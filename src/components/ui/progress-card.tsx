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
  return (
    <article className={cn('rounded-2xl border border-border bg-panel-muted p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
        </div>
        <p className="text-sm font-semibold text-accent">{progress}%</p>
      </div>
      <div className="mt-4 h-2.5 rounded-full bg-accent-soft">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-muted">{nextStep}</p>
    </article>
  );
}

