import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '@/lib/utils';

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 8, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-80 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none',
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

const HoverCardArrow = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Arrow>
>((props, ref) => (
  <HoverCardPrimitive.Arrow
    ref={ref}
    className="fill-popover"
    {...props}
  />
));
HoverCardArrow.displayName = HoverCardPrimitive.Arrow.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardArrow };