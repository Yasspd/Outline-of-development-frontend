'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  getExternalLearningSummaryReport,
  getLearningSummaryReport,
} from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { getExternalStatusMeta } from '@/lib/presentation';

export default function HrReportsPage() {
  const { accessToken } = useAuth();
  const reportsQuery = useQuery({
    queryKey: ['hr-reports', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [learningSummary, externalSummary] = await Promise.all([
        getLearningSummaryReport(accessToken as string),
        getExternalLearningSummaryReport(accessToken as string),
      ]);

      return { learningSummary, externalSummary };
    },
  });

  if (reportsQuery.isPending || !reportsQuery.data) {
    return (
      <EmptyState
        title="Загружаем отчёты"
        description="Собираем сводки по обучению сотрудников и внешним заявкам."
      />
    );
  }

  const { learningSummary, externalSummary } = reportsQuery.data;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Сводка по обучению"
        description="Общая картина по пользователям, курсам и завершённым записям на обучение."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ReportCard label="Пользователи" value={String(learningSummary.overview.users)} />
          <ReportCard label="Курсы" value={String(learningSummary.courses.totalCourses)} />
          <ReportCard label="Записи" value={String(learningSummary.courses.totalEnrollments)} />
          <ReportCard label="Завершено" value={String(learningSummary.courses.completedEnrollments)} />
        </div>
      </SectionCard>

      <SectionCard
        title="Сводка по внешнему обучению"
        description="Статусы заявок и подтверждённый бюджет по внешнему обучению."
      >
        <div className="mb-4 rounded-[24px] border border-border bg-panel-subtle px-4 py-4">
          <p className="text-sm text-muted">Подтверждённый бюджет</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatCurrency(Number(externalSummary.approvedBudget))}
          </p>
        </div>
        <div className="space-y-3">
          {externalSummary.byStatus.map((item) => (
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
    </div>
  );
}

function ReportCard({
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
