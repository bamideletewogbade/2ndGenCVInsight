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
        <CardTitle>ATS Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex justify-center">
          <GaugeChart score={atsScore.overall} />
        </div>
        <p className="text-[12px] text-muted-foreground text-center leading-relaxed">{atsScore.notes}</p>
        <div className="space-y-3">
          {subScores.map((sub, i) => (
            <div key={sub.key}>
              <MetricTooltip metricKey={sub.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-muted-foreground">{sub.label}</span>
                  <span className={`text-[11px] font-mono font-medium ${atsScoreColor(breakdownValues[i])}`}>
                    {breakdownValues[i]}
                  </span>
                </div>
              </MetricTooltip>
              <Progress value={breakdownValues[i]} />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground/70 text-center leading-relaxed">
          Estimated score for educational purposes — not an official ATS assessment.
        </p>
      </CardContent>
    </Card>
  );
}