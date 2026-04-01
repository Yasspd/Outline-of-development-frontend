'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { buttonVariants } from '@/components/ui/button';
import { RoleRecommendationCard } from '@/components/workspace/role-recommendation-card';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  getCourses,
  getMyCertificates,
  getMyCourses,
  getMyExternalLearningRequests,
} from '@/lib/api';
import { cn } from '@/lib/cn';
import { formatCurrency, formatFullDate } from '@/lib/format';
import {
  formatCourseType,
  getCertificateStatusMeta,
  getExternalStatusMeta,
} from '@/lib/presentation';

export default function EmployeeDashboardPage() {
  const { accessToken } = useAuth();
  const dashboardQuery = useQuery({
    queryKey: ['employee-dashboard', accessToken],
    enabled: Boolean(accessToken),
    queryFn: async () => {
      const [enrolledCourses, requests, certificates, courses] = await Promise.all([
        getMyCourses(accessToken as string, { scope: 'enrolled' }),
        getMyExternalLearningRequests(accessToken as string),
        getMyCertificates(accessToken as string),
        getCourses(accessToken as string),
      ]);

      return {
        enrolledCourses,
        requests,
        certificates,
        availableCourses: courses.filter((course) => course.status === 'PUBLISHED').slice(0, 4),
      };
    },
  });

  if (dashboardQuery.isPending || !dashboardQuery.data) {
    return (
      <EmptyState
        title="Собираем рабочую сводку"
        description="Подтягиваем ваши курсы, заявки, сертификаты и доступное обучение."
      />
    );
  }

  const { enrolledCourses, requests, certificates, availableCourses } = dashboardQuery.data;
  const nextRequest = requests[0];
  const latestCertificate = certificates[0];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Мои курсы" value={String(enrolledCourses.length)} description="Текущие записи на обучение" />
        <StatTile
          label="Внешние заявки"
          value={String(requests.length)}
          description="Черновики, согласование и завершённые курсы"
        />
        <StatTile label="Сертификаты" value={String(certificates.length)} description="Загруженные подтверждения обучения" />
        <StatTile
          label="Доступные курсы"
          value={String(availableCourses.length)}
          description="Опубликованные программы, куда можно записаться"
        />
      </section>

      <RoleRecommendationCard role="employee" />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Что сейчас в обучении"
          description="Актуальные курсы и опубликованные программы, доступные для записи."
          action={
            <Link
              href="/employee/my-courses"
              className={cn(buttonVariants({ variant: 'secondary' }), 'w-full sm:w-auto')}
            >
              Открыть каталог
            </Link>
          }
        >
          <div className="space-y-3">
            {enrolledCourses.length ? (
              enrolledCourses.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  className="rounded-[24px] border border-border bg-panel-subtle p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-foreground">{course.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {formatCourseType(course.type)} · {course.durationHours ?? '—'} ч.
                      </p>
                    </div>
                    <StatusBadge tone="info">В обучении</StatusBadge>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Пока нет записей"
                description="Выберите первый курс из каталога, чтобы в кабинете появились активное обучение и личный прогресс."
                action={
                  <Link
                    href="/employee/my-courses"
                    className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
                  >
                    Выбрать курс
                  </Link>
                }
              />
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Ближайший рабочий контур"
          description="Заявки, сертификаты и ключевые сигналы по вашему развитию."
        >
          <div className="space-y-4">
            <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Последняя заявка</p>
              {nextRequest ? (
                <>
                  <p className="mt-3 text-base font-semibold text-foreground">{nextRequest.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {nextRequest.providerName ?? 'Внешний провайдер'} · {formatCurrency(Number(nextRequest.cost))}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <StatusBadge tone={getExternalStatusMeta(nextRequest.status).tone}>
                      {getExternalStatusMeta(nextRequest.status).label}
                    </StatusBadge>
                    <span className="text-sm text-muted">{formatFullDate(nextRequest.startAt)}</span>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted">
                  Заявок пока нет. Когда вы отправите первую заявку на внешнее обучение, здесь появится её статус и ближайшие даты.
                </p>
              )}
            </div>

            <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Сертификаты</p>
              {latestCertificate ? (
                <>
                  <p className="mt-3 text-base font-semibold text-foreground">{latestCertificate.fileName}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <StatusBadge tone={getCertificateStatusMeta(latestCertificate.status).tone}>
                      {getCertificateStatusMeta(latestCertificate.status).label}
                    </StatusBadge>
                    <span className="text-sm text-muted">
                      {formatFullDate(latestCertificate.uploadedAt)}
                    </span>
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted">
                  Сертификаты появятся после завершения обучения и загрузки подтверждающего файла в раздел сертификатов.
                </p>
              )}
            </div>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

function StatTile({
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
