'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  CertificateStatus,
  getCertificates,
  rejectCertificate,
  verifyCertificate,
} from '@/lib/api';
import { cn } from '@/lib/cn';
import { formatFullDate } from '@/lib/format';
import { getCertificateStatusMeta } from '@/lib/presentation';

const filters: Array<{
  value: 'all' | CertificateStatus;
  label: string;
}> = [
  { value: 'all', label: 'Все документы' },
  { value: 'UPLOADED', label: 'На проверке' },
  { value: 'ACCEPTED', label: 'Подтверждённые' },
  { value: 'REJECTED', label: 'Отклонённые' },
];

export default function HrCertificatesPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('all');

  const certificatesQuery = useQuery({
    queryKey: ['hr-certificates', accessToken],
    enabled: Boolean(accessToken),
    queryFn: () => getCertificates(accessToken as string),
  });

  const certificateMutation = useMutation({
    mutationFn: async ({
      certificateId,
      action,
    }: {
      certificateId: string;
      action: 'verify' | 'reject';
    }) => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      return action === 'verify'
        ? verifyCertificate(accessToken, certificateId)
        : rejectCertificate(accessToken, certificateId);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['hr-certificates'] }),
        queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['hr-analytics'] }),
        queryClient.invalidateQueries({ queryKey: ['hr-reports'] }),
        queryClient.invalidateQueries({ queryKey: ['employee-certificates'] }),
      ]);
    },
  });

  const filteredCertificates = useMemo(() => {
    const certificates = certificatesQuery.data ?? [];

    if (filter === 'all') {
      return certificates;
    }

    return certificates.filter((certificate) => certificate.status === filter);
  }, [certificatesQuery.data, filter]);

  if (certificatesQuery.isPending || !certificatesQuery.data) {
    return (
      <EmptyState
        title="Подгружаем документы"
        description="Собираем сертификаты сотрудников и историю решений по ним."
      />
    );
  }

  const certificates = certificatesQuery.data;
  const counts = certificates.reduce(
    (accumulator, certificate) => {
      accumulator[certificate.status] += 1;
      return accumulator;
    },
    {
      UPLOADED: 0,
      ACCEPTED: 0,
      REJECTED: 0,
    },
  );
  const learningCoverage = certificates.reduce(
    (accumulator, certificate) => {
      if (certificate.externalLearningRequestId) {
        accumulator.add(certificate.externalLearningRequestId);
      }

      return accumulator;
    },
    new Set<string>(),
  );
  const latestResolved = certificates
    .filter((certificate) => certificate.status !== 'UPLOADED')
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="На проверке" value={String(counts.UPLOADED)} />
        <SummaryCard label="Подтверждено" value={String(counts.ACCEPTED)} />
        <SummaryCard label="Отклонено" value={String(counts.REJECTED)} />
      </section>

      <SectionCard
        title="Картина обучения"
        description="Документы показывают, какие маршруты уже подтверждены, а где ещё нужно финальное решение."
      >
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            <MetricRow
              label="Маршрутов с документами"
              value={String(learningCoverage.size)}
            />
            <MetricRow
              label="Документов в очереди"
              value={String(counts.UPLOADED)}
            />
            <MetricRow
              label="Подтверждённых результатов"
              value={String(counts.ACCEPTED)}
            />
            <MetricRow
              label="Требуют доработки"
              value={String(counts.REJECTED)}
            />
          </div>

          <div className="space-y-3">
            {latestResolved.length ? (
              latestResolved.map((certificate) => {
                const statusMeta = getCertificateStatusMeta(certificate.status);

                return (
                  <div
                    key={certificate.id}
                    className="rounded-[24px] border border-border bg-panel-subtle p-5"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-base font-semibold text-foreground">
                            {certificate.externalLearningRequest?.title ?? certificate.fileName}
                          </p>
                          <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                        </div>
                        <p className="mt-2 text-sm text-muted">
                          {certificate.owner?.firstName} {certificate.owner?.lastName}
                        </p>
                      </div>
                      <p className="max-w-xs text-sm leading-6 text-muted">
                        {certificate.status === 'ACCEPTED'
                          ? 'Результат подтверждён и уже учитывается в общей картине обучения.'
                          : 'Документ отклонён и требует обновления со стороны сотрудника.'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="История подтверждений пока не накопилась"
                description="После первых решений по документам здесь появится живая картина завершённого обучения."
              />
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Очередь подтверждения"
        description="Проверяйте документы после завершения обучения и фиксируйте итоговое решение."
      >
        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                buttonVariants({ variant: filter === item.value ? 'primary' : 'secondary' }),
                'w-full sm:w-auto',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredCertificates.length ? (
            filteredCertificates.map((certificate) => {
              const statusMeta = getCertificateStatusMeta(certificate.status);
              const canOpenFile = /^https?:\/\//.test(certificate.fileUrl);

              return (
                <div
                  key={certificate.id}
                  className="rounded-[24px] border border-border bg-panel-subtle p-5"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-base font-semibold text-foreground">
                          {certificate.owner?.firstName} {certificate.owner?.lastName}
                        </p>
                        <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                      </div>
                      <p className="text-sm text-muted">{certificate.fileName}</p>
                      <p className="text-sm text-muted">
                        {certificate.externalLearningRequest?.title ??
                          'Документ загружен без привязки к заявке'}
                      </p>
                      <p className="text-sm text-muted">
                        Загружен: {formatFullDate(certificate.uploadedAt)}
                        {certificate.verifiedAt
                          ? ` · Решение: ${formatFullDate(certificate.verifiedAt)}`
                          : ''}
                      </p>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                      {canOpenFile ? (
                        <a
                          href={certificate.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={cn(buttonVariants({ variant: 'secondary' }), 'w-full sm:w-auto')}
                        >
                          Открыть файл
                        </a>
                      ) : (
                        <div className="rounded-full border border-border bg-panel px-4 py-2 text-sm text-muted">
                          Документ загружен в систему
                        </div>
                      )}
                      {certificate.status === 'UPLOADED' ? (
                        <>
                          <button
                            type="button"
                            disabled={certificateMutation.isPending}
                            onClick={() =>
                              certificateMutation.mutate({
                                certificateId: certificate.id,
                                action: 'verify',
                              })
                            }
                            className={cn(
                              buttonVariants({ variant: 'primary' }),
                              'w-full sm:w-auto',
                            )}
                          >
                            Подтвердить
                          </button>
                          <button
                            type="button"
                            disabled={certificateMutation.isPending}
                            onClick={() =>
                              certificateMutation.mutate({
                                certificateId: certificate.id,
                                action: 'reject',
                              })
                            }
                            className={cn(
                              buttonVariants({ variant: 'secondary' }),
                              'w-full sm:w-auto',
                            )}
                          >
                            Отклонить
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="По выбранному фильтру документов нет"
              description="Как только сотрудники загрузят новые подтверждения, они появятся в этом разделе."
            />
          )}
        </div>
      </SectionCard>

      {certificateMutation.error ? (
        <div className="rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
          {certificateMutation.error.message}
        </div>
      ) : null}
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
    <div className="rounded-[24px] border border-border bg-panel p-5">
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
