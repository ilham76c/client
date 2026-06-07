'use client';

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiFetch } from '../api/client';

/**
 * Generic GET hook using React Query
 */
export const useFetch = <T,>(
  key: (string | unknown)[],
  url: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiFetch<T>(url),
    ...options,
  });
};

/**
 * Generic mutation hook for POST/PUT/DELETE
 */
export const useMutate = <T, D = unknown>(
  mutationFn: (data: D) => Promise<T>,
  options?: Omit<UseMutationOptions<T, Error, D>, 'mutationFn'>
) => {
  return useMutation<T, Error, D>({
    mutationFn,
    ...options,
  });
};
