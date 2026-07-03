import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { MissingSkills } from '@/types/analysis';

interface MissingSkillsCardProps {
  missingSkills: MissingSkills;
}

export function MissingSkillsCard({ missingSkills }: MissingSkillsCardProps) {
  const isHighMatch = missingSkills.matchPercentage >= 80;
  const isLowMatch = missingSkills.matchPercentage < 50;

  const statusColor = isHighMatch
    ? 'text-green-600 dark:text-green-400'
    : isLowMatch
      ? 'text-red-600 dark:text-red-400'
      : 'text-amber-600 dark:text-amber-400';

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
            <p className={`text-xs ${statusColor} mt-1`}>{statusText}</p>
          </div>
          <div className="text-right shrink-0 ml-4">
            <span className={`font-heading text-2xl font-bold tracking-tight ${statusColor}`}>
              {missingSkills.matchPercentage}%
            </span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Match</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
                    <li key={i} className="text-sm text-foreground leading-relaxed flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-foreground/30 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground/70">None identified</p>
              )}
            </div>
          ))}
        </div>

        {missingSkills.recommendations.length > 0 && (
          <div className="mt-5 pt-5 border-t border-border/40">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-2.5">
              Recommendations
            </p>
            <ul className="space-y-1.5">
              {missingSkills.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-foreground leading-relaxed flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-foreground/30 mt-2 shrink-0" />
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