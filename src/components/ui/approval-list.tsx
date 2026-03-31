import { formatCurrency } from '@/lib/format';
import { ApprovalItem } from '@/lib/mock-data';

import { StatusBadge } from './status-badge';

export function ApprovalList({ items }: { items: ApprovalItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="alrosa-v-rule rounded-[24px] border border-border bg-panel-subtle px-5 py-4"
        >
          <div className="flex flex-col gap-4 pl-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted">
                {item.employee} · {item.stage}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-foreground">{formatCurrency(item.cost)}</p>
              <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
