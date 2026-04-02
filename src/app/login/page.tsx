import Link from 'next/link';
import { ArrowRight, LogIn, Shield } from 'lucide-react';
import { ReactNode } from 'react';

import { LoginForm } from '@/features/auth/login-form';
import { buttonVariants } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto grid min-h-screen max-w-[1320px] gap-8 px-4 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-[32px] border border-border bg-panel px-6 py-8 lg:px-8">
          <div>
            <div className="alrosa-rule mb-4" />
            <StatusBadge tone="info">Доступ в АЛРОСА ИТ</StatusBadge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground">
              Вход в «Контур развития»
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
              Единая точка доступа к корпоративному обучению, внешним заявкам, календарю,
              сертификатам и аналитике.
            </p>

            <div className="mt-8 space-y-4">
              <FeatureCard
                icon={<LogIn className="h-4 w-4" strokeWidth={1.8} />}
                title="Рабочее пространство"
                description="В одном интерфейсе собраны обучение, внешние заявки, календарь и сертификаты."
              />
              <FeatureCard
                icon={<Shield className="h-4 w-4" strokeWidth={1.8} />}
                title="Ежедневный инструмент"
                description="Интерфейс подходит для сотрудников, руководителей и специалистов кадровой службы в повседневной работе."
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className={cn(buttonVariants({ variant: 'secondary' }), 'w-full sm:w-auto')}>
              На главную
            </Link>
            <Link href="/register" className={cn(buttonVariants({ variant: 'ghost' }), 'w-full sm:w-auto')}>
              Регистрация <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </section>

        <section className="flex items-center">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
      <div className="mb-4 flex size-10 items-center justify-center rounded-full border border-border bg-panel text-brand-red">
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
