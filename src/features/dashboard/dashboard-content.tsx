'use client';

import { useQuery } from '@tanstack/react-query';

import { ApprovalList } from '@/components/ui/approval-list';
import { CalendarConflictCard } from '@/components/ui/calendar-conflict-card';
import { CertificateCard } from '@/components/ui/certificate-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressCard } from '@/components/ui/progress-card';
import { SectionCard } from '@/components/ui/section-card';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  approvalQueue,
  calendarConflict,
  dashboardStats,
  developmentTracks,
  learningProfile,
  upcomingLearning,
} from '@/lib/mock-data';
import { formatFullDate } from '@/lib/format';

async function getDashboardData() {
  return {
    stats: dashboardStats,
    upcomingLearning,
    calendarConflict,
    approvalQueue,
    developmentTracks,
    learningProfile,
  };
}

export function DashboardContent() {
  const { data, isPending } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });

  if (isPending || !data) {
    return (
      <EmptyState
        title="Загружаем рабочий контур"
        description="Собираем статус обучения, согласований и календаря."
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            meta={item.meta}
            accent={item.accent}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-6">
          <SectionCard
            title="Ближайшее обучение"
            description="Всё важное на ближайшие дни без лишнего перегруза."
          >
            <div className="space-y-3">
              {data.upcomingLearning.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-panel-muted p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted">
                      {item.type} · {formatFullDate(item.date)}
                    </p>
                  </div>
                  <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Согласование заявок"
            description="Текущие внешние курсы, которые требуют решения или внимания."
          >
            <ApprovalList items={data.approvalQueue} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Проверка календаря"
            description="Система заранее показывает конфликтные интервалы."
          >
            <CalendarConflictCard
              title={data.calendarConflict.title}
              description={data.calendarConflict.description}
              suggestion={data.calendarConflict.suggestion}
            />
          </SectionCard>

          <SectionCard
            title="Профиль обучения"
            description="Ключевые показатели по подтверждённым обучениям и обязательным курсам."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-panel-muted p-5">
                <p className="text-sm font-medium text-muted">Сертификаты</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">
                  {data.learningProfile.certificatesCount}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-panel-muted p-5">
                <p className="text-sm font-medium text-muted">Обязательные курсы</p>
                <p className="mt-3 text-3xl font-semibold text-foreground">
                  {data.learningProfile.mandatoryCoursesCompleted}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <CertificateCard item={data.learningProfile.latestCertificate} />
            </div>
          </SectionCard>
        </div>
      </section>

      <SectionCard
        title="Треки развития"
        description="Текущие направления развития с понятным прогрессом и ближайшим шагом."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {data.developmentTracks.map((track) => (
            <ProgressCard
              key={track.id}
              title={track.title}
              description={track.description}
              progress={track.progress}
              nextStep={track.nextStep}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

