'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SearchInput } from '@/components/ui/search-input';
import { buttonVariants } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/cn';
import { pageMeta } from '@/lib/navigation';

export function Header() {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? pageMeta['/'];

  return (
    <header className="border-b border-border bg-canvas/90 px-4 py-5 backdrop-blur-sm sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="alrosa-rule shrink-0" />
            <StatusBadge tone="info">ALROSA IT learning workspace</StatusBadge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
            {meta.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{meta.description}</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto xl:items-center">
          <SearchInput
            className="min-w-0 sm:min-w-80 xl:min-w-[23rem]"
            placeholder="Поиск по курсам, заявкам и сертификатам"
          />
          <Link
            href="/external-learning/new"
            className={cn(buttonVariants({ variant: 'primary' }), 'w-full sm:w-auto')}
          >
            Подать заявку на внешний курс
          </Link>
        </div>
      </div>
    </header>
  );
}
