export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export const ACCESS_TOKEN_STORAGE_KEY = 'kontur.accessToken';
export const REFRESH_TOKEN_STORAGE_KEY = 'kontur.refreshToken';

export type RoleCode = 'EMPLOYEE' | 'MANAGER' | 'HR_LD_ADMIN' | 'INTERNAL_TRAINER';
export type CourseType = 'LMS' | 'CORPORATE_UNIVERSITY';
export type CourseFormat = 'SELF_PACED' | 'LIVE' | 'HYBRID';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type EnrollmentStatus = 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ExternalLearningStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED';
export type ApprovalStage = 'MANAGER' | 'HR';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
export type CertificateStatus = 'UPLOADED' | 'ACCEPTED' | 'REJECTED';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export type AuthenticatedUser = {
  id: string;
  email: string;
  roles: RoleCode[];
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  position?: string;
  department?: string;
  outlookEmail?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type BasicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  department?: string | null;
  position?: string | null;
};

export type CurrentUserProfile = BasicUser & {
  outlookEmail: string | null;
  isActive: boolean;
  managerId: string | null;
  manager:
    | {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      }
    | null;
  roles: RoleCode[];
};

export type CourseSession = {
  id: string;
  title: string | null;
  startAt: string | null;
  endAt: string | null;
  capacity: number | null;
  location: string | null;
  meetingUrl: string | null;
};

export type CourseEnrollmentRecord = {
  id: string;
  courseId: string;
  sessionId: string | null;
  userId: string;
  status: EnrollmentStatus;
  progressPercent: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: BasicUser;
  course?: {
    id: string;
    title: string;
    type: CourseType;
    format: CourseFormat;
  };
  session?: CourseSession | null;
};

export type CourseRecord = {
  id: string;
  title: string;
  description: string | null;
  type: CourseType;
  format: CourseFormat;
  status: CourseStatus;
  durationHours: number | null;
  createdAt: string;
  updatedAt: string;
  trainer: BasicUser | null;
  createdBy: BasicUser | null;
  sessions: CourseSession[];
  _count?: {
    enrollments: number;
  };
  enrollments?: CourseEnrollmentRecord[];
};

export type CertificateRecord = {
  id: string;
  userId: string;
  externalLearningRequestId: string | null;
  fileName: string;
  fileUrl: string;
  status: CertificateStatus;
  uploadedAt: string;
  verifiedAt: string | null;
  externalLearningRequest?: ExternalLearningRequestRecord | null;
  owner?: BasicUser;
  verifiedBy?: BasicUser | null;
};

export type ExternalLearningRequestRecord = {
  id: string;
  employeeId?: string;
  title: string;
  courseUrl: string;
  providerName: string | null;
  cost: number | string;
  currency: string;
  startAt: string;
  endAt: string;
  program: string | null;
  description: string | null;
  status: ExternalLearningStatus;
  currentStage: ApprovalStage | null;
  calendarConflict: boolean;
  calendarConflictMeta?: {
    hasConflict: boolean;
    conflicts: Array<{
      id: string;
      title: string;
      startAt: string;
      endAt: string;
    }>;
  } | null;
  approvedAt: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: BasicUser;
  approvals?: ApprovalRecord[];
  certificates?: CertificateRecord[];
};

export type ApprovalRecord = {
  id: string;
  externalLearningRequestId: string;
  stage: ApprovalStage;
  approverId: string;
  status: ApprovalStatus;
  comment: string | null;
  decidedAt: string | null;
  createdAt: string;
  updatedAt: string;
  request: ExternalLearningRequestRecord;
};

export type BackendHealthStatus = {
  status: 'online' | 'offline';
  service: string;
  timestamp?: string;
  url: string;
};

export type NotificationRecord = {
  id: string;
  userId: string;
  title: string;
  body: string;
  status: NotificationStatus;
  payload?: Record<string, unknown> | null;
  sentAt: string | null;
  readAt: string | null;
  createdAt: string;
};

export type AnalyticsOverview = {
  users: number;
  courses: number;
  externalRequests: number;
  certificates: number;
};

