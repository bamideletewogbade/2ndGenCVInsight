import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow } from '@/components/ui/hover-card';
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
    <HoverCard openDelay={300} closeDelay={150}>
      <HoverCardTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-help">
          {children}
          {showIcon && (
            <span className="inline-flex items-center justify-center w-3 h-3 rounded-full text-[8px] font-medium text-muted-foreground/50 bg-secondary border border-border/50 shrink-0 select-none leading-none pb-px">
              i
            </span>
          )}
        </span>
      </HoverCardTrigger>
      <AnimatePresence>
        <HoverCardContent asChild forceMount side="top" align="start" sideOffset={10}>
          <motion.div
            initial={animation.tooltip.initial}
            animate={animation.tooltip.animate}
            exit={animation.tooltip.exit}
            transition={animation.tooltip.transition}
            className="space-y-1.5 max-w-xs"
          >
            <HoverCardArrow className="fill-popover" />
            <p className="text-xs text-popover-foreground leading-relaxed">
              {entry.definition}
            </p>
            {entry.whyItMatters && (
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {entry.whyItMatters}
              </p>
            )}
          </motion.div>
        </HoverCardContent>
      </AnimatePresence>
    </HoverCard>
  );
}