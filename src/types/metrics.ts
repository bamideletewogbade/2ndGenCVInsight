export interface AIRequestMetrics {
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
}