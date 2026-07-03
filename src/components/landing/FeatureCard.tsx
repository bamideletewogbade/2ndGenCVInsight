import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { animation } from '@/config/ui';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...animation.fadeUp.transition, delay: index * animation.stagger }}
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-stone-900 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}