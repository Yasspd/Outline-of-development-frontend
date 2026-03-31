'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { BadgeCheck, Building2, KeyRound, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';
import { registerUser } from '@/lib/api';
import {
  RegisterFormValues,
  registerFormSchema,
  toRegisterPayload,
} from './register-schema';

const defaultValues: RegisterFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  position: '',
  department: '',
  outlookEmail: '',
};

const accessTokenStorageKey = 'kontur.accessToken';
const refreshTokenStorageKey = 'kontur.refreshToken';

export function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      window.localStorage.setItem(accessTokenStorageKey, response.accessToken);
      window.localStorage.setItem(refreshTokenStorageKey, response.refreshToken);
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    await registerMutation.mutateAsync(toRegisterPayload(values));
  }

  if (registerMutation.isSuccess) {
    return (
      <SectionCard
        title="Регистрация завершена"
        description="Учётная запись создана, токены сохранены локально, пользователю назначена роль Employee."
      >
        <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border border-border bg-panel text-brand-red">
                <BadgeCheck className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {registerMutation.data.user.email}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Роли: {registerMutation.data.user.roles.join(', ')}
                </p>
              </div>
            </div>
            <StatusBadge tone="success">Готово</StatusBadge>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}>
            Перейти в рабочее пространство
          </Link>
          <SecondaryButton
            type="button"
            onClick={() => {
              registerMutation.reset();
              form.reset(defaultValues);
            }}
          >
            Зарегистрировать ещё пользователя
          </SecondaryButton>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Создание учётной записи"
      description="Публичная регистрация создаёт сотрудника с базовой ролью Employee. Менеджера и дополнительные роли потом может назначить HR."
    >
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="firstName">Имя</Label>
            <Input id="firstName" placeholder="Анна" {...form.register('firstName')} />
            <FieldError message={form.formState.errors.firstName?.message} />
          </div>

          <div>
            <Label htmlFor="lastName">Фамилия</Label>
            <Input id="lastName" placeholder="Климова" {...form.register('lastName')} />
            <FieldError message={form.formState.errors.lastName?.message} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="employee@kontur.local"
              {...form.register('email')}
            />
            <FieldError message={form.formState.errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="Минимум 6 символов"
              {...form.register('password')}
            />
            <FieldError message={form.formState.errors.password?.message} />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              {...form.register('confirmPassword')}
            />
            <FieldError message={form.formState.errors.confirmPassword?.message} />
          </div>

          <div>
            <Label htmlFor="position">Должность</Label>
            <Input
              id="position"
              placeholder="Backend Engineer"
              {...form.register('position')}
            />
            <FieldError message={form.formState.errors.position?.message} />
          </div>

          <div>
            <Label htmlFor="department">Подразделение</Label>
            <Input
              id="department"
              placeholder="Platform Engineering"
              {...form.register('department')}
            />
            <FieldError message={form.formState.errors.department?.message} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="outlookEmail">Outlook email</Label>
            <Input
              id="outlookEmail"
              type="email"
              placeholder="anna.klimova@company.ru"
              {...form.register('outlookEmail')}
            />
            <FieldError message={form.formState.errors.outlookEmail?.message} />
          </div>
        </div>

        {registerMutation.error ? (
          <div className="rounded-2xl border border-danger/20 bg-danger-soft/70 px-4 py-3 text-sm text-danger">
            {registerMutation.error.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <PrimaryButton type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => form.reset(defaultValues)}>
            Очистить форму
          </SecondaryButton>
        </div>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <InfoTile
          icon={<UserRoundPlus className="h-4 w-4" strokeWidth={1.8} />}
          title="Роль по умолчанию"
          description="Employee"
        />
        <InfoTile
          icon={<Building2 className="h-4 w-4" strokeWidth={1.8} />}
          title="Менеджер"
          description="Назначается позже через HR"
        />
        <InfoTile
          icon={<KeyRound className="h-4 w-4" strokeWidth={1.8} />}
          title="После регистрации"
          description="JWT токены сохраняются локально"
        />
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
