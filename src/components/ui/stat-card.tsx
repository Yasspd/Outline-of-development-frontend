import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export function StatCard({
  label,
  value,
  meta,
  accent,
  className,
}: {
  label: string;
  value: string;
  meta: ReactNode;
  accent?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'rounded-2xl border border-border bg-panel px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        {accent ? <div className="text-right text-xs text-muted">{accent}</div> : null}
      </div>
      <div className="mt-4 text-sm text-muted">{meta}</div>
    </article>
  );
}

