import type { AIRequestMetrics } from '@/types/metrics';
import { MetricCard } from './MetricCard';
import { Badge } from '@/components/ui/badge';

interface MetricGridProps {
  metrics: AIRequestMetrics;
}

function formatCost(usd: number): string {
  return `$${usd.toFixed(5)}`;
}

function formatLatency(ms: number): string {
  return `${ms.toLocaleString()} ms`;
}

function formatTokens(n: number): string {
  return n.toLocaleString();
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard metricKey="model-used" label="Model Used">
        <Badge variant="outline" className="font-mono text-xs">
          {metrics.modelUsed.split('/').pop()}
        </Badge>
      </MetricCard>

      <MetricCard metricKey="fallback-triggered" label="Fallback Triggered">
        <Badge variant={metrics.fallbackTriggered ? 'warning' : 'success'}>
          {metrics.fallbackTriggered ? 'Yes' : 'No'}
        </Badge>
      </MetricCard>

      {metrics.fallbackTriggered && metrics.fallbackReason && (
        <MetricCard metricKey="fallback-reason" label="Fallback Reason">
          <span className="text-xs text-amber-600 dark:text-amber-400">{metrics.fallbackReason}</span>
        </MetricCard>
      )}

      <MetricCard metricKey="request-id" label="Request ID">
        <span className="text-xs font-mono break-all">{metrics.requestId.slice(0, 12)}...</span>
      </MetricCard>

      <MetricCard metricKey="timestamp" label="Timestamp">
        <span className="text-xs font-mono">{new Date(metrics.timestamp).toLocaleString()}</span>
      </MetricCard>

      <MetricCard metricKey="prompt-tokens" label="Prompt Tokens">
        {formatTokens(metrics.promptTokens)}
      </MetricCard>

      <MetricCard metricKey="completion-tokens" label="Completion Tokens">
        {formatTokens(metrics.completionTokens)}
      </MetricCard>

      <MetricCard metricKey="total-tokens" label="Total Tokens">
        {formatTokens(metrics.totalTokens)}
      </MetricCard>

      <MetricCard metricKey="estimated-cost" label="Estimated Cost">
        <span className="text-green-600 dark:text-green-400">{formatCost(metrics.estimatedCostUsd)}</span>
      </MetricCard>

      <MetricCard metricKey="latency" label="Latency">
        {formatLatency(metrics.latencyMs)}
      </MetricCard>

      <MetricCard metricKey="ttft" label="Time to First Token">
        {formatLatency(metrics.timeToFirstTokenMs)}
        <span className="text-[10px] text-muted-foreground ml-1">(simulated)</span>
      </MetricCard>

      <MetricCard metricKey="response-status" label="Response Status">
        <Badge variant={metrics.responseStatus === 'success' ? 'success' : metrics.responseStatus === 'partial' ? 'warning' : 'destructive'}>
          {metrics.responseStatus}
        </Badge>
      </MetricCard>

      <MetricCard metricKey="retry-count" label="Retry Count">
        {metrics.retryCount}
      </MetricCard>

      <MetricCard metricKey="prompt-version" label="Prompt Version">
        <Badge variant="outline">{metrics.promptVersion}</Badge>
      </MetricCard>

      <MetricCard metricKey="prompt-template-name" label="Prompt Template">
        <span className="text-xs font-mono">{metrics.promptTemplateName}</span>
      </MetricCard>

      <MetricCard metricKey="json-validation" label="JSON Validation">
        <Badge variant={metrics.jsonValidationStatus === 'valid' ? 'success' : metrics.jsonValidationStatus === 'retried' ? 'warning' : 'destructive'}>
          {metrics.jsonValidationStatus === 'valid' ? 'Valid' : metrics.jsonValidationStatus === 'retried' ? 'Retried' : 'Failed'}
        </Badge>
      </MetricCard>
    </div>
  );
}