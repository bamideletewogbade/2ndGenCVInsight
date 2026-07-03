import { getModelChain, BASE_URL, PROMPT_VERSION, PROMPT_TEMPLATE_NAME, getApiKey } from '@/config/models';
import type { ModelConfig } from '@/config/models';
import OpenAI from 'openai';

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'meta/llama-3.1-70b-instruct': { input: 0.35, output: 0.40 },
  'mistralai/mixtral-8x22b-instruct-v0.1': { input: 0.30, output: 0.30 },
  'nvidia/llama-3.1-nemotron-70b-instruct': { input: 0.35, output: 0.40 },
};

function createClient(): OpenAI {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }
  return new OpenAI({
    apiKey,
    baseURL: BASE_URL,
    dangerouslyAllowBrowser: true,
  });
}

function extractJsonFromResponse(text: string): string {
  // Try to extract JSON from markdown code fences
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) return fenceMatch[1].trim();

  // Try to find a JSON object in the text
  const braceMatch = text.match(/(\{[\s\S]*\})/);
  if (braceMatch) return braceMatch[1].trim();

  return text.trim();
}

function validateJsonStructure(json: unknown, requiredKeys: string[]): boolean {
  if (typeof json !== 'object' || json === null) return false;
  const obj = json as Record<string, unknown>;
  return requiredKeys.every((key) => key in obj);
}

const REQUIRED_TOP_KEYS = ['summary', 'skills', 'strengths', 'improvements', 'atsScore'];

export interface CallLLMResult {
  content: string;
  parsed: Record<string, unknown>;
  modelUsed: string;
  fallbackTriggered: boolean;
  fallbackReason: string | null;
  retryCount: number;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  jsonValidationStatus: 'valid' | 'failed' | 'retried';
}

export async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  options?: { timeoutMs?: number; requiredKeys?: string[] }
): Promise<CallLLMResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const models = getModelChain();
  const requiredKeys = options?.requiredKeys ?? REQUIRED_TOP_KEYS;
  let lastError: Error | null = null;
  let retryCount = 0;
  let jsonRetried = false;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const timeoutMs = options?.timeoutMs ?? model.timeoutMs;

    try {
      const client = createClient();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const startTime = performance.now();

      const response = await client.chat.completions.create(
        {
          model: model.id,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        },
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);
      const latencyMs = Math.round(performance.now() - startTime);

      const content = response.choices[0]?.message?.content ?? '';
      const promptTokens = response.usage?.prompt_tokens ?? 0;
      const completionTokens = response.usage?.completion_tokens ?? 0;

      // Try parsing as JSON directly
      try {
        const parsed = JSON.parse(content);
        if (validateJsonStructure(parsed, requiredKeys)) {
          return {
            content,
            parsed,
            modelUsed: model.id,
            fallbackTriggered: i > 0,
            fallbackReason: i > 0 ? (lastError?.message ?? 'Previous model failed') : null,
            retryCount,
            promptTokens,
            completionTokens,
            latencyMs,
            jsonValidationStatus: 'valid',
          };
        }
      } catch {
        // JSON parse failed, try extraction
      }

      // Try extracting JSON from the response
      const extracted = extractJsonFromResponse(content);
      try {
        const parsed = JSON.parse(extracted);
        if (validateJsonStructure(parsed, requiredKeys)) {
          jsonRetried = true;
          return {
            content,
            parsed,
            modelUsed: model.id,
            fallbackTriggered: i > 0,
            fallbackReason: i > 0 ? (lastError?.message ?? 'Previous model failed') : null,
            retryCount,
            promptTokens,
            completionTokens,
            latencyMs,
            jsonValidationStatus: 'retried',
          };
        }
      } catch {
        // Extraction also failed
      }

      // JSON validation failed on this model
      lastError = new Error(`JSON validation failed for model ${model.id}`);
      retryCount++;
      continue;
    } catch (err: unknown) {
      retryCount++;
      const isLast = i === models.length - 1;

      let reason = 'Unknown error';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          reason = `Timeout after ${timeoutMs}ms`;
        } else if (err.message.includes('401') || err.message.includes('authentication')) {
          throw new Error('API_KEY_INVALID');
        } else if (err.message.includes('429')) {
          reason = 'Rate limited';
        } else if (err.message.includes('API_KEY_MISSING')) {
          throw err;
        } else {
          reason = err.message;
        }
      }

      lastError = new Error(reason);

      if (isLast) {
        throw new Error(
          `All models failed. Last error: ${reason}`
        );
      }
      // Continue to next model in chain
    }
  }

  // Should never reach here, but just in case
  throw new Error('All AI models failed. ' + (lastError?.message ?? 'Unknown reason'));
}

export function buildMetricsFromResult(result: CallLLMResult): {
  requestId: string;
  timestamp: string;
  modelUsed: string;
  fallbackTriggered: boolean;
  fallbackReason: string | null;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  timeToFirstTokenMs: number;
  responseStatus: 'success' | 'partial' | 'failed';
  retryCount: number;
  promptVersion: string;
  promptTemplateName: string;
  jsonValidationStatus: 'valid' | 'failed' | 'retried';
} {
  const totalTokens = result.promptTokens + result.completionTokens;
  return {
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    modelUsed: result.modelUsed,
    fallbackTriggered: result.fallbackTriggered,
    fallbackReason: result.fallbackReason,
    promptTokens: result.promptTokens,
    completionTokens: result.completionTokens,
    totalTokens,
    estimatedCostUsd: calculateCost(result.modelUsed, result.promptTokens, result.completionTokens),
    latencyMs: result.latencyMs,
    timeToFirstTokenMs: simulateTTFT(result.latencyMs, totalTokens),
    responseStatus: 'success',
    retryCount: result.retryCount,
    promptVersion: PROMPT_VERSION,
    promptTemplateName: PROMPT_TEMPLATE_NAME,
    jsonValidationStatus: result.jsonValidationStatus,
  };
}