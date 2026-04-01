'use client';

import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { createUser, getUsers, RoleCode } from '@/lib/api';
import { formatRoleCode } from '@/lib/presentation';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: 'Password123!',
  position: '',
  department: '',
  outlookEmail: '',
  managerId: '',
  roleCode: 'EMPLOYEE' as RoleCode,
};

export default function HrUsersPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [formState, setFormState] = useState(initialValues);

  const usersQuery = useQuery({
    queryKey: ['hr-users', accessToken],
    enabled: Boolean(accessToken),
    queryFn: () => getUsers(accessToken as string),
  });

  const createUserMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      return createUser(accessToken, {
        firstName: formState.firstName.trim(),
        lastName: formState.lastName.trim(),
        email: formState.email.trim(),
        password: formState.password,
        position: formState.position.trim() || undefined,
        department: formState.department.trim() || undefined,
        outlookEmail: formState.outlookEmail.trim() || undefined,
        managerId: formState.managerId || undefined,
        roleCodes: [formState.roleCode],
      });
    },
    onSuccess: async () => {
      setFormState(initialValues);
      await queryClient.invalidateQueries({ queryKey: ['hr-users'] });
      await queryClient.invalidateQueries({ queryKey: ['hr-dashboard'] });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createUserMutation.mutate();
  }

  if (usersQuery.isPending || !usersQuery.data) {
    return (
      <EmptyState
        title="Загружаем пользователей"
        description="Поднимаем список сотрудников, роли и связи внутри контура обучения."
      />
    );
  }

  const users = usersQuery.data;
  const managers = users.filter((user) => user.roles.includes('MANAGER'));

  return (
    <div className="space-y-6">
      <SectionCard
        title="Создать пользователя"
        description="Новый аккаунт создаётся без учебной активности и начинает с пустого рабочего пространства."
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="Имя">
            <Input value={formState.firstName} onChange={(event) => setFormState((current) => ({ ...current, firstName: event.target.value }))} required />
          </FormField>
          <FormField label="Фамилия">
            <Input value={formState.lastName} onChange={(event) => setFormState((current) => ({ ...current, lastName: event.target.value }))} required />
          </FormField>
          <FormField label="Эл. почта">
            <Input type="email" value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} required />
          </FormField>
          <FormField label="Пароль">
            <Input type="text" value={formState.password} onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))} required />
          </FormField>
          <FormField label="Должность">
            <Input value={formState.position} onChange={(event) => setFormState((current) => ({ ...current, position: event.target.value }))} />
          </FormField>
          <FormField label="Подразделение">
            <Input value={formState.department} onChange={(event) => setFormState((current) => ({ ...current, department: event.target.value }))} />
          </FormField>
          <FormField label="Почта Outlook">
            <Input type="email" value={formState.outlookEmail} onChange={(event) => setFormState((current) => ({ ...current, outlookEmail: event.target.value }))} />
          </FormField>
          <FormField label="Роль">
            <select
              value={formState.roleCode}
              onChange={(event) => setFormState((current) => ({ ...current, roleCode: event.target.value as RoleCode }))}
              className="mt-2 flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            >
              <option value="EMPLOYEE">Сотрудник</option>
              <option value="MANAGER">Руководитель</option>
              <option value="HR_LD_ADMIN">Кадры и развитие</option>
              <option value="INTERNAL_TRAINER">Внутренний тренер</option>
            </select>
          </FormField>
          <FormField label="Руководитель" className="md:col-span-2">
            <select
              value={formState.managerId}
              onChange={(event) => setFormState((current) => ({ ...current, managerId: event.target.value }))}
              className="mt-2 flex h-11 w-full rounded-2xl border border-border bg-panel px-4 text-sm text-foreground outline-none transition-colors focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15"
            >
              <option value="">Не назначать</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.firstName} {manager.lastName}
                </option>
              ))}
            </select>
          </FormField>
          <div className="md:col-span-2">
            <PrimaryButton type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending ? 'Создаём...' : 'Создать пользователя'}
            </PrimaryButton>
          </div>
        </form>

        {createUserMutation.error ? (
          <div className="mt-5 rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
            {createUserMutation.error.message}
          </div>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Все пользователи"
        description="Список аккаунтов и их роли в корпоративном контуре обучения."
      >
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="rounded-[24px] border border-border bg-panel-subtle p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="mt-1 text-sm text-muted">{user.email}</p>
                  <p className="mt-1 text-sm text-muted">
                    {user.position ?? 'Должность не указана'} · {user.department ?? 'Подразделение не указано'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <StatusBadge key={`${user.id}-${role}`} tone="info">
                      {formatRoleCode(role)}
                    </StatusBadge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function FormField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
