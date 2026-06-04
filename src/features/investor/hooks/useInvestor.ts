'use client';

import { useQuery } from '@tanstack/react-query';
import { investorApi } from '../api';
import { PaginationParams } from '@/lib/types';

/**
 * Hook for fetching investor list
 */
export const useInvestors = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['investors', params],
    queryFn: () => investorApi.list(params),
  });
};

/**
 * Hook for fetching single investor detail
 */
export const useInvestorDetail = (id: string) => {
  return useQuery({
    queryKey: ['investor', id],
    queryFn: () => investorApi.detail(id),
    enabled: !!id,
  });
};