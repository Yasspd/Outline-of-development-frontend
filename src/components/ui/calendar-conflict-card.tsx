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
    <div className="rounded-[26px] border border-brand-red/20 bg-danger-soft/65 p-5">
      <div className="mb-4 flex items-center gap-4">
        <div className="alrosa-rule w-14" />
        <StatusBadge tone="danger">Конфликт найден</StatusBadge>
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-4 rounded-2xl border border-brand-red/15 bg-panel px-4 py-4 text-sm leading-6 text-foreground">
        {suggestion}
      </div>
      <div className="mt-5">
        <SecondaryButton>Предложить новое время</SecondaryButton>
      </div>
    </div>
  );
}
