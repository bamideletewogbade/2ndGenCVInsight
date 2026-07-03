import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface StrengthsCardProps {
  strengths: string[];
}

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strengths</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {strengths.map((strength, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-[10px] font-mono text-muted-foreground mt-px">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-[13px] text-foreground leading-relaxed">{strength}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}