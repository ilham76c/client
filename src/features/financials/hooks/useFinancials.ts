'use client';

import { useQuery } from '@tanstack/react-query';
import { financialsApi } from '../api';
import { PaginationParams } from '@/lib/types';

/**
 * Hook for fetching financials list
 */
export const useFinancials = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['financials', params],
    queryFn: () => financialsApi.list(params),
  });
};

/**
 * Hook for fetching single financial detail
 */
export const useFinancialDetail = (id: string) => {
  return useQuery({
    queryKey: ['financial', id],
    queryFn: () => financialsApi.detail(id),
    enabled: !!id,
  });
};