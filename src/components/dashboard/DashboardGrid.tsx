import { motion } from 'framer-motion';
import { SummaryCard } from './SummaryCard';
import { ATSScoreCard } from './ATSScoreCard';
import { SkillsCard } from './SkillsCard';
import { StrengthsCard } from './StrengthsCard';
import { ImprovementsCard } from './ImprovementsCard';
import { MissingSkillsCard } from './MissingSkillsCard';
import { InsightsPanel } from './InsightsPanel';
import { ResponsibleAICard } from './ResponsibleAICard';
import { Button } from '@/components/ui/button';
import { ArrowCounterClockwise } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { animation } from '@/config/ui';
import type { AnalysisResponse } from '@/types/analysis';
import type { AIRequestMetrics } from '@/types/metrics';

interface DashboardGridProps {
  data: AnalysisResponse;
  metrics: AIRequestMetrics;
}

const containerVariants = {
  animate: { transition: { staggerChildren: animation.stagger } },
};

const itemVariants = {
  initial: animation.fadeUp.initial,
  animate: animation.fadeUp.animate,
  transition: animation.fadeUp.transition,
};

export function DashboardGrid({ data, metrics }: DashboardGridProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col"
      >
        <motion.div variants={itemVariants}>
          <SummaryCard summary={data.summary} totalSkills={data.skills.reduce((acc, c) => acc + c.items.length, 0)} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ATSScoreCard atsScore={data.atsScore} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <SkillsCard skills={data.skills} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StrengthsCard strengths={data.strengths} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ImprovementsCard improvements={data.improvements} />
        </motion.div>

        {data.missingSkills && (
          <motion.div variants={itemVariants}>
            <MissingSkillsCard missingSkills={data.missingSkills} />
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <InsightsPanel metrics={metrics} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <ResponsibleAICard />
        </motion.div>
      </motion.div>

      {/* Desktop "Analyze Another" button */}
      <div className="hidden sm:flex justify-center pt-6 pb-10">
        <Button
          variant="outline"
          onClick={() => navigate('/upload')}
          className="rounded-full gap-2 group"
        >
          <ArrowCounterClockwise size={14} weight="bold" />
          Analyze Another
        </Button>
      </div>
    </div>
  );
}