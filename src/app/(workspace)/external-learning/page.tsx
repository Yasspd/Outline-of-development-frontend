import Link from 'next/link';

import { ApprovalList } from '@/components/ui/approval-list';
import { buttonVariants } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';
import { approvalQueue, externalLearningRequests } from '@/lib/mock-data';

export default function ExternalLearningPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Мои заявки"
        description="Текущий внешний контур обучения, бюджет и этапы прохождения."
        action={
          <Link
            href="/external-learning/new"
            className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
          >
            Новая заявка
          </Link>
        }
      >
        <div className="space-y-3">
          {externalLearningRequests.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-2xl border border-border bg-panel-muted p-4 lg:grid-cols-[1.4fr_0.8fr_0.7fr_0.8fr]"
            >
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted">
                  {item.provider} · {item.period}
                </p>
              </div>
              <p className="text-sm text-muted">{formatCurrency(item.cost)}</p>
              <p className="text-sm text-muted">{item.stage}</p>
              <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Согласование заявок"
        description="Блок для менеджеров и HR, где видно очередь решений."
      >
        <ApprovalList items={approvalQueue} />
      </SectionCard>
    </div>
  );
}
