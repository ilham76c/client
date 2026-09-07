// hooks/useForeignFlow.ts
import { useQuery } from '@tanstack/react-query';
import { marketApi } from '../api';

export const useForeignFlow = (date: string = 'latest') => {
  return useQuery({
    queryKey: ['foreign-flow', date],
    queryFn: ({ signal }) => marketApi.fetchForeignFlow(date, signal),
    enabled: !!date,
    staleTime: 60 * 1000, // 1 minute — price data changes more often
    select: (res) => res.data,
  });
};
