import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

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
            <li key={i} className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-foreground leading-relaxed">{strength}</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}