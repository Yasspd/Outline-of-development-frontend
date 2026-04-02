import { WorkspaceRole } from '@/lib/roles';

export type NavigationItem = {
  label: string;
  href: string;
  description: string;
};

const navigationByRole: Record<WorkspaceRole, NavigationItem[]> = {
  employee: [
    {
      label: 'Главная',
      href: '/employee/dashboard',
      description: 'Мои курсы, заявки, дедлайны и быстрый обзор обучения.',
    },
    {
      label: 'Мои курсы',
      href: '/employee/my-courses',
      description: 'Доступные курсы и мои записи на обучение.',
    },
    {
      label: 'Внешнее обучение',
      href: '/employee/external-learning',
      description: 'Заявки на внешние курсы и их статусы.',
    },
    {
      label: 'Сертификаты',
      href: '/employee/certificates',
      description: 'Загрузка и просмотр сертификатов.',
    },
    {
      label: 'Настройки',
      href: '/employee/settings',
      description: 'Профиль и роли пользователя.',
    },
  ],
  manager: [
    {
      label: 'Главная',
      href: '/manager/dashboard',
      description: 'Сводка по команде и очереди согласований.',
    },
    {
      label: 'Согласования',
      href: '/manager/approvals',
      description: 'Заявки команды, требующие решения.',
    },
    {
      label: 'Команда',
      href: '/manager/team',
      description: 'Сотрудники и их учебная активность.',
    },
    {
      label: 'Настройки',
      href: '/manager/settings',
      description: 'Профиль и текущая роль.',
    },
  ],
  hr: [
    {
      label: 'Главная',
      href: '/hr/dashboard',
      description: 'Главные показатели, приоритетные задачи и состояние контура обучения.',
    },
    {
      label: 'Пользователи',
      href: '/hr/users',
      description: 'Сотрудники, роли и оргструктура обучения.',
    },
    {
      label: 'Согласования',
      href: '/hr/approvals',
      description: 'Очередь решений и реестр заявок на внешнее обучение.',
    },
    {
      label: 'Курсы',
      href: '/hr/courses',
      description: 'Каталог внутренних курсов, публикация и назначения.',
    },
    {
      label: 'Сертификаты',
      href: '/hr/certificates',
      description: 'Проверка подтверждающих документов по завершённому обучению.',
    },
    {
      label: 'Аналитика',
      href: '/hr/analytics',
      description: 'Показатели по обучению, бюджету и очередям согласования.',
    },
    {
      label: 'Отчёты',
      href: '/hr/reports',
      description: 'Сводки для руководства и выгрузка данных.',
    },
    {
      label: 'Настройки',
      href: '/hr/settings',
      description: 'Профиль и активные роли.',
    },
  ],
  trainer: [
    {
      label: 'Главная',
      href: '/trainer/dashboard',
      description: 'Мои программы, участники и прогресс.',
    },
    {
      label: 'Программы',
      href: '/trainer/courses',
      description: 'Собственные программы и корпоративные курсы.',
    },
    {
      label: 'Участники',
      href: '/trainer/participants',
      description: 'Мониторинг прогресса обучающихся.',
    },
    {
      label: 'Настройки',
      href: '/trainer/settings',
      description: 'Профиль и назначенные роли.',
    },
  ],
};

type PageMeta = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

