import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisLoaderProps {
  stage: 'extracting' | 'sending' | 'analyzing' | 'preparing' | 'idle';
  fallbackMessage?: string | null;
}

const stages = [
  { key: 'extracting', text: 'Extracting text from your resume...' },
  { key: 'sending', text: 'Sending to AI model...' },
  { key: 'analyzing', text: 'Analyzing content and generating feedback...' },
  { key: 'preparing', text: 'Preparing your dashboard...' },
];

export function AnalysisLoader({ stage, fallbackMessage }: AnalysisLoaderProps) {
  const currentIndex = stages.findIndex((s) => s.key === stage);

  return (
    <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Thin progress bar */}
        <div className="relative h-[2px] w-56 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-foreground rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / stages.length) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>

        {/* Stage text */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {stage !== 'idle' && (
              <motion.p
                key={stage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-[13px] text-foreground font-medium"
              >
                {stages[currentIndex]?.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Fallback message */}
        <AnimatePresence>
          {fallbackMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[12px] text-amber-600 dark:text-amber-400"
            >
              {fallbackMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Skeleton preview */}
        <div className="mt-4 w-full max-w-md grid grid-cols-3 gap-2 opacity-8">
          <div className="col-span-2 h-24 rounded-[var(--radius)] bg-secondary animate-pulse" />
          <div className="h-24 rounded-[var(--radius)] bg-secondary animate-pulse" />
          <div className="h-20 rounded-[var(--radius)] bg-secondary animate-pulse" />
          <div className="h-20 rounded-[var(--radius)] bg-secondary animate-pulse" />
          <div className="h-20 rounded-[var(--radius)] bg-secondary animate-pulse" />
        </div>
      </div>
    </div>
  );
}