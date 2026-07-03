import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MetricTooltip } from '@/components/metrics/MetricTooltip';
import type { MissingSkills } from '@/types/analysis';

interface MissingSkillsCardProps {
  missingSkills: MissingSkills;
}

export function MissingSkillsCard({ missingSkills }: MissingSkillsCardProps) {
  const isHighMatch = missingSkills.matchPercentage >= 80;
  const isLowMatch = missingSkills.matchPercentage < 50;

  const statusColor = isHighMatch
    ? 'text-green-700 dark:text-green-400'
    : isLowMatch
      ? 'text-red-700 dark:text-red-400'
      : 'text-amber-700 dark:text-amber-400';

  const statusText = isHighMatch
    ? 'Strong match — your resume covers most required skills.'
    : isLowMatch
      ? 'Significant gaps. Consider addressing these to improve your match.'
      : 'Moderate match. Some skills gaps to address.';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <CardTitle>Missing Skills</CardTitle>
            <p className={`text-[12px] ${statusColor} mt-1`}>{statusText}</p>
          </div>
          {/* Match % — inline on desktop, hidden on mobile (shown in banner below) */}
          <MetricTooltip metricKey="match-percentage">
            <div className="text-right shrink-0 ml-4 hidden sm:block">
              <span className={`font-heading text-2xl font-bold tracking-tight ${statusColor}`}>
                {missingSkills.matchPercentage}%
              </span>
            </div>
          </MetricTooltip>
        </div>
      </CardHeader>
      <CardContent>
        {/* Match % banner — mobile only, full width */}
        <div className="sm:hidden flex items-center justify-between py-3 px-4 -mx-5 -mt-4 mb-4 bg-secondary/60 border-b border-border/40">
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Match</span>
          <MetricTooltip metricKey="match-percentage">
            <span className={`font-heading text-xl font-bold tracking-tight ${statusColor}`}>
              {missingSkills.matchPercentage}%
            </span>
          </MetricTooltip>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 mb-0 sm:mb-6">
          {([
            { title: 'Technologies', items: missingSkills.technologies },
            { title: 'Certifications', items: missingSkills.certifications },
            { title: 'Soft Skills', items: missingSkills.softSkills },
          ] as const).map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-2">
                {col.title}
              </p>
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
          <div className="mt-4">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-2">
              Recommendations
            </p>
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