const pageMetaByPrefix: Array<{
  prefix: string;
  meta: PageMeta;
}> = [
  {
    prefix: '/employee/dashboard',
    meta: {
      title: 'Кабинет сотрудника',
      description: 'Курсы, заявки, дедлайны и сертификаты в одном рабочем окне.',
      actionHref: '/employee/external-learning/new',
      actionLabel: 'Подать заявку',
    },
  },
  {
    prefix: '/employee/my-courses',
    meta: {
      title: 'Мои курсы',
      description: 'Доступные программы и мои записи на обучение.',
      actionHref: '/employee/external-learning/new',
      actionLabel: 'Новая заявка',
    },
  },
  {
    prefix: '/employee/external-learning/new',
    meta: {
      title: 'Новая заявка',
      description: 'Создание и отправка заявки на внешний курс.',
    },
  },
  {
    prefix: '/employee/external-learning',
    meta: {
      title: 'Внешнее обучение',
      description: 'Мои заявки, согласование и контроль календаря.',
      actionHref: '/employee/external-learning/new',
      actionLabel: 'Создать заявку',
    },
  },
  {
    prefix: '/employee/certificates',
    meta: {
      title: 'Сертификаты',
      description: 'Загрузка и история подтверждений обучения.',
    },
  },
  {
    prefix: '/employee/settings',
    meta: {
      title: 'Настройки профиля',
      description: 'Роли, контакты и базовый профиль сотрудника.',
    },
  },
  {
    prefix: '/manager/dashboard',
    meta: {
      title: 'Кабинет руководителя',
      description: 'Сводка по команде, активным обучением и очереди согласований.',
      actionHref: '/manager/approvals',
      actionLabel: 'Открыть согласования',
    },
  },
  {
    prefix: '/manager/approvals',
    meta: {
      title: 'Согласования команды',
      description: 'Заявки на внешнее обучение, требующие решения руководителя.',
    },
  },
  {
    prefix: '/manager/team',
    meta: {
      title: 'Команда',
      description: 'Сотрудники и их учебная активность.',
    },
  },
  {
    prefix: '/manager/settings',
    meta: {
      title: 'Настройки профиля',
      description: 'Роли и базовые данные руководителя.',
    },
  },
  {
    prefix: '/hr/dashboard',
    meta: {
      title: 'Кабинет кадровой службы',
      description: 'Решения по обучению, пользователи, сертификаты и управленческая картина по всему контуру.',
      actionHref: '/hr/approvals',
      actionLabel: 'Открыть очередь',
    },
  },
  {
    prefix: '/hr/users',
    meta: {
      title: 'Пользователи и роли',
      description: 'Создание сотрудников, распределение ролей и поддержка структуры команды.',
    },
  },
  {
    prefix: '/hr/approvals',
    meta: {
      title: 'Согласования кадровой службы',
      description: 'Финальные решения по заявкам и общий реестр внешнего обучения сотрудников.',
    },
  },
  {
    prefix: '/hr/courses',
    meta: {
      title: 'Курсы и программы',
      description: 'Внутренние курсы, публикация и назначения сотрудникам.',
    },
  },
  {
    prefix: '/hr/certificates',
    meta: {
      title: 'Сертификаты',
      description: 'Очередь подтверждения документов и история решений по завершённому обучению.',
    },
  },
  {
    prefix: '/hr/analytics',
    meta: {
      title: 'Аналитика',
      description: 'Показатели по людям, обучению, бюджету и контролю выполнения.',
    },
  },
  {
    prefix: '/hr/reports',
    meta: {
      title: 'Отчёты',
      description: 'Сводные материалы по обучению и внешним заявкам для руководства.',
    },
  },
  {
    prefix: '/hr/settings',
    meta: {
      title: 'Настройки профиля',
      description: 'Роли и контактные данные кадровой службы.',
    },
  },
  {
    prefix: '/trainer/dashboard',
    meta: {
      title: 'Кабинет внутреннего тренера',
      description: 'Мои программы, участники и прогресс обучения.',
      actionHref: '/trainer/courses',
      actionLabel: 'Мои программы',
    },
  },
  {
    prefix: '/trainer/courses',
    meta: {
      title: 'Программы тренера',
      description: 'Создание, публикация и обзор собственных программ.',
    },
  },
  {
    prefix: '/trainer/participants',
    meta: {
      title: 'Участники и прогресс',
      description: 'Мониторинг статусов и прогресса обучающихся.',
    },
  },
  {
    prefix: '/trainer/settings',
    meta: {
      title: 'Настройки профиля',
      description: 'Роли и профиль внутреннего тренера.',
    },
  },
];

const defaultMeta: PageMeta = {
  title: 'Контур развития',
  description: 'Единая цифровая среда обучения сотрудников АЛРОСА ИТ.',
};

export function getNavigationItems(role: WorkspaceRole | null | undefined): NavigationItem[] {
  if (!role) {
    return navigationByRole.employee;
  }

  return navigationByRole[role];
}

export function resolvePageMeta(pathname: string): PageMeta {
  const match = pageMetaByPrefix.find((item) => pathname.startsWith(item.prefix));
  return match?.meta ?? defaultMeta;
}
