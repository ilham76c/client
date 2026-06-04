'use client';

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '../api/client';

/**
 * Custom hook for GET requests with React Query
 */
export const useFetch = <T,>(
  key: (string | unknown)[],
  url: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiClient.get<T>(url),
    ...options,
  });
};

/**
 * Custom hook for POST requests
 */
export const usePost = <T, D,>(
  options?: Omit<UseMutationOptions<T, Error, D>, 'mutationFn'>
) => {
  return useMutation<T, Error, D>({
    ...options,
  });
};

/**
 * Custom hook for PUT requests
 */
export const usePut = <T, D,>(
  options?: Omit<UseMutationOptions<T, Error, D>, 'mutationFn'>
) => {
  return useMutation<T, Error, D>({
    ...options,
  });
};

/**
 * Custom hook for DELETE requests
 */
export const useDelete = <T,>(
  options?: Omit<UseMutationOptions<T, Error, string>, 'mutationFn'>
) => {
  return useMutation<T, Error, string>({
    ...options,
  });
};