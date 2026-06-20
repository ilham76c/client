'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getEmitenDetail,
  searchEmitens,
  getEmitenProfile,
  getEmitenPrices,
} from '../api';
import type { Emiten, PriceQueryParams } from '../types';

/**
 * Hook for fetching a single emiten's ticker + name.
 * Cached per ticker via react-query — safe to call from multiple
 * components (e.g. page header + tabs) without duplicate requests.
 */
export const useEmitenDetail = (ticker: string) => {
  return useQuery({
    queryKey: ['emiten-detail', ticker],
    queryFn: ({ signal }) => getEmitenDetail(ticker, signal),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000, // 5 minutes — ticker/name rarely changes
  });
};

/**
 * Hook for fetching full company profile (contact, sector, listing info).
 * Cached separately from useEmitenDetail since it carries more data
 * and is only needed by the Profile tab.
 */
export const useEmitenProfile = (ticker: string) => {
  return useQuery({
    queryKey: ['emiten-profile', ticker],
    queryFn: ({ signal }) => getEmitenProfile(ticker, signal),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000, // 5 minutes — ticker/name rarely changes
  });
};

/** Hook for fetching historical closing price series */
export const useEmitenPrices = (ticker: string, params?: PriceQueryParams) => {
  return useQuery({
    queryKey: ['emiten-prices', ticker, params],
    queryFn: ({ signal }) => getEmitenPrices(ticker, params, signal),
    enabled: !!ticker,
    staleTime: 60 * 1000, // 1 minute — price data changes more often
  });
};

/**
 * Hook for debounced emiten search with abort support.
 * Separates inputValue (display) from query (search trigger)
 * to prevent dropdown re-appearing after selection.
 */
export const useEmitenSearch = (debounceMs = 300) => {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Emiten[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query || query.length < 4) {
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
        const res = await searchEmitens(query, controllerRef.current.signal);
        setResults(res.data.emitens ?? []);
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

  /** Called on user keystroke */
  const handleChange = (value: string) => {
    setInputValue(value);
    setQuery(value);
  };

  /** Called on emiten selected — updates display only, does NOT trigger search */
  const handleSelect = (emiten: Emiten) => {
    setInputValue(`${emiten.ticker} – ${emiten.name}`);
    setQuery('');
    setResults([]);
    setLoading(false);
  };

  return { inputValue, handleChange, handleSelect, results, loading, error };
};
