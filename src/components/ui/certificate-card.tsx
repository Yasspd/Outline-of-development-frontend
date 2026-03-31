import { formatFullDate } from '@/lib/format';
import { CertificateItem } from '@/lib/mock-data';

import { StatusBadge } from './status-badge';

export function CertificateCard({ item }: { item: CertificateItem }) {
  return (
    <article className="rounded-[26px] border border-border bg-panel-subtle p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="alrosa-rule w-12" />
        <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
        <p className="mt-1 text-sm text-muted">{item.provider}</p>
      </div>
      <p className="mt-5 border-t border-border pt-4 text-sm text-muted">
        Загружен: {formatFullDate(item.uploadedAt)}
      </p>
    </article>
  );
}
