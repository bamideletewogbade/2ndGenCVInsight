import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ResumeSummary } from '@/types/analysis';

interface SummaryCardProps {
  summary: ResumeSummary;
  totalSkills: number;
}

export function SummaryCard({ summary, totalSkills }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[17px]">Resume Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Overview text */}
        <p className="text-sm text-foreground leading-relaxed">
          {summary.overview}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-border/60">
          <div className="flex flex-col items-center text-center px-2">
            <span className="font-heading text-xl font-bold tracking-tight">
              {summary.yearsOfExperience}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
              Years Exp.
            </span>
          </div>
          <div className="flex flex-col items-center text-center px-2">
            <span className="font-heading text-xl font-bold tracking-tight">
              {totalSkills}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
              Skills Found
            </span>
          </div>
          <div className="flex flex-col items-center text-center px-2">
            <span className="font-heading text-xl font-bold tracking-tight">
              {summary.careerProgression.length}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
              Career Steps
            </span>
          </div>
        </div>

        {/* Career Progression */}
        {summary.careerProgression.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-3">
              Career Progression
            </p>
            <div className="relative ml-2 border-l-2 border-foreground/10 pl-5 space-y-3">
              {summary.careerProgression.map((item, i) => (
                <div key={i} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[calc(0.5rem+5px+4px)] top-[6px] w-2 h-2 rounded-full bg-foreground/20 border border-background" />
                  <p className="text-sm text-foreground leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strongest Qualifications */}
        {summary.strongestQualifications.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-3">
              Strongest Qualifications
            </p>
            <div className="flex flex-wrap gap-1.5">
              {summary.strongestQualifications.map((q, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-[11px] sm:text-[10px] px-2.5 py-1 sm:px-2 sm:py-0.5"
                >
                  {q}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}