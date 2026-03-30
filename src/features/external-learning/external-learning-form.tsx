'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Input } from '@/components/ui/input';
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
    // MVP: later this will be connected to the backend mutation
    console.info('external-learning-request', values);
  }

  return (
    <form
      className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <SectionCard
        title="Форма заявки"
        description="Только нужные поля, без перегрузки второстепенными деталями."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="title">Название курса</Label>
            <Input id="title" placeholder="Например, Product Discovery Bootcamp" {...form.register('title')} />
            <FieldError message={form.formState.errors.title?.message} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="link">Ссылка</Label>
            <Input id="link" placeholder="https://provider.com/course" {...form.register('link')} />
            <FieldError message={form.formState.errors.link?.message} />
          </div>

          <div>
            <Label htmlFor="cost">Стоимость</Label>
            <Input id="cost" type="number" {...form.register('cost', { valueAsNumber: true })} />
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
            <Input
              id="attachments"
              type="file"
              onChange={(event) => form.setValue('attachments', event.target.files)}
            />
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
          description="Понимание бюджета должно читаться без открытия дополнительных вкладок."
        >
          <div className="space-y-3 rounded-2xl border border-border bg-panel-muted p-5">
            <StatusBadge tone={budgetTone}>{budgetLabel}</StatusBadge>
            <p className="text-3xl font-semibold text-foreground">{formatCurrency(cost || 0)}</p>
            <p className="text-sm leading-6 text-muted">
              При стоимости выше 50 000 ₽ заявка сразу требует дополнительной проверки со стороны
              HR / L&D.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Проверка календаря"
          description="Система заранее сигнализирует о пересечениях с важными рабочими слотами."
        >
          <div className="space-y-3 rounded-2xl border border-border bg-panel-muted p-5">
            <StatusBadge tone={conflictDetected ? 'danger' : 'success'}>
              {conflictDetected ? 'Есть конфликт' : 'Конфликтов не найдено'}
            </StatusBadge>
            <p className="text-sm leading-6 text-muted">
              {conflictDetected
                ? 'На выбранные даты уже попадает квартальная планёрка команды. Стоит предложить альтернативное время.'
                : 'На выбранные даты пересечений с текущими событиями не обнаружено.'}
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Этапы согласования"
          description="Маршрут заявки прозрачен сразу на этапе заполнения."
        >
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-panel-muted p-4">
              <p className="font-medium text-foreground">1. Manager approval</p>
              <p className="mt-1 text-sm text-muted">
                Руководитель подтверждает необходимость обучения и влияние на загрузку команды.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-panel-muted p-4">
              <p className="font-medium text-foreground">2. HR / L&D approval</p>
              <p className="mt-1 text-sm text-muted">
                HR проверяет бюджет, формат обучения и финальный маршрут сотрудника.
              </p>
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
