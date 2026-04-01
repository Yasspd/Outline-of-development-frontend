'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  getCourseParticipants,
  getMyCourses,
  updateCourseEnrollment,
  type EnrollmentStatus,
} from '@/lib/api';
import { getEnrollmentStatusMeta } from '@/lib/presentation';

export default function TrainerParticipantsPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [draftState, setDraftState] = useState<Record<string, { status: EnrollmentStatus; progressPercent: number }>>({});

  const coursesQuery = useQuery({
    queryKey: ['trainer-participant-courses', accessToken],
    enabled: Boolean(accessToken),
    queryFn: () =>
      getMyCourses(accessToken as string, {
        scope: 'trainer',
        type: 'CORPORATE_UNIVERSITY',
      }),
  });

  useEffect(() => {
    if (!selectedCourseId && coursesQuery.data?.[0]?.id) {
      setSelectedCourseId(coursesQuery.data[0].id);
    }
  }, [coursesQuery.data, selectedCourseId]);

  const participantsQuery = useQuery({
    queryKey: ['trainer-participants', accessToken, selectedCourseId],
    enabled: Boolean(accessToken && selectedCourseId),
    queryFn: () => getCourseParticipants(accessToken as string, selectedCourseId),
  });

  const updateParticipantMutation = useMutation({
    mutationFn: async (enrollmentId: string) => {
      if (!accessToken) {
        throw new Error('Session is not ready');
      }

      const payload = draftState[enrollmentId];

      if (!payload) {
        throw new Error('Нет изменений для сохранения');
      }

      return updateCourseEnrollment(accessToken, enrollmentId, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trainer-participants'] });
      await queryClient.invalidateQueries({ queryKey: ['trainer-dashboard'] });
    },
  });

  if (coursesQuery.isPending || !coursesQuery.data) {
    return (
      <EmptyState
        title="Загружаем программы"
        description="Поднимаем список программ, которыми управляет внутренний тренер."
      />
    );
  }

  const courses = coursesQuery.data;
  const participants = participantsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <SectionCard
        title="Выбор программы"
        description="Выберите программу и обновляйте прогресс каждого обучающегося в рабочем контуре."
      >
        {courses.length ? (
          <select
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
            className="flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        ) : (
          <EmptyState
            title="Нет программ для мониторинга"
            description="Создайте или опубликуйте программу, чтобы здесь появились участники."
          />
        )}
      </SectionCard>

      <SectionCard
        title="Участники"
        description="Здесь видны участники выбранной программы, их статус обучения и текущий прогресс."
      >
        <div className="space-y-3">
          {participants.length ? (
            participants.map((participant) => {
              const localState = draftState[participant.id] ?? {
                status: participant.status,
                progressPercent: participant.progressPercent,
              };
              const meta = getEnrollmentStatusMeta(localState.status);

              return (
                <div
                  key={participant.id}
                  className="rounded-[24px] border border-border bg-panel-subtle p-5"
                >
                  <div className="grid gap-4 xl:grid-cols-[1fr_220px_180px_150px] xl:items-end">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-base font-semibold text-foreground">
                          {participant.user?.firstName} {participant.user?.lastName}
                        </p>
                        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                      </div>
                      <p className="mt-1 text-sm text-muted">{participant.user?.email}</p>
                      <p className="mt-1 text-sm text-muted">
                        {participant.user?.position ?? 'Должность не указана'} · {participant.user?.department ?? 'Подразделение не указано'}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                        Статус
                      </label>
                      <select
                        value={localState.status}
                        onChange={(event) =>
                          setDraftState((current) => ({
                            ...current,
                            [participant.id]: {
                              status: event.target.value as EnrollmentStatus,
                              progressPercent: localState.progressPercent,
                            },
                          }))
                        }
                        className="flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                      >
                        <option value="ENROLLED">Записан</option>
                        <option value="IN_PROGRESS">В процессе</option>
                        <option value="COMPLETED">Завершён</option>
                        <option value="CANCELLED">Отменён</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                        Прогресс, %
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={localState.progressPercent}
                        onChange={(event) =>
                          setDraftState((current) => ({
                            ...current,
                            [participant.id]: {
                              status: localState.status,
                              progressPercent: Number(event.target.value),
                            },
                          }))
                        }
                      />
                    </div>

                    <button
                      type="button"
                      disabled={updateParticipantMutation.isPending}
                      onClick={() => updateParticipantMutation.mutate(participant.id)}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-accent bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-[#111111] disabled:opacity-50"
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="Участников пока нет"
              description="После записи сотрудника на программу он появится в списке и станет доступен для мониторинга."
            />
          )}
        </div>
      </SectionCard>

      {updateParticipantMutation.error ? (
        <div className="rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
          {updateParticipantMutation.error.message}
        </div>
      ) : null}
    </div>
  );
}
