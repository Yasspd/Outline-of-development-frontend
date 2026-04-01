'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  getAnalyticsCourses,
  getAnalyticsExternalLearning,
  getAnalyticsOverview,
} from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { getExternalStatusMeta } from '@/lib/presentation';

export default function HrAnalyticsPage() {
  const { accessToken } = useAuth();
  const analyticsQuery = useQuery({
    queryKey: ['hr-analytics', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [overview, courses, externalLearning] = await Promise.all([
        getAnalyticsOverview(accessToken as string),
        getAnalyticsCourses(accessToken as string),
        getAnalyticsExternalLearning(accessToken as string),
      ]);

      return { overview, courses, externalLearning };
    },
  });

  if (analyticsQuery.isPending || !analyticsQuery.data) {
    return (
      <EmptyState
        title="Загружаем аналитику"
        description="Поднимаем общую статистику по курсам, заявкам и бюджету."
      />
    );
  }

  const { overview, courses, externalLearning } = analyticsQuery.data;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard label="Пользователи" value={String(overview.users)} />
        <AnalyticsCard label="Курсы" value={String(courses.totalCourses)} />
        <AnalyticsCard label="Записи" value={String(courses.totalEnrollments)} />
        <AnalyticsCard label="Подтверждённый бюджет" value={formatCurrency(Number(externalLearning.approvedBudget))} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="Показатели по курсам"
          description="Ключевые показатели по внутренним курсам и записям сотрудников."
        >
          <div className="space-y-3">
            <MetricRow label="Всего курсов" value={String(courses.totalCourses)} />
            <MetricRow label="Опубликованных курсов" value={String(courses.publishedCourses)} />
            <MetricRow label="Всего записей" value={String(courses.totalEnrollments)} />
            <MetricRow label="Завершённых записей" value={String(courses.completedEnrollments)} />
          </div>
        </SectionCard>

        <SectionCard
          title="Внешнее обучение"
          description="Статусы заявок и объём подтверждённого бюджета по внешнему обучению."
        >
          <div className="space-y-3">
            {externalLearning.byStatus.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between rounded-[24px] border border-border bg-panel-subtle px-4 py-4"
              >
                <StatusBadge tone={getExternalStatusMeta(item.status).tone}>
                  {getExternalStatusMeta(item.status).label}
                </StatusBadge>
                <p className="text-sm font-semibold text-foreground">{item._count._all}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

function AnalyticsCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[28px] border border-border bg-panel p-5">
      <div className="alrosa-rule mb-4" />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function MetricRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[24px] border border-border bg-panel-subtle px-4 py-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
