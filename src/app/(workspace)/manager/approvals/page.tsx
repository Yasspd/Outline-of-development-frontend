'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { approveApproval, getPendingApprovals, rejectApproval } from '@/lib/api';
import { cn } from '@/lib/cn';
import { formatCurrency, formatFullDate } from '@/lib/format';
import { formatApprovalStage } from '@/lib/presentation';

export default function ManagerApprovalsPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const approvalsQuery = useQuery({
    queryKey: ['manager-approvals', accessToken],
    enabled: Boolean(accessToken),
    queryFn: () => getPendingApprovals(accessToken as string),
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
      await queryClient.invalidateQueries({ queryKey: ['manager-approvals'] });
      await queryClient.invalidateQueries({ queryKey: ['manager-dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['hr-approvals'] });
      await queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] });
    },
  });

  if (approvalsQuery.isPending || !approvalsQuery.data) {
    return (
      <EmptyState
        title="Загружаем очередь согласований"
        description="Поднимаем заявки команды, которые ждут решения руководителя."
      />
    );
  }

  const approvals = approvalsQuery.data;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Согласования руководителя"
        description="Здесь проходит первый этап согласования заявок сотрудников на внешнее обучение."
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
                      <p className="text-base font-semibold text-foreground">{approval.request.title}</p>
                      <StatusBadge tone="warning">{formatApprovalStage(approval.stage)}</StatusBadge>
                    </div>
                    <p className="text-sm text-muted">
                      {approval.request.employee?.firstName} {approval.request.employee?.lastName}
                    </p>
                    <p className="text-sm text-muted">{formatCurrency(Number(approval.request.cost))}</p>
                    <p className="text-sm text-muted">
                      {formatFullDate(approval.request.startAt)} - {formatFullDate(approval.request.endAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      disabled={actionMutation.isPending}
                      onClick={() => actionMutation.mutate({ approvalId: approval.id, action: 'approve' })}
                      className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
                    >
                      Согласовать
                    </button>
                    <button
                      type="button"
                      disabled={actionMutation.isPending}
                      onClick={() => actionMutation.mutate({ approvalId: approval.id, action: 'reject' })}
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
              title="Нет ожидающих согласований"
              description="Когда сотрудник отправит новую заявку на внешнее обучение, она появится в этой очереди."
            />
          )}
        </div>
      </SectionCard>

      {actionMutation.error ? (
        <div className="rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
          {actionMutation.error.message}
        </div>
      ) : null}
    </div>
  );
}
