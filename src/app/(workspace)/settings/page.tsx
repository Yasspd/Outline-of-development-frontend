import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { settingsSnapshot } from '@/lib/mock-data';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Профиль"
        description="Основные данные сотрудника и контекст роли в системе."
      >
        <dl className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-panel-muted p-5">
            <dt className="text-sm text-muted">ФИО</dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">
              {settingsSnapshot.fullName}
            </dd>
          </div>
          <div className="rounded-2xl border border-border bg-panel-muted p-5">
            <dt className="text-sm text-muted">Роль</dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">
              {settingsSnapshot.role}
            </dd>
          </div>
          <div className="rounded-2xl border border-border bg-panel-muted p-5">
            <dt className="text-sm text-muted">Email</dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">
              {settingsSnapshot.email}
            </dd>
          </div>
          <div className="rounded-2xl border border-border bg-panel-muted p-5">
            <dt className="text-sm text-muted">Подразделение</dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">
              {settingsSnapshot.department}
            </dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard
        title="Уведомления"
        description="Только рабочие уведомления, без лишнего шума."
      >
        <div className="space-y-3">
          {settingsSnapshot.notifications.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-border bg-panel-muted px-4 py-4"
            >
              <p className="text-sm font-medium text-foreground">{item}</p>
              <StatusBadge tone="success">Включено</StatusBadge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
