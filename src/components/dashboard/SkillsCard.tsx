import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { skillCategoryColors } from '@/config/ui';
import { cn } from '@/lib/utils';
import type { SkillCategory } from '@/types/analysis';

interface SkillsCardProps {
  skills: SkillCategory[];
}

export function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {skills.map((category, ci) => (
          <div key={category.category}>
            {ci > 0 && <Separator className="my-4" />}
            <div className="flex items-baseline gap-2 mb-2.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em]">
                {category.category}
              </p>
              <span className="text-[10px] text-muted-foreground/60 font-mono">
                ({category.items.length} {category.items.length === 1 ? 'skill' : 'skills'})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((skill) => {
                const colorClass = skillCategoryColors[category.category] ?? skillCategoryColors['Tools'];
                return (
                  <span
                    key={skill}
                    className={cn(
                      'inline-flex items-center rounded-md px-2.5 py-1 text-xs sm:px-2 sm:py-0.5 sm:text-[11px] font-medium',
                      colorClass
                    )}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}