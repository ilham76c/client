/**
 * Core API fetch utility
 * All requests go through Next.js BFF.
 */

import { signOut } from 'next-auth/react';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`/api/backend${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      await signOut({
        callbackUrl: '/login',
      });
    }

    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

export const apiGet = <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => apiFetch<T>(endpoint, options);

export const apiPost = <T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit,
): Promise<T> =>
  apiFetch<T>(endpoint, {
    method: 'POST',
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...options,
  });

export const apiPut = <T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit,
): Promise<T> =>
  apiFetch<T>(endpoint, {
    method: 'PUT',
    body: data !== undefined ? JSON.stringify(data) : undefined,
    ...options,
  });

export const apiDelete = <T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => apiFetch<T>(endpoint, { method: 'DELETE', ...options });
