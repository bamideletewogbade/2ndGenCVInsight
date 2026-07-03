import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Warning, ArrowLeft, ArrowCounterClockwise, CheckCircle, ArrowBendUpRight, CaretDown } from '@phosphor-icons/react';
import { GaugeChart } from '@/components/metrics/GaugeChart';
import { MetricGrid } from '@/components/metrics/MetricGrid';
import { atsScoreColor, atsStrokeColor, skillCategoryColors } from '@/config/ui';
import { cn } from '@/lib/utils';
import type { AnalysisResponse } from '@/types/analysis';
import type { AIRequestMetrics } from '@/types/metrics';

/* ─── Tab types ─── */
type TabId = 'overview' | 'feedback' | 'insights';

const tabs: { id: TabId; label: string; shortLabel: string }[] = [
  { id: 'overview', label: 'Overview', shortLabel: 'Score' },
  { id: 'feedback', label: 'Feedback', shortLabel: 'Feedback' },
  { id: 'insights', label: 'AI & Metrics', shortLabel: 'AI' },
];

/* ─── Empty state ─── */
function EmptyState({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
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

/* ─── OVERVIEW TAB ─── */
function OverviewTab({ data, totalSkills }: { data: AnalysisResponse; totalSkills: number }) {
  const { summary, atsScore } = data;
  const strokeColor = atsStrokeColor(atsScore.overall);

  return (
    <div className="space-y-5">
      {/* Hero: ATS Score + Quick Stats */}
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center">
            <GaugeChart score={atsScore.overall} size={120} sizeSm={150} />
            <p className="text-[13px] text-muted-foreground text-center mt-4 max-w-sm leading-relaxed">
              {atsScore.notes}
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="rounded-lg bg-secondary/50 py-3 px-2 text-center">
              <p className="font-heading text-lg font-bold tracking-tight">{summary.yearsOfExperience}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Years Exp.</p>
            </div>
            <div className="rounded-lg bg-secondary/50 py-3 px-2 text-center">
              <p className="font-heading text-lg font-bold tracking-tight">{totalSkills}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Skills</p>
            </div>
            <div className="rounded-lg bg-secondary/50 py-3 px-2 text-center">
              <p className="font-heading text-lg font-bold tracking-tight" style={{ color: strokeColor }}>
                {atsScore.overall}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">ATS Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview text */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-[15px] font-semibold tracking-tight">Summary</h3>
        </CardHeader>
        <CardContent>
          <p className="text-[14px] text-foreground leading-relaxed">{summary.overview}</p>
        </CardContent>
      </Card>

      {/* Career + Qualifications side by side on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {summary.careerProgression.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="font-heading text-[15px] font-semibold tracking-tight">Career Path</h3>
            </CardHeader>
            <CardContent>
              <div className="relative ml-2.5 border-l-2 border-foreground/10 pl-4 space-y-2.5">
                {summary.careerProgression.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[calc(0.5rem+3px+3px)] top-[6px] w-1.5 h-1.5 rounded-full bg-foreground/20 border border-background" />
                    <p className="text-[13px] text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {summary.strongestQualifications.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="font-heading text-[15px] font-semibold tracking-tight">Top Qualifications</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {summary.strongestQualifications.map((q, i) => (
                  <Badge key={i} variant="secondary" className="text-[11px] px-2.5 py-1">
                    {q}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ─── FEEDBACK TAB ─── */
function FeedbackTab({ data }: { data: AnalysisResponse }) {
  const { skills, strengths, improvements, atsScore, missingSkills } = data;

  const breakdownItems = [
    { key: 'formatting' as const, label: 'Formatting' },
    { key: 'keywords' as const, label: 'Keywords' },
    { key: 'readability' as const, label: 'Readability' },
    { key: 'experience' as const, label: 'Experience' },
    { key: 'skills' as const, label: 'Skills' },
    { key: 'consistency' as const, label: 'Consistency' },
  ];

  return (
    <div className="space-y-5">
      {/* ATS Breakdown — compact bars */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-[15px] font-semibold tracking-tight">ATS Breakdown</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {breakdownItems.map((item) => (
            <div key={item.key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] text-muted-foreground">{item.label}</span>
                <span className={`text-[12px] font-mono font-medium ${atsScoreColor(atsScore.breakdown[item.key])}`}>
                  {atsScore.breakdown[item.key]}
                </span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground transition-all duration-700 ease-out"
                  style={{ width: `${atsScore.breakdown[item.key]}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground/60 pt-2 leading-relaxed">
            Estimated score for educational purposes — not an official ATS assessment.
          </p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-[15px] font-semibold tracking-tight">
            Skills
            <span className="text-[11px] text-muted-foreground font-normal ml-2 font-body">
              {skills.reduce((a, c) => a + c.items.length, 0)} found
            </span>
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {skills.map((category, ci) => (
            <div key={category.category}>
              {ci > 0 && <Separator className="mb-4" />}
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-2">
                {category.category}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className={cn(
                      'inline-flex items-center rounded-md px-2.5 py-1 text-[12px] font-medium',
                      skillCategoryColors[category.category] ?? skillCategoryColors['Tools']
                    )}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths & Improvements — side by side on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <h3 className="font-heading text-[15px] font-semibold tracking-tight">
              Strengths
              <span className="text-[11px] text-muted-foreground font-normal ml-2 font-body">
                {strengths.length}
              </span>
            </h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={16} weight="duotone" className="text-foreground/30 mt-0.5 shrink-0" />
                  <p className="text-[13px] text-foreground leading-relaxed">{s}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-secondary/15">
          <CardHeader>
            <h3 className="font-heading text-[15px] font-semibold tracking-tight">
              Improvements
              <span className="text-[11px] text-muted-foreground font-normal ml-2 font-body">
                {improvements.length}
              </span>
            </h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <ArrowBendUpRight size={16} weight="duotone" className="text-foreground/30 mt-0.5 shrink-0" />
                  <p className="text-[13px] text-foreground leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Missing Skills */}
      {missingSkills && (
        <MissingSkillsSection missingSkills={missingSkills} />
      )}
    </div>
  );
}

function MissingSkillsSection({ missingSkills }: { missingSkills: AnalysisResponse['missingSkills'] & {} }) {
  const isHighMatch = missingSkills.matchPercentage >= 80;
  const isLowMatch = missingSkills.matchPercentage < 50;
  const statusColor = isHighMatch ? 'text-green-600 dark:text-green-400' : isLowMatch ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-heading text-[15px] font-semibold tracking-tight">Missing Skills</h3>
          </div>
          <div className="text-right shrink-0 ml-4">
            <span className={`font-heading text-xl font-bold tracking-tight ${statusColor}`}>
              {missingSkills.matchPercentage}%
            </span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Match</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-0 sm:mb-5">
          {([
            { title: 'Technologies', items: missingSkills.technologies },
            { title: 'Certifications', items: missingSkills.certifications },
            { title: 'Soft Skills', items: missingSkills.softSkills },
          ] as const).map((col) => (
            <div key={col.title}>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-2">
                {col.title}
              </p>
              {col.items.length > 0 ? (
                <ul className="space-y-1">
                  {col.items.map((item, i) => (
                    <li key={i} className="text-[13px] text-foreground leading-relaxed flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-foreground/30 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] text-muted-foreground/70">None identified</p>
              )}
            </div>
          ))}
        </div>

        {missingSkills.recommendations.length > 0 && (
          <div className="pt-4 border-t border-border/40">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-2">
              Recommendations
            </p>
            <ul className="space-y-1.5">
              {missingSkills.recommendations.map((r, i) => (
                <li key={i} className="text-[13px] text-foreground leading-relaxed flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-foreground/30 mt-2 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── INSIGHTS TAB ─── */
function InsightsTab({ metrics }: { metrics: AIRequestMetrics }) {
  const [aiOpen, setAiOpen] = useState(true);

  return (
    <div className="space-y-5">
      {/* Request Metrics */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-[15px] font-semibold tracking-tight">
            Request Metrics
          </h3>
        </CardHeader>
        <CardContent>
          <MetricGrid metrics={metrics} />
        </CardContent>
      </Card>

      {/* Responsible AI */}
      <Card>
        <button
          onClick={() => setAiOpen(!aiOpen)}
          className="w-full text-left"
        >
          <CardHeader className="cursor-pointer select-none hover:bg-secondary/30 transition-colors rounded-t-[var(--radius)]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-[15px] font-semibold tracking-tight">Responsible AI</h3>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  Privacy, fairness, transparency, and governance.
                </p>
              </div>
              <CaretDown
                size={16}
                weight="bold"
                className={cn(
                  'text-muted-foreground transition-transform duration-200 shrink-0 ml-3',
                  aiOpen && 'rotate-180'
                )}
              />
            </div>
          </CardHeader>
        </button>
        {aiOpen && (
          <CardContent className="pt-0 space-y-4">
            {[
              { title: 'Privacy', items: ['PII detection scan performed', 'Sensitive info check completed', 'Text held in session memory only'] },
              { title: 'Fairness', items: ['Ignores name, age, gender, ethnicity', 'Feedback based solely on job-relevant criteria'] },
              { title: 'Transparency', items: ['All recommendations AI-generated', 'Review with a human before making changes'] },
              { title: 'Governance', items: ['Session record in Request Metrics above', 'Prompt version tracked for reproducibility', 'Exact AI model and version recorded'] },
            ].map((section, si) => (
              <div key={section.title}>
                {si > 0 && <Separator className="mb-4" />}
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.12em] mb-2">
                  {section.title}
                </p>
                <ul className="space-y-2">
                  {section.items.map((text, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle size={13} weight="bold" className="text-foreground/30 mt-px shrink-0" />
                      <span className="text-[12px] text-foreground leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Risk Level</span>
              <Badge variant="success">Low</Badge>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

/* ─── TAB CONTENT ANIMATION ─── */
const tabContentVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

/* ─── MAIN DASHBOARD PAGE ─── */
export function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result?: AnalysisResponse; metrics?: AIRequestMetrics; fileName?: string } | null;
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (!state?.result || !state?.metrics) {
    return <EmptyState navigate={navigate} />;
  }

  const { result, metrics, fileName } = state;
  const totalSkills = result.skills.reduce((acc, c) => acc + c.items.length, 0);
  const strokeColor = atsStrokeColor(result.atsScore.overall);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Sticky Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/60">
          <div className="max-w-2xl mx-auto px-4">
            {/* Top bar */}
            <div className="flex items-center justify-between h-11">
              <button
                onClick={() => navigate('/upload')}
                className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full hover:bg-secondary transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={18} weight="bold" className="text-foreground/70" />
              </button>
              <span className="font-heading text-[13px] font-semibold tracking-tight truncate max-w-[200px]">
                {fileName ?? 'Resume Analysis'}
              </span>
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

            {/* Tab bar */}
            <div className="flex gap-1 -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative px-4 py-2.5 text-[13px] font-medium transition-colors',
                    activeTab === tab.id
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground/70'
                  )}
                >
                  <span className="sm:inline hidden">{tab.label}</span>
                  <span className="sm:hidden inline">{tab.shortLabel}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-foreground rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="max-w-2xl mx-auto px-4 pt-5 pb-24">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <OverviewTab data={result} totalSkills={totalSkills} />
              </motion.div>
            )}
            {activeTab === 'feedback' && (
              <motion.div
                key="feedback"
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <FeedbackTab data={result} />
              </motion.div>
            )}
            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                variants={tabContentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <InsightsTab metrics={metrics} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* FAB — mobile only */}
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