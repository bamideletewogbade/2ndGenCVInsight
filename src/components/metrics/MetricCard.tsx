import { MetricTooltip } from './MetricTooltip';

interface MetricCardProps {
  metricKey: string;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}

export function MetricCard({ metricKey, label, value, valueClassName = '' }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-1.5 py-3 px-4">
      <MetricTooltip metricKey={metricKey}>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.1em]">
          {label}
        </span>
      </MetricTooltip>
      <div className={`text-[13px] font-mono font-medium ${valueClassName}`}>
        {value}
      </div>
    </div>
  );
}