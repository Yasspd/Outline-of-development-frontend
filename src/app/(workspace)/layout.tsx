import { ReactNode } from 'react';

import { AppShell } from '@/components/app-shell/app-shell';
import { WorkspaceGuard } from '@/components/providers/workspace-guard';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceGuard>
      <AppShell>{children}</AppShell>
    </WorkspaceGuard>
  );
}
