'use client';

import { useQuery } from '@tanstack/react-query';
import { ownershipApi } from '../api';
import { PaginationParams } from '@/lib/types';

/**
 * Hook for fetching ownership list
 */
export const useOwnership = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['ownership', params],
    queryFn: () => ownershipApi.list(params),
  });
};

/**
 * Hook for fetching single ownership detail
 */
export const useOwnershipDetail = (id: string) => {
  return useQuery({
    queryKey: ['ownership', id],
    queryFn: () => ownershipApi.detail(id),
    enabled: !!id,
  });
};
