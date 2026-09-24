'use client';

import { useQuery } from '@tanstack/react-query';
import { emitenApi } from '../api';

/**
 * Hook for debounced emiten search with abort support.
 * Separates inputValue (display) from query (search trigger)
 * to prevent dropdown re-appearing after selection.
 */
export const useEmitenSearch = (query: string) => {
  return useQuery({
    queryKey: ['emitens', query],
    queryFn: ({ signal }) => emitenApi.search(query, signal),
    enabled: query.length >= 4,
    staleTime: 1000 * 60 * 5,
    select: (res) => res.data,
  });
};
