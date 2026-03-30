import { ReactNode } from 'react';

import { Header } from './header';
import { Sidebar } from './sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

