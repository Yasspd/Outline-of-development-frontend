import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

const toneMap = {
  neutral: 'bg-panel-muted text-muted',
  info: 'bg-info-soft text-info',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
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
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide',
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

