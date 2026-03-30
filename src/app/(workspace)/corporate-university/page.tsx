import { SectionCard } from '@/components/ui/section-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { corporatePrograms } from '@/lib/mock-data';

export default function CorporateUniversityPage() {
  return (
    <SectionCard
      title="Программы корпоративного университета"
      description="Аккуратный каталог внутренних программ без перегруженных карточек и витринного шума."
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {corporatePrograms.map((program) => (
          <article key={program.id} className="rounded-2xl border border-border bg-panel-muted p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-foreground">{program.title}</h3>
              <StatusBadge tone={program.tone}>{program.status}</StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{program.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm text-muted">
              <span>{program.duration}</span>
              <span>{program.seatsLeft}</span>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}

