'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatCurrency } from '@/lib/format';
import { getAnalyticsHrWorkspace } from '@/lib/api';
import { getCertificateStatusMeta, getExternalStatusMeta } from '@/lib/presentation';

export default function HrAnalyticsPage() {
  const { accessToken } = useAuth();
  const analyticsQuery = useQuery({
    queryKey: ['hr-analytics', accessToken],
    enabled: Boolean(accessToken),
    queryFn: () => getAnalyticsHrWorkspace(accessToken as string),
  });

  if (analyticsQuery.isPending || !analyticsQuery.data) {
    return (
      <EmptyState
        title="Подготавливаем расширенную аналитику"
        description="Собираем бюджет, скорость решений, результативность программ и структуру спроса на обучение."
      />
    );
  }

  const analytics = analyticsQuery.data;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <AnalyticsCard
          label="Запросы на бюджет"
          value={formatCurrency(analytics.externalLearning.requestedBudget ?? 0)}
        />
        <AnalyticsCard
          label="Подтверждено"
          value={formatCurrency(analytics.externalLearning.approvedBudget)}
        />
        <AnalyticsCard
          label="В работе"
          value={formatCurrency(analytics.externalLearning.inReviewBudget ?? 0)}
        />
        <AnalyticsCard
          label="Скорость HR"
          value={`${analytics.externalLearning.averageHrDecisionHours} ч`}
        />
        <AnalyticsCard
          label="Завершение маршрутов"
          value={`${analytics.externalLearning.completionRate ?? 0}%`}
        />
        <AnalyticsCard
          label="Подтверждение документов"
          value={`${analytics.certificates.acceptanceRate}%`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard
          title="Экономика внешнего обучения"
          description="Какая часть бюджета уже подтверждена, где идёт основной поток и где остаются риски."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <MetricRow
              label="Подтверждённый бюджет"
              value={formatCurrency(analytics.externalLearning.approvedBudget)}
            />
            <MetricRow
              label="Бюджет в работе"
              value={formatCurrency(analytics.externalLearning.inReviewBudget ?? 0)}
            />
            <MetricRow
              label="Отклонённый бюджет"
              value={formatCurrency(analytics.externalLearning.rejectedBudget ?? 0)}
            />
            <MetricRow
              label="Календарные пересечения"
              value={String(analytics.externalLearning.calendarConflicts ?? 0)}
            />
            <MetricRow
              label="Ожидают руководителя"
              value={String(analytics.externalLearning.pendingManager)}
            />
            <MetricRow label="Ожидают HR" value={String(analytics.externalLearning.pendingHr)} />
          </div>
        </SectionCard>

        <SectionCard
          title="Скорость принятия решений"
          description="Помогает понять, где маршрут тормозится и как быстро двигается заявка от этапа к этапу."
        >
          <div className="space-y-3">
            <MetricRow
              label="Среднее решение руководителя"
              value={`${analytics.externalLearning.averageManagerDecisionHours} ч`}
            />
            <MetricRow
              label="Среднее финальное решение HR"
              value={`${analytics.externalLearning.averageHrDecisionHours} ч`}
            />
            <MetricRow
              label="Срочные решения в очереди"
              value={String(analytics.approvals.urgentCount)}
            />
            <MetricRow
              label="Сертификаты, требующие ускорения"
              value={String(analytics.certificates.urgentCount)}
            />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Провайдеры внешнего обучения"
          description="Где концентрируется запрос на внешнее обучение и какие поставщики сильнее всего влияют на бюджет."
        >
          <div className="space-y-3">
            {analytics.externalLearning.providerBreakdown.map((provider) => (
              <div key={provider.providerName} className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{provider.providerName}</p>
                    <p className="mt-1 text-sm text-muted">
                      Маршрутов: {provider.requests} · активных: {provider.pending}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(provider.approvedBudget)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Подразделения"
          description="Какие команды активнее всего учатся и где HR уже видит результат по завершённым маршрутам."
        >
          <div className="space-y-3">
            {analytics.externalLearning.departmentBreakdown.map((department) => (
              <div
                key={department.department}
                className="rounded-[24px] border border-border bg-panel-subtle p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{department.department}</p>
                    <p className="mt-1 text-sm text-muted">
                      Сотрудников: {department.employees} · маршрутов: {department.externalRequests}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(department.approvedBudget)}
                  </p>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <InlineMetric label="Внутренние записи" value={String(department.internalEnrollments)} />
                  <InlineMetric label="Активные маршруты" value={String(department.activeRoutes)} />
                  <InlineMetric label="Завершено" value={String(department.completedRoutes)} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="План по месяцам"
          description="Горизонт обучения: когда планируются маршруты, где растёт подтверждённый бюджет и где уже есть завершение."
        >
          <div className="space-y-3">
            {analytics.externalLearning.monthlyTrend.map((point) => (
              <div key={point.month} className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{point.month}</p>
                    <p className="mt-1 text-sm text-muted">
                      План: {point.planned} · согласовано: {point.approved} · завершено:{' '}
                      {point.completed}
                    </p>
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(point.approvedBudget)}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      запланировано {formatCurrency(point.plannedBudget)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Документы и статусы"
          description="Финальный слой контроля: сертификаты, подтверждение результата и распределение по статусам."
        >
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {(
                [
                  ['UPLOADED', analytics.certificates.uploaded],
                  ['ACCEPTED', analytics.certificates.accepted],
                  ['REJECTED', analytics.certificates.rejected],
                ] as const
              ).map(([status, count]) => (
                <div key={status} className="rounded-[22px] border border-border bg-panel-subtle p-4">
                  <StatusBadge tone={getCertificateStatusMeta(status).tone}>
                    {getCertificateStatusMeta(status).label}
                  </StatusBadge>
                  <p className="mt-4 text-3xl font-semibold text-foreground">{count}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {analytics.externalLearning.byStatus.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between rounded-[22px] border border-border bg-panel-subtle px-4 py-4"
                >
                  <StatusBadge tone={getExternalStatusMeta(item.status).tone}>
                    {getExternalStatusMeta(item.status).label}
                  </StatusBadge>
                  <p className="text-sm font-semibold text-foreground">{item._count._all}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </section>

      <SectionCard
        title="Ключевые сотрудники в аналитике"
        description="Сотрудники, вокруг которых сейчас концентрируются маршруты, документы и активность в контуре."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {analytics.people.topActiveEmployees.map((employee) => (
            <div key={employee.employeeId} className="rounded-[24px] border border-border bg-panel-subtle p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{employee.fullName}</p>
                  <p className="mt-1 text-sm text-muted">
                    {employee.department ?? 'Подразделение не указано'}
                  </p>
                </div>
                <StatusBadge tone="info">В аналитике</StatusBadge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InlineMetric label="Внутренние записи" value={String(employee.internalEnrollments)} />
                <InlineMetric label="Активные маршруты" value={String(employee.activeRoutes)} />
                <InlineMetric label="Завершено" value={String(employee.completedRoutes)} />
                <InlineMetric label="Документы" value={String(employee.certificates)} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
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

function InlineMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-border bg-panel px-4 py-3">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
