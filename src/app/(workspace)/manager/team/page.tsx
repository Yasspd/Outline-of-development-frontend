'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { getAnalyticsTeamOverview, getMyTeam } from '@/lib/api';

export default function ManagerTeamPage() {
  const { accessToken } = useAuth();
  const teamQuery = useQuery({
    queryKey: ['manager-team', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [team, overview] = await Promise.all([
        getMyTeam(accessToken as string),
        getAnalyticsTeamOverview(accessToken as string),
      ]);

      return { team, overview };
    },
  });

  if (teamQuery.isPending || !teamQuery.data) {
    return (
      <EmptyState
        title="Загружаем команду"
        description="Поднимаем прямых подчинённых и их учебную активность."
      />
    );
  }

  const { team, overview } = teamQuery.data;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Сводка по команде"
        description="Общий срез по активному обучению, заявкам и сертификатам сотрудников."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Команда" value={String(overview.teamSize)} />
          <SummaryCard label="Активные обучающиеся" value={String(overview.activeLearners)} />
          <SummaryCard label="На согласовании" value={String(overview.pendingApprovals)} />
        </div>
      </SectionCard>

      <SectionCard
        title="Сотрудники"
        description="Прямые подчинённые руководителя и их сигналы по обучению."
      >
        <div className="space-y-3">
          {team.length ? (
            team.map((member) => {
              const metrics = overview.members.find((item) => item.id === member.id);

              return (
                <div
                  key={member.id}
                  className="rounded-[24px] border border-border bg-panel-subtle p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {member.position ?? 'Должность не указана'} · {member.department ?? 'Подразделение не указано'}
                      </p>
                      <p className="mt-1 text-sm text-muted">{member.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone={metrics?.enrollments ? 'info' : 'neutral'}>
                        {metrics?.enrollments ?? 0} записей
                      </StatusBadge>
                      <StatusBadge tone={metrics?.externalRequests ? 'warning' : 'neutral'}>
                        {metrics?.externalRequests ?? 0} заявок
                      </StatusBadge>
                      <StatusBadge tone={metrics?.certificates ? 'success' : 'neutral'}>
                        {metrics?.certificates ?? 0} сертификатов
                      </StatusBadge>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="Команда не настроена"
              description="Когда кадровая служба закрепит за вами сотрудников, здесь появится сводка по их обучению и заявкам."
            />
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
