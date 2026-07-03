import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GaugeChart } from '@/components/metrics/GaugeChart';
import { MetricTooltip } from '@/components/metrics/MetricTooltip';
import { atsScoreColor } from '@/config/ui';
import type { ATSScore } from '@/types/analysis';

interface ATSScoreCardProps {
  atsScore: ATSScore;
}

const subScores: { key: string; label: string }[] = [
  { key: 'ats-formatting', label: 'Formatting' },
  { key: 'ats-keywords', label: 'Keywords' },
  { key: 'ats-readability', label: 'Readability' },
  { key: 'ats-experience', label: 'Experience' },
  { key: 'ats-skills', label: 'Skills' },
  { key: 'ats-consistency', label: 'Consistency' },
];

export function ATSScoreCard({ atsScore }: ATSScoreCardProps) {
  const breakdownValues = [
    atsScore.breakdown.formatting,
    atsScore.breakdown.keywords,
    atsScore.breakdown.readability,
    atsScore.breakdown.experience,
    atsScore.breakdown.skills,
    atsScore.breakdown.consistency,
  ];

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>ATS Compatibility Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <GaugeChart score={atsScore.overall} />
        </div>
        <p className="text-sm text-muted-foreground text-center">{atsScore.notes}</p>
        <div className="space-y-3">
          {subScores.map((sub, i) => (
            <div key={sub.key}>
              <MetricTooltip metricKey={sub.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{sub.label}</span>
                  <span className={`text-xs font-semibold ${atsScoreColor(breakdownValues[i])}`}>
                    {breakdownValues[i]}
                  </span>
                </div>
              </MetricTooltip>
              <Progress value={breakdownValues[i]} className="h-1.5" />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
          This is an estimated score for educational purposes, not an official ATS assessment.
        </p>
      </CardContent>
    </Card>
  );
}