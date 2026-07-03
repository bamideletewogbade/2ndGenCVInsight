import type { AIRequestMetrics } from '@/types/metrics';
import { MetricCard } from './MetricCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface MetricGridProps {
  metrics: AIRequestMetrics;
}

function formatCost(usd: number): string {
  return `$${usd.toFixed(5)}`;
}

function formatLatency(ms: number): string {
  return `${ms.toLocaleString()}ms`;
}

function formatTokens(n: number): string {
  return n.toLocaleString();
}

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 divide-x divide-y divide-border/40">
      <MetricCard metricKey="model-used" label="Model">
        <Badge variant="secondary" className="font-mono text-[10px]">
          {metrics.modelUsed.split('/').pop()}
        </Badge>
      </MetricCard>

      <MetricCard metricKey="fallback-triggered" label="Fallback">
        <Badge variant={metrics.fallbackTriggered ? 'warning' : 'success'}>
          {metrics.fallbackTriggered ? 'Yes' : 'No'}
        </Badge>
      </MetricCard>

      <MetricCard metricKey="response-status" label="Status">
        <Badge variant={metrics.responseStatus === 'success' ? 'success' : metrics.responseStatus === 'partial' ? 'warning' : 'destructive'}>
          {metrics.responseStatus}
        </Badge>
      </MetricCard>

      <MetricCard metricKey="json-validation" label="JSON">
        <Badge variant={metrics.jsonValidationStatus === 'valid' ? 'success' : metrics.jsonValidationStatus === 'retried' ? 'warning' : 'destructive'}>
          {metrics.jsonValidationStatus === 'valid' ? 'Valid' : metrics.jsonValidationStatus === 'retried' ? 'Retried' : 'Failed'}
        </Badge>
      </MetricCard>

      {metrics.fallbackTriggered && metrics.fallbackReason && (
        <MetricCard metricKey="fallback-reason" label="Fallback Reason" valueClassName="text-xs text-amber-600 dark:text-amber-400">
          {metrics.fallbackReason}
        </MetricCard>
      )}

      <MetricCard metricKey="prompt-tokens" label="Prompt Tokens">
        {formatTokens(metrics.promptTokens)}
      </MetricCard>

      <MetricCard metricKey="completion-tokens" label="Completion Tokens">
        {formatTokens(metrics.completionTokens)}
      </MetricCard>

      <MetricCard metricKey="total-tokens" label="Total Tokens">
        {formatTokens(metrics.totalTokens)}
      </MetricCard>

      <MetricCard metricKey="estimated-cost" label="Est. Cost">
        <span className="text-green-700 dark:text-green-400">{formatCost(metrics.estimatedCostUsd)}</span>
      </MetricCard>

      <MetricCard metricKey="latency" label="Latency">
        {formatLatency(metrics.latencyMs)}
      </MetricCard>

      <MetricCard metricKey="ttft" label="TTFT">
        <div className="flex items-center gap-1.5">
          {formatLatency(metrics.timeToFirstTokenMs)}
          <span className="text-[9px] text-muted-foreground">(sim)</span>
        </div>
      </MetricCard>

      <MetricCard metricKey="retry-count" label="Retries">
        {metrics.retryCount}
      </MetricCard>

      <MetricCard metricKey="request-id" label="Request ID">
        <span className="text-[11px] font-mono text-muted-foreground">{metrics.requestId.slice(0, 16)}...</span>
      </MetricCard>

      <MetricCard metricKey="timestamp" label="Timestamp">
        <span className="text-[11px] font-mono text-muted-foreground">{new Date(metrics.timestamp).toLocaleTimeString()}</span>
      </MetricCard>

      <MetricCard metricKey="prompt-version" label="Prompt Ver.">
        <Badge variant="outline">{metrics.promptVersion}</Badge>
      </MetricCard>

      <MetricCard metricKey="prompt-template-name" label="Template">
        <span className="text-[11px] font-mono text-muted-foreground">{metrics.promptTemplateName}</span>
      </MetricCard>
    </div>
  );
}