export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? '/api';

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
