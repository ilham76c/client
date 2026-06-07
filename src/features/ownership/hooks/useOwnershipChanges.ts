'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api/client';
import { OwnershipData, OwnershipQueryParams } from '@/features/ownership/types';

interface ApiResponse<T> {
  data: T;
  meta?: {
    count?: number;
    limit?: number;
    offset?: number;
    total?: number;
  };
}

function buildQueryString(params: OwnershipQueryParams): string {
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => [k, String(v)])
  ).toString();
}

function useOwnershipData(endpoint: string, params: OwnershipQueryParams) {
  const [data, setData] = useState<OwnershipData | null>(null);
  const [meta, setMeta] = useState<ApiResponse<unknown>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const qs = buildQueryString(params);
        const res = await apiFetch<ApiResponse<OwnershipData>>(`${endpoint}?${qs}`);
        if (!cancelled) {
          setData(res.data);
          setMeta(res.meta);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), endpoint]);

  return { data, meta, loading, error };
}

export function useOwnershipChanges(params: OwnershipQueryParams) {
  return useOwnershipData('/api/v1/ownership/changes', params);
}

export function useOwnershipMonthlyChanges(params: OwnershipQueryParams) {
  return useOwnershipData('/api/v1/ownership/monthly/changes', params);
}
