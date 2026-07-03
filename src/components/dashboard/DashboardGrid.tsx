import { motion } from 'framer-motion';
import { SummaryCard } from './SummaryCard';
import { SkillsCard } from './SkillsCard';
import { StrengthsCard } from './StrengthsCard';
import { ImprovementsCard } from './ImprovementsCard';
import { ATSScoreCard } from './ATSScoreCard';
import { MissingSkillsCard } from './MissingSkillsCard';
import { InsightsPanel } from './InsightsPanel';
import { ResponsibleAICard } from './ResponsibleAICard';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AnalysisResponse } from '@/types/analysis';
import type { AIRequestMetrics } from '@/types/metrics';
import { animation } from '@/config/ui';

interface DashboardGridProps {
  data: AnalysisResponse;
  metrics: AIRequestMetrics;
}

const containerVariants = {
  animate: {
    transition: { staggerChildren: animation.stagger },
  },
};

const itemVariants = {
  initial: animation.fadeUp.initial,
  animate: animation.fadeUp.animate,
  transition: animation.fadeUp.transition,
};

export function DashboardGrid({ data, metrics }: DashboardGridProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants}>
          <SummaryCard summary={data.summary} />
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
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="initial"
        animate="animate"
      >
        <InsightsPanel metrics={metrics} />
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="initial"
        animate="animate"
      >
        <ResponsibleAICard />
      </motion.div>

      <div className="flex justify-center pt-4 pb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/upload')}
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Analyze Another
        </Button>
      </div>
    </div>
  );
}