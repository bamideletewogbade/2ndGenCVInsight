import { useState, useEffect } from 'react';
import { atsStrokeColor } from '@/config/ui';
import { MetricTooltip } from './MetricTooltip';

interface GaugeChartProps {
  score: number;
  size?: number;
  sizeSm?: number;
}

export function GaugeChart({ score, size = 130, sizeSm }: GaugeChartProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)');
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const currentSize = (isDesktop && sizeSm != null) ? sizeSm : size;
  const radius = (currentSize - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const strokeColor = atsStrokeColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={currentSize} height={currentSize} className="-rotate-90">
        <circle
          cx={currentSize / 2}
          cy={currentSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-secondary"
        />
        <circle
          cx={currentSize / 2}
          cy={currentSize / 2}
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
          <span
            className="font-heading text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: strokeColor }}
          >
            {score}
          </span>
          <span className="text-[9px] sm:text-[10px] text-muted-foreground tracking-wide uppercase mt-0.5">
            score
          </span>
        </div>
      </MetricTooltip>
    </div>
  );
}