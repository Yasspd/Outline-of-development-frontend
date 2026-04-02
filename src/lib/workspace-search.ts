import type {
  CertificateRecord,
  CourseRecord,
  ExternalLearningRequestRecord,
} from '@/lib/api';
import { formatFullDate } from '@/lib/format';
import {
  formatCourseFormat,
  formatCourseType,
  getCertificateStatusMeta,
  getExternalStatusMeta,
} from '@/lib/presentation';
import type { WorkspaceRole } from '@/lib/roles';

export type WorkspaceSearchResultKind = 'course' | 'request' | 'certificate';

export type WorkspaceSearchResult = {
  id: string;
  kind: WorkspaceSearchResultKind;
  title: string;
  subtitle: string;
  href: string;
  searchText: string;
};

function normalizeSearchValue(value: string): string {
  return value
    .toLocaleLowerCase('ru-RU')
    .replaceAll('ё', 'е')
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveCourseHref(role: WorkspaceRole): string {
  if (role === 'hr') {
    return '/hr/courses';
  }

  if (role === 'trainer') {
    return '/trainer/courses';
  }

  if (role === 'manager') {
    return '/manager/dashboard';
  }

  return '/employee/my-courses';
}

export function buildWorkspaceSearchResults(input: {
  role: WorkspaceRole;
  courses: CourseRecord[];
  programs: CourseRecord[];
  requests: ExternalLearningRequestRecord[];
  certificates: CertificateRecord[];
}): WorkspaceSearchResult[] {
  const uniquePublishedCourses = new Map<string, CourseRecord>();

  [...input.courses, ...input.programs].forEach((course) => {
    if (course.status === 'PUBLISHED' && !uniquePublishedCourses.has(course.id)) {
      uniquePublishedCourses.set(course.id, course);
    }
  });

  const courseResults = [...uniquePublishedCourses.values()].map((course) => ({
    id: `course-${course.id}`,
    kind: 'course' as const,
    title: course.title,
    subtitle: `${formatCourseType(course.type)} · ${formatCourseFormat(course.format)}`,
    href: resolveCourseHref(input.role),
    searchText: normalizeSearchValue(
      [
        'курс',
        'обучение',
        'опубликован',
        course.title,
        course.description ?? '',
        formatCourseType(course.type),
        formatCourseFormat(course.format),
      ].join(' '),
    ),
  }));

  const requestResults = input.requests.map((request) => ({
    id: `request-${request.id}`,
    kind: 'request' as const,
    title: request.title,
    subtitle: `${getExternalStatusMeta(request.status).label} · ${request.providerName ?? 'Внешний провайдер'}`,
    href: '/employee/external-learning',
    searchText: normalizeSearchValue(
      [
        'заявка',
        'внешнее обучение',
        request.title,
        request.providerName ?? '',
        request.program ?? '',
        request.description ?? '',
        getExternalStatusMeta(request.status).label,
      ].join(' '),
    ),
  }));

  const certificateResults = input.certificates.map((certificate) => ({
    id: `certificate-${certificate.id}`,
    kind: 'certificate' as const,
    title: certificate.fileName,
    subtitle: `${getCertificateStatusMeta(certificate.status).label} · ${formatFullDate(certificate.uploadedAt)}`,
    href: '/employee/certificates',
    searchText: normalizeSearchValue(
      [
        'сертификат',
        'подтверждение',
        certificate.fileName,
        certificate.externalLearningRequest?.title ?? '',
        getCertificateStatusMeta(certificate.status).label,
      ].join(' '),
    ),
  }));

  return [...courseResults, ...requestResults, ...certificateResults];
}

function scoreWorkspaceSearchResult(
  item: WorkspaceSearchResult,
  queryTerms: string[],
): number {
  const title = normalizeSearchValue(item.title);
  const subtitle = normalizeSearchValue(item.subtitle);

  return queryTerms.reduce((score, term) => {
    if (title.startsWith(term)) {
      return score + 8;
    }

    if (title.includes(term)) {
      return score + 5;
    }

    if (subtitle.includes(term)) {
      return score + 3;
    }

    if (item.searchText.includes(term)) {
      return score + 1;
    }

    return score;
  }, 0);
}

export function filterWorkspaceSearchResults(
  items: WorkspaceSearchResult[],
  query: string,
): WorkspaceSearchResult[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return [];
  }

  const queryTerms = normalizedQuery.split(' ').filter(Boolean);

  return items
    .filter((item) => queryTerms.every((term) => item.searchText.includes(term)))
    .sort((left, right) => {
      const scoreDiff =
        scoreWorkspaceSearchResult(right, queryTerms) -
        scoreWorkspaceSearchResult(left, queryTerms);

      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return left.title.localeCompare(right.title, 'ru-RU');
    });
}
