export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

export const ACCESS_TOKEN_STORAGE_KEY = 'kontur.accessToken';
export const REFRESH_TOKEN_STORAGE_KEY = 'kontur.refreshToken';

export type AuthenticatedUser = {
  id: string;
  email: string;
  roles: string[];
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

export type CurrentUserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string | null;
  department: string | null;
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
  roles: string[];
};

export type BackendHealthStatus = {
  status: 'online' | 'offline';
  service: string;
  timestamp?: string;
  url: string;
};

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
    const response = await fetch(`${API_BASE_URL}/health`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    const payload = (await response.json()) as {
      status: string;
      service: string;
      timestamp: string;
    };

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

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;

    const message = Array.isArray(errorPayload?.message)
      ? errorPayload.message.join(', ')
      : errorPayload?.message;

    throw new Error(message ?? `Registration failed with status ${response.status}`);
  }

  return (await response.json()) as AuthResponse;
}

export async function loginUser(payload: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;

    const message = Array.isArray(errorPayload?.message)
      ? errorPayload.message.join(', ')
      : errorPayload?.message;

    throw new Error(message ?? `Login failed with status ${response.status}`);
  }

  return (await response.json()) as AuthResponse;
}

export async function getCurrentUser(accessToken: string): Promise<CurrentUserProfile | null> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (response.status === 401 || response.status === 403) {
    clearStoredAuthTokens();
    return null;
  }

  if (!response.ok) {
    throw new Error(`Current user request failed with status ${response.status}`);
  }

  return (await response.json()) as CurrentUserProfile;
}
