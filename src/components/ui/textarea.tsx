import { forwardRef, TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-32 w-full rounded-2xl border border-border bg-panel px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15',
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';
