import type { CurrentUserProfile } from '@/lib/api';
import { resolvePrimaryRole } from '@/lib/roles';

const roleLabels: Record<string, string> = {
  EMPLOYEE: 'Сотрудник',
  MANAGER: 'Руководитель',
  HR_LD_ADMIN: 'Кадры и развитие',
  INTERNAL_TRAINER: 'Внутренний тренер',
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
    return 'Сотрудник';
  }

  return roles.map((role) => roleLabels[role] ?? role).join(' / ');
}

export function getPrimaryRoleLabel(roles: string[] | null | undefined): string {
  const primaryRole = resolvePrimaryRole(roles);

  if (primaryRole === 'hr') {
    return roleLabels.HR_LD_ADMIN;
  }

  if (primaryRole === 'trainer') {
    return roleLabels.INTERNAL_TRAINER;
  }

  if (primaryRole === 'manager') {
    return roleLabels.MANAGER;
  }

  return roleLabels.EMPLOYEE;
}

export function getUserMetaLine(user: CurrentUserProfile | null | undefined): string {
  if (!user) {
    return 'Профиль не загружен';
  }

  const parts = [user.position, user.department].filter(Boolean);

  return parts.join(' · ') || getUserRoleLabel(user.roles);
}
