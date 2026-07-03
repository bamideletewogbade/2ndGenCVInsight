import { useState, useCallback } from 'react';
import type { AnalysisResponse } from '@/types/analysis';
import type { AIRequestMetrics } from '@/types/metrics';

export type AnalysisStatus =
  | 'idle'
  | 'extracting'
  | 'sending'
  | 'analyzing'
  | 'preparing'
  | 'success'
  | 'error';

export interface AnalysisError {
  type: 'file_type' | 'file_size' | 'parse' | 'api_error' | 'all_models_failed' | 'json_failed' | 'network' | 'server' | 'unknown';
  message: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

interface BackendResponse {
  analysis: AnalysisResponse;
  metrics: AIRequestMetrics;
  fallback_message: string | null;
}

interface BackendError {
  detail: string;
  type?: string;
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

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError({ type: 'file_size', message: 'File is too large. Please upload a file under 10MB.' });
      return;
    }

    setError(null);
    setResult(null);
    setMetrics(null);
    setFallbackMessage(null);

    try {
      // Stage 1: Building request
      setStatus('extracting');

      const formData = new FormData();
      formData.append('file', file);
      if (jobDescription && jobDescription.trim()) {
        formData.append('job_description', jobDescription.trim());
      }

      // Stage 2: Sending to backend
      setStatus('sending');

      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
      });

      // Stage 3: Analyzing (backend is processing)
      setStatus('analyzing');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `Server error (${response.status})` })) as BackendError;

        if (response.status === 413) {
          throw { type: 'file_size' as const, message: 'File is too large. Please upload a file under 10MB.' };
        }
        if (response.status === 422) {
          throw { type: 'file_type' as const, message: errorData.detail || 'Invalid file type. Please upload a PDF or DOCX.' };
        }
        if (response.status === 502 || response.status === 504) {
          throw { type: 'all_models_failed' as const, message: 'Analysis Unavailable — All AI models are currently unreachable. This may be a temporary issue with the NVIDIA NIM platform. Please try again in a moment.' };
        }

        // Try to parse backend error type
        const errorType = errorData.type || 'server';
        throw { type: errorType as AnalysisError['type'], message: errorData.detail || 'An unexpected server error occurred.' };
      }

      const data: BackendResponse = await response.json();

      // Stage 4: Preparing dashboard
      setStatus('preparing');

      setResult(data.analysis);
      setMetrics(data.metrics);
      if (data.fallback_message) {
        setFallbackMessage(data.fallback_message);
      }
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');

      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError({
          type: 'network',
          message: 'Unable to reach the server. Please ensure the backend is running (python backend/run.sh) and try again.',
        });
      } else if (err instanceof Error) {
        const msg = err.message;
        if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('net::')) {
          setError({
            type: 'network',
            message: 'Unable to reach the server. Please ensure the backend is running and try again.',
          });
        } else {
          setError({
            type: 'unknown',
            message: `An unexpected error occurred: ${msg}`,
          });
        }
      } else if (typeof err === 'object' && err !== null && 'type' in err && 'message' in err) {
        setError(err as AnalysisError);
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