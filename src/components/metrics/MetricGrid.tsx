import type { AIRequestMetrics } from '@/types/metrics';

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

interface MetricItem {
  label: string;
  value: string;
  className?: string;
  hideOnMobile?: boolean;
}

export function MetricGrid({ metrics }: MetricGridProps) {
  const items: MetricItem[] = [
    { label: 'Model', value: metrics.modelUsed.split('/').pop() ?? metrics.modelUsed },
    { label: 'Status', value: metrics.responseStatus, className: metrics.responseStatus === 'success' ? 'text-green-600 dark:text-green-400' : metrics.responseStatus === 'partial' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400' },
    { label: 'Fallback', value: metrics.fallbackTriggered ? `Yes — ${metrics.fallbackReason ?? 'unknown'}` : 'No' },
    { label: 'Latency', value: formatLatency(metrics.latencyMs) },
    { label: 'Prompt Tokens', value: formatTokens(metrics.promptTokens) },
    { label: 'Completion Tokens', value: formatTokens(metrics.completionTokens) },
    { label: 'Total Tokens', value: formatTokens(metrics.totalTokens) },
    { label: 'Est. Cost', value: formatCost(metrics.estimatedCostUsd), className: 'text-green-600 dark:text-green-400' },
    { label: 'TTFT', value: `${formatLatency(metrics.timeToFirstTokenMs)} (sim)` },
    { label: 'JSON Validation', value: metrics.jsonValidationStatus === 'valid' ? 'Valid' : metrics.jsonValidationStatus === 'retried' ? 'Retried' : 'Failed' },
    { label: 'Retries', value: String(metrics.retryCount) },
    { label: 'Request ID', value: metrics.requestId.slice(0, 16) + '...', hideOnMobile: true },
    { label: 'Timestamp', value: new Date(metrics.timestamp).toLocaleTimeString(), hideOnMobile: true },
    { label: 'Prompt Version', value: metrics.promptVersion, hideOnMobile: true },
    { label: 'Template', value: metrics.promptTemplateName, hideOnMobile: true },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-lg bg-secondary/40 px-3.5 py-3 ${item.hideOnMobile ? 'hidden sm:block' : ''}`}
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
            {item.label}
          </p>
          <p className={`text-[13px] font-mono font-medium truncate ${item.className ?? 'text-foreground'}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}