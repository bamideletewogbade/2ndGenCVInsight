import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';
import { metricGlossary } from '@/lib/metric-glossary';
import { animation } from '@/config/ui';

interface MetricTooltipProps {
  metricKey: string;
  children: React.ReactNode;
  showIcon?: boolean;
}

export function MetricTooltip({ metricKey, children, showIcon = true }: MetricTooltipProps) {
  const entry = metricGlossary[metricKey];

  if (!entry) {
    return <>{children}</>;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-help">
          {children}
          {showIcon && (
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[10px] font-medium text-muted-foreground/70 bg-muted/50 shrink-0 select-none">
              i
            </span>
          )}
        </span>
      </HoverCardTrigger>
      <AnimatePresence>
        <HoverCardContent asChild forceMount side="top" align="start" sideOffset={8}>
          <motion.div
            initial={animation.tooltip.initial}
            animate={animation.tooltip.animate}
            exit={animation.tooltip.exit}
            transition={animation.tooltip.transition}
            className="space-y-1.5"
          >
            <HoverCardArrow className="fill-popover" />
            <p className="text-sm font-medium text-popover-foreground">
              {entry.definition}
            </p>
            {entry.whyItMatters && (
              <p className="text-xs text-muted-foreground">
                {entry.whyItMatters}
              </p>
            )}
          </motion.div>
        </HoverCardContent>
      </AnimatePresence>
    </HoverCard>
  );
}