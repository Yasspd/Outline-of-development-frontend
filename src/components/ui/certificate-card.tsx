import { formatFullDate } from '@/lib/format';
import { CertificateItem } from '@/lib/mock-data';

import { StatusBadge } from './status-badge';

export function CertificateCard({ item }: { item: CertificateItem }) {
  return (
    <article className="rounded-2xl border border-border bg-panel-muted p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
          <p className="mt-1 text-sm text-muted">{item.provider}</p>
        </div>
        <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
      </div>
      <p className="mt-4 text-sm text-muted">Загружен: {formatFullDate(item.uploadedAt)}</p>
    </article>
  );
}

