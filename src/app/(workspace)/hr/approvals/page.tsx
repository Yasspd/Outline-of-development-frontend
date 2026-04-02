'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  approveApproval,
  ExternalLearningStatus,
  getExternalLearningRequests,
  getPendingApprovals,
  rejectApproval,
} from '@/lib/api';
import { cn } from '@/lib/cn';
import { formatCurrency, formatFullDate } from '@/lib/format';
import { formatApprovalStage, getExternalStatusMeta } from '@/lib/presentation';

const registryFilters: Array<{
  value: 'all' | 'active' | ExternalLearningStatus;
  label: string;
}> = [
  { value: 'all', label: 'Все заявки' },
  { value: 'active', label: 'В работе' },
  { value: 'APPROVED', label: 'Согласованы' },
  { value: 'COMPLETED', label: 'Завершены' },
  { value: 'REJECTED', label: 'Отклонены' },
];

export default function HrApprovalsPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [filter, setFilter] = useState<(typeof registryFilters)[number]['value']>('all');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const approvalsQuery = useQuery({
    queryKey: ['hr-approvals', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [approvals, requests] = await Promise.all([
        getPendingApprovals(accessToken as string),
        getExternalLearningRequests(accessToken as string),
      ]);

      return { approvals, requests };
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({
      approvalId,
      action,
    }: {
      approvalId: string;
      action: 'approve' | 'reject';
    }) => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      return action === 'approve'
        ? approveApproval(accessToken, approvalId)
        : rejectApproval(accessToken, approvalId);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['hr-approvals'] }),
        queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['hr-analytics'] }),
        queryClient.invalidateQueries({ queryKey: ['hr-reports'] }),
        queryClient.invalidateQueries({ queryKey: ['employee-external-learning'] }),
        queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] }),
      ]);
    },
  });

  const filteredRequests = useMemo(() => {
    const requests = approvalsQuery.data?.requests ?? [];

    if (filter === 'all') {
      return requests;
    }

    if (filter === 'active') {
      return requests.filter((request) => request.status === 'IN_REVIEW');
    }

    return requests.filter((request) => request.status === filter);
  }, [approvalsQuery.data?.requests, filter]);

  if (approvalsQuery.isPending || !approvalsQuery.data) {
    return (
      <EmptyState
        title="Собираем реестр заявок"
        description="Подгружаем очередь решений и историю внешнего обучения сотрудников."
      />
    );
  }

  const { approvals, requests } = approvalsQuery.data;
  const inReviewCount = requests.filter((request) => request.status === 'IN_REVIEW').length;
  const approvedCount = requests.filter((request) => request.status === 'APPROVED').length;
  const completedCount = requests.filter((request) => request.status === 'COMPLETED').length;
  const rejectedCount = requests.filter((request) => request.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Очередь финального решения"
        description="Заявки, где уже есть решение руководителя и нужен итоговый ответ кадровой службы."
      >
        <div className="space-y-3">
          {approvals.length ? (
            approvals.map((approval) => (
              <div
                key={approval.id}
                className="rounded-[24px] border border-border bg-panel-subtle p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-foreground">
                        {approval.request.title}
                      </p>
                      <StatusBadge tone="warning">Ждёт решения</StatusBadge>
                      {approval.request.calendarConflict ? (
                        <StatusBadge tone="danger">Есть конфликт в календаре</StatusBadge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted">
                      {approval.request.employee?.firstName} {approval.request.employee?.lastName}
                      {approval.request.providerName ? ` · ${approval.request.providerName}` : ''}
                    </p>
                    <p className="text-sm text-muted">
                      {formatCurrency(Number(approval.request.cost))} ·{' '}
                      {formatFullDate(approval.request.startAt)} -{' '}
                      {formatFullDate(approval.request.endAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      disabled={actionMutation.isPending}
                      onClick={() =>
                        actionMutation.mutate({ approvalId: approval.id, action: 'approve' })
                      }
                      className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
                    >
                      Согласовать
                    </button>
                    <button
                      type="button"
                      disabled={actionMutation.isPending}
                      onClick={() =>
                        actionMutation.mutate({ approvalId: approval.id, action: 'reject' })
                      }
                      className={cn(buttonVariants({ variant: 'secondary' }), 'w-full sm:w-auto')}
                    >
                      Отклонить
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="Очередь свободна"
              description="На текущий момент финальных решений по внешнему обучению не требуется."
            />
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Картина обучения"
        description="Общий маршрут внешнего обучения: что сейчас в работе, что согласовано и что уже завершено."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="В работе"
            value={String(inReviewCount)}
            description="Заявки, которые ещё проходят маршрут решения."
          />
          <SummaryCard
            label="Ждут кадровую службу"
            value={String(approvals.length)}
            description="Очередь финального решения по бюджету и допуску."
          />
          <SummaryCard
            label="Согласованы"
            value={String(approvedCount)}
            description="Заявки, которые уже получили положительное решение."
          />
          <SummaryCard
            label="Завершены"
            value={String(completedCount)}
            description="Обучение, где маршрут уже доведён до результата."
          />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-4">
          <ProgressStripe label="В работе" value={inReviewCount} tone="warning" />
          <ProgressStripe label="Согласованы" value={approvedCount} tone="success" />
          <ProgressStripe label="Завершены" value={completedCount} tone="info" />
          <ProgressStripe label="Отклонены" value={rejectedCount} tone="danger" />
        </div>
      </SectionCard>

      <SectionCard
        title="Реестр внешнего обучения"
        description="Вся история заявок с маршрутами согласования, бюджетом и текущими статусами."
      >
        <div className="mb-5 flex flex-wrap gap-2">
          {registryFilters.map((registryFilter) => (
            <button
              key={registryFilter.value}
              type="button"
              onClick={() => setFilter(registryFilter.value)}
              className={cn(
                buttonVariants({ variant: filter === registryFilter.value ? 'primary' : 'secondary' }),
                'w-full sm:w-auto',
              )}
            >
              {registryFilter.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredRequests.length ? (
            filteredRequests.map((request) => {
              const statusMeta = getExternalStatusMeta(request.status);

              return (
                <div
                  key={request.id}
                  className="rounded-[24px] border border-border bg-panel-subtle p-5"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-base font-semibold text-foreground">{request.title}</p>
                        <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                        <StatusBadge tone="info">
                          {formatApprovalStage(request.currentStage)}
                        </StatusBadge>
                        {request.calendarConflict ? (
                          <StatusBadge tone="danger">Есть пересечение в календаре</StatusBadge>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted">
                        {request.employee?.firstName} {request.employee?.lastName}
                        {request.providerName ? ` · ${request.providerName}` : ''}
                      </p>
                      <p className="text-sm text-muted">
                        {formatCurrency(Number(request.cost))} ·{' '}
                        {formatFullDate(request.startAt)} - {formatFullDate(request.endAt)}
                      </p>
                      {request.description ? (
                        <p className="text-sm leading-6 text-muted">{request.description}</p>
                      ) : null}
                    </div>

                    <div className="flex w-full flex-col gap-2 xl:max-w-[240px]">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedRequestId((current) =>
                            current === request.id ? null : request.id,
                          )
                        }
                        className={cn(
                          buttonVariants({ variant: 'secondary' }),
                          'w-full text-center',
                        )}
                      >
                        {expandedRequestId === request.id ? 'Скрыть описание' : 'Открыть описание'}
                      </button>
                      <div className="rounded-[20px] border border-border bg-panel px-4 py-3 text-sm text-muted">
                        Сертификатов: {request.certificates?.length ?? 0}
                      </div>
                    </div>
                  </div>

                  {expandedRequestId === request.id ? (
                    <div className="mt-4 rounded-[24px] border border-border bg-panel px-5 py-5">
                      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                              Программа
                            </p>
                            <p className="mt-2 text-sm leading-6 text-foreground">
                              {request.program ?? 'Программа не указана'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                              Описание заявки
                            </p>
                            <p className="mt-2 text-sm leading-6 text-foreground">
                              {request.description ?? 'Сотрудник пока не добавил пояснение к заявке.'}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="rounded-[20px] border border-border bg-panel-subtle px-4 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                              Провайдер
                            </p>
                            <p className="mt-2 text-sm text-foreground">
                              {request.providerName ?? 'Не указан'}
                            </p>
                          </div>
                          <div className="rounded-[20px] border border-border bg-panel-subtle px-4 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                              Ссылка на курс
                            </p>
                            {toExternalUrl(request.courseUrl) ? (
                              <a
                                href={toExternalUrl(request.courseUrl) as string}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex text-sm font-medium text-brand-red hover:text-[#b50009]"
                              >
                                Перейти на сайт курса
                              </a>
                            ) : (
                              <p className="mt-2 text-sm text-muted">
                                Ссылка указана в нестандартном формате и требует уточнения.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <EmptyState
              title="По выбранному статусу пока нет заявок"
              description="Попробуйте сменить фильтр или дождитесь новых заявок от сотрудников."
            />
          )}
        </div>
      </SectionCard>

      {actionMutation.error ? (
        <div className="rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
          {actionMutation.error.message}
        </div>
      ) : null}

      {!requests.length ? (
        <EmptyState
          title="История внешнего обучения пока пуста"
          description="Когда сотрудники начнут отправлять заявки, здесь появится весь маршрут решений."
        />
      ) : null}
    </div>
  );
}

function toExternalUrl(value: string | null | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withProtocol).toString();
  } catch {
    return null;
  }
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-panel p-5">
      <div className="alrosa-rule mb-4" />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function ProgressStripe({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'warning' | 'success' | 'info' | 'danger';
}) {
  const toneClassName =
    tone === 'success'
      ? 'bg-emerald-500'
      : tone === 'info'
        ? 'bg-sky-500'
        : tone === 'danger'
          ? 'bg-rose-500'
          : 'bg-amber-500';

  return (
    <div className="rounded-[22px] border border-border bg-panel-subtle px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-border/70">
        <div
          className={cn('h-2 rounded-full', toneClassName)}
          style={{ width: `${Math.min(100, Math.max(12, value * 18))}%` }}
        />
      </div>
    </div>
  );
}
