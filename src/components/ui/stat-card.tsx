import { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export function StatCard({
  label,
  value,
  meta,
  accent,
  icon,
  className,
}: {
  label: string;
  value: string;
  meta: ReactNode;
  accent?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'rounded-[26px] border border-border bg-panel px-5 py-5',
        className,
      )}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="alrosa-rule w-14" />
        <div className="flex items-center gap-3">
          {accent ? (
            <div className="rounded-full border border-brand-blue/35 bg-brand-blue-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-info">
              {accent}
            </div>
          ) : null}
          {icon ? (
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-panel-subtle text-foreground">
              {icon}
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="mt-3 text-[2rem] font-semibold tracking-tight text-foreground">{value}</p>
      </div>

      <div className="mt-5 border-t border-border pt-4 text-sm leading-6 text-muted">
        {meta}
      </div>
    </article>
  );
}
