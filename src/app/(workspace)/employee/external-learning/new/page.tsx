'use client';

import type { ReactNode } from 'react';
import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Textarea } from '@/components/ui/textarea';
import {
  checkExternalLearningRequestCalendar,
  createExternalLearningRequest,
  submitExternalLearningRequest,
} from '@/lib/api';
import { formatFullDate } from '@/lib/format';

const initialValues = {
  title: '',
  courseUrl: '',
  providerName: '',
  cost: '0',
  currency: 'RUB',
  startAt: '',
  endAt: '',
  program: '',
  description: '',
};

export default function EmployeeExternalLearningNewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const [formState, setFormState] = useState(initialValues);
  const [draftRequest, setDraftRequest] = useState<{
    id: string;
    conflict: {
      hasConflict: boolean;
      conflicts: Array<{
        id: string;
        title: string;
        startAt: string;
        endAt: string;
      }>;
    };
  } | null>(null);

  const payload = useMemo(
    () => ({
      title: formState.title.trim(),
      courseUrl: formState.courseUrl.trim(),
      providerName: formState.providerName.trim() || undefined,
      cost: Number(formState.cost),
      currency: formState.currency.trim() || 'RUB',
      startAt: new Date(formState.startAt).toISOString(),
      endAt: new Date(formState.endAt).toISOString(),
      program: formState.program.trim() || undefined,
      description: formState.description.trim() || undefined,
    }),
    [formState],
  );

  const draftMutation = useMutation({
    mutationFn: async (shouldSubmit: boolean) => {
      if (!accessToken) {
        throw new Error('Сессия ещё не готова');
      }

      const created = await createExternalLearningRequest(accessToken, payload);

      if (!shouldSubmit) {
        return { mode: 'draft' as const, requestId: created.id };
      }

      const conflict = await checkExternalLearningRequestCalendar(accessToken, created.id);

      if (conflict.hasConflict) {
        return { mode: 'conflict' as const, requestId: created.id, conflict };
      }

      await submitExternalLearningRequest(accessToken, created.id);

      return { mode: 'submitted' as const, requestId: created.id };
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ['employee-external-learning'] });
      await queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });

      if (result.mode === 'conflict') {
        setDraftRequest({ id: result.requestId, conflict: result.conflict });
        return;
      }

      setDraftRequest(null);
      router.push('/employee/external-learning');
    },
  });

  const finalSubmitMutation = useMutation({
    mutationFn: async () => {
      if (!accessToken || !draftRequest) {
        throw new Error('Черновик заявки ещё не готов');
      }

      return submitExternalLearningRequest(accessToken, draftRequest.id, {
        skipCalendarConflictWarning: true,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employee-external-learning'] });
      await queryClient.invalidateQueries({ queryKey: ['employee-dashboard'] });
      router.push('/employee/external-learning');
    },
  });

  function updateField(field: keyof typeof formState, value: string) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDraftRequest(null);
    draftMutation.mutate(true);
  }

  if (!accessToken) {
    return (
      <EmptyState
        title="Сессия ещё не готова"
        description="Загрузите рабочее пространство заново и повторите создание заявки."
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
      <SectionCard
        title="Новая заявка на внешний курс"
        description="Создайте заявку на внешний курс: система проверит календарь и направит её на согласование."
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Название курса">
              <Input
                value={formState.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Product Discovery Bootcamp"
                required
              />
            </Field>

            <Field label="Провайдер">
              <Input
                value={formState.providerName}
                onChange={(event) => updateField('providerName', event.target.value)}
                placeholder="ProductSense"
              />
            </Field>

            <Field label="Ссылка" className="md:col-span-2">
              <Input
                type="url"
                value={formState.courseUrl}
                onChange={(event) => updateField('courseUrl', event.target.value)}
                placeholder="https://provider.example/course"
                required
              />
            </Field>

            <Field label="Стоимость">
              <Input
                type="number"
                min="0"
                value={formState.cost}
                onChange={(event) => updateField('cost', event.target.value)}
                required
              />
            </Field>

            <Field label="Валюта">
              <Input
                value={formState.currency}
                onChange={(event) => updateField('currency', event.target.value.toUpperCase())}
                maxLength={3}
                required
              />
            </Field>

            <Field label="Дата начала">
              <Input
                type="datetime-local"
                value={formState.startAt}
                onChange={(event) => updateField('startAt', event.target.value)}
                required
              />
            </Field>

            <Field label="Дата окончания">
              <Input
                type="datetime-local"
                value={formState.endAt}
                onChange={(event) => updateField('endAt', event.target.value)}
                required
              />
            </Field>

            <Field label="Программа" className="md:col-span-2">
              <Textarea
                value={formState.program}
                onChange={(event) => updateField('program', event.target.value)}
                placeholder="Ключевые модули, темы и план обучения"
              />
            </Field>

            <Field label="Описание / цель" className="md:col-span-2">
              <Textarea
                value={formState.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Почему обучение нужно вам и команде"
              />
            </Field>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton type="submit" disabled={draftMutation.isPending || finalSubmitMutation.isPending}>
              {draftMutation.isPending ? 'Проверяем и отправляем...' : 'Проверить и отправить'}
            </PrimaryButton>
            <SecondaryButton
              type="button"
              disabled={draftMutation.isPending || finalSubmitMutation.isPending}
              onClick={() => {
                setDraftRequest(null);
                draftMutation.mutate(false);
              }}
            >
              Сохранить как черновик
            </SecondaryButton>
          </div>
        </form>
      </SectionCard>

      <div className="space-y-6">
        <SectionCard
          title="Как проходит заявка"
          description="После заполнения формы система проверяет календарь и запускает маршрут согласования."
        >
          <div className="space-y-3">
            <FlowStep
              step="1. Черновик заявки"
              description="Данные курса сохраняются в личном контуре сотрудника и остаются доступны для редактирования."
            />
            <FlowStep
              step="2. Проверка календаря"
              description="Система сверяет выбранные даты с текущими рабочими событиями и предупреждает о пересечениях."
            />
            <FlowStep
              step="3. Согласование"
              description="При наличии руководителя заявка сначала уходит ему, а затем переходит в кадровую службу."
            />
          </div>
        </SectionCard>

        {draftRequest ? (
          <SectionCard
            title="Найдены пересечения в календаре"
            description="Заявка уже сохранена как черновик. Вы можете посмотреть пересечения и всё равно отправить её на согласование."
          >
            <div className="space-y-3">
              {draftRequest.conflict.conflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  className="rounded-[24px] border border-border bg-panel-subtle p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{conflict.title}</p>
                    <StatusBadge tone="warning">Есть пересечение</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {formatFullDate(conflict.startAt)} - {formatFullDate(conflict.endAt)}
                  </p>
                </div>
              ))}
              <PrimaryButton
                type="button"
                disabled={finalSubmitMutation.isPending}
                onClick={() => finalSubmitMutation.mutate()}
              >
                {finalSubmitMutation.isPending ? 'Отправляем...' : 'Отправить несмотря на конфликт'}
              </PrimaryButton>
            </div>
          </SectionCard>
        ) : (
          <SectionCard
            title="Что будет дальше"
            description="После отправки заявки вы увидите её статус, этап согласования и календарные предупреждения в личном кабинете."
          >
            <p className="text-sm leading-6 text-muted">
              Сохранённые данные сразу появятся в списке заявок, где можно отслеживать решения руководителя и кадровой службы.
            </p>
          </SectionCard>
        )}

        {draftMutation.error ? (
          <div className="rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
            {draftMutation.error.message}
          </div>
        ) : null}

        {finalSubmitMutation.error ? (
          <div className="rounded-[24px] border border-danger/20 bg-danger-soft/60 px-5 py-4 text-sm text-danger">
            {finalSubmitMutation.error.message}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function FlowStep({
  step,
  description,
}: {
  step: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-panel-subtle p-4">
      <p className="text-sm font-semibold text-foreground">{step}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
