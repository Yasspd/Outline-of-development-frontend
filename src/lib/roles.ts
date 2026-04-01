export type WorkspaceRole = 'employee' | 'manager' | 'hr' | 'trainer';

const rolePriority = [
  'HR_LD_ADMIN',
  'INTERNAL_TRAINER',
  'MANAGER',
  'EMPLOYEE',
] as const;

const workspaceRoleByCode: Record<(typeof rolePriority)[number], WorkspaceRole> = {
  HR_LD_ADMIN: 'hr',
  INTERNAL_TRAINER: 'trainer',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

export function resolvePrimaryRole(roles: string[] | null | undefined): WorkspaceRole {
  for (const roleCode of rolePriority) {
    if (roles?.includes(roleCode)) {
      return workspaceRoleByCode[roleCode];
    }
  }

  return 'employee';
}

export function getWorkspaceHome(role: WorkspaceRole): string {
  return `/${role}/dashboard`;
}

export function resolveWorkspaceRoleFromPath(pathname: string): WorkspaceRole | null {
  if (pathname.startsWith('/employee/')) {
    return 'employee';
  }

  if (pathname.startsWith('/manager/')) {
    return 'manager';
  }

  if (pathname.startsWith('/hr/')) {
    return 'hr';
  }

  if (pathname.startsWith('/trainer/')) {
    return 'trainer';
  }

  return null;
}

export function resolveCompatibilityTarget(
  pathname: string,
  primaryRole: WorkspaceRole,
): string {
  if (pathname === '/workspace' || pathname === '/' || pathname === '/dashboard') {
    return getWorkspaceHome(primaryRole);
  }

  if (pathname === '/my-courses') {
    if (primaryRole === 'employee') {
      return '/employee/my-courses';
    }

    if (primaryRole === 'trainer') {
      return '/trainer/courses';
    }

    if (primaryRole === 'hr') {
      return '/hr/courses';
    }

    return '/manager/team';
  }

  if (pathname === '/external-learning') {
    return primaryRole === 'employee' ? '/employee/external-learning' : getWorkspaceHome(primaryRole);
  }

  if (pathname === '/external-learning/new') {
    return primaryRole === 'employee'
      ? '/employee/external-learning/new'
      : getWorkspaceHome(primaryRole);
  }

  if (pathname === '/certificates') {
    return primaryRole === 'employee' ? '/employee/certificates' : getWorkspaceHome(primaryRole);
  }

  if (pathname === '/analytics') {
    if (primaryRole === 'hr') {
      return '/hr/analytics';
    }

    if (primaryRole === 'manager') {
      return '/manager/dashboard';
    }

    return getWorkspaceHome(primaryRole);
  }

  if (pathname === '/settings') {
    return `/${primaryRole}/settings`;
  }

  if (pathname === '/corporate-university') {
    if (primaryRole === 'trainer') {
      return '/trainer/courses';
    }

    if (primaryRole === 'hr') {
      return '/hr/courses';
    }

    return '/employee/my-courses';
  }

  if (pathname === '/calendar') {
    return getWorkspaceHome(primaryRole);
  }

  return getWorkspaceHome(primaryRole);
}
