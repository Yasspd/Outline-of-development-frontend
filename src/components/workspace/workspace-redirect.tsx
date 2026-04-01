'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { getWorkspaceHome, resolveCompatibilityTarget } from '@/lib/roles';

export function WorkspaceRedirect({
  sourcePath,
}: {
  sourcePath?: string;
}) {
  const router = useRouter();
  const { primaryRole } = useAuth();

  useEffect(() => {
    if (!primaryRole) {
      return;
    }

    router.replace(
      sourcePath ? resolveCompatibilityTarget(sourcePath, primaryRole) : getWorkspaceHome(primaryRole),
    );
  }, [primaryRole, router, sourcePath]);

  return (
    <EmptyState
      title="Открываем нужный кабинет"
      description="Перенаправляем в рабочее пространство, которое соответствует текущей роли пользователя."
    />
  );
}
