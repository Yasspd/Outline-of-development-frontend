import { CalendarConflictCard } from '@/components/ui/calendar-conflict-card';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { calendarConflict, calendarEvents } from '@/lib/mock-data';
import { formatFullDate } from '@/lib/format';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Ближайшие события"
        description="Лента обучения собрана так, чтобы быстро видеть занятость и статусы."
      >
        <div className="space-y-3">
          {calendarEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-panel-muted p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-semibold text-foreground">{event.title}</p>
                <p className="text-sm text-muted">
                  {event.type} · {formatFullDate(event.date)}
                </p>
              </div>
              <StatusBadge tone={event.tone}>{event.status}</StatusBadge>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Проверка конфликтов"
        description="Критичные пересечения показываются отдельным спокойным блоком."
      >
        <CalendarConflictCard
          title={calendarConflict.title}
          description={calendarConflict.description}
          suggestion={calendarConflict.suggestion}
        />
      </SectionCard>
    </div>
  );
}

