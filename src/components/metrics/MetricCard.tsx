import { MetricTooltip } from './MetricTooltip';

interface MetricCardProps {
  metricKey: string;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}

export function MetricCard({ metricKey, label, value, valueClassName = '' }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border/50">
      <MetricTooltip metricKey={metricKey}>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </MetricTooltip>
      <div className={`text-sm font-mono font-medium ${valueClassName}`}>
        {value}
      </div>
    </div>
  );
}