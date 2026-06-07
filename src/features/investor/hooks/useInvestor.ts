'use client';

import { useQuery } from '@tanstack/react-query';
import { investorApi, fetchInvestorDetails } from '../api';
import { PaginationParams } from '@/lib/types';

/** Hook for fetching paginated investor list */
export const useInvestors = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['investors', params],
    queryFn: () => investorApi.list(params),
  });
};

/** Hook for fetching a single investor by id */
export const useInvestorDetail = (id: string) => {
  return useQuery({
    queryKey: ['investor', id],
    queryFn: () => investorApi.detail(id),
    enabled: !!id,
  });
};

/** Hook for fetching full investor details (summary + holdings) */
export const useInvestorDetails = (uuid: string | null) => {
  return useQuery({
    queryKey: ['investor-details', uuid],
    queryFn: () => fetchInvestorDetails(uuid!),
    enabled: !!uuid,
  });
};
