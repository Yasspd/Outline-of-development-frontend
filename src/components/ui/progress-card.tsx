import { cn } from '@/lib/cn';

export function ProgressCard({
  title,
  description,
  progress,
  nextStep,
  className,
}: {
  title: string;
  description: string;
  progress: number;
  nextStep: string;
  className?: string;
}) {
  const clampedProgress = Math.min(98, Math.max(2, progress));

  return (
    <article className={cn('rounded-[26px] border border-border bg-panel-subtle p-5', className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="alrosa-rule w-12" />
        <p className="text-sm font-semibold text-foreground">{progress}%</p>
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="relative mt-5 h-2 rounded-full bg-accent-soft">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${progress}%` }}
        />
        <span
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-brand-red bg-panel"
          style={{ left: `calc(${clampedProgress}% - 0.375rem)` }}
        />
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{nextStep}</p>
    </article>
  );
}
