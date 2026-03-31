import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
