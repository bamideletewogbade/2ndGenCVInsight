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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...animation.fadeUp.transition, delay: index * animation.stagger }}
      className="group p-6 rounded-[var(--radius)] border border-transparent hover:border-border/60 transition-colors duration-300"
    >
      <div className="text-foreground/70 mb-4 group-hover:text-foreground transition-colors">
        {icon}
      </div>
      <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground mb-2">
        {title}
      </h3>
      <p className="text-[13px] text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}