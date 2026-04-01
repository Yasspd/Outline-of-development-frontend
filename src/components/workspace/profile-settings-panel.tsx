'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { getPrimaryRoleLabel, getUserDisplayName, getUserRoleLabel } from '@/lib/user-display';

import { RoleRecommendationCard } from './role-recommendation-card';

export function ProfileSettingsPanel() {
  const { user, primaryRole } = useAuth();

  if (!user || !primaryRole) {
    return (
      <EmptyState
        title="Профиль недоступен"
        description="Данные пользователя появятся после загрузки активной сессии."
      />
    );
  }

  const cards = [
    { label: 'ФИО', value: getUserDisplayName(user) },
    { label: 'Основная роль', value: getPrimaryRoleLabel(user.roles) },
    { label: 'Все роли', value: getUserRoleLabel(user.roles) },
    { label: 'Эл. почта', value: user.email },
    { label: 'Должность', value: user.position ?? 'Не указано' },
    { label: 'Подразделение', value: user.department ?? 'Не указано' },
    { label: 'Почта Outlook', value: user.outlookEmail ?? 'Не указана' },
    {
      label: 'Руководитель',
      value: user.manager ? `${user.manager.firstName} ${user.manager.lastName}` : 'Не назначен',
    },
  ];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Профиль"
        description="Основные сведения о сотруднике, роли в системе и контакты для рабочего контура обучения."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((item) => (
            <div key={item.label} className="rounded-[24px] border border-border bg-panel-subtle p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {item.label}
              </p>
              <p className="mt-3 text-base font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <RoleRecommendationCard role={primaryRole} />
    </div>
  );
}
