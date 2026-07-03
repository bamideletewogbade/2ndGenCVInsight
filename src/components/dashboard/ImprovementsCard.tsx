import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ImprovementsCardProps {
  improvements: string[];
}

export function ImprovementsCard({ improvements }: ImprovementsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Improvements</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {improvements.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-[10px] font-mono text-muted-foreground mt-px">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-[13px] text-foreground leading-relaxed">{item}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}