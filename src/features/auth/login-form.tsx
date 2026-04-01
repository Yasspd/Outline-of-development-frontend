'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { useAuth } from '@/components/providers/auth-provider';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';
import { loginUser } from '@/lib/api';
import { LoginFormValues, loginFormSchema } from './login-schema';

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
};

export function LoginForm() {
  const router = useRouter();
  const { setSession, hasHydrated } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      setSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      router.push('/workspace');
    },
  });

  async function onSubmit(values: LoginFormValues) {
    await loginMutation.mutateAsync(values);
  }

  return (
    <SectionCard
      title="Вход в аккаунт"
      description="Используйте рабочий email и пароль, чтобы перейти в контур обучения, заявок и календаря."
    >
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5">
          <div>
            <Label htmlFor="email">Эл. почта</Label>
            <Input id="email" type="email" placeholder="anna.klimova@company.ru" {...form.register('email')} />
            <FieldError message={form.formState.errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" placeholder="Введите пароль" {...form.register('password')} />
            <FieldError message={form.formState.errors.password?.message} />
          </div>
        </div>

        {loginMutation.error ? (
          <div className="rounded-2xl border border-danger/20 bg-danger-soft/70 px-4 py-3 text-sm text-danger">
            {loginMutation.error.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton type="submit" disabled={!hasHydrated || loginMutation.isPending}>
            {loginMutation.isPending ? 'Выполняем вход...' : 'Войти'}
          </PrimaryButton>
          <SecondaryButton
            type="button"
            disabled={!hasHydrated || loginMutation.isPending}
            onClick={() => form.reset(defaultValues)}
          >
            Очистить
          </SecondaryButton>
        </div>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <InfoTile
          icon={<ShieldCheck className="h-4 w-4" strokeWidth={1.8} />}
          title="Рабочая сессия"
          description="После успешного входа доступ сохраняется локально, а профиль загружается автоматически."
        />
        <InfoTile
          icon={<KeyRound className="h-4 w-4" strokeWidth={1.8} />}
          title="Нет аккаунта?"
          description="Создайте новую учётную запись и вернитесь во вход без отдельной ручной настройки."
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/register" className={cn(buttonVariants({ variant: 'secondary' }), 'w-full sm:w-auto')}>
          Регистрация
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: 'ghost' }), 'w-full sm:w-auto')}>
          На главную <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.8} />
        </Link>
      </div>
    </SectionCard>
  );
}

function InfoTile({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-border bg-panel-subtle p-4">
      <div className="mb-3 flex size-9 items-center justify-center rounded-full border border-border bg-panel text-brand-red">
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-danger">{message}</p>;
}
