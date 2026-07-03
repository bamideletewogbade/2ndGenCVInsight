import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GaugeChart } from '@/components/metrics/GaugeChart';
import { atsScoreColor } from '@/config/ui';
import type { ATSScore, ATSScoreBreakdown } from '@/types/analysis';

interface ATSScoreCardProps {
  atsScore: ATSScore;
}

const breakdownItems: { key: keyof ATSScoreBreakdown; label: string }[] = [
  { key: 'formatting', label: 'Formatting' },
  { key: 'keywords', label: 'Keywords' },
  { key: 'readability', label: 'Readability' },
  { key: 'experience', label: 'Experience' },
  { key: 'skills', label: 'Skills' },
  { key: 'consistency', label: 'Consistency' },
];

export function ATSScoreCard({ atsScore }: ATSScoreCardProps) {
  const scores = breakdownItems.map((item) => ({
    ...item,
    value: atsScore.breakdown[item.key],
  }));

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>ATS Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Gauge — larger on desktop */}
        <div className="flex justify-center">
          <GaugeChart score={atsScore.overall} size={130} sizeSm={160} />
        </div>

        {/* Notes */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          {atsScore.notes}
        </p>

        {/* Breakdown — horizontal bar chart layout */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-1">
          {scores.map((s) => (
            <div key={s.key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className={`text-xs font-mono font-medium ${atsScoreColor(s.value)}`}>
                  {s.value}
                </span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground transition-all duration-700 ease-out"
                  style={{ width: `${s.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-muted-foreground/70 text-center leading-relaxed">
          Estimated score for educational purposes — not an official ATS assessment.
        </p>
      </CardContent>
    </Card>
  );
}