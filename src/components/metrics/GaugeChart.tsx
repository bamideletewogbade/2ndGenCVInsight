import { atsStrokeColor } from '@/config/ui';
import { MetricTooltip } from './MetricTooltip';

interface GaugeChartProps {
  score: number;
  size?: number;
}

export function GaugeChart({ score, size = 130 }: GaugeChartProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const strokeColor = atsStrokeColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <MetricTooltip metricKey="ats-overall">
        <div className="absolute flex flex-col items-center justify-center">
          <span className="font-heading text-3xl font-bold tracking-tight" style={{ color: strokeColor }}>
            {score}
          </span>
          <span className="text-[10px] text-muted-foreground tracking-wide uppercase mt-0.5">score</span>
        </div>
      </MetricTooltip>
    </div>
  );
}