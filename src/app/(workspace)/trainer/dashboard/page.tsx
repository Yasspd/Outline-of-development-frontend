'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { RoleRecommendationCard } from '@/components/workspace/role-recommendation-card';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { getCourseParticipants, getMyCourses } from '@/lib/api';

export default function TrainerDashboardPage() {
  const { accessToken } = useAuth();
  const dashboardQuery = useQuery({
    queryKey: ['trainer-dashboard', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const courses = await getMyCourses(accessToken as string, {
        scope: 'trainer',
        type: 'CORPORATE_UNIVERSITY',
      });

      const participantsByCourse = await Promise.all(
        courses.map(async (course) => ({
          course,
          participants: await getCourseParticipants(accessToken as string, course.id),
        })),
      );

      return {
        courses,
        participantsByCourse,
        totalParticipants: participantsByCourse.reduce(
          (total, item) => total + item.participants.length,
          0,
        ),
      };
    },
  });

  if (dashboardQuery.isPending || !dashboardQuery.data) {
    return (
      <EmptyState
        title="Собираем кабинет тренера"
        description="Поднимаем собственные программы и список участников."
      />
    );
  }

  const { courses, participantsByCourse, totalParticipants } = dashboardQuery.data;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Программы" value={String(courses.length)} description="Программы, где вы тренер или владелец" />
        <MetricCard label="Участники" value={String(totalParticipants)} description="Все участники ваших программ" />
        <MetricCard
          label="В процессе"
          value={String(
            participantsByCourse.flatMap((item) => item.participants).filter((participant) => participant.status === 'IN_PROGRESS').length,
          )}
          description="Обучающиеся с активным прогрессом"
        />
      </section>

      <RoleRecommendationCard role="trainer" />

      <SectionCard
        title="Мои программы"
        description="Программы корпоративного университета и текущее наполнение участниками."
      >
        <div className="space-y-3">
          {participantsByCourse.length ? (
            participantsByCourse.map(({ course, participants }) => (
              <div
                key={course.id}
                className="rounded-[24px] border border-border bg-panel-subtle p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-base font-semibold text-foreground">{course.title}</p>
                    <p className="mt-1 text-sm text-muted">{course.description ?? 'Описание не заполнено'}</p>
                  </div>
                  <StatusBadge tone={participants.length ? 'info' : 'neutral'}>
                    {participants.length} участников
                  </StatusBadge>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="Программ пока нет"
              description="Создайте первую программу и откройте запись сотрудников, чтобы начать мониторинг участников."
            />
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-border bg-panel p-5">
      <div className="alrosa-rule mb-4" />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
