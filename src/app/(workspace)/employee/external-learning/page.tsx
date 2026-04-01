'use client';

import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { getMyExternalLearningRequests, submitExternalLearningRequest } from '@/lib/api';
import { cn } from '@/lib/cn';
import { formatCurrency, formatFullDate } from '@/lib/format';
import { formatApprovalStage, getExternalStatusMeta } from '@/lib/presentation';

export default function EmployeeExternalLearningPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const requestsQuery = useQuery({
    queryKey: ['employee-external-learning', accessToken],
    enabled: Boolean(accessToken),
    queryFn: () => getMyExternalLearningRequests(accessToken as string),
  });

  const submitMutation = useMutation({
    mutationFn: async ({
      requestId,
      skipCalendarConflictWarning,
    }: {
      requestId: string;
      skipCalendarConflictWarning?: boolean;
    }) => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      return submitExternalLearningRequest(accessToken, requestId, {
        skipCalendarConflictWarning,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employee-external-learning'] });
      await queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
    },
  });

  if (requestsQuery.isPending || !requestsQuery.data) {
    return (
      <EmptyState
        title="Загружаем заявки"
        description="Поднимаем ваши внешние курсы, статусы согласования и календарные предупреждения."
      />
    );
  }

  const requests = requestsQuery.data;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Мои заявки"
        description="Черновики, заявки на согласовании и завершённые записи по внешнему обучению."
        action={
          <Link
            href="/employee/external-learning/new"
            className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
          >
            Новая заявка
          </Link>
        }
      >
        <div className="space-y-3">
          {requests.length ? (
            requests.map((request) => {
              const statusMeta = getExternalStatusMeta(request.status);
              const canSubmit = request.status === 'DRAFT' || request.status === 'REJECTED';

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
                        {request.calendarConflict ? (
                          <StatusBadge tone="warning">Есть пересечение</StatusBadge>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted">
                        {request.providerName ?? 'Внешний провайдер'} · {formatCurrency(Number(request.cost))}
                      </p>
                      <p className="text-sm text-muted">
                        {formatFullDate(request.startAt)} - {formatFullDate(request.endAt)}
                      </p>
                      <p className="text-sm leading-6 text-muted">
                        Этап: {formatApprovalStage(request.currentStage)}
                      </p>
                    </div>

                    {canSubmit ? (
                      <button
                        type="button"
                        disabled={submitMutation.isPending}
                        onClick={() =>
                          submitMutation.mutate({
                            requestId: request.id,
                            skipCalendarConflictWarning: request.calendarConflict,
                          })
                        }
                        className={cn(buttonVariants({ variant: 'secondary' }), 'w-full sm:w-auto')}
                      >
                        {request.calendarConflict ? 'Отправить с предупреждением' : 'Отправить'}
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="Заявок пока нет"
              description="Создайте первую заявку на внешний курс, и дальше она пройдёт путь согласования руководителя и кадровой службы."
              action={
                <Link
                  href="/employee/external-learning/new"
                  className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
                >
                  Создать заявку
                </Link>
              }
            />
          )}
        </div>
      </SectionCard>

      {submitMutation.error ? (
        <div className="rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
          {submitMutation.error.message}
        </div>
      ) : null}
    </div>
  );
}
