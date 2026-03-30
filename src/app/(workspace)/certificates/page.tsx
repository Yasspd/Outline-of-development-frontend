import { CertificateCard } from '@/components/ui/certificate-card';
import { SectionCard } from '@/components/ui/section-card';
import { certificates } from '@/lib/mock-data';

export default function CertificatesPage() {
  return (
    <SectionCard
      title="Сертификаты"
      description="Проверенные и ожидающие верификации подтверждения обучения."
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {certificates.map((certificate) => (
          <CertificateCard key={certificate.id} item={certificate} />
        ))}
      </div>
    </SectionCard>
  );
}

