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
import { useEffect, useRef, useState } from 'react';
import { searchEmitens } from '../api';
import type { Emiten } from '../types';

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