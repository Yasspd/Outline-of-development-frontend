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
  enrollCourse,
  getMyCourses,
  getUsers,
  publishCourse,
} from '@/lib/api';
import {
  formatCourseFormat,
  formatCourseType,
  formatRoleCode,
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
  const [assigneeByCourse, setAssigneeByCourse] = useState<Record<string, string>>({});

  const coursesQuery = useQuery({
    queryKey: ['hr-courses', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [courses, users] = await Promise.all([
        getMyCourses(accessToken as string, { scope: 'created' }),
        getUsers(accessToken as string),
      ]);

      return { courses, users };
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['hr-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] }),
      ]);
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['hr-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['employee-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['workspace-search'] }),
      ]);
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({
      courseId,
      userId,
    }: {
      courseId: string;
      userId: string;
    }) => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      return enrollCourse(accessToken, courseId, { userId });
    },
    onSuccess: async (_, variables) => {
      setAssigneeByCourse((current) => ({ ...current, [variables.courseId]: '' }));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['hr-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['employee-courses'] }),
        queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] }),
      ]);
    },
  });

  const createError = createCourseMutation.error?.message;
  const assignError = assignMutation.error?.message;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createCourseMutation.mutate();
  }

  if (coursesQuery.isPending || !coursesQuery.data) {
    return (
      <EmptyState
        title="Собираем каталог обучения"
        description="Подгружаем курсы, тренеров и сотрудников для назначения обучения."
      />
    );
  }

  const { courses, users } = coursesQuery.data;
  const trainers = users.filter((user) => user.roles.includes('INTERNAL_TRAINER'));
  const employees = users.filter((user) => user.roles.includes('EMPLOYEE'));
  const publishedCourses = courses.filter((course) => course.status === 'PUBLISHED');
  const summary = {
    courses: courses.length,
    published: publishedCourses.length,
    learners: courses.reduce((total, course) => total + (course._count?.enrollments ?? 0), 0),
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Курсы кадровой службы" value={String(summary.courses)} />
        <SummaryCard label="Опубликовано" value={String(summary.published)} />
        <SummaryCard label="Назначений на обучение" value={String(summary.learners)} />
      </section>

      <SectionCard
        title="Создать курс"
        description="Новый курс можно сразу подготовить, назначить тренера и затем открыть сотрудникам после публикации."
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="Название курса">
            <Input
              value={formState.title}
              onChange={(event) =>
                setFormState((current) => ({ ...current, title: event.target.value }))
              }
              required
            />
          </FormField>
          <FormField label="Тип обучения">
            <select
              value={formState.type}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  type: event.target.value as CreateCoursePayload['type'],
                }))
              }
              className="mt-2 flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            >
              <option value="LMS">LMS</option>
              <option value="CORPORATE_UNIVERSITY">Корпоративный университет</option>
            </select>
          </FormField>
          <FormField label="Формат">
            <select
              value={formState.format}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  format: event.target.value as CreateCoursePayload['format'],
                }))
              }
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
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  durationHours: Number(event.target.value),
                }))
              }
            />
          </FormField>
          <FormField label="Внутренний тренер" className="md:col-span-2">
            <select
              value={formState.trainerId ?? ''}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  trainerId: event.target.value || undefined,
                }))
              }
              className="mt-2 flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            >
              <option value="">Пока без назначения</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.firstName} {trainer.lastName}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Описание" className="md:col-span-2">
            <Textarea
              value={formState.description}
              onChange={(event) =>
                setFormState((current) => ({ ...current, description: event.target.value }))
              }
            />
          </FormField>
          <div className="md:col-span-2">
            <PrimaryButton type="submit" disabled={createCourseMutation.isPending}>
              {createCourseMutation.isPending ? 'Сохраняем курс...' : 'Создать курс'}
            </PrimaryButton>
          </div>
        </form>

        {createError ? (
          <div className="mt-5 rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
            {createError}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Каталог кадровой службы"
        description="Здесь видно, какие программы уже опубликованы и кого можно назначить на обучение."
      >
        <div className="space-y-3">
          {courses.length ? (
            courses.map((course) => {
              const statusMeta = getCourseStatusMeta(course.status);
              const trainerLabel = course.trainer
                ? `${course.trainer.firstName} ${course.trainer.lastName}`
                : 'Тренер не назначен';

              return (
                <div
                  key={course.id}
                  className="rounded-[24px] border border-border bg-panel-subtle p-5"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-base font-semibold text-foreground">{course.title}</p>
                          <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                        </div>
                        <p className="mt-2 text-sm text-muted">
                          {formatCourseType(course.type)} · {formatCourseFormat(course.format)} ·{' '}
                          {course._count?.enrollments ?? 0} назначений
                        </p>
                        <p className="mt-2 text-sm text-muted">{trainerLabel}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">
                          {course.description ?? 'Описание курса пока не заполнено.'}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {course.trainer ? (
                          <StatusBadge tone="info">
                            {formatRoleCode('INTERNAL_TRAINER')} · {trainerLabel}
                          </StatusBadge>
                        ) : null}
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

                    {course.status === 'PUBLISHED' ? (
                      <div className="grid gap-4 rounded-[24px] border border-border bg-panel px-4 py-4 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div>
                          <Label>Назначить сотрудника</Label>
                          <select
                            value={assigneeByCourse[course.id] ?? ''}
                            onChange={(event) =>
                              setAssigneeByCourse((current) => ({
                                ...current,
                                [course.id]: event.target.value,
                              }))
                            }
                            className="mt-2 flex h-11 w-full rounded-2xl border border-border bg-panel-subtle px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
                          >
                            <option value="">Выберите сотрудника</option>
                            {employees.map((employee) => (
                              <option key={employee.id} value={employee.id}>
                                {employee.firstName} {employee.lastName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <PrimaryButton
                          type="button"
                          disabled={
                            assignMutation.isPending || !assigneeByCourse[course.id]
                          }
                          onClick={() =>
                            assignMutation.mutate({
                              courseId: course.id,
                              userId: assigneeByCourse[course.id],
                            })
                          }
                        >
                          Назначить обучение
                        </PrimaryButton>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="Каталог пока пуст"
              description="Создайте первый курс, и он сразу появится в рабочем списке кадровой службы."
            />
          )}
        </div>

        {assignError ? (
          <div className="mt-5 rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
            {assignError}
          </div>
        ) : null}
      </SectionCard>
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
