'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { RoleRecommendationCard } from '@/components/workspace/role-recommendation-card';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  getAnalyticsOverview,
  getCourses,
  getPendingApprovals,
  getUsers,
} from '@/lib/api';

export default function HrDashboardPage() {
  const { accessToken } = useAuth();
  const dashboardQuery = useQuery({
    queryKey: ['hr-dashboard', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [overview, approvals, users, courses] = await Promise.all([
        getAnalyticsOverview(accessToken as string),
        getPendingApprovals(accessToken as string),
        getUsers(accessToken as string),
        getCourses(accessToken as string),
      ]);

      return { overview, approvals, users, courses };
    },
  });

  if (dashboardQuery.isPending || !dashboardQuery.data) {
    return (
      <EmptyState
        title="Собираем кабинет кадровой службы"
        description="Загружаем пользователей, курсы, согласования и общую аналитику."
      />
    );
  }

  const { overview, approvals, users, courses } = dashboardQuery.data;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Пользователи" value={String(overview.users)} description="Все аккаунты в контуре обучения" />
        <MetricCard label="Курсы" value={String(overview.courses)} description="LMS и программы корпоративного университета" />
        <MetricCard label="Внешние заявки" value={String(overview.externalRequests)} description="Заявки на внешнее обучение" />
        <MetricCard label="Финальные решения" value={String(approvals.length)} description="Заявки, дошедшие до этапа кадровой службы" />
      </section>

      <RoleRecommendationCard role="hr" />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Очередь финального согласования"
          description="Финальные решения кадровой службы по внешнему обучению сотрудников."
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
                    <StatusBadge tone="warning">Кадры</StatusBadge>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Очередь пуста"
                description="Когда руководитель согласует заявку сотрудника, она появится здесь для финального решения."
              />
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Контур данных"
          description="Кто уже работает в системе и какие программы доступны сотрудникам."
        >
          <div className="space-y-3">
            <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
              <p className="text-sm font-semibold text-foreground">Пользователи</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {users.slice(0, 3).map((user) => user.email).join(', ') || 'Пока нет пользователей'}
              </p>
            </div>
            <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
              <p className="text-sm font-semibold text-foreground">Курсы</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {courses.slice(0, 3).map((course) => course.title).join(', ') || 'Пока нет курсов'}
              </p>
            </div>
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
