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
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Missing Skills</CardTitle>
          <MetricTooltip metricKey="match-percentage">
            <div className="text-right">
              <span className={`text-2xl font-bold ${isHighMatch ? 'text-green-500' : isLowMatch ? 'text-red-500' : 'text-amber-500'}`}>
                {missingSkills.matchPercentage}%
              </span>
              <p className="text-[10px] text-muted-foreground">match</p>
            </div>
          </MetricTooltip>
        </div>
        {isHighMatch && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Strong match! Your resume covers most of the required skills.
          </p>
        )}
        {isLowMatch && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            Significant gaps exist. Consider addressing these to improve your match.
          </p>
        )}
        {!isHighMatch && !isLowMatch && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            Moderate match. Some skills gaps to address.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Technologies</h4>
            {missingSkills.technologies.length > 0 ? (
              <ul className="space-y-1.5">
                {missingSkills.technologies.map((t, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">None identified</p>
            )}
          </div>
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Certifications</h4>
            {missingSkills.certifications.length > 0 ? (
              <ul className="space-y-1.5">
                {missingSkills.certifications.map((c, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">None identified</p>
            )}
          </div>
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Soft Skills</h4>
            {missingSkills.softSkills.length > 0 ? (
              <ul className="space-y-1.5">
                {missingSkills.softSkills.map((s, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">None identified</p>
            )}
          </div>
        </div>
        {missingSkills.recommendations.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Recommendations</h4>
            <ul className="space-y-1.5">
              {missingSkills.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
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