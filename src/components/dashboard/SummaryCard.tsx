import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ResumeSummary } from '@/types/analysis';

interface SummaryCardProps {
  summary: ResumeSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Resume Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground leading-relaxed">{summary.overview}</p>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Years of Experience</p>
          <p className="text-2xl font-bold text-foreground">{summary.yearsOfExperience}</p>
        </div>
        {summary.careerProgression.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Career Progression</p>
            <div className="space-y-2">
              {summary.careerProgression.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {summary.strongestQualifications.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Strongest Qualifications</p>
            <div className="flex flex-wrap gap-1.5">
              {summary.strongestQualifications.map((q, i) => (
                <Badge key={i} variant="secondary">{q}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}