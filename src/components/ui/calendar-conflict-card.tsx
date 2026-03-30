import { SecondaryButton } from './secondary-button';
import { StatusBadge } from './status-badge';

export function CalendarConflictCard({
  title,
  description,
  suggestion,
}: {
  title: string;
  description: string;
  suggestion: string;
}) {
  return (
    <div className="rounded-2xl border border-danger/15 bg-danger-soft/60 p-5">
      <div className="mb-3">
        <StatusBadge tone="danger">Конфликт найден</StatusBadge>
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-4 rounded-xl border border-danger/10 bg-panel px-4 py-3 text-sm text-foreground">
        {suggestion}
      </div>
      <div className="mt-4">
        <SecondaryButton>Предложить новое время</SecondaryButton>
      </div>
    </div>
  );
}

