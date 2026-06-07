'use client';

import { useCallback } from 'react';
import { User } from '../types';

/**
 * Auth hook using localStorage token (matches apiFetch approach)
 */
export const useAuth = () => {
  const getUser = useCallback((): User | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }, []);

  const user = getUser();
  const isAuthenticated = !!localStorage.getItem('access_token');

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }, []);

  return {
    user,
    isAuthenticated,
    logout,
  };
};
