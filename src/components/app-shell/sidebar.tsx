'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/cn';
import { navigationItems } from '@/lib/navigation';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-border bg-panel px-5 py-5 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Контур развития
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          Learning Workspace
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Единая рабочая среда обучения, заявок и развития сотрудников.
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'min-w-[180px] rounded-xl border border-transparent px-4 py-3 transition-colors lg:min-w-0',
                isActive
                  ? 'border-border bg-accent-soft text-accent'
                  : 'text-muted hover:bg-panel-muted hover:text-foreground',
              )}
            >
              <div className="text-sm font-medium">{item.label}</div>
              <div className="mt-1 hidden text-xs leading-5 lg:block">{item.description}</div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

