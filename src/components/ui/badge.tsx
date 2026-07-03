import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-foreground text-background',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive/10 text-destructive',
    outline: 'border border-border text-foreground',
    success: 'bg-green-500/10 text-green-700 dark:text-green-400',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };