import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { insiderApi } from '../api';

interface Params {
  page: number;
  limit: number;
  action?: 'BUY' | 'SELL';
}

export const useGlobalInsiderActivity = (params: Params) => {
  return useQuery({
    queryKey: ['global-insider-activity', params],
    queryFn: ({ signal }) => insiderApi.globalActivity(params, signal),
    staleTime: 5 * 60 * 1000,
    select: (res) => res,
    placeholderData: keepPreviousData,
  });
};