export type CoursesAnalytics = {
  totalCourses: number;
  draftCourses?: number;
  publishedCourses: number;
  archivedCourses?: number;
  totalEnrollments: number;
  activeEnrollments?: number;
  completedEnrollments: number;
  completionRate?: number;
  averageProgress?: number;
};

export type ExternalLearningAnalytics = {
  byStatus: Array<{
    status: ExternalLearningStatus;
    _count: {
      _all: number;
    };
  }>;
  requestedBudget?: number;
  approvedBudget: number;
  inReviewBudget?: number;
  rejectedBudget?: number;
  completionRate?: number;
  calendarConflicts?: number;
};

export type HrDepartmentBreakdown = {
  department: string;
  employees: number;
  internalEnrollments: number;
  completedInternal: number;
  externalRequests: number;
  activeRoutes: number;
  completedRoutes: number;
  certificates: number;
  approvedBudget: number;
};

export type HrProviderBreakdown = {
  providerName: string;
  requests: number;
  pending: number;
  approved: number;
  completed: number;
  approvedBudget: number;
};

export type HrTrendPoint = {
  month: string;
  planned: number;
  approved: number;
  completed: number;
  rejected: number;
  plannedBudget: number;
  approvedBudget: number;
};

export type HrRecommendation = {
  priority: 'high' | 'medium' | 'low';
  score: number;
  title: string;
  description: string;
};

export type HrWorkspaceAnalytics = {
  overview: AnalyticsOverview;
  roleCoverage: {
    employees: number;
    managers: number;
    trainers: number;
    hrAdmins: number;
  };
  coursePortfolio: CoursesAnalytics & {
    upcomingSessions: number;
    coveragePercent: number;
    recentCourses: Array<{
      id: string;
      title: string;
      type: CourseType;
      format: CourseFormat;
      status: CourseStatus;
      durationHours: number | null;
      enrollments: number;
    }>;
  };
  externalLearning: ExternalLearningAnalytics & {
    totalRequests: number;
    pendingManager: number;
    pendingHr: number;
    averageManagerDecisionHours: number;
    averageHrDecisionHours: number;
    providerBreakdown: HrProviderBreakdown[];
    departmentBreakdown: HrDepartmentBreakdown[];
    monthlyTrend: HrTrendPoint[];
    recentRequests: Array<{
      id: string;
      title: string;
      providerName: string | null;
      status: ExternalLearningStatus;
      currentStage: ApprovalStage | null;
      cost: number;
      currency: string;
      startAt: string;
      endAt: string;
      employee: BasicUser;
      calendarConflict: boolean;
    }>;
  };
  approvals: {
    pendingCount: number;
    urgentCount: number;
    queue: Array<{
      id: string;
      requestId: string;
      title: string;
      employee: BasicUser;
      cost: number;
      currency: string;
      startAt: string;
      stage: ApprovalStage;
      createdAt: string;
    }>;
  };
  certificates: {
    uploaded: number;
    accepted: number;
    rejected: number;
    acceptanceRate: number;
    averageVerificationHours: number;
    urgentCount: number;
    pending: Array<{
      id: string;
      fileName: string;
      uploadedAt: string;
      owner: BasicUser;
      request: {
        id: string;
        title: string;
        startAt: string;
        endAt: string;
      } | null;
    }>;
    recentDecisions: Array<{
      id: string;
      fileName: string;
      status: CertificateStatus;
      verifiedAt: string | null;
      owner: BasicUser;
      request: {
        id: string;
        title: string;
        startAt: string;
        endAt: string;
      } | null;
    }>;
  };
  people: {
    topActiveEmployees: Array<{
      employeeId: string;
      fullName: string;
      department: string | null;
      internalEnrollments: number;
      activeRoutes: number;
      completedRoutes: number;
      certificates: number;
    }>;
  };
  notifications: {
    unreadCount: number;
    items: NotificationRecord[];
  };
  recommendations: HrRecommendation[];
};

export type TeamOverview = {
  teamSize: number;
  activeLearners: number;
  pendingApprovals: number;
  members: Array<
    BasicUser & {
      enrollments: number;
      externalRequests: number;
      certificates: number;
    }
  >;
};

