import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Warning, ArrowLeft, ArrowCounterClockwise } from '@phosphor-icons/react';
import { atsScoreColor } from '@/config/ui';
import { animation } from '@/config/ui';
import type { AnalysisResponse } from '@/types/analysis';
import type { AIRequestMetrics } from '@/types/metrics';

const headerVariants = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const contentVariants = {
  initial: animation.fadeUp.initial,
  animate: animation.fadeUp.animate,
};

export function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result?: AnalysisResponse; metrics?: AIRequestMetrics; fileName?: string } | null;

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

  const { result, metrics, fileName } = state;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Sticky Report Header */}
        <motion.header
          variants={headerVariants}
          initial="initial"
          animate="animate"
          className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/60"
        >
          <div className="max-w-2xl mx-auto flex items-center justify-between h-11 px-4">
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full hover:bg-secondary transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={18} weight="bold" className="text-foreground/70" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-heading text-[13px] font-semibold tracking-tight truncate">
                {fileName ?? 'Resume Analysis'}
              </span>
            </div>
            <Badge
              className={`shrink-0 font-heading text-[11px] font-bold px-2 py-0.5 rounded-full ${
                result.atsScore.overall >= 70
                  ? 'bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20'
                  : result.atsScore.overall >= 50
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20'
              }`}
            >
              {result.atsScore.overall}
            </Badge>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main
          variants={contentVariants}
          initial="initial"
          animate="animate"
          transition={animation.fadeUp.transition}
          className="max-w-2xl mx-auto px-4 pt-5 pb-24"
        >
          <DashboardGrid data={result} metrics={metrics} />
        </motion.main>

        {/* Floating "Analyze Another" button — mobile only */}
        <div className="fixed bottom-6 right-6 sm:hidden z-30">
          <Button
            onClick={() => navigate('/upload')}
            className="rounded-full h-12 px-5 gap-2 shadow-lg shadow-black/20 font-heading text-[13px] font-semibold"
            size="sm"
          >
            <ArrowCounterClockwise size={16} weight="bold" />
            <span>New</span>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}