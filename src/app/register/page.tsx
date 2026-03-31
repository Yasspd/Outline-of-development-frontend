import Link from 'next/link';
import { ArrowRight, BadgeCheck, Shield } from 'lucide-react';
import { ReactNode } from 'react';

import { RegisterForm } from '@/features/auth/register-form';
import { buttonVariants } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto grid min-h-screen max-w-[1320px] gap-8 px-4 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <section className="flex flex-col justify-between rounded-[32px] border border-border bg-panel px-6 py-8 lg:px-8">
          <div>
            <div className="alrosa-rule mb-4" />
            <StatusBadge tone="info">ALROSA IT registration</StatusBadge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground">
              Регистрация в «Контуре развития»
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
              Публичная регистрация создаёт базовую учётную запись сотрудника. После этого HR может
              назначить менеджера, дополнительные роли и рабочие связи.
            </p>

            <div className="mt-8 space-y-4">
              <FeatureCard
                icon={<BadgeCheck className="h-4 w-4" strokeWidth={1.8} />}
                title="Employee по умолчанию"
                description="Новая учётная запись получает базовую роль сотрудника без лишних прав."
              />
              <FeatureCard
                icon={<Shield className="h-4 w-4" strokeWidth={1.8} />}
                title="Чистый MVP-поток"
                description="Регистрация сразу возвращает JWT, поэтому аккаунт можно использовать без отдельного шага логина."
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className={cn(buttonVariants({ variant: 'secondary' }), 'w-full sm:w-auto')}>
              Вернуться в систему
            </Link>
            <Link
              href="http://localhost:3081/docs"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: 'ghost' }), 'w-full sm:w-auto')}
            >
              Swagger <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </section>

        <section className="flex items-center">
          <RegisterForm />
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
