'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/components/providers/auth-provider';
import { cn } from '@/lib/cn';
import { getNavigationItems } from '@/lib/navigation';
import { getPrimaryRoleLabel, getUserDisplayName, getUserRoleLabel } from '@/lib/user-display';

export function Sidebar() {
  const pathname = usePathname();
  const { user, primaryRole } = useAuth();
  const displayName = getUserDisplayName(user);
  const roleLabel = getUserRoleLabel(user?.roles);
  const primaryRoleLabel = getPrimaryRoleLabel(user?.roles);
  const navigationItems = getNavigationItems(primaryRole);

  return (
    <aside className="w-full shrink-0 border-b border-border bg-panel/95 px-5 py-5 backdrop-blur-sm lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[18.5rem] lg:flex-col lg:border-b-0 lg:border-r lg:overflow-hidden">
      <div className="mb-8 rounded-[28px] border border-border bg-panel px-5 py-5">
        <div className="alrosa-rule mb-4" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
          ALROSA IT
        </p>
        <h1 className="mt-3 text-[1.7rem] font-semibold tracking-tight text-foreground">
          Контур развития
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Единая рабочая среда обучения, заявок и развития сотрудников.
        </p>
      </div>

      {user ? (
        <div className="mb-6 rounded-[24px] border border-border bg-panel-subtle px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Текущий аккаунт
          </p>
          <p className="mt-3 text-sm font-semibold text-foreground">{displayName}</p>
          <p className="mt-1 text-xs text-muted">{user.email}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {primaryRoleLabel}
          </p>
          <p className="mt-2 text-xs leading-5 text-muted">{roleLabel}</p>
        </div>
      ) : null}

      <nav className="flex gap-2 overflow-x-auto lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:overscroll-contain lg:pr-1 app-sidebar-scrollbar">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative min-w-[180px] rounded-[22px] border px-4 py-3.5 transition-colors lg:min-w-0',
                isActive
                  ? 'border-brand-red/20 bg-panel-subtle text-foreground'
                  : 'border-transparent text-muted hover:border-brand-blue/25 hover:bg-panel hover:text-foreground',
              )}
            >
              {isActive ? (
                <span className="pointer-events-none absolute inset-y-3 left-3 hidden w-4 lg:block">
                  <span className="absolute left-1 top-0 h-1.5 w-1.5 rounded-full border border-brand-red bg-panel" />
                  <span className="absolute bottom-0 left-1 h-1.5 w-1.5 rounded-full border border-brand-red bg-panel" />
                  <span className="absolute bottom-2 top-2 left-[0.42rem] w-px bg-brand-red" />
                </span>
              ) : null}
              <div className={cn('space-y-1', isActive ? 'lg:pl-5' : undefined)}>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="hidden text-xs leading-5 lg:block">{item.description}</div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
