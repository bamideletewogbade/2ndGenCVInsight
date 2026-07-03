import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants: Record<string, string> = {
      default: 'bg-foreground text-background hover:bg-foreground/85 active:bg-foreground/95',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/85',
      outline: 'border border-border bg-transparent hover:bg-secondary',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-secondary',
      link: 'text-foreground underline-offset-4 hover:underline',
    };
    const sizes: Record<string, string> = {
      default: 'h-9 px-4 py-2 text-[13px]',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-11 px-7 text-sm',
      icon: 'h-9 w-9',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[var(--radius)] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-40 cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };