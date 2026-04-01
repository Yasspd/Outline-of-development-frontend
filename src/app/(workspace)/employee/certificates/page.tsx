'use client';

import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { getMyCertificates, getMyExternalLearningRequests, uploadCertificate } from '@/lib/api';
import { formatFullDate } from '@/lib/format';
import { getCertificateStatusMeta, getExternalStatusMeta } from '@/lib/presentation';

export default function EmployeeCertificatesPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [externalLearningRequestId, setExternalLearningRequestId] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const certificatesQuery = useQuery({
    queryKey: ['employee-certificates', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [certificates, requests] = await Promise.all([
        getMyCertificates(accessToken as string),
        getMyExternalLearningRequests(accessToken as string),
      ]);

      return {
        certificates,
        requests: requests.filter((request) =>
          ['APPROVED', 'SCHEDULED', 'COMPLETED'].includes(request.status),
        ),
      };
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      if (!file) {
        throw new Error('Выберите файл сертификата');
      }

      return uploadCertificate(accessToken, {
        file,
        externalLearningRequestId: externalLearningRequestId || undefined,
      });
    },
    onSuccess: async () => {
      setFile(null);
      setExternalLearningRequestId('');
      await queryClient.invalidateQueries({ queryKey: ['employee-certificates'] });
      await queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    uploadMutation.mutate();
  }

  if (certificatesQuery.isPending || !certificatesQuery.data) {
    return (
      <EmptyState
        title="Загружаем сертификаты"
        description="Поднимаем ваши подтверждения обучения и доступные заявки для привязки."
      />
    );
  }

  const { certificates, requests } = certificatesQuery.data;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Загрузить сертификат"
        description="После завершения внешнего обучения добавьте сертификат, чтобы кадровая служба смогла его подтвердить."
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="certificate-request">Заявка на внешнее обучение</Label>
            <select
              id="certificate-request"
              value={externalLearningRequestId}
              onChange={(event) => setExternalLearningRequestId(event.target.value)}
              className="mt-2 flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            >
              <option value="">Без привязки</option>
              {requests.map((request) => (
                <option key={request.id} value={request.id}>
                  {request.title} · {getExternalStatusMeta(request.status).label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="certificate-file">Файл сертификата</Label>
            <Input
              id="certificate-file"
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <PrimaryButton type="submit" disabled={uploadMutation.isPending}>
              {uploadMutation.isPending ? 'Загружаем...' : 'Загрузить сертификат'}
            </PrimaryButton>
          </div>
        </form>

        {uploadMutation.error ? (
          <div className="mt-5 rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
            {uploadMutation.error.message}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Мои сертификаты"
        description="История всех загруженных файлов и их статусы проверки."
      >
        <div className="space-y-3">
          {certificates.length ? (
            certificates.map((certificate) => {
              const meta = getCertificateStatusMeta(certificate.status);

              return (
                <div
                  key={certificate.id}
                  className="rounded-[24px] border border-border bg-panel-subtle p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-base font-semibold text-foreground">{certificate.fileName}</p>
                      <p className="mt-2 text-sm text-muted">
                        Загружен: {formatFullDate(certificate.uploadedAt)}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {certificate.externalLearningRequest?.title ?? 'Без привязки к заявке'}
                      </p>
                    </div>
                    <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="Сертификаты ещё не загружены"
              description="После прохождения внешнего обучения добавьте файл сюда, и он появится в общем контуре."
            />
          )}
        </div>
      </SectionCard>
    </div>
  );
}
