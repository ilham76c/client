'use client';

import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api';
import { LoginRequest } from '@/lib/types';

/**
 * Hook for login mutation
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
  });
};