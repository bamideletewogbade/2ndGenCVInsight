import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="pt-24 pb-20 sm:pt-32 sm:pb-28">
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
            className="mt-6 text-[15px] text-muted-foreground max-w-lg leading-relaxed"
          >
            Upload your resume, get actionable feedback, and see every metric behind the analysis — latency, tokens, cost, model selection — all explained in plain language.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-10 flex items-center gap-3"
          >
            <Button
              size="lg"
              onClick={() => navigate('/upload')}
              className="rounded-full gap-2 group"
            >
              Upload Resume
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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