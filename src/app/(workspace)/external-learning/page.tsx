'use client';

import Link from 'next/link';

import { useAuth } from '@/components/providers/auth-provider';
import { ApprovalList } from '@/components/ui/approval-list';
import { buttonVariants } from '@/components/ui/button';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';
import { approvalQueue, externalLearningRequests } from '@/lib/mock-data';
import { getUserDisplayName } from '@/lib/user-display';

export default function ExternalLearningPage() {
  const { user } = useAuth();
  const approvalQueueItems = approvalQueue.map((item, index) =>
    index === 0 ? { ...item, employee: getUserDisplayName(user) } : item,
  );

  return (
    <div className="space-y-6">
      <SectionCard
        title="РњРѕРё Р·Р°СЏРІРєРё"
        description="РўРµРєСѓС‰РёР№ РІРЅРµС€РЅРёР№ РєРѕРЅС‚СѓСЂ РѕР±СѓС‡РµРЅРёСЏ, Р±СЋРґР¶РµС‚ Рё СЌС‚Р°РїС‹ РїСЂРѕС…РѕР¶РґРµРЅРёСЏ."
        action={
          <Link
            href="/external-learning/new"
            className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
          >
            РќРѕРІР°СЏ Р·Р°СЏРІРєР°
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
                  {item.provider} В· {item.period}
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
        title="РЎРѕРіР»Р°СЃРѕРІР°РЅРёРµ Р·Р°СЏРІРѕРє"
        description="Р‘Р»РѕРє РґР»СЏ РјРµРЅРµРґР¶РµСЂРѕРІ Рё HR, РіРґРµ РІРёРґРЅРѕ РѕС‡РµСЂРµРґСЊ СЂРµС€РµРЅРёР№."
      >
        <ApprovalList items={approvalQueueItems} />
      </SectionCard>
    </div>
  );
}
