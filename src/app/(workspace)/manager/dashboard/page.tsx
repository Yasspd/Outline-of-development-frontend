'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { RoleRecommendationCard } from '@/components/workspace/role-recommendation-card';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { getAnalyticsTeamOverview, getPendingApprovals } from '@/lib/api';
import { formatApprovalStage } from '@/lib/presentation';

export default function ManagerDashboardPage() {
  const { accessToken } = useAuth();
  const dashboardQuery = useQuery({
    queryKey: ['manager-dashboard', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [teamOverview, approvals] = await Promise.all([
        getAnalyticsTeamOverview(accessToken as string),
        getPendingApprovals(accessToken as string),
      ]);

      return { teamOverview, approvals };
    },
  });

  if (dashboardQuery.isPending || !dashboardQuery.data) {
    return (
      <EmptyState
        title="Собираем обзор команды"
        description="Загружаем очередь согласований и метрики по обучению сотрудников."
      />
    );
  }

  const { teamOverview, approvals } = dashboardQuery.data;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Команда" value={String(teamOverview.teamSize)} description="Прямые подчинённые текущего manager" />
        <MetricCard label="В обучении" value={String(teamOverview.activeLearners)} description="Сотрудники с активным обучением" />
        <MetricCard label="На согласовании" value={String(teamOverview.pendingApprovals)} description="Заявки, ожидающие решения" />
      </section>

      <RoleRecommendationCard role="manager" />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Очередь согласований"
          description="Заявки сотрудников, по которым требуется решение руководителя."
        >
          <div className="space-y-3">
            {approvals.length ? (
              approvals.slice(0, 5).map((approval) => (
                <div
                  key={approval.id}
                  className="rounded-[24px] border border-border bg-panel-subtle p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-foreground">{approval.request.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {approval.request.employee?.firstName} {approval.request.employee?.lastName}
                      </p>
                    </div>
                    <StatusBadge tone="warning">{formatApprovalStage(approval.stage)}</StatusBadge>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Новых заявок на согласование пока нет"
                description="Когда сотрудник отправит заявку на внешнее обучение, она появится в этой очереди."
              />
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Команда"
          description="Краткая витрина по сотрудникам и их учебной активности."
        >
          <div className="space-y-3">
            {teamOverview.members.length ? (
              teamOverview.members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-[24px] border border-border bg-panel-subtle p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="mt-1 text-sm text-muted">{member.position ?? member.email}</p>
                    </div>
                    <StatusBadge tone={member.enrollments ? 'info' : 'neutral'}>
                      {member.enrollments} записей
                    </StatusBadge>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Команда пока пуста"
                description="Когда за вами закрепят сотрудников, здесь появится сводка по их обучению и заявкам."
              />
            )}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-border bg-panel p-5">
      <div className="alrosa-rule mb-4" />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
