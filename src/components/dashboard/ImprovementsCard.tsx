import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowBendUpRight } from '@phosphor-icons/react';

interface ImprovementsCardProps {
  improvements: string[];
}

export function ImprovementsCard({ improvements }: ImprovementsCardProps) {
  return (
    <Card className="bg-secondary/20">
      <CardHeader>
        <CardTitle>Improvements</CardTitle>
        <p className="text-xs text-muted-foreground">
          {improvements.length} {improvements.length === 1 ? 'improvement' : 'improvements'} suggested
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-0">
          {improvements.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 border-l-2 border-foreground/8 pl-4 py-2"
            >
              <ArrowBendUpRight
                size={18}
                weight="duotone"
                className="text-foreground/30 mt-px shrink-0"
              />
              <p className="text-sm text-foreground leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}