import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarDays, GraduationCap, ShieldCheck } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';

const featureItems = [
  {
    title: 'Единая среда обучения',
    description:
      'LMS, внешний контур обучения, корпоративный университет и сертификаты в одном рабочем продукте.',
    icon: GraduationCap,
  },
  {
    title: 'Согласование и календарь',
    description:
      'Заявки проходят понятный approval-flow, а календарные конфликты видны до отправки курса.',
    icon: CalendarDays,
  },
  {
    title: 'Рабочий кабинет сотрудника',
    description:
      'После входа открываются профиль, текущие заявки, курсы и статус развития сотрудника.',
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="rounded-[32px] border border-border bg-panel px-6 py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="alrosa-rule shrink-0" />
                <StatusBadge tone="info">ALROSA IT learning platform</StatusBadge>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                Контур развития
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
                Корпоративная платформа обучения, заявок и развития сотрудников
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">
                Платформа объединяет обучение, внешние заявки, корпоративные программы,
                календарные проверки, сертификаты и аналитику в едином корпоративном интерфейсе.
              </p>
            </div>

            <div className="grid gap-3 sm:min-w-[18rem]">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'w-full')}
              >
                Войти в аккаунт
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'w-full')}
              >
                Зарегистрироваться
              </Link>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-between')}
              >
                Открыть рабочее пространство
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          {featureItems.map((item) => {
            const Icon = item.icon;

            return (
              <SectionCard
                key={item.title}
                title={item.title}
                description={item.description}
                className="h-full"
              >
                <div className="flex size-11 items-center justify-center rounded-full border border-border bg-panel-subtle text-brand-red">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
              </SectionCard>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <SectionCard
            title="Основные разделы платформы"
            description="Рабочая структура включает dashboard, обучение, календарь, сертификаты и аналитику."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <p className="text-sm font-semibold text-foreground">Dashboard</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Активные обучения, ближайшие события, заявки на согласовании и календарные конфликты.
                </p>
              </div>
              <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <p className="text-sm font-semibold text-foreground">Внешнее обучение</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Подача заявки, бюджет, manager approval, HR approval и итоговый статус.
                </p>
              </div>
              <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <p className="text-sm font-semibold text-foreground">Корпоративный университет</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Внутренние программы развития, soft skills и назначенные курсы.
                </p>
              </div>
              <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <p className="text-sm font-semibold text-foreground">Сертификаты и аналитика</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Подтверждения обучения, профиль сотрудника и обзор ключевых метрик.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Ключевые сценарии"
            description="Платформа поддерживает повседневные процессы обучения и развития."
          >
            <div className="space-y-3">
              <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full border border-border bg-panel text-brand-red">
                    <BookOpen className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Личный кабинет обучения</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Сотрудник видит свои курсы, прогресс, обучение в работе и подтверждённые результаты.
                </p>
              </div>

              <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <p className="text-sm font-semibold text-foreground">Маршрут согласования</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Заявка на внешний курс проходит этапы manager approval и HR approval в прозрачном процессе.
                </p>
              </div>

              <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
                <p className="text-sm font-semibold text-foreground">Рабочее пространство</p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Авторизованный кабинет доступен на маршруте{' '}
                  <span className="font-medium text-foreground">/dashboard</span>.
                </p>
              </div>
            </div>
          </SectionCard>
        </section>
      </div>
    </main>
  );
}
