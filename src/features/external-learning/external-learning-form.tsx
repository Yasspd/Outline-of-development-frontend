'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  FileText,
  GitPullRequest,
  Link2,
  Paperclip,
  ShieldCheck,
} from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/format';
import {
  ExternalLearningRequestFormValues,
  externalLearningRequestSchema,
} from './schemas';

const defaultValues: ExternalLearningRequestFormValues = {
  title: '',
  link: '',
  provider: '',
  cost: 48000,
  startDate: '2026-04-08',
  endDate: '2026-04-10',
  description: '',
  attachments: undefined,
};

export function ExternalLearningForm() {
  const form = useForm<ExternalLearningRequestFormValues>({
    resolver: zodResolver(externalLearningRequestSchema),
    defaultValues,
  });

  const cost = form.watch('cost');
  const startDate = form.watch('startDate');

  const budgetTone = cost > 50000 ? 'warning' : 'success';
  const budgetLabel =
    cost > 50000 ? 'Понадобится дополнительное подтверждение' : 'Укладывается в лимит';
  const conflictDetected = startDate.endsWith('-08');

  function onSubmit(values: ExternalLearningRequestFormValues) {
    console.info('external-learning-request', values);
  }

  return (
    <form
      className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <SectionCard
        title="Форма заявки"
        description="Серьёзная и понятная форма без второстепенного шума. Все ключевые проверки видны сразу."
      >
        <div className="mb-6 rounded-[24px] border border-brand-blue/35 bg-panel-subtle p-4">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-blue/35 bg-brand-blue-soft text-info">
              <FileText className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Заявка на внешний курс</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                Укажите только деловые параметры курса: содержание, даты, стоимость и ссылку на
                провайдера. Остальные проверки система покажет в боковой колонке.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="title">Название курса</Label>
            <Input
              id="title"
              placeholder="Например, Product Discovery Bootcamp"
              {...form.register('title')}
            />
            <FieldError message={form.formState.errors.title?.message} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="link">Ссылка</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-red">
                <Link2 className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <Input
                id="link"
                className="pl-11"
                placeholder="https://provider.com/course"
                {...form.register('link')}
              />
            </div>
            <FieldError message={form.formState.errors.link?.message} />
          </div>

          <div>
            <Label htmlFor="cost">Стоимость</Label>
            <Input
              id="cost"
              type="number"
              {...form.register('cost', { valueAsNumber: true })}
            />
            <FieldError message={form.formState.errors.cost?.message} />
          </div>

          <div>
            <Label htmlFor="provider">Провайдер курса</Label>
            <Input id="provider" placeholder="Product Sense" {...form.register('provider')} />
            <FieldError message={form.formState.errors.provider?.message} />
          </div>

          <div>
            <Label htmlFor="startDate">Дата начала</Label>
            <Input id="startDate" type="date" {...form.register('startDate')} />
            <FieldError message={form.formState.errors.startDate?.message} />
          </div>

          <div>
            <Label htmlFor="endDate">Дата окончания</Label>
            <Input id="endDate" type="date" {...form.register('endDate')} />
            <FieldError message={form.formState.errors.endDate?.message} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Описание / программа</Label>
            <Textarea
              id="description"
              placeholder="Ключевые темы, ожидаемый результат, длительность и формат обучения."
              {...form.register('description')}
            />
            <FieldError message={form.formState.errors.description?.message} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="attachments">Вложения / документы</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-red">
                <Paperclip className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <Input
                id="attachments"
                className="pl-11"
                type="file"
                onChange={(event) => form.setValue('attachments', event.target.files)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <PrimaryButton type="submit">Отправить на согласование</PrimaryButton>
          <SecondaryButton type="button">Сохранить как черновик</SecondaryButton>
        </div>
      </SectionCard>

      <div className="space-y-6">
        <SectionCard
          title="Статус бюджета"
          description="Финансовая оценка должна считываться без дополнительных действий."
        >
          <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-panel text-brand-red">
                  <BarChart3 className="h-4 w-4" strokeWidth={1.8} />
                </div>
                <p className="text-sm font-semibold text-foreground">Бюджет заявки</p>
              </div>
              <StatusBadge tone={budgetTone}>{budgetLabel}</StatusBadge>
            </div>
            <p className="mt-4 text-3xl font-semibold text-foreground">{formatCurrency(cost || 0)}</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              При стоимости выше 50 000 ₽ заявка требует дополнительной проверки со стороны
              HR / L&D.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Проверка календаря"
          description="Конфликт должен быть заметен до отправки заявки."
        >
          <div className="rounded-[24px] border border-border bg-panel-subtle p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-panel text-info">
                  <CalendarDays className="h-4 w-4" strokeWidth={1.8} />
                </div>
                <p className="text-sm font-semibold text-foreground">Календарный слот</p>
              </div>
              <StatusBadge tone={conflictDetected ? 'danger' : 'success'}>
                {conflictDetected ? 'Есть конфликт' : 'Конфликтов не найдено'}
              </StatusBadge>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              {conflictDetected
                ? 'На выбранные даты уже попадает квартальная планёрка команды. Стоит предложить альтернативное время.'
                : 'На выбранные даты пересечений с текущими событиями не обнаружено.'}
            </p>
            {conflictDetected ? (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-brand-red/15 bg-danger-soft/55 px-4 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" strokeWidth={1.8} />
                <p className="text-sm leading-6 text-foreground">
                  Рекомендуем согласовать перенос на другую дату до отправки заявки.
                </p>
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard
          title="Этапы согласования"
          description="Маршрут заявки прозрачен ещё до отправки."
        >
          <div className="space-y-3">
            <div className="alrosa-v-rule rounded-[24px] border border-border bg-panel-subtle px-5 py-4">
              <div className="pl-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <GitPullRequest className="h-4 w-4 text-brand-red" strokeWidth={1.8} />
                    <p className="font-medium text-foreground">1. Manager approval</p>
                  </div>
                  <StatusBadge tone="neutral">Первый этап</StatusBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Руководитель подтверждает необходимость обучения и влияние на загрузку команды.
                </p>
              </div>
            </div>

            <div className="alrosa-v-rule rounded-[24px] border border-border bg-panel-subtle px-5 py-4">
              <div className="pl-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-info" strokeWidth={1.8} />
                    <p className="font-medium text-foreground">2. HR / L&D approval</p>
                  </div>
                  <StatusBadge tone="info">Финальное решение</StatusBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  HR проверяет бюджет, формат обучения и итоговый маршрут сотрудника.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-danger">{message}</p>;
}
