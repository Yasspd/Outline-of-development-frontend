'use client';

import type { ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  exportReport,
  ExportReportPayload,
  getExternalLearningSummaryReport,
  getLearningSummaryReport,
} from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { getExternalStatusMeta } from '@/lib/presentation';

function downloadExport(
  reportType: ExportReportPayload['reportType'],
  format: 'json' | 'csv',
  data: unknown,
) {
  const fileContent =
    format === 'csv' && typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  const blob = new Blob([fileContent], {
    type: format === 'csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${reportType}-${new Date().toISOString().slice(0, 10)}.${format}`;
  link.click();
  URL.revokeObjectURL(url);
}

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

  const exportMutation = useMutation({
    mutationFn: async (payload: ExportReportPayload) => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      return {
        payload,
        response: await exportReport(accessToken, payload),
      };
    },
    onSuccess: ({ payload, response }) => {
      downloadExport(payload.reportType, response.format, response.data);
    },
  });

  if (reportsQuery.isPending || !reportsQuery.data) {
    return (
      <EmptyState
        title="Подготавливаем отчёты"
        description="Собираем управленческий срез по портфелю обучения, бюджету, очередям и результатам."
      />
    );
  }

  const { learningSummary, externalSummary } = reportsQuery.data;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Управленческий срез"
        description="Короткая картина для HR и руководства: люди, портфель программ, бюджет и итоговый результат."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ReportCard label="Сотрудники" value={String(learningSummary.roleCoverage.employees)} />
          <ReportCard
            label="Внутренние программы"
            value={String(learningSummary.courses.totalCourses)}
          />
          <ReportCard
            label="Подтверждённый бюджет"
            value={formatCurrency(externalSummary.approvedBudget)}
          />
          <ReportCard
            label="Подтверждение документов"
            value={`${externalSummary.certificates.acceptanceRate}%`}
          />
        </div>
      </SectionCard>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Отчёт по внутреннему обучению"
          description="Показывает охват, портфель программ, подразделения и активных участников контура."
        >
          <div className="mb-5 flex flex-wrap gap-3">
            <ExportButton
              onClick={() =>
                exportMutation.mutate({ reportType: 'learning-summary', format: 'json' })
              }
              disabled={exportMutation.isPending}
            >
              Выгрузить JSON
            </ExportButton>
            <ExportButton
              onClick={() =>
                exportMutation.mutate({ reportType: 'learning-summary', format: 'csv' })
              }
              disabled={exportMutation.isPending}
            >
              Выгрузить CSV
            </ExportButton>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <MetricRow
              label="Опубликованные программы"
              value={String(learningSummary.courses.publishedCourses)}
            />
            <MetricRow
              label="Черновики портфеля"
              value={String(learningSummary.courses.draftCourses ?? 0)}
            />
            <MetricRow
              label="Активные записи"
              value={String(learningSummary.courses.activeEnrollments ?? 0)}
            />
            <MetricRow
              label="Завершение записей"
              value={`${learningSummary.courses.completionRate ?? 0}%`}
            />
            <MetricRow
              label="Ближайшие сессии"
              value={String(learningSummary.courses.upcomingSessions)}
            />
            <MetricRow
              label="Охват сотрудников"
              value={`${learningSummary.courses.coveragePercent}%`}
            />
          </div>

          <div className="mt-5 space-y-3">
            {learningSummary.departments.slice(0, 4).map((department) => (
              <div
                key={department.department}
                className="rounded-[22px] border border-border bg-panel-subtle px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{department.department}</p>
                  <span className="text-sm font-semibold text-foreground">
                    {department.employees} чел.
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  Внутренние записи: {department.internalEnrollments} · завершено:{' '}
                  {department.completedInternal}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Отчёт по внешнему обучению"
          description="Главный слой для бюджета и маршрутов: статусы, скорость, провайдеры и документы."
        >
          <div className="mb-5 flex flex-wrap gap-3">
            <ExportButton
              onClick={() =>
                exportMutation.mutate({
                  reportType: 'external-learning-summary',
                  format: 'json',
                })
              }
              disabled={exportMutation.isPending}
            >
              Выгрузить JSON
            </ExportButton>
            <ExportButton
              onClick={() =>
                exportMutation.mutate({
                  reportType: 'external-learning-summary',
                  format: 'csv',
                })
              }
              disabled={exportMutation.isPending}
            >
              Выгрузить CSV
            </ExportButton>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <MetricRow
              label="Запрошенный бюджет"
              value={formatCurrency(externalSummary.requestedBudget)}
            />
            <MetricRow
              label="Подтверждённый бюджет"
              value={formatCurrency(externalSummary.approvedBudget)}
            />
            <MetricRow
              label="Бюджет в работе"
              value={formatCurrency(externalSummary.inReviewBudget)}
            />
            <MetricRow
              label="Среднее решение HR"
              value={`${externalSummary.averageHrDecisionHours} ч`}
            />
            <MetricRow
              label="Очередь HR"
              value={String(externalSummary.approvals.pendingCount)}
            />
            <MetricRow
              label="Документы на проверке"
              value={String(externalSummary.certificates.uploaded)}
            />
          </div>

          <div className="mt-5 space-y-3">
            {externalSummary.byStatus.map((item) => (
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
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Что особенно важно руководству"
          description="Точки, на которые HR стоит обращать внимание на совещаниях и в еженедельных отчётах."
        >
          <div className="space-y-3">
            {externalSummary.recommendations.map((recommendation) => (
              <div
                key={recommendation.title}
                className="rounded-[24px] border border-border bg-panel-subtle p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={recommendation.priority === 'high' ? 'danger' : 'warning'}>
                    {recommendation.priority === 'high' ? 'Высокий приоритет' : 'Контроль'}
                  </StatusBadge>
                  <p className="text-base font-semibold text-foreground">{recommendation.title}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{recommendation.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Структура выгрузки"
          description="Теперь CSV и JSON содержат не только общие суммы, но и развёрнутые блоки по подразделениям, провайдерам и трендам."
        >
          <div className="space-y-3">
            <PreviewCard
              title="Внутреннее обучение"
              rows={[
                ['Портфель программ', String(learningSummary.courses.totalCourses)],
                ['Охват сотрудников', `${learningSummary.courses.coveragePercent}%`],
                ['Подразделений в отчёте', String(learningSummary.departments.length)],
                ['Рекомендаций', String(learningSummary.recommendations.length)],
              ]}
            />
            <PreviewCard
              title="Внешнее обучение"
              rows={[
                ['Провайдеров в отчёте', String(externalSummary.providerBreakdown.length)],
                ['Подразделений в отчёте', String(externalSummary.departmentBreakdown.length)],
                ['Периодов в тренде', String(externalSummary.monthlyTrend.length)],
                ['Сертификатов на проверке', String(externalSummary.certificates.uploaded)],
              ]}
            />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Провайдеры и подразделения в отчётах"
          description="Сильнее всего помогает в разборе бюджета и выборе программ на следующую волну обучения."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              {externalSummary.providerBreakdown.slice(0, 4).map((provider) => (
                <div
                  key={provider.providerName}
                  className="rounded-[22px] border border-border bg-panel-subtle px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{provider.providerName}</p>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(provider.approvedBudget)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Маршрутов: {provider.requests} · завершено: {provider.completed}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {externalSummary.departmentBreakdown.slice(0, 4).map((department) => (
                <div
                  key={department.department}
                  className="rounded-[22px] border border-border bg-panel-subtle px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{department.department}</p>
                    <span className="text-sm font-semibold text-foreground">
                      {department.externalRequests} маршрутов
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Бюджет: {formatCurrency(department.approvedBudget)} · документов:{' '}
                    {department.certificates}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Помесячный горизонт"
          description="Удобный блок для обсуждения следующей волны заявок и ожидаемой нагрузки на HR."
        >
          <div className="space-y-3">
            {externalSummary.monthlyTrend.map((point) => (
              <div key={point.month} className="rounded-[22px] border border-border bg-panel-subtle px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{point.month}</p>
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(point.approvedBudget)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">
                  План: {point.planned} · согласовано: {point.approved} · завершено:{' '}
                  {point.completed} · отклонено: {point.rejected}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
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
    <div className="rounded-[28px] border border-border bg-panel p-5">
      <div className="alrosa-rule mb-4" />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ExportButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-blue/30 hover:bg-panel-subtle disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
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

function PreviewCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, string]>;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">{label}</p>
            <p className="text-sm font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
