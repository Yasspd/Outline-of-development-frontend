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
import { Textarea } from '@/components/ui/textarea';
import {
  createCorporateProgram,
  CreateCoursePayload,
  getMyCourses,
  publishCourse,
} from '@/lib/api';
import { formatCourseFormat, getCourseStatusMeta } from '@/lib/presentation';

const initialValues: CreateCoursePayload = {
  title: '',
  description: '',
  type: 'CORPORATE_UNIVERSITY',
  format: 'LIVE',
  durationHours: 8,
};

export default function TrainerCoursesPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [formState, setFormState] = useState<CreateCoursePayload>(initialValues);

  const coursesQuery = useQuery({
    queryKey: ['trainer-courses', accessToken],
    enabled: Boolean(accessToken),
    queryFn: () =>
      getMyCourses(accessToken as string, {
        scope: 'trainer',
        type: 'CORPORATE_UNIVERSITY',
      }),
  });

  const createProgramMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      return createCorporateProgram(accessToken, {
        title: formState.title.trim(),
        description: formState.description?.trim() || undefined,
        type: 'CORPORATE_UNIVERSITY',
        format: formState.format,
        durationHours: formState.durationHours ? Number(formState.durationHours) : undefined,
      });
    },
    onSuccess: async () => {
      setFormState(initialValues);
      await queryClient.invalidateQueries({ queryKey: ['trainer-courses'] });
      await queryClient.invalidateQueries({ queryKey: ['trainer-dashboard'] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (courseId: string) => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      return publishCourse(accessToken, courseId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['trainer-courses'] });
      await queryClient.invalidateQueries({ queryKey: ['trainer-dashboard'] });
      await queryClient.invalidateQueries({ queryKey: ['employee-courses'] });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createProgramMutation.mutate();
  }

  if (coursesQuery.isPending || !coursesQuery.data) {
    return (
      <EmptyState
        title="Загружаем программы"
        description="Поднимаем ваши программы корпоративного университета и их текущие статусы."
      />
    );
  }

  const courses = coursesQuery.data;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Создать программу"
        description="Внутренний тренер создаёт программу корпоративного университета и открывает её для сотрудников."
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="Название">
            <Input value={formState.title} onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))} required />
          </FormField>
          <FormField label="Формат">
            <select
              value={formState.format}
              onChange={(event) => setFormState((current) => ({ ...current, format: event.target.value as CreateCoursePayload['format'] }))}
              className="mt-2 flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            >
              <option value="LIVE">Очный</option>
              <option value="SELF_PACED">Самостоятельно</option>
              <option value="HYBRID">Гибридный</option>
            </select>
          </FormField>
          <FormField label="Длительность, ч.">
            <Input
              type="number"
              min="1"
              value={formState.durationHours ?? ''}
              onChange={(event) => setFormState((current) => ({ ...current, durationHours: Number(event.target.value) }))}
            />
          </FormField>
          <FormField label="Описание" className="md:col-span-2">
            <Textarea value={formState.description} onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))} />
          </FormField>
          <div className="md:col-span-2">
            <PrimaryButton type="submit" disabled={createProgramMutation.isPending}>
              {createProgramMutation.isPending ? 'Создаём...' : 'Создать программу'}
            </PrimaryButton>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Мои программы"
        description="После публикации программа доступна для записи и мониторинга участников."
      >
        <div className="space-y-3">
          {courses.length ? (
            courses.map((course) => {
              const statusMeta = getCourseStatusMeta(course.status);

              return (
                <div key={course.id} className="rounded-[24px] border border-border bg-panel-subtle p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-base font-semibold text-foreground">{course.title}</p>
                        <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                      </div>
                      <p className="mt-2 text-sm text-muted">{formatCourseFormat(course.format)}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{course.description ?? 'Описание не заполнено'}</p>
                    </div>
                    {course.status === 'DRAFT' ? (
                      <PrimaryButton
                        type="button"
                        disabled={publishMutation.isPending}
                        onClick={() => publishMutation.mutate(course.id)}
                      >
                        Опубликовать
                      </PrimaryButton>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="Программ пока нет"
              description="Создайте первую программу выше, чтобы открыть запись сотрудников и начать мониторинг участников."
            />
          )}
        </div>
      </SectionCard>

      {createProgramMutation.error ? (
        <div className="rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
          {createProgramMutation.error.message}
        </div>
      ) : null}
    </div>
  );
}

function FormField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
