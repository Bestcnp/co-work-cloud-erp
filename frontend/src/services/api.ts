/**
 * Centralized API Client
 *
 * Typed HTTP client with automatic auth token injection.
 * All API calls go through this service — no inline fetch() in components.
 */

import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface ApiError {
  error: string;
  message: string;
}

class ApiRequestError extends Error {
  status: number;
  body: ApiError;

  constructor(status: number, body: ApiError) {
    super(body.message || `API Error: ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let body: ApiError;
    try {
      body = await response.json();
    } catch {
      body = { error: 'UNKNOWN', message: response.statusText };
    }
    throw new ApiRequestError(response.status, body);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),

  post: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),

  /** Health check */
  health: () =>
    apiRequest<{ status: string; timestamp: string }>('/health'),

  /** Hermes AI connectivity check */
  hermesStatus: () =>
    apiRequest<{ connected: boolean; models: string[]; error?: string }>(
      '/health/hermes',
    ),
};

export { ApiRequestError };