export type LearningSummaryReport = {
  overview: AnalyticsOverview;
  roleCoverage: HrWorkspaceAnalytics['roleCoverage'];
  courses: HrWorkspaceAnalytics['coursePortfolio'];
  departments: HrDepartmentBreakdown[];
  people: HrWorkspaceAnalytics['people'];
  recommendations: HrRecommendation[];
};

export type ExternalLearningSummaryReport = {
  byStatus: ExternalLearningAnalytics['byStatus'];
  totalRequests: number;
  requestedBudget: number;
  approvedBudget: number;
  inReviewBudget: number;
  rejectedBudget: number;
  completionRate: number;
  calendarConflicts: number;
  pendingManager: number;
  pendingHr: number;
  averageManagerDecisionHours: number;
  averageHrDecisionHours: number;
  providerBreakdown: HrProviderBreakdown[];
  departmentBreakdown: HrDepartmentBreakdown[];
  monthlyTrend: HrTrendPoint[];
  approvals: HrWorkspaceAnalytics['approvals'];
  certificates: Omit<HrWorkspaceAnalytics['certificates'], 'pending' | 'recentDecisions'>;
  recommendations: HrRecommendation[];
};

export type ExportReportPayload = {
  reportType: 'learning-summary' | 'external-learning-summary';
  format?: 'json' | 'csv';
};

export type ExportReportResponse = {
  format: 'json' | 'csv';
  data: unknown;
};

export type CreateUserPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  position?: string;
  department?: string;
  outlookEmail?: string;
  managerId?: string;
  roleCodes?: RoleCode[];
};

export type CreateCoursePayload = {
  title: string;
  description?: string;
  type: CourseType;
  format: CourseFormat;
  durationHours?: number;
  trainerId?: string;
};

export type CreateExternalLearningRequestPayload = {
  title: string;
  courseUrl: string;
  providerName?: string;
  cost: number;
  currency?: string;
  startAt: string;
  endAt: string;
  program?: string;
  description?: string;
};

export type SubmitExternalLearningRequestPayload = {
  skipCalendarConflictWarning?: boolean;
};

export type EnrollCoursePayload = {
  sessionId?: string;
  userId?: string;
};

export type UpdateCourseEnrollmentPayload = {
  status?: EnrollmentStatus;
  progressPercent?: number;
  startedAt?: string | null;
  completedAt?: string | null;
};

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  accessToken?: string | null;
  body?: BodyInit | Record<string, unknown> | null;
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, query?: ApiRequestOptions['query']) {
  const base = API_BASE_URL.startsWith('http') ? API_BASE_URL : 'http://localhost';
  const prefix = API_BASE_URL.startsWith('http') ? '' : API_BASE_URL;
  const url = new URL(`${prefix}${path}`, base);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return API_BASE_URL.startsWith('http')
    ? url.toString()
    : `${prefix}${path}${url.search}`;
}

