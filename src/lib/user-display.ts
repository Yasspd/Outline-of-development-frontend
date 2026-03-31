import type { CurrentUserProfile } from '@/lib/api';

const roleLabels: Record<string, string> = {
  EMPLOYEE: 'Employee',
  MANAGER: 'Manager',
  HR_LD_ADMIN: 'HR / L&D Admin',
  INTERNAL_TRAINER: 'Internal Trainer',
};

export function getUserDisplayName(
  user: Pick<CurrentUserProfile, 'firstName' | 'lastName'> | null | undefined,
): string {
  if (!user) {
    return 'Сотрудник';
  }

  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Сотрудник';
}

export function getUserRoleLabel(roles: string[] | null | undefined): string {
  if (!roles?.length) {
    return 'Employee';
  }

  return roles.map((role) => roleLabels[role] ?? role).join(' / ');
}

export function getUserMetaLine(user: CurrentUserProfile | null | undefined): string {
  if (!user) {
    return 'Профиль не загружен';
  }

  const parts = [user.position, user.department].filter(Boolean);

  return parts.join(' · ') || getUserRoleLabel(user.roles);
}
