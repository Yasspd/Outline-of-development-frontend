'use client';

import type { ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge, StatusTone } from '@/components/ui/status-badge';
import {
  enrollCorporateProgram,
  enrollCourse,
  getCorporatePrograms,
  getCourses,
  getMyCourses,
} from '@/lib/api';
import { formatCourseFormat, formatCourseType, getCourseStatusMeta } from '@/lib/presentation';

export default function EmployeeMyCoursesPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const coursesQuery = useQuery({
    queryKey: ['employee-courses', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [enrolled, courses, programs] = await Promise.all([
        getMyCourses(accessToken as string, { scope: 'enrolled' }),
        getCourses(accessToken as string),
        getCorporatePrograms(accessToken as string),
      ]);

      const enrolledIds = new Set(enrolled.map((course) => course.id));

      return {
        enrolled,
        availableCourses: courses.filter(
          (course) => course.type === 'LMS' && course.status === 'PUBLISHED' && !enrolledIds.has(course.id),
        ),
        availablePrograms: programs.filter((program) => !enrolledIds.has(program.id)),
      };
    },
  });

  const enrollMutation = useMutation({
    mutationFn: async ({
      courseId,
      kind,
    }: {
      courseId: string;
      kind: 'course' | 'program';
    }) => {
      if (!accessToken) {
        throw new Error('Session is not ready');
      }

      return kind === 'course'
        ? enrollCourse(accessToken, courseId)
        : enrollCorporateProgram(accessToken, courseId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employee-courses'] });
      await queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
    },
  });

  if (coursesQuery.isPending || !coursesQuery.data) {
    return (
      <EmptyState
        title="Загружаем каталог обучения"
        description="Собираем ваши записи, LMS-курсы и программы корпоративного университета."
      />
    );
  }

  const { enrolled, availableCourses, availablePrograms } = coursesQuery.data;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Мои записи"
        description="Все курсы, на которые вы уже записаны через LMS или корпоративный университет."
      >
        <div className="space-y-3">
          {enrolled.length ? (
            enrolled.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                meta={`${formatCourseType(course.type)} · ${formatCourseFormat(course.format)}`}
                tone="info"
                status="В обучении"
                details={course.description ?? 'Курс уже добавлен в ваш рабочий контур обучения.'}
              />
            ))
          ) : (
            <EmptyState
              title="Записей пока нет"
              description="Выберите первый курс ниже, чтобы в кабинете появились активное обучение и личный прогресс."
            />
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Курсы кадровой службы"
        description="Опубликованные LMS-курсы, доступные для самостоятельной записи сотрудника."
      >
        <div className="space-y-3">
          {availableCourses.length ? (
            availableCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                meta={`${formatCourseType(course.type)} · ${formatCourseFormat(course.format)}`}
                tone={getCourseStatusMeta(course.status).tone}
                status={getCourseStatusMeta(course.status).label}
                details={course.description ?? 'Описание не заполнено'}
                action={
                  <PrimaryButton
                    type="button"
                    disabled={enrollMutation.isPending}
                    onClick={() => enrollMutation.mutate({ courseId: course.id, kind: 'course' })}
                  >
                    Записаться
                  </PrimaryButton>
                }
              />
            ))
          ) : (
            <EmptyState
              title="Нет доступных LMS-курсов"
              description="Когда кадровая служба опубликует новый курс, он появится здесь автоматически."
            />
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Корпоративный университет"
        description="Программы внутреннего обучения, которые доступны сотруднику для самостоятельной записи."
      >
        <div className="space-y-3">
          {availablePrograms.length ? (
            availablePrograms.map((program) => (
              <CourseCard
                key={program.id}
                title={program.title}
                meta={`${formatCourseType(program.type)} · ${formatCourseFormat(program.format)}`}
                tone={getCourseStatusMeta(program.status).tone}
                status={getCourseStatusMeta(program.status).label}
                details={program.description ?? 'Описание не заполнено'}
                action={
                  <PrimaryButton
                    type="button"
                    disabled={enrollMutation.isPending}
                    onClick={() => enrollMutation.mutate({ courseId: program.id, kind: 'program' })}
                  >
                    Записаться
                  </PrimaryButton>
                }
              />
            ))
          ) : (
            <EmptyState
              title="Нет доступных программ"
              description="Программы внутреннего тренера появятся здесь после публикации."
            />
          )}
        </div>
      </SectionCard>

      {enrollMutation.error ? (
        <div className="rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
          {enrollMutation.error.message}
        </div>
      ) : null}
    </div>
  );
}

function CourseCard({
  title,
  meta,
  details,
  status,
  tone,
  action,
}: {
  title: string;
  meta: string;
  details: string;
  status: string;
  tone: StatusTone;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-base font-semibold text-foreground">{title}</p>
            <StatusBadge tone={tone}>{status}</StatusBadge>
          </div>
          <p className="mt-2 text-sm text-muted">{meta}</p>
          <p className="mt-3 text-sm leading-6 text-muted">{details}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
