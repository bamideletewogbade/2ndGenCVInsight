import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MetricTooltip } from '@/components/metrics/MetricTooltip';
import type { MissingSkills } from '@/types/analysis';

interface MissingSkillsCardProps {
  missingSkills: MissingSkills;
}

export function MissingSkillsCard({ missingSkills }: MissingSkillsCardProps) {
  const isHighMatch = missingSkills.matchPercentage >= 80;
  const isLowMatch = missingSkills.matchPercentage < 50;

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Missing Skills</CardTitle>
            {isHighMatch && (
              <p className="text-[12px] text-green-700 dark:text-green-400 mt-1">
                Strong match — your resume covers most required skills.
              </p>
            )}
            {isLowMatch && (
              <p className="text-[12px] text-red-700 dark:text-red-400 mt-1">
                Significant gaps. Consider addressing these to improve your match.
              </p>
            )}
            {!isHighMatch && !isLowMatch && (
              <p className="text-[12px] text-amber-700 dark:text-amber-400 mt-1">
                Moderate match. Some skills gaps to address.
              </p>
            )}
          </div>
          <MetricTooltip metricKey="match-percentage">
            <div className="text-right shrink-0 ml-4">
              <span className={`font-heading text-2xl font-bold tracking-tight ${isHighMatch ? 'text-green-600 dark:text-green-400' : isLowMatch ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {missingSkills.matchPercentage}%
              </span>
            </div>
          </MetricTooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {([
            { title: 'Technologies', items: missingSkills.technologies },
            { title: 'Certifications', items: missingSkills.certifications },
            { title: 'Soft Skills', items: missingSkills.softSkills },
          ] as const).map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-2">{col.title}</p>
              {col.items.length > 0 ? (
                <ul className="space-y-1.5">
                  {col.items.map((item, i) => (
                    <li key={i} className="text-[13px] text-foreground leading-relaxed flex items-start gap-2">
                      <span className="w-px h-3 bg-foreground/30 mt-[7px] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-muted-foreground">None identified</p>
              )}
            </div>
          ))}
        </div>
        {missingSkills.recommendations.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-2">Recommendations</p>
            <ul className="space-y-1.5">
              {missingSkills.recommendations.map((r, i) => (
                <li key={i} className="text-[13px] text-foreground leading-relaxed flex items-start gap-2">
                  <span className="w-px h-3 bg-foreground/30 mt-[7px] shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}