async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const accessToken = options.accessToken ?? getStoredAccessToken();
  const headers = new Headers(options.headers ?? {});
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (!isFormData && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(buildUrl(path, options.query), {
    ...options,
    headers,
    body:
      !options.body || isFormData || typeof options.body === 'string'
        ? (options.body as BodyInit | null | undefined)
        : JSON.stringify(options.body),
    cache: options.cache ?? 'no-store',
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;

    const message = Array.isArray(errorPayload?.message)
      ? errorPayload.message.join(', ')
      : errorPayload?.message;

    if (response.status === 401 || response.status === 403) {
      clearStoredAuthTokens();
    }

    throw new Error(message ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function persistAuthTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken);
}

export function clearStoredAuthTokens(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export async function getBackendHealth(): Promise<BackendHealthStatus> {
  try {
    const payload = await apiRequest<{
      status: string;
      service: string;
      timestamp: string;
    }>('/health', {
      method: 'GET',
    });

    return {
      status: payload.status === 'ok' ? 'online' : 'offline',
      service: payload.service,
      timestamp: payload.timestamp,
      url: API_BASE_URL,
    };
  } catch {
    return {
      status: 'offline',
      service: 'kontur-razvitiya-backend',
      url: API_BASE_URL,
    };
  }
}

export function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function getCurrentUser(accessToken: string): Promise<CurrentUserProfile | null> {
  try {
    return await apiRequest<CurrentUserProfile>('/users/me', {
      accessToken,
      method: 'GET',
    });
  } catch (error) {
    if (error instanceof Error && /status 401|status 403/i.test(error.message)) {
      clearStoredAuthTokens();
      return null;
    }

    throw error;
  }
}

export function getUsers(accessToken: string) {
  return apiRequest<CurrentUserProfile[]>('/users', {
    accessToken,
    method: 'GET',
  });
}

export function createUser(accessToken: string, payload: CreateUserPayload) {
  return apiRequest<CurrentUserProfile>('/users', {
    accessToken,
    method: 'POST',
    body: payload,
  });
}

export function getMyTeam(accessToken: string) {
  return apiRequest<CurrentUserProfile[]>('/users/me/team', {
    accessToken,
    method: 'GET',
  });
}

export function getCourses(accessToken: string) {
  return apiRequest<CourseRecord[]>('/courses', {
    accessToken,
    method: 'GET',
  });
}

export function getMyCourses(
  accessToken: string,
  query: {
    scope?: 'created' | 'trainer' | 'enrolled';
    type?: CourseType;
  } = {},
) {
  return apiRequest<CourseRecord[]>('/courses/mine', {
    accessToken,
    method: 'GET',
    query,
  });
}

export function getCourse(accessToken: string, id: string) {
  return apiRequest<CourseRecord>(`/courses/${id}`, {
    accessToken,
    method: 'GET',
  });
}

export function createCourse(accessToken: string, payload: CreateCoursePayload) {
  return apiRequest<CourseRecord>('/courses', {
    accessToken,
    method: 'POST',
    body: payload,
  });
}

export function publishCourse(accessToken: string, id: string) {
  return apiRequest<CourseRecord>(`/courses/${id}/publish`, {
    accessToken,
    method: 'POST',
  });
}

export function enrollCourse(accessToken: string, id: string, payload: EnrollCoursePayload = {}) {
  return apiRequest<CourseEnrollmentRecord>(`/courses/${id}/enroll`, {
    accessToken,
    method: 'POST',
    body: payload,
  });
}

export function getCourseParticipants(accessToken: string, id: string) {
  return apiRequest<CourseEnrollmentRecord[]>(`/courses/${id}/participants`, {
    accessToken,
    method: 'GET',
  });
}

export function updateCourseEnrollment(
  accessToken: string,
  id: string,
  payload: UpdateCourseEnrollmentPayload,
) {
  return apiRequest<CourseEnrollmentRecord>(`/course-enrollments/${id}`, {
    accessToken,
    method: 'PATCH',
    body: payload,
  });
}

export function getCorporatePrograms(accessToken: string) {
  return apiRequest<CourseRecord[]>('/corporate-university/programs', {
    accessToken,
    method: 'GET',
  });
}

export function createCorporateProgram(accessToken: string, payload: CreateCoursePayload) {
  return apiRequest<CourseRecord>('/corporate-university/programs', {
    accessToken,
    method: 'POST',
    body: payload,
  });
}

export function enrollCorporateProgram(
  accessToken: string,
  id: string,
  payload: EnrollCoursePayload = {},
) {
  return apiRequest<CourseEnrollmentRecord>(`/corporate-university/programs/${id}/enroll`, {
    accessToken,
    method: 'POST',
    body: payload,
  });
}

export function getMyExternalLearningRequests(accessToken: string) {
  return apiRequest<ExternalLearningRequestRecord[]>('/external-learning/requests/my', {
    accessToken,
    method: 'GET',
  });
}

export function getExternalLearningRequests(accessToken: string) {
  return apiRequest<ExternalLearningRequestRecord[]>('/external-learning/requests', {
    accessToken,
    method: 'GET',
  });
}

export function createExternalLearningRequest(
  accessToken: string,
  payload: CreateExternalLearningRequestPayload,
) {
  return apiRequest<ExternalLearningRequestRecord>('/external-learning/requests', {
    accessToken,
    method: 'POST',
    body: payload,
  });
}

export function submitExternalLearningRequest(
  accessToken: string,
  id: string,
  payload: SubmitExternalLearningRequestPayload = {},
) {
  return apiRequest<ExternalLearningRequestRecord>(`/external-learning/requests/${id}/submit`, {
    accessToken,
    method: 'POST',
    body: payload,
  });
}

export function checkExternalLearningRequestCalendar(accessToken: string, id: string) {
  return apiRequest<{
    hasConflict: boolean;
    conflicts: Array<{
      id: string;
      title: string;
      startAt: string;
      endAt: string;
    }>;
  }>(`/external-learning/requests/${id}/check-calendar`, {
    accessToken,
    method: 'POST',
  });
}

export function getPendingApprovals(accessToken: string) {
  return apiRequest<ApprovalRecord[]>('/approvals/pending', {
    accessToken,
    method: 'GET',
  });
}

export function approveApproval(accessToken: string, id: string, comment?: string) {
  return apiRequest<ApprovalRecord>(`/approvals/${id}/approve`, {
    accessToken,
    method: 'POST',
    body: { comment },
  });
}

export function rejectApproval(accessToken: string, id: string, comment?: string) {
  return apiRequest<ApprovalRecord>(`/approvals/${id}/reject`, {
    accessToken,
    method: 'POST',
    body: { comment },
  });
}

export function getMyCertificates(accessToken: string) {
  return apiRequest<CertificateRecord[]>('/certificates/my', {
    accessToken,
    method: 'GET',
  });
}

export function getCertificates(
  accessToken: string,
  query: {
    status?: CertificateStatus;
  } = {},
) {
  return apiRequest<CertificateRecord[]>('/certificates', {
    accessToken,
    method: 'GET',
    query,
  });
}

export function uploadCertificate(
  accessToken: string,
  payload: {
    externalLearningRequestId?: string;
    file: File;
  },
) {
  const formData = new FormData();
  formData.append('file', payload.file);

  if (payload.externalLearningRequestId) {
    formData.append('externalLearningRequestId', payload.externalLearningRequestId);
  }

  return apiRequest<CertificateRecord>('/certificates', {
    accessToken,
    method: 'POST',
    body: formData,
  });
}

export function verifyCertificate(accessToken: string, id: string) {
  return apiRequest<CertificateRecord>(`/certificates/${id}/verify`, {
    accessToken,
    method: 'PATCH',
  });
}

export function rejectCertificate(accessToken: string, id: string) {
  return apiRequest<CertificateRecord>(`/certificates/${id}/reject`, {
    accessToken,
    method: 'PATCH',
  });
}

export function getAnalyticsOverview(accessToken: string) {
  return apiRequest<AnalyticsOverview>('/analytics/overview', {
    accessToken,
    method: 'GET',
  });
}

export function getAnalyticsCourses(accessToken: string) {
  return apiRequest<CoursesAnalytics>('/analytics/courses', {
    accessToken,
    method: 'GET',
  });
}

export function getAnalyticsExternalLearning(accessToken: string) {
  return apiRequest<ExternalLearningAnalytics>('/analytics/external-learning', {
    accessToken,
    method: 'GET',
  });
}

export function getAnalyticsTeamOverview(accessToken: string) {
  return apiRequest<TeamOverview>('/analytics/team-overview', {
    accessToken,
    method: 'GET',
  });
}

export function getAnalyticsHrWorkspace(accessToken: string) {
  return apiRequest<HrWorkspaceAnalytics>('/analytics/hr-workspace', {
    accessToken,
    method: 'GET',
  });
}

export function getLearningSummaryReport(accessToken: string) {
  return apiRequest<LearningSummaryReport>('/reports/learning-summary', {
    accessToken,
    method: 'GET',
  });
}

export function getExternalLearningSummaryReport(accessToken: string) {
  return apiRequest<ExternalLearningSummaryReport>('/reports/external-learning-summary', {
    accessToken,
    method: 'GET',
  });
}

export function exportReport(accessToken: string, payload: ExportReportPayload) {
  return apiRequest<ExportReportResponse>('/reports/export', {
    accessToken,
    method: 'POST',
    body: payload,
  });
}
