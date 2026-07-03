import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from '@phosphor-icons/react';

interface StrengthsCardProps {
  strengths: string[];
}

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strengths</CardTitle>
        <p className="text-[11px] text-muted-foreground">
          {strengths.length} {strengths.length === 1 ? 'strength' : 'strengths'} identified
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-0">
          {strengths.map((strength, i) => (
            <li
              key={i}
              className="flex items-start gap-3 border-l-2 border-foreground/8 pl-4 py-2"
            >
              <CheckCircle
                size={18}
                weight="duotone"
                className="text-foreground/30 mt-px shrink-0"
              />
              <p className="text-[13px] text-foreground leading-relaxed">{strength}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}