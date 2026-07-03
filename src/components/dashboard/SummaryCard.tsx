import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ResumeSummary } from '@/types/analysis';

interface SummaryCardProps {
  summary: ResumeSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Resume Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-[13px] text-foreground leading-relaxed">{summary.overview}</p>
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-1">Years of Experience</p>
          <p className="font-heading text-2xl font-bold tracking-tight">{summary.yearsOfExperience}</p>
        </div>
        {summary.careerProgression.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-3">Career Progression</p>
            <div className="space-y-2.5">
              {summary.careerProgression.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[10px] font-mono text-muted-foreground mt-px">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-[13px] text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {summary.strongestQualifications.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-3">Strongest Qualifications</p>
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