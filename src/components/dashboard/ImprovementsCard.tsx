import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

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
            <li key={i} className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-foreground leading-relaxed">{item}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}