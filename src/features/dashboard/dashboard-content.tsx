'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  GitPullRequest,
  Server,
} from 'lucide-react';

import { ApprovalList } from '@/components/ui/approval-list';
import { CalendarConflictCard } from '@/components/ui/calendar-conflict-card';
import { CertificateCard } from '@/components/ui/certificate-card';
import { EmptyState } from '@/components/ui/empty-state';
import { ProgressCard } from '@/components/ui/progress-card';
import { SectionCard } from '@/components/ui/section-card';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { API_BASE_URL, getBackendHealth } from '@/lib/api';
import { formatFullDate } from '@/lib/format';
import {
  approvalQueue,
  calendarConflict,
  dashboardStats,
  developmentTracks,
  learningProfile,
  upcomingLearning,
} from '@/lib/mock-data';

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

const statIcons = [BookOpen, BarChart3, GitPullRequest, CalendarDays];

export function DashboardContent() {
  const { data, isPending } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  });

  const { data: backendHealth } = useQuery({
    queryKey: ['backend-health'],
    queryFn: getBackendHealth,
    retry: false,
    refetchInterval: 1000 * 30,
  });

  if (isPending || !data) {
    return (
      <EmptyState
        title="Загружаем рабочий контур"
        description="Собираем статус обучения, согласований и календаря."
      />
    );
  }

  const backendOnline = backendHealth?.status === 'online';

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-border bg-panel px-6 py-6">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="alrosa-rule mb-4" />
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-brand-blue/35 bg-brand-blue-soft text-info">
                <Activity className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Обзор рабочего контура
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  Обучение, согласование и календарь в одном окне
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                  Главная страница собрана как рабочий инструмент: важные статусы видны сразу,
                  акценты дозированы, а структура остаётся понятной для сотрудника, руководителя
                  и HR.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-panel text-brand-red">
                  <Server className="h-4 w-4" strokeWidth={1.9} />
                </div>
                <StatusBadge tone={backendOnline ? 'success' : 'danger'}>
                  {backendOnline ? 'Backend доступен' : 'Backend недоступен'}
                </StatusBadge>
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">Связь с backend</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Текущий API base URL: <span className="font-medium text-foreground">{API_BASE_URL}</span>
              </p>
            </div>

            <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="alrosa-rule w-12" />
                <StatusBadge tone="info">3080 → 3081</StatusBadge>
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">Локальная связка</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Frontend работает на порте <span className="font-medium text-foreground">3080</span>,
                backend ожидается на <span className="font-medium text-foreground">3081</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((item, index) => {
          const Icon = statIcons[index];

          return (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              meta={item.meta}
              accent={item.accent}
              icon={<Icon className="h-5 w-5 text-brand-red" strokeWidth={1.8} />}
            />
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-6">
          <SectionCard
            title="Ближайшее обучение"
            description="Всё важное на ближайшие дни без перегруженного расписания."
          >
            <div className="space-y-3">
              {data.upcomingLearning.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-[24px] border border-border bg-panel-subtle p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-blue/35 bg-brand-blue-soft text-info">
                      <CalendarDays className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted">
                        {item.type} · {formatFullDate(item.date)}
                      </p>
                    </div>
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
              <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full border border-border bg-panel text-brand-red">
                    <Award className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <StatusBadge tone="success">Сертификаты</StatusBadge>
                </div>
                <p className="mt-4 text-3xl font-semibold text-foreground">
                  {data.learningProfile.certificatesCount}
                </p>
                <p className="mt-1 text-sm text-muted">Подтверждённых результатов обучения</p>
              </div>

              <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full border border-border bg-panel text-info">
                    <BookOpen className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <StatusBadge tone="info">Обязательные курсы</StatusBadge>
                </div>
                <p className="mt-4 text-3xl font-semibold text-foreground">
                  {data.learningProfile.mandatoryCoursesCompleted}
                </p>
                <p className="mt-1 text-sm text-muted">Текущий прогресс по обязательной программе</p>
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
