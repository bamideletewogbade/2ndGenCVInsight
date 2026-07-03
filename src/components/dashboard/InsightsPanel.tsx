import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { MetricGrid } from '@/components/metrics/MetricGrid';
import { CaretDown } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import type { AIRequestMetrics } from '@/types/metrics';

interface InsightsPanelProps {
  metrics: AIRequestMetrics;
}

export function InsightsPanel({ metrics }: InsightsPanelProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    setOpen(mql.matches);
    const handler = (e: MediaQueryListEvent) => setOpen(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer select-none hover:bg-secondary/30 transition-colors rounded-t-[var(--radius)]">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-[15px]">AI Request Insights</CardTitle>
                <Badge variant="secondary" className="text-[9px] font-mono">
                  16 metrics
                </Badge>
              </div>
              <CaretDown
                size={16}
                weight="bold"
                className={cn(
                  'text-muted-foreground transition-transform duration-200',
                  open && 'rotate-180'
                )}
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <MetricGrid metrics={metrics} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}