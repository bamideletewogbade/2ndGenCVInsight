import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MetricGrid } from '@/components/metrics/MetricGrid';
import type { AIRequestMetrics } from '@/types/metrics';

interface InsightsPanelProps {
  metrics: AIRequestMetrics;
}

export function InsightsPanel({ metrics }: InsightsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Request Insights</CardTitle>
        <CardDescription>
          Operational metrics from this analysis — the same kind of dashboard AI engineers use to monitor production systems.
        </CardDescription>
      </CardHeader>
      <CardContent className="-mx-5 -mb-5 mt-0">
        <div className="bg-secondary/40 rounded-b-[var(--radius)]">
          <MetricGrid metrics={metrics} />
        </div>
      </CardContent>
    </Card>
  );
}