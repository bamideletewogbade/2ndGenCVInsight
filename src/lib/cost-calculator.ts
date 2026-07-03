const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'meta/llama-3.1-70b-instruct': { input: 0.35, output: 0.40 },
  'mistralai/mixtral-8x22b-instruct-v0.1': { input: 0.30, output: 0.30 },
  'nvidia/llama-3.1-nemotron-70b-instruct': { input: 0.35, output: 0.40 },
};

export function calculateCost(
  modelId: string,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = MODEL_PRICING[modelId];
  if (!pricing) return 0;
  const inputCost = (promptTokens / 1_000_000) * pricing.input;
  const outputCost = (completionTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

export function simulateTTFT(totalLatencyMs: number, _totalTokens: number): number {
  // Rough heuristic: first token tends to arrive ~15% into total latency
  // for non-streaming requests
  return Math.round(totalLatencyMs * 0.15);
}