import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors', {
  variants: {
    variant: {
      default: 'bg-white/10 text-foreground',
      neutral: 'bg-white/10 text-muted-foreground',
      success: 'bg-amber-500/15 text-amber-300',
      warning: 'bg-orange-500/15 text-orange-300',
      accent: 'bg-cyan-500/15 text-cyan-300',
      danger: 'bg-rose-500/15 text-rose-300',
      outline: 'border border-white/10 text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };