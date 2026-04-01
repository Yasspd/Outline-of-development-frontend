'use client';

import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';
import { WorkspaceRole } from '@/lib/roles';

const recommendationByRole: Record<
  WorkspaceRole,
  {
    title: string;
    description: string;
    nextStep: string;
    href: string;
  }
> = {
  employee: {
    title: 'Рекомендации для старта',
    description:
      'Чтобы рабочее пространство сотрудника быстро стало полезным, начните с записи на внутренний курс или отправьте первую заявку на внешнее обучение.',
    nextStep:
      'После первых действий в кабинете появятся прогресс, статусы заявок, сертификаты и история обучения.',
    href: '/employee/my-courses',
  },
  manager: {
    title: 'Рекомендации для руководителя',
    description:
      'Чтобы кабинет показывал актуальную картину по команде, начните с очереди согласований и контроля активных заявок сотрудников.',
    nextStep:
      'После первых решений по заявкам вы увидите нагрузку по обучению, сроки и активность команды в одном контуре.',
    href: '/manager/approvals',
  },
  hr: {
    title: 'Рекомендации для кадровой службы',
    description:
      'Чтобы контур обучения наполнился реальными данными, начните с пользователей и ролей, затем опубликуйте курс или программу.',
    nextStep:
      'После этого в аналитике и отчётах появятся реальные записи, статусы обучения и согласования.',
    href: '/hr/courses',
  },
  trainer: {
    title: 'Рекомендации для внутреннего тренера',
    description:
      'Чтобы кабинет тренера показывал участников и прогресс, создайте программу, опубликуйте её и назначьте сотрудников на обучение.',
    nextStep:
      'После записи участников вы сможете отслеживать статусы, прогресс и завершение программы по каждому обучающемуся.',
    href: '/trainer/courses',
  },
};

export function RoleRecommendationCard({
  role,
  className,
}: {
  role: WorkspaceRole;
  className?: string;
}) {
  const recommendation = recommendationByRole[role];

  return (
    <SectionCard
      title={recommendation.title}
      description={recommendation.description}
      className={className}
      action={<StatusBadge tone="info">Рекомендация</StatusBadge>}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-3xl text-sm leading-6 text-muted">{recommendation.nextStep}</p>
        <Link
          href={recommendation.href}
          className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
        >
          Заполнить аккаунт контентом
        </Link>
      </div>
    </SectionCard>
  );
}
