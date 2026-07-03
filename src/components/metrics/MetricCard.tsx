import { cn } from '@/lib/utils';
import { MetricTooltip } from './MetricTooltip';

interface MetricCardProps {
  metricKey: string;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  className?: string;
}

export function MetricCard({ metricKey, label, value, valueClassName = '', className }: MetricCardProps) {
  return (
    <div className={cn('flex flex-col gap-1.5 py-2.5 px-3 sm:py-3 sm:px-4', className)}>
      <MetricTooltip metricKey={metricKey}>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.1em]">
          {label}
        </span>
      </MetricTooltip>
      <div className={`text-sm font-mono font-medium ${valueClassName}`}>
        {value}
      </div>
    </div>
  );
}