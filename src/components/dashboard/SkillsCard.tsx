import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
      <CardContent className="space-y-5">
        {skills.map((category) => (
          <div key={category.category}>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-2.5">
              {category.category}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((skill) => {
                const colorClass = skillCategoryColors[category.category] ?? skillCategoryColors['Tools'];
                return (
                  <span
                    key={skill}
                    className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium', colorClass)}
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