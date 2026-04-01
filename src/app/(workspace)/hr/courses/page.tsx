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
  createCourse,
  CreateCoursePayload,
  getMyCourses,
  getUsers,
  publishCourse,
} from '@/lib/api';
import {
  formatCourseFormat,
  formatCourseType,
  getCourseStatusMeta,
} from '@/lib/presentation';

const initialValues: CreateCoursePayload = {
  title: '',
  description: '',
  type: 'LMS',
  format: 'LIVE',
  durationHours: 8,
  trainerId: undefined,
};

export default function HrCoursesPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [formState, setFormState] = useState<CreateCoursePayload>(initialValues);

  const coursesQuery = useQuery({
    queryKey: ['hr-courses', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [courses, users] = await Promise.all([
        getMyCourses(accessToken as string, { scope: 'created' }),
        getUsers(accessToken as string),
      ]);

      return {
        courses,
        trainers: users.filter((user) => user.roles.includes('INTERNAL_TRAINER')),
      };
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      return createCourse(accessToken, {
        title: formState.title.trim(),
        description: formState.description?.trim() || undefined,
        type: formState.type,
        format: formState.format,
        durationHours: formState.durationHours ? Number(formState.durationHours) : undefined,
        trainerId: formState.trainerId || undefined,
      });
    },
    onSuccess: async () => {
      setFormState(initialValues);
      await queryClient.invalidateQueries({ queryKey: ['hr-courses'] });
      await queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] });
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
      await queryClient.invalidateQueries({ queryKey: ['hr-courses'] });
      await queryClient.invalidateQueries({ queryKey: ['employee-courses'] });
      await queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createCourseMutation.mutate();
  }

  if (coursesQuery.isPending || !coursesQuery.data) {
    return (
      <EmptyState
        title="Загружаем курсы"
        description="Поднимаем курсы кадровой службы и список доступных внутренних тренеров."
      />
    );
  }

  const { courses, trainers } = coursesQuery.data;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Создать курс"
        description="Кадровая служба создаёт курс, после публикации он сразу становится доступен сотрудникам."
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="Название курса">
            <Input value={formState.title} onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))} required />
          </FormField>
          <FormField label="Тип">
            <select
              value={formState.type}
              onChange={(event) => setFormState((current) => ({ ...current, type: event.target.value as CreateCoursePayload['type'] }))}
              className="mt-2 flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            >
              <option value="LMS">LMS</option>
              <option value="CORPORATE_UNIVERSITY">Корпоративный университет</option>
            </select>
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
          <FormField label="Тренер" className="md:col-span-2">
            <select
              value={formState.trainerId ?? ''}
              onChange={(event) => setFormState((current) => ({ ...current, trainerId: event.target.value || undefined }))}
              className="mt-2 flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            >
              <option value="">Не назначать</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.firstName} {trainer.lastName}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Описание" className="md:col-span-2">
            <Textarea value={formState.description} onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))} />
          </FormField>
          <div className="md:col-span-2">
            <PrimaryButton type="submit" disabled={createCourseMutation.isPending}>
              {createCourseMutation.isPending ? 'Создаём...' : 'Создать курс'}
            </PrimaryButton>
          </div>
        </form>

        {createCourseMutation.error ? (
          <div className="mt-5 rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
            {createCourseMutation.error.message}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Мои курсы"
        description="После публикации сотрудники увидят LMS-курс в своём каталоге и смогут записаться."
      >
        <div className="space-y-3">
          {courses.length ? (
            courses.map((course) => {
              const statusMeta = getCourseStatusMeta(course.status);

              return (
                <div key={course.id} className="rounded-[24px] border border-border bg-panel-subtle p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-base font-semibold text-foreground">{course.title}</p>
                        <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        {formatCourseType(course.type)} · {formatCourseFormat(course.format)} · {course._count?.enrollments ?? 0} learners
                      </p>
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
              title="Курсы кадровой службы ещё не созданы"
              description="Создайте первый курс выше, и он сразу появится в каталоге сотрудников."
            />
          )}
        </div>
      </SectionCard>
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
