'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/components/providers/auth-provider';
import { buttonVariants } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';
import { resolvePageMeta } from '@/lib/navigation';
import { getUserDisplayName, getUserMetaLine } from '@/lib/user-display';

export function Header() {
  const pathname = usePathname();
  const meta = resolvePageMeta(pathname);
  const { user } = useAuth();
  const displayName = getUserDisplayName(user);
  const metaLine = getUserMetaLine(user);

  return (
    <header className="border-b border-border bg-canvas/90 px-4 py-5 backdrop-blur-sm sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="alrosa-rule shrink-0" />
            <StatusBadge tone="info">Единый контур обучения ALROSA IT</StatusBadge>
          </div>
          <p className="text-sm font-medium text-foreground">Здравствуйте, {displayName}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
            {meta.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{meta.description}</p>
          <p className="mt-3 text-sm leading-6 text-muted">{metaLine}</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:items-center">
          <SearchInput
            className="min-w-0 sm:min-w-80 xl:min-w-[23rem]"
            placeholder="Поиск по курсам, заявкам и сертификатам"
          />
          {user ? (
            <div className="rounded-[22px] border border-border bg-panel px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{displayName}</p>
              <p className="mt-1 text-xs text-muted">{user.email}</p>
            </div>
          ) : null}
          {meta.actionHref && meta.actionLabel ? (
            <Link
              href={meta.actionHref}
              className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
            >
              {meta.actionLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
