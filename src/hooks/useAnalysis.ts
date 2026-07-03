import { useState, useCallback } from 'react';
import { extractTextFromPDF } from '@/lib/pdf-parser';
import { extractTextFromDOCX } from '@/lib/docx-parser';
import { cleanText, ParseError } from '@/lib/text-cleaner';
import { callLLM, buildMetricsFromResult } from '@/lib/ai-client';
import { getSystemPrompt, buildAnalysisUserPrompt } from '@/lib/prompt-templates';
import type { AnalysisResponse } from '@/types/analysis';
import type { AIRequestMetrics } from '@/types/metrics';
import { MAX_FILE_SIZE_MB } from '@/config/models';

export type AnalysisStatus =
  | 'idle'
  | 'extracting'
  | 'sending'
  | 'analyzing'
  | 'preparing'
  | 'success'
  | 'error';

export interface AnalysisError {
  type: 'file_type' | 'file_size' | 'parse' | 'api_key' | 'api_key_invalid' | 'all_models_failed' | 'json_failed' | 'network' | 'unknown';
  message: string;
}

export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [error, setError] = useState<AnalysisError | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [metrics, setMetrics] = useState<AIRequestMetrics | null>(null);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setResult(null);
    setMetrics(null);
    setFallbackMessage(null);
  }, []);

  const analyze = useCallback(async (file: File, jobDescription?: string) => {
    // Validate file type
    const ext = file.name.toLowerCase();
    if (!ext.endsWith('.pdf') && !ext.endsWith('.docx')) {
      setError({ type: 'file_type', message: 'Please upload a PDF or DOCX file.' });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError({ type: 'file_size', message: `File is too large. Please upload a file under ${MAX_FILE_SIZE_MB}MB.` });
      return;
    }

    setError(null);
    setResult(null);
    setMetrics(null);
    setFallbackMessage(null);

    try {
      // Stage 1: Extract text
      setStatus('extracting');
      let rawText: string;

      if (file.name.toLowerCase().endsWith('.pdf')) {
        rawText = await extractTextFromPDF(file);
      } else {
        rawText = await extractTextFromDOCX(file);
      }

      const resumeText = cleanText(rawText);

      // Stage 2: Send to AI
      setStatus('sending');
      const systemPrompt = getSystemPrompt();
      const userPrompt = buildAnalysisUserPrompt(resumeText, jobDescription);

      setStatus('analyzing');

      const llmResult = await callLLM(systemPrompt, userPrompt);

      if (llmResult.fallbackTriggered) {
        setFallbackMessage('Primary model unavailable — switching to fallback...');
      }

      // Stage 4: Prepare dashboard
      setStatus('preparing');

      const parsed = llmResult.parsed as unknown as AnalysisResponse;
      const metricsData = buildMetricsFromResult(llmResult);

      setResult(parsed);
      setMetrics(metricsData);
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');

      if (err instanceof ParseError) {
        setError({
          type: 'parse',
          message: "We couldn't extract enough text from this file. This usually means the PDF is image-based (scanned). Please upload a text-based PDF or DOCX.",
        });
      } else if (err instanceof Error) {
        const msg = err.message;
        if (msg === 'API_KEY_MISSING') {
          setError({
            type: 'api_key',
            message: 'API Key Not Found — Create a `.env` file in the project root with `VITE_NVIDIA_API_KEY=your-key-here`. Get a free key at build.nvidia.com.',
          });
        } else if (msg === 'API_KEY_INVALID') {
          setError({
            type: 'api_key_invalid',
            message: 'The API key appears to be invalid. Please check your VITE_NVIDIA_API_KEY in the .env file.',
          });
        } else if (msg.includes('All models failed') || msg.includes('All AI models failed')) {
          setError({
            type: 'all_models_failed',
            message: 'Analysis Unavailable — All AI models are currently unreachable. This may be a temporary issue with the NVIDIA NIM platform. Please try again in a moment.',
          });
        } else if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('net::')) {
          setError({
            type: 'network',
            message: 'You appear to be offline. Please check your connection and try again.',
          });
        } else {
          setError({
            type: 'unknown',
            message: `An unexpected error occurred: ${msg}`,
          });
        }
      } else {
        setError({
          type: 'unknown',
          message: 'An unexpected error occurred.',
        });
      }
    }
  }, []);

  return { status, error, result, metrics, fallbackMessage, analyze, reset };
}