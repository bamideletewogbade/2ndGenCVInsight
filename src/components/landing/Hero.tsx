import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { HeroScene } from '@/components/landing/HeroScene';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 sm:px-8 lg:px-12">
        <div className="pt-20 pb-16 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-28 max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6"
          >
            AI-Powered Resume Analysis
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-heading text-[clamp(2.5rem,8vw,5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground"
          >
            See your CV
            <br />
            <span className="text-muted-foreground">the way AI does.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 text-[15px] sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed"
          >
            Upload your resume. Get instant, honest feedback with full transparency into how the analysis works — models, tokens, cost, everything.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate('/upload')}
              className="rounded-full gap-2 group shrink-0"
            >
              Analyze Your Resume
              <ArrowUpRight
                size={14}
                weight="regular"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Button>
            <span className="text-xs text-muted-foreground">
              PDF or DOCX
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}