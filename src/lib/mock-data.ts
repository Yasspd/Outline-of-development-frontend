import { StatusTone } from '@/components/ui/status-badge';
import { demoEmployeeProfile } from '@/lib/demo-profile';

export type DashboardStat = {
  label: string;
  value: string;
  meta: string;
  accent: string;
};

export type LearningEvent = {
  id: string;
  title: string;
  date: string;
  status: string;
  tone: StatusTone;
  type: string;
};

export type ApprovalItem = {
  id: string;
  title: string;
  employee: string;
  stage: string;
  cost: number;
  status: string;
  tone: StatusTone;
};

export type TrackItem = {
  id: string;
  title: string;
  description: string;
  progress: number;
  nextStep: string;
};

export type CertificateItem = {
  id: string;
  title: string;
  provider: string;
  uploadedAt: string;
  status: string;
  tone: StatusTone;
};

export type CourseItem = {
  id: string;
  title: string;
  format: string;
  progress: number;
  nextMilestone: string;
  status: string;
  tone: StatusTone;
};

export type ExternalLearningRequestItem = {
  id: string;
  title: string;
  provider: string;
  cost: number;
  period: string;
  stage: string;
  status: string;
  tone: StatusTone;
};

export type CorporateProgramItem = {
  id: string;
  title: string;
  description: string;
  duration: string;
  seatsLeft: string;
  status: string;
  tone: StatusTone;
};

export const dashboardStats: DashboardStat[] = [
  {
    label: 'Активные обучения',
    value: '05',
    meta: '2 обязательных курса и 3 программы развития в работе',
    accent: 'в фокусе',
  },
  {
    label: 'Прогресс за квартал',
    value: '78%',
    meta: 'Цель квартала почти закрыта, остался один модуль сертификации',
    accent: '+12 п.п.',
  },
  {
    label: 'Заявки на согласовании',
    value: '03',
    meta: '2 заявки на этапе менеджера, 1 заявка на проверке HR',
    accent: 'в процессе',
  },
  {
    label: 'Следующее занятие',
    value: '29 мар · 14:00',
    meta: 'Воркшоп по переговорам с командой продукта',
    accent: 'через 2 дня',
  },
];

export const upcomingLearning: LearningEvent[] = [
  {
    id: 'event-1',
    title: 'Negotiation Skills for Tech Leads',
    date: '2026-04-02',
    status: 'Подтверждено',
    tone: 'success',
    type: 'Корпоративный университет',
  },
  {
    id: 'event-2',
    title: 'Архитектура NestJS-монолита',
    date: '2026-04-05',
    status: 'Назначено',
    tone: 'info',
    type: 'LMS',
  },
  {
    id: 'event-3',
    title: 'Product Discovery Bootcamp',
    date: '2026-04-08',
    status: 'На согласовании',
    tone: 'warning',
    type: 'Внешнее обучение',
  },
];

export const calendarConflict = {
  title: 'Найден конфликт с командной планёркой',
  description:
    'Внешний курс по Product Discovery пересекается с квартальным планированием команды 8 апреля с 11:00 до 12:30.',
  suggestion: 'Предлагаем перенести обучение на 10 апреля после 15:00.',
};

export const approvalQueue: ApprovalItem[] = [
  {
    id: 'approval-1',
    title: 'Product Discovery Bootcamp',
    employee: demoEmployeeProfile.fullName,
    stage: 'Manager approval',
    cost: 48000,
    status: 'Требует решения',
    tone: 'warning',
  },
  {
    id: 'approval-2',
    title: 'Agile Facilitation Advanced',
    employee: 'Максим Романов',
    stage: 'HR approval',
    cost: 32000,
    status: 'Проверка бюджета',
    tone: 'info',
  },
  {
    id: 'approval-3',
    title: 'Data Storytelling for Leads',
    employee: 'Ирина Лебедева',
    stage: 'Manager approval',
    cost: 27000,
    status: 'Новый запрос',
    tone: 'warning',
  },
];

export const developmentTracks: TrackItem[] = [
  {
    id: 'track-1',
    title: 'Leadership Track',
    description: 'Управление командой, обратная связь и стратегическая коммуникация.',
    progress: 74,
    nextStep: 'Остался модуль по performance review',
  },
  {
    id: 'track-2',
    title: 'Architecture Track',
    description: 'Практики проектирования платформ и архитектурные ревью.',
    progress: 61,
    nextStep: 'Запланирован внутренний воркшоп 5 апреля',
  },
  {
    id: 'track-3',
    title: 'Product Collaboration Track',
    description: 'Совместная работа с продуктом и delivery-командой.',
    progress: 83,
    nextStep: 'Финальный модуль по stakeholder management',
  },
];

