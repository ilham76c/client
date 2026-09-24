// hooks/useInsiderActivity.ts
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { insiderApi } from '../api';

interface Params {
  offset: number;
  limit: number;
  action?: 'BUY' | 'SELL';
  ticker?: string;
}

export const useInsiderActivity = (params: Params) => {
  return useQuery({
    queryKey: ['insider-activity', params],
    queryFn: ({ signal }) => insiderApi.insiderActivity(params, signal),
    staleTime: 5 * 60 * 1000,
    select: (res) => res,
    placeholderData: keepPreviousData,
  });
};
