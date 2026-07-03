import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-amber-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950" />
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Analyze your CV with{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              production-grade
            </span>{' '}
            AI engineering.
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Upload your resume, get actionable feedback, and see exactly how the AI system works — every metric, every decision, explained.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="mt-10"
        >
          <Button
            size="lg"
            onClick={() => navigate('/upload')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 text-base gap-2 shadow-lg shadow-indigo-500/25"
          >
            <Sparkles className="w-4 h-4" />
            Upload Resume
          </Button>
        </motion.div>
      </div>
    </section>
  );
}