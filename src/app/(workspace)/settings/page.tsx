'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { settingsSnapshot } from '@/lib/mock-data';
import { getUserDisplayName, getUserRoleLabel } from '@/lib/user-display';

export default function SettingsPage() {
  const { user } = useAuth();

  const profile = user
    ? {
        fullName: getUserDisplayName(user),
        role: getUserRoleLabel(user.roles),
        email: user.email,
        department: user.department ?? 'Не указано',
        notifications: settingsSnapshot.notifications,
      }
    : settingsSnapshot;

  return (
    <div className="space-y-6">
      <SectionCard
        title="РџСЂРѕС„РёР»СЊ"
        description="РћСЃРЅРѕРІРЅС‹Рµ РґР°РЅРЅС‹Рµ СЃРѕС‚СЂСѓРґРЅРёРєР° Рё РєРѕРЅС‚РµРєСЃС‚ СЂРѕР»Рё РІ СЃРёСЃС‚РµРјРµ."
      >
        <dl className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-panel-muted p-5">
            <dt className="text-sm text-muted">Р¤РРћ</dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">{profile.fullName}</dd>
          </div>
          <div className="rounded-2xl border border-border bg-panel-muted p-5">
            <dt className="text-sm text-muted">Р РѕР»СЊ</dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">{profile.role}</dd>
          </div>
          <div className="rounded-2xl border border-border bg-panel-muted p-5">
            <dt className="text-sm text-muted">Email</dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">{profile.email}</dd>
          </div>
          <div className="rounded-2xl border border-border bg-panel-muted p-5">
            <dt className="text-sm text-muted">РџРѕРґСЂР°Р·РґРµР»РµРЅРёРµ</dt>
            <dd className="mt-2 text-lg font-semibold text-foreground">{profile.department}</dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard
        title="РЈРІРµРґРѕРјР»РµРЅРёСЏ"
        description="РўРѕР»СЊРєРѕ СЂР°Р±РѕС‡РёРµ СѓРІРµРґРѕРјР»РµРЅРёСЏ, Р±РµР· Р»РёС€РЅРµРіРѕ С€СѓРјР°."
      >
        <div className="space-y-3">
          {profile.notifications.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-border bg-panel-muted px-4 py-4"
            >
              <p className="text-sm font-medium text-foreground">{item}</p>
              <StatusBadge tone="success">Р’РєР»СЋС‡РµРЅРѕ</StatusBadge>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
