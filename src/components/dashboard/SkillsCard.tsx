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
        <CardTitle>Skills Extraction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.map((category) => (
          <div key={category.category}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              {category.category}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((skill) => {
                const colorClass = skillCategoryColors[category.category] ?? skillCategoryColors['Tools'];
                return (
                  <span
                    key={skill}
                    className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colorClass)}
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