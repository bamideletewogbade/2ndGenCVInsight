import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MetricGrid } from '@/components/metrics/MetricGrid';
import type { AIRequestMetrics } from '@/types/metrics';

interface InsightsPanelProps {
  metrics: AIRequestMetrics;
}

export function InsightsPanel({ metrics }: InsightsPanelProps) {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle>AI Request Insights</CardTitle>
        <CardDescription>
          Operational metrics from this analysis — the same kind of dashboard AI engineers use to monitor production systems.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MetricGrid metrics={metrics} />
      </CardContent>
    </Card>
  );
}