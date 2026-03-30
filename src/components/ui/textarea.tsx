import { forwardRef, TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-32 w-full rounded-xl border border-border bg-panel px-4 py-3 text-sm text-foreground outline-none transition-shadow placeholder:text-muted focus:border-ring focus:ring-2 focus:ring-ring/15',
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';

