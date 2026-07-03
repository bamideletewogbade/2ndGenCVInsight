import { useLocation, useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/layout/PageTransition';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Warning, ArrowLeft } from '@phosphor-icons/react';
import type { AnalysisResponse } from '@/types/analysis';
import type { AIRequestMetrics } from '@/types/metrics';

export function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result?: AnalysisResponse; metrics?: AIRequestMetrics } | null;

  if (!state?.result || !state?.metrics) {
    return (
      <PageTransition>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="max-w-sm w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Warning size={18} weight="regular" className="text-foreground/70" />
              </div>
              <h2 className="font-heading text-base font-semibold tracking-tight">No Analysis Data</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-[13px] text-muted-foreground text-center leading-relaxed">
                Please upload a resume first to see your analysis.
              </p>
              <div className="flex justify-center">
                <Button variant="outline" onClick={() => navigate('/upload')} className="rounded-full gap-1.5">
                  <ArrowLeft size={14} weight="bold" />
                  Upload Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        <DashboardGrid data={state.result} metrics={state.metrics} />
      </div>
    </PageTransition>
  );
}