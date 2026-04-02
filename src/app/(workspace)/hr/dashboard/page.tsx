'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { buttonVariants } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';
import { formatCurrency, formatFullDate } from '@/lib/format';
import { getAnalyticsHrWorkspace } from '@/lib/api';
import { getCertificateStatusMeta, getExternalStatusMeta } from '@/lib/presentation';

export default function HrDashboardPage() {
  const { accessToken } = useAuth();
  const dashboardQuery = useQuery({
    queryKey: ['hr-dashboard', accessToken],
    enabled: Boolean(accessToken),
    queryFn: () => getAnalyticsHrWorkspace(accessToken as string),
  });

  if (dashboardQuery.isPending || !dashboardQuery.data) {
    return (
      <EmptyState
        title="Собираем HR-картину"
        description="Поднимаем бюджет, очередь решений, документы и общую картину обучения по всему контуру."
      />
    );
  }

  const analytics = dashboardQuery.data;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Очередь HR"
          value={String(analytics.approvals.pendingCount)}
          description="Заявки, по которым HR нужно принять решение."
        />
        <MetricCard
          label="Документы на проверке"
          value={String(analytics.certificates.uploaded)}
          description="Сертификаты, ожидающие подтверждения результата."
        />
        <MetricCard
          label="Подтверждённый бюджет"
          value={formatCurrency(Number(analytics.externalLearning.approvedBudget))}
          description="Сумма по уже согласованным маршрутам внешнего обучения."
        />
        <MetricCard
          label="Охват внутренним обучением"
          value={`${analytics.coursePortfolio.coveragePercent}%`}
          description="Доля сотрудников, уже включённых во внутренние программы."
        />
        <MetricCard
          label="Сотрудники в контуре"
          value={String(analytics.roleCoverage.employees)}
          description="Все сотрудники, включённые в рабочий контур обучения."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard
          title="Фокус HR на сегодня"
          description="Приоритеты, которые сильнее всего влияют на бюджет, сроки и закрытие маршрутов."
          action={
            <Link
              href="/hr/approvals"
              className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
            >
              Открыть очередь
            </Link>
          }
        >
          <div className="space-y-3">
            {analytics.recommendations.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone={item.priority === 'high' ? 'danger' : 'warning'}>
                    {item.priority === 'high' ? 'Приоритетно' : 'В работе'}
                  </StatusBadge>
                  <p className="text-base font-semibold text-foreground">{item.title}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Сигналы и напоминания"
          description="Последние рабочие сигналы для кадровой службы без перехода в отдельный журнал."
        >
          <div className="mb-4 flex items-center justify-between rounded-[22px] border border-border bg-panel-subtle px-4 py-4">
            <p className="text-sm text-muted">Непрочитанные сигналы</p>
            <p className="text-2xl font-semibold text-foreground">
              {analytics.notifications.unreadCount}
            </p>
          </div>
          <div className="space-y-3">
            {analytics.notifications.items.length ? (
              analytics.notifications.items.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-[22px] border border-border bg-panel-subtle p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{notification.title}</p>
                    <StatusBadge tone={notification.readAt ? 'neutral' : 'info'}>
                      {notification.readAt ? 'Просмотрено' : 'Новое'}
                    </StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{notification.body}</p>
                </div>
              ))
            ) : (
              <EmptyState
                title="Сигналы появятся позже"
                description="Как только в контуре возникнут новые задачи или события, они будут собраны здесь."
              />
            )}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Очередь решений HR"
          description="Финальные решения по бюджету и запуску маршрутов внешнего обучения."
          action={
            <Link
              href="/hr/approvals"
              className={cn(buttonVariants({ variant: 'secondary' }), 'w-full sm:w-auto')}
            >
              Реестр заявок
            </Link>
          }
        >
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <CompactStat
              label="Всего в очереди"
              value={String(analytics.approvals.pendingCount)}
              tone="warning"
            />
            <CompactStat
              label="Срочно к решению"
              value={String(analytics.approvals.urgentCount)}
              tone={analytics.approvals.urgentCount > 0 ? 'danger' : 'success'}
            />
          </div>
          <div className="space-y-3">
            {analytics.approvals.queue.length ? (
              analytics.approvals.queue.map((approval) => (
                <div key={approval.id} className="rounded-[24px] border border-border bg-panel-subtle p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-base font-semibold text-foreground">{approval.title}</p>
                        <StatusBadge tone="warning">Требует решения</StatusBadge>
                      </div>
                      <p className="text-sm text-muted">
                        {approval.employee.firstName} {approval.employee.lastName}
                        {approval.employee.department ? ` · ${approval.employee.department}` : ''}
                      </p>
                      <p className="text-sm text-muted">
                        {formatCurrency(approval.cost)} · старт {formatFullDate(approval.startAt)}
                      </p>
                    </div>
                    <p className="max-w-xs text-sm leading-6 text-muted">
                      Заявка уже дошла до HR и ждёт финального подтверждения перед запуском обучения.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Очередь свободна"
                description="Когда новые маршруты дойдут до HR-этапа, они появятся в этом блоке."
              />
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Документы и подтверждение"
          description="Контроль сертификатов и подтверждения результатов после прохождения программ."
          action={
            <Link
              href="/hr/certificates"
              className={cn(buttonVariants({ variant: 'secondary' }), 'w-full sm:w-auto')}
            >
              Сертификаты
            </Link>
          }
        >
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <CompactStat
              label="На проверке"
              value={String(analytics.certificates.uploaded)}
              tone="warning"
            />
            <CompactStat
              label="Срочные документы"
              value={String(analytics.certificates.urgentCount)}
              tone={analytics.certificates.urgentCount > 0 ? 'danger' : 'success'}
            />
          </div>
          <div className="space-y-3">
            {analytics.certificates.pending.length ? (
              analytics.certificates.pending.map((certificate) => (
                <div
                  key={certificate.id}
                  className="rounded-[22px] border border-border bg-panel-subtle p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {certificate.owner.firstName} {certificate.owner.lastName}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {certificate.request?.title ?? 'Документ без привязки к маршруту'}
                      </p>
                    </div>
                    <StatusBadge tone={getCertificateStatusMeta('UPLOADED').tone}>
                      {getCertificateStatusMeta('UPLOADED').label}
                    </StatusBadge>
                  </div>
                  <p className="mt-3 text-sm text-muted">
                    Загружен {formatFullDate(certificate.uploadedAt)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                title="Документы разобраны"
                description="Новые сертификаты появятся здесь, как только сотрудники их загрузят."
              />
            )}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Портфель программ"
          description="Портфель HR-программ и текущее состояние внутреннего контура обучения."
          action={
            <Link
              href="/hr/courses"
              className={cn(buttonVariants({ variant: 'secondary' }), 'w-full sm:w-auto')}
            >
              Управлять курсами
            </Link>
          }
        >
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <CompactStat
              label="Опубликовано"
              value={String(analytics.coursePortfolio.publishedCourses)}
              tone="info"
            />
            <CompactStat
              label="Черновики"
              value={String(analytics.coursePortfolio.draftCourses ?? 0)}
              tone={(analytics.coursePortfolio.draftCourses ?? 0) > 0 ? 'warning' : 'success'}
            />
            <CompactStat
              label="Активные записи"
              value={String(analytics.coursePortfolio.activeEnrollments ?? 0)}
              tone="info"
            />
            <CompactStat
              label="Ближайшие сессии"
              value={String(analytics.coursePortfolio.upcomingSessions)}
              tone="neutral"
            />
          </div>
          <div className="space-y-3">
            {analytics.coursePortfolio.recentCourses.map((course) => (
              <div key={course.id} className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-foreground">{course.title}</p>
                      <StatusBadge tone={course.status === 'PUBLISHED' ? 'success' : 'warning'}>
                        {course.status === 'PUBLISHED' ? 'Опубликован' : 'Черновик'}
                      </StatusBadge>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      {course.type === 'CORPORATE_UNIVERSITY'
                        ? 'Корпоративный университет'
                        : 'Каталог LMS'}
                      {' · '}
                      {course.format === 'LIVE'
                        ? 'Живой формат'
                        : course.format === 'HYBRID'
                          ? 'Смешанный формат'
                          : 'Самостоятельное обучение'}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    Участников: {course.enrollments}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Провайдеры и подразделения"
          description="Где концентрируется внешний бюджет и какие команды активнее всего участвуют в обучении."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Провайдеры</p>
              {analytics.externalLearning.providerBreakdown.slice(0, 4).map((provider) => (
                <div
                  key={provider.providerName}
                  className="rounded-[20px] border border-border bg-panel-subtle px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{provider.providerName}</p>
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(provider.approvedBudget)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Маршрутов: {provider.requests} · завершено: {provider.completed}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Подразделения</p>
              {analytics.externalLearning.departmentBreakdown.slice(0, 4).map((department) => (
                <div
                  key={department.department}
                  className="rounded-[20px] border border-border bg-panel-subtle px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{department.department}</p>
                    <span className="text-sm font-semibold text-foreground">
                      {department.employees} чел.
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    Внешних маршрутов: {department.externalRequests} · бюджет:{' '}
                    {formatCurrency(department.approvedBudget)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard
          title="Ключевые сотрудники в контуре"
          description="Кто сильнее всего влияет на объём обучения и виден в HR-картине прямо сейчас."
        >
          <div className="space-y-3">
            {analytics.people.topActiveEmployees.map((employee) => (
              <div key={employee.employeeId} className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{employee.fullName}</p>
                    <p className="mt-1 text-sm text-muted">
                      {employee.department ?? 'Подразделение не указано'}
                    </p>
                  </div>
                  <StatusBadge tone="info">В контуре</StatusBadge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InlineMetric label="Внутренние записи" value={String(employee.internalEnrollments)} />
                  <InlineMetric label="Активные маршруты" value={String(employee.activeRoutes)} />
                  <InlineMetric label="Завершённые маршруты" value={String(employee.completedRoutes)} />
                  <InlineMetric label="Документы" value={String(employee.certificates)} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Последние маршруты внешнего обучения"
          description="Свежие изменения по заявкам, чтобы HR видел картину без перехода в отдельный реестр."
        >
          <div className="space-y-3">
            {analytics.externalLearning.recentRequests.map((request) => (
              <div key={request.id} className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-base font-semibold text-foreground">{request.title}</p>
                      <StatusBadge tone={getExternalStatusMeta(request.status).tone}>
                        {getExternalStatusMeta(request.status).label}
                      </StatusBadge>
                      {request.calendarConflict ? (
                        <StatusBadge tone="danger">Есть пересечение</StatusBadge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted">
                      {request.employee.firstName} {request.employee.lastName}
                      {request.providerName ? ` · ${request.providerName}` : ''}
                    </p>
                    <p className="text-sm text-muted">
                      {formatCurrency(request.cost)} · {formatFullDate(request.startAt)}
                    </p>
                  </div>
                  <p className="max-w-xs text-sm leading-6 text-muted">
                    {request.status === 'IN_REVIEW'
                      ? 'Маршрут ещё движется по согласованию и требует контроля.'
                      : request.status === 'COMPLETED'
                        ? 'Маршрут уже закрыт и учитывается в итоговой истории обучения.'
                        : 'Маршрут находится в рабочем контуре и отражён в аналитике.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
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

function CompactStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}) {
  return (
    <div className="rounded-[22px] border border-border bg-panel-subtle px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        <StatusBadge tone={tone}>{value}</StatusBadge>
      </div>
    </div>
  );
}

function InlineMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-border bg-panel px-4 py-3">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
