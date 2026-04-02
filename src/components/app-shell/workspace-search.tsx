'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { Award, BookOpen, FileText, LoaderCircle, Search } from 'lucide-react';

import { useAuth } from '@/components/providers/auth-provider';
import { SearchInput } from '@/components/ui/search-input';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  getCorporatePrograms,
  getCourses,
  getMyCertificates,
  getMyExternalLearningRequests,
} from '@/lib/api';
import { cn } from '@/lib/cn';
import {
  buildWorkspaceSearchResults,
  filterWorkspaceSearchResults,
  type WorkspaceSearchResult,
} from '@/lib/workspace-search';

const resultMeta = {
  course: {
    label: 'Курс',
    icon: BookOpen,
    tone: 'info' as const,
  },
  request: {
    label: 'Заявка',
    icon: FileText,
    tone: 'warning' as const,
  },
  certificate: {
    label: 'Сертификат',
    icon: Award,
    tone: 'success' as const,
  },
};

export function WorkspaceSearch({
  className,
  placeholder,
}: {
  className?: string;
  placeholder: string;
}) {
  const pathname = usePathname();
  const { accessToken, primaryRole } = useAuth();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const searchDataQuery = useQuery({
    queryKey: ['workspace-search-data', accessToken, primaryRole],
    enabled: Boolean(accessToken && primaryRole),
    staleTime: 60_000,
    queryFn: async () => {
      const [courses, programs, requests, certificates] = await Promise.all([
        getCourses(accessToken as string),
        getCorporatePrograms(accessToken as string),
        getMyExternalLearningRequests(accessToken as string),
        getMyCertificates(accessToken as string),
      ]);

      return buildWorkspaceSearchResults({
        role: primaryRole as NonNullable<typeof primaryRole>,
        courses,
        programs,
        requests,
        certificates,
      });
    },
  });

  const filteredResults = useMemo(
    () => filterWorkspaceSearchResults(searchDataQuery.data ?? [], deferredQuery).slice(0, 10),
    [deferredQuery, searchDataQuery.data],
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <SearchInput
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full"
      />

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.55rem)] z-40 rounded-[28px] border border-border bg-panel p-2 shadow-[0_18px_50px_rgba(16,18,20,0.08)]">
          {searchDataQuery.isPending ? (
            <SearchState
              icon={
                <LoaderCircle
                  className="h-4 w-4 animate-spin text-brand-red"
                  strokeWidth={1.8}
                />
              }
              title="Собираем результаты"
              description="Подгружаем опубликованные курсы, ваши заявки и сертификаты."
            />
          ) : searchDataQuery.isError ? (
            <SearchState
              icon={<Search className="h-4 w-4 text-brand-red" strokeWidth={1.8} />}
              title="Поиск временно недоступен"
              description="Не удалось загрузить данные для поиска. Попробуйте ещё раз через несколько секунд."
            />
          ) : filteredResults.length ? (
            <div className="max-h-[26rem] space-y-1 overflow-y-auto p-1 app-sidebar-scrollbar">
              {filteredResults.map((result) => (
                <SearchResultLink
                  key={result.id}
                  result={result}
                  onSelect={() => {
                    setIsOpen(false);
                    setQuery('');
                  }}
                />
              ))}
            </div>
          ) : (
            <SearchState
              icon={<Search className="h-4 w-4 text-brand-red" strokeWidth={1.8} />}
              title="Ничего не найдено"
              description="Попробуйте ввести часть названия курса, заявки или сертификата."
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

function SearchResultLink({
  result,
  onSelect,
}: {
  result: WorkspaceSearchResult;
  onSelect: () => void;
}) {
  const meta = resultMeta[result.kind];
  const Icon = meta.icon;

  return (
    <Link
      href={result.href}
      onClick={onSelect}
      className="flex items-start gap-3 rounded-[22px] border border-transparent px-4 py-3 transition-colors hover:border-brand-blue/20 hover:bg-panel-subtle"
    >
      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-panel-subtle text-brand-red">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{result.title}</p>
          <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted">{result.subtitle}</p>
      </div>
    </Link>
  );
}

function SearchState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full border border-border bg-panel-subtle">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}
