import { useLocation, useNavigate } from 'react-router-dom';
import { PageTransition } from '@/components/layout/PageTransition';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
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
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-lg font-semibold">No Analysis Data</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                It looks like you navigated here directly. Please upload a resume first to see your analysis.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => navigate('/upload')} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardGrid data={state.result} metrics={state.metrics} />
      </div>
    </PageTransition>
  );
}