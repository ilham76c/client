'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { investorApi, fetchInvestorDetails, searchInvestors } from '../api';
import type { SearchInvestor } from '../types';
import { PaginationParams } from '@/lib/types';

/** Hook for paginated investor list */
export const useInvestors = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['investors', params],
    queryFn: () => investorApi.list(params),
  });
};

/** Hook for a single investor by id */
export const useInvestorDetail = (id: string) => {
  return useQuery({
    queryKey: ['investor', id],
    queryFn: () => investorApi.detail(id),
    enabled: !!id,
  });
};

/** Hook for full investor details (summary + holdings) */
export const useInvestorDetails = (uuid: string | null) => {
  return useQuery({
    queryKey: ['investor-details', uuid],
    queryFn: () => fetchInvestorDetails(uuid!),
    enabled: !!uuid,
  });
};

/**
 * Hook for debounced investor search with abort support.
 *
 * Exposes two separate values:
 * - `inputValue` — what is shown in the input (controlled by the component)
 * - `setQuery`   — triggers the actual search (only called on user keystroke, not on select)
 */
export const useInvestorSearch = (debounceMs = 400) => {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchInvestor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      try {
        const res = await searchInvestors(query, controllerRef.current.signal);
        setResults(res.data.investors ?? []);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controllerRef.current?.abort();
    };
  }, [query, debounceMs]);

  /** Called on user keystroke — updates both display value and search query */
  const handleChange = (value: string) => {
    setInputValue(value);
    setQuery(value);
  };

  /** Called on investor selected — updates display value only, does NOT trigger search */
  const handleSelect = (investor: SearchInvestor) => {
    setInputValue(investor.name);
    setQuery(''); // clears search without showing investor.name as a query
    setResults([]);
    setLoading(false);
  };

  return { inputValue, handleChange, handleSelect, results, loading, error };
};

export const useInvestorHoldings = (investorUid: string | null) => {
  return useQuery({
    queryKey: ['investor-holdings', investorUid],
    queryFn: () => investorApi.holdings(investorUid!),
    enabled: !!investorUid,
    select: (res) => res.data,
  });
};
