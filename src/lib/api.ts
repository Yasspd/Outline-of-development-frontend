export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? '/api';

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

export type BackendHealthStatus = {
  status: 'online' | 'offline';
  service: string;
  timestamp?: string;
  url: string;
};

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
