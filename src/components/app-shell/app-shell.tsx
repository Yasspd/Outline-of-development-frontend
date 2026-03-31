import { ReactNode } from 'react';

import { Header } from './header';
import { Sidebar } from './sidebar';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header />
        <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
