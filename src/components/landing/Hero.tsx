import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

const stats = ['3 AI Models', '< 10s Analysis', '16 Metrics Tracked'] as const;

export function Hero() {
  const navigate = useNavigate();
  const [statIndex, setStatIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatIndex((prev) => (prev + 1) % stats.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="pt-16 pb-14 sm:pt-32 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Resume Analysis
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-heading text-[clamp(2rem,6vw,3.75rem)] font-bold leading-[1.08] tracking-[-0.025em] text-foreground max-w-3xl"
          >
            Understand your CV
            <br />
            <span className="text-muted-foreground">through the lens</span> of AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 text-[14px] sm:text-[15px] text-muted-foreground max-w-lg leading-relaxed"
          >
            Upload your resume, get actionable feedback, and see every metric behind the analysis — latency, tokens, cost, model selection — all explained in plain language.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-10 flex flex-col items-start gap-3 sm:items-center sm:flex-row"
          >
            <div className="h-4 flex items-center mb-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={statIndex}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-[11px] font-mono text-muted-foreground"
                >
                  {stats[statIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
            <Button
              size="lg"
              onClick={() => navigate('/upload')}
              className="rounded-full gap-2 group"
            >
              Analyze Your Resume
              <ArrowUpRight
                size={14}
                weight="regular"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Button>
            <p className="text-[11px] text-muted-foreground">
              PDF or DOCX · No sign-up
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}