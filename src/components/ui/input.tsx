import { forwardRef, InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted focus:border-ring focus:ring-2 focus:ring-ring/15',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';

