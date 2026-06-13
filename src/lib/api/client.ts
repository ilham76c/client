/**
 * Core API fetch utility
 * Single source of truth for all HTTP requests
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || '';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${API_VERSION}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

/** Typed GET helper */
export const apiGet = <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => apiFetch<T>(endpoint, options);

/** Typed POST helper */
export const apiPost = <T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit,
): Promise<T> =>
  apiFetch<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });

/** Typed PUT helper */
export const apiPut = <T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit,
): Promise<T> =>
  apiFetch<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });

/** Typed DELETE helper */
export const apiDelete = <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => apiFetch<T>(endpoint, { method: 'DELETE', ...options });
