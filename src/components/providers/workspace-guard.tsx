'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { useAuth } from '@/components/providers/auth-provider';

export function WorkspaceGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { hasHydrated, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (hasHydrated && !isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, isLoading, router]);

  if (!hasHydrated || isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen bg-canvas px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[560px] rounded-[28px] border border-border bg-panel px-6 py-8 text-center">
          <div className="alrosa-rule mx-auto mb-4" />
          <p className="text-sm font-semibold text-foreground">Проверяем доступ</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Рабочее пространство доступно только после входа в аккаунт.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
