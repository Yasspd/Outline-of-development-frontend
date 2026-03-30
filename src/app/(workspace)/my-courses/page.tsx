import { EmptyState } from '@/components/ui/empty-state';
import { ProgressCard } from '@/components/ui/progress-card';
import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { myCourses } from '@/lib/mock-data';

export default function MyCoursesPage() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Текущие программы"
        description="Все активные курсы и внешний контур в одной рабочей плоскости."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {myCourses.map((course) => (
            <ProgressCard
              key={course.id}
              title={course.title}
              description={course.format}
              progress={course.progress}
              nextStep={course.nextMilestone}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Статус обучения"
        description="Короткая сводка по активным и обязательным направлениям."
      >
        <div className="space-y-3">
          {myCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-panel-muted p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-semibold text-foreground">{course.title}</p>
                <p className="text-sm text-muted">{course.nextMilestone}</p>
              </div>
              <StatusBadge tone={course.tone}>{course.status}</StatusBadge>
            </div>
          ))}
        </div>
      </SectionCard>

      <EmptyState
        title="Новых обязательных курсов пока нет"
        description="Когда HR или руководитель назначит новое обучение, оно появится здесь в общей ленте."
      />
    </div>
  );
}