export const learningProfile = {
  certificatesCount: 14,
  mandatoryCoursesCompleted: '8 из 9',
  latestCertificate: {
    id: 'cert-1',
    title: 'Leadership Essentials',
    provider: 'Internal Academy',
    uploadedAt: '2026-03-18',
    status: 'Проверено',
    tone: 'success' as const,
  },
};

export const myCourses: CourseItem[] = [
  {
    id: 'course-1',
    title: 'Leadership Essentials',
    format: 'Корпоративный университет',
    progress: 92,
    nextMilestone: 'Итоговая аттестация 31 марта',
    status: 'Почти завершено',
    tone: 'success',
  },
  {
    id: 'course-2',
    title: 'Secure Development Fundamentals',
    format: 'LMS',
    progress: 64,
    nextMilestone: 'Остался модуль по secure code review',
    status: 'В работе',
    tone: 'info',
  },
  {
    id: 'course-3',
    title: 'Product Discovery Bootcamp',
    format: 'Внешнее обучение',
    progress: 18,
    nextMilestone: 'Ожидается подтверждение бюджета',
    status: 'На согласовании',
    tone: 'warning',
  },
];

export const externalLearningRequests: ExternalLearningRequestItem[] = [
  {
    id: 'request-1',
    title: 'Product Discovery Bootcamp',
    provider: 'Product Sense',
    cost: 48000,
    period: '8–10 апреля',
    stage: 'Manager approval',
    status: 'На согласовании',
    tone: 'warning',
  },
  {
    id: 'request-2',
    title: 'Agile Facilitation Advanced',
    provider: 'ScrumTrek',
    cost: 32000,
    period: '14 апреля',
    stage: 'HR approval',
    status: 'Проверка бюджета',
    tone: 'info',
  },
  {
    id: 'request-3',
    title: 'Systems Design Intensive',
    provider: 'Highload School',
    cost: 56000,
    period: '22–24 апреля',
    stage: 'Approved',
    status: 'Подтверждено',
    tone: 'success',
  },
];

export const corporatePrograms: CorporateProgramItem[] = [
  {
    id: 'program-1',
    title: 'Strategic Communication',
    description: 'Системная коммуникация с руководством и соседними командами.',
    duration: '4 недели',
    seatsLeft: '4 места',
    status: 'Набор открыт',
    tone: 'success',
  },
  {
    id: 'program-2',
    title: 'Conflict Management',
    description: 'Практика сложных переговоров и разбор рабочих кейсов.',
    duration: '2 недели',
    seatsLeft: '2 места',
    status: 'Скоро старт',
    tone: 'info',
  },
  {
    id: 'program-3',
    title: 'Mentoring for Tech Leads',
    description: 'Наставничество, развитие сотрудников и регулярная обратная связь.',
    duration: '3 недели',
    seatsLeft: 'лист ожидания',
    status: 'Высокий спрос',
    tone: 'warning',
  },
];

export const calendarEvents: LearningEvent[] = [
  ...upcomingLearning,
  {
    id: 'event-4',
    title: 'Обязательный курс по ИБ',
    date: '2026-04-11',
    status: 'Доступно в LMS',
    tone: 'info',
    type: 'LMS',
  },
];

export const certificates: CertificateItem[] = [
  learningProfile.latestCertificate,
  {
    id: 'cert-2',
    title: 'Secure Development Fundamentals',
    provider: 'Internal Academy',
    uploadedAt: '2026-02-12',
    status: 'Проверено',
    tone: 'success',
  },
  {
    id: 'cert-3',
    title: 'Agile Facilitation Basics',
    provider: 'ScrumTrek',
    uploadedAt: '2026-03-26',
    status: 'Ожидает верификации',
    tone: 'warning',
  },
];

export const analyticsSnapshot = {
  overview: [
    { label: 'Доля завершения обязательных курсов', value: '89%' },
    { label: 'Среднее время согласования', value: '2.6 дня' },
    { label: 'Конфликтов в календаре за месяц', value: '6' },
    { label: 'Использование бюджета', value: '72%' },
  ],
  departments: [
    { name: 'Platform Engineering', value: 82 },
    { name: 'Product Management', value: 76 },
    { name: 'QA & Release', value: 69 },
    { name: 'Design', value: 71 },
  ],
};

export const settingsSnapshot = {
  fullName: demoEmployeeProfile.fullName,
  role: demoEmployeeProfile.roleLabel,
  email: demoEmployeeProfile.email,
  department: demoEmployeeProfile.department,
  notifications: [
    'Напоминания о старте обучения',
    'Изменения статуса заявки',
    'Конфликты календаря',
  ],
};
