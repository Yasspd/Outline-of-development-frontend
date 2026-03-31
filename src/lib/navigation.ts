export type NavigationItem = {
  label: string;
  href: string;
  description: string;
};

export const navigationItems: NavigationItem[] = [
  {
    label: 'Главная',
    href: '/dashboard',
    description: 'Общая картина, ближайшие события и текущие статусы',
  },
  {
    label: 'Мои курсы',
    href: '/my-courses',
    description: 'Назначенные и активные обучения',
  },
  {
    label: 'Внешнее обучение',
    href: '/external-learning',
    description: 'Заявки, бюджет и согласование',
  },
  {
    label: 'Корпоративный университет',
    href: '/corporate-university',
    description: 'Внутренние программы развития и soft skills',
  },
  {
    label: 'Календарь',
    href: '/calendar',
    description: 'События и занятость',
  },
  {
    label: 'Сертификаты',
    href: '/certificates',
    description: 'Подтверждения обучения',
  },
  {
    label: 'Аналитика',
    href: '/analytics',
    description: 'Показатели и отчёты',
  },
  {
    label: 'Настройки',
    href: '/settings',
    description: 'Профиль и уведомления',
  },
];

export const pageMeta: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Рабочее пространство',
    description: 'Держите под контролем активные обучения, согласования и ближайшие занятия.',
  },
  '/my-courses': {
    title: 'Мои курсы',
    description: 'Текущие программы, обязательные обучения и ближайшие дедлайны.',
  },
  '/external-learning': {
    title: 'Внешнее обучение',
    description: 'Управляйте заявками, бюджетом и этапами согласования.',
  },
  '/external-learning/new': {
    title: 'Новая заявка',
    description: 'Подайте заявку на внешний курс с понятной проверкой бюджета и календаря.',
  },
  '/corporate-university': {
    title: 'Корпоративный университет',
    description: 'Внутренние программы развития и soft skills.',
  },
  '/calendar': {
    title: 'Календарь обучения',
    description: 'Проверьте предстоящие события и конфликтующие интервалы.',
  },
  '/certificates': {
    title: 'Сертификаты',
    description: 'Загруженные подтверждения обучения и статус проверки.',
  },
  '/analytics': {
    title: 'Аналитика',
    description: 'Ключевые показатели по обучению и развитию команды.',
  },
  '/settings': {
    title: 'Настройки',
    description: 'Параметры профиля, уведомлений и рабочих интеграций.',
  },
};
