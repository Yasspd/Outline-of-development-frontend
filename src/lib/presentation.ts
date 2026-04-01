import type {
  ApprovalStage,
  ApprovalStatus,
  CertificateStatus,
  CourseFormat,
  CourseStatus,
  CourseType,
  EnrollmentStatus,
  ExternalLearningStatus,
  RoleCode,
} from '@/lib/api';
import type { StatusTone } from '@/components/ui/status-badge';

const roleLabelMap: Record<RoleCode, string> = {
  EMPLOYEE: 'Сотрудник',
  MANAGER: 'Руководитель',
  HR_LD_ADMIN: 'Кадры и развитие',
  INTERNAL_TRAINER: 'Внутренний тренер',
};

const courseTypeLabelMap: Record<CourseType, string> = {
  LMS: 'LMS',
  CORPORATE_UNIVERSITY: 'Корпоративный университет',
};

const courseFormatLabelMap: Record<CourseFormat, string> = {
  SELF_PACED: 'Самостоятельно',
  LIVE: 'Очный',
  HYBRID: 'Гибридный',
};

const courseStatusMeta: Record<CourseStatus, { label: string; tone: StatusTone }> = {
  DRAFT: { label: 'Черновик', tone: 'neutral' },
  PUBLISHED: { label: 'Опубликован', tone: 'success' },
  ARCHIVED: { label: 'В архиве', tone: 'warning' },
};

const enrollmentStatusMeta: Record<EnrollmentStatus, { label: string; tone: StatusTone }> = {
  ENROLLED: { label: 'Записан', tone: 'info' },
  IN_PROGRESS: { label: 'В процессе', tone: 'warning' },
  COMPLETED: { label: 'Завершён', tone: 'success' },
  CANCELLED: { label: 'Отменён', tone: 'danger' },
};

const approvalStatusMeta: Record<ApprovalStatus, { label: string; tone: StatusTone }> = {
  PENDING: { label: 'На согласовании', tone: 'warning' },
  APPROVED: { label: 'Согласовано', tone: 'success' },
  REJECTED: { label: 'Отклонено', tone: 'danger' },
  SKIPPED: { label: 'Пропущено', tone: 'neutral' },
};

const externalStatusMeta: Record<ExternalLearningStatus, { label: string; tone: StatusTone }> = {
  DRAFT: { label: 'Черновик', tone: 'neutral' },
  SUBMITTED: { label: 'Отправлена', tone: 'info' },
  IN_REVIEW: { label: 'На рассмотрении', tone: 'warning' },
  APPROVED: { label: 'Согласована', tone: 'success' },
  REJECTED: { label: 'Отклонена', tone: 'danger' },
  SCHEDULED: { label: 'Запланирована', tone: 'info' },
  COMPLETED: { label: 'Завершена', tone: 'success' },
  CANCELLED: { label: 'Отменена', tone: 'danger' },
};

const certificateStatusMeta: Record<CertificateStatus, { label: string; tone: StatusTone }> = {
  UPLOADED: { label: 'Загружен', tone: 'info' },
  ACCEPTED: { label: 'Подтверждён', tone: 'success' },
  REJECTED: { label: 'Отклонён', tone: 'danger' },
};

const approvalStageLabelMap: Record<ApprovalStage, string> = {
  MANAGER: 'Руководитель',
  HR: 'Кадры и развитие',
};

export function formatRoleCode(roleCode: RoleCode): string {
  return roleLabelMap[roleCode] ?? roleCode;
}

export function formatCourseType(type: CourseType): string {
  return courseTypeLabelMap[type] ?? type;
}

export function formatCourseFormat(format: CourseFormat): string {
  return courseFormatLabelMap[format] ?? format;
}

export function formatApprovalStage(stage: ApprovalStage | null | undefined): string {
  if (!stage) {
    return 'Завершено';
  }

  return approvalStageLabelMap[stage] ?? stage;
}

export function getCourseStatusMeta(status: CourseStatus) {
  return courseStatusMeta[status];
}

export function getEnrollmentStatusMeta(status: EnrollmentStatus) {
  return enrollmentStatusMeta[status];
}

export function getApprovalStatusMeta(status: ApprovalStatus) {
  return approvalStatusMeta[status];
}

export function getExternalStatusMeta(status: ExternalLearningStatus) {
  return externalStatusMeta[status];
}

export function getCertificateStatusMeta(status: CertificateStatus) {
  return certificateStatusMeta[status];
}
