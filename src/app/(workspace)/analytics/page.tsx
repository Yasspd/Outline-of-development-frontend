import { SectionCard } from '@/components/ui/section-card';
import { analyticsSnapshot } from '@/lib/mock-data';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Ключевые показатели"
        description="На главной аналитике остаются только метрики, по которым действительно принимают решения."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {analyticsSnapshot.overview.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-panel-muted p-5">
              <p className="text-sm font-medium text-muted">{item.label}</p>
              <p className="mt-4 text-3xl font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Покрытие по подразделениям"
        description="Без тяжёлых графиков: только ясная сравнительная шкала."
      >
        <div className="space-y-4">
          {analyticsSnapshot.departments.map((department) => (
            <div key={department.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{department.name}</span>
                <span className="text-muted">{department.value}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-accent-soft">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${department.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

