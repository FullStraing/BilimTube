export class ApiError extends Error {
  status: number;
  info?: unknown;

  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

function resolveApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

  if (!baseUrl) {
    return '';
  }

  if (typeof window !== 'undefined') {
    try {
      const url = new URL(baseUrl, window.location.origin);
      if (
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1' &&
        (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
      ) {
        return '';
      }
    } catch {
      return '';
    }
  }

  return baseUrl;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${resolveApiBaseUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError('Request failed', res.status, data);
  }

  return data as T;
}

