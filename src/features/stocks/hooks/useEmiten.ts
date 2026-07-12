'use client';

import { useQuery } from '@tanstack/react-query';
import {
  emitenApi,
} from '../api';
import type { PriceQueryParams } from '../types';

/**
 * Hook for fetching a single emiten's ticker + name.
 * Cached per ticker via react-query — safe to call from multiple
 * components (e.g. page header + tabs) without duplicate requests.
 */
export const useEmitenDetail = (ticker: string) => {
  return useQuery({
    queryKey: ['emiten-detail', ticker],
    queryFn: ({ signal }) => emitenApi.detail(ticker, signal),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000, // 5 minutes — ticker/name rarely changes
    select: (res) => res.data,
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
    queryFn: ({ signal }) => emitenApi.profile(ticker, signal),
    enabled: !!ticker,
    staleTime: 5 * 60 * 1000, // 5 minutes — ticker/name rarely changes
    select: (res) => res.data,
  });
};

/** Hook for fetching historical closing price series */
export const useEmitenPrices = (ticker: string, params?: PriceQueryParams) => {
  return useQuery({
    queryKey: ['emiten-prices', ticker, params],
    queryFn: ({ signal }) => emitenApi.prices(ticker, params, signal),
    enabled: !!ticker,
    staleTime: 60 * 1000, // 1 minute — price data changes more often
    select: (res) => res.data,
  });
};

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