import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

const toneMap = {
  neutral: 'border-border bg-panel-subtle text-muted',
  info: 'border-brand-blue/40 bg-info-soft text-info',
  success: 'border-success/20 bg-success-soft text-success',
  warning: 'border-brand-red/15 bg-warning-soft text-warning',
  danger: 'border-brand-red/20 bg-danger-soft text-danger',
} as const;

const dotMap = {
  neutral: 'bg-muted-foreground',
  info: 'bg-brand-blue',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const;

export type StatusTone = keyof typeof toneMap;

export function StatusBadge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em]',
        toneMap[tone],
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotMap[tone])} />
      {children}
    </span>
  );
}
