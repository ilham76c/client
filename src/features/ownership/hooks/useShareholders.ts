'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api/client';
import { ShareholderData } from '@/features/ownership/types';

interface ApiResponse<T> {
  data: T;
  meta?: {
    count?: number;
    limit?: number;
    offset?: number;
    total?: number;
  };
}

export function useShareholders({ ticker }: { ticker: string }) {
  const [data, setData] = useState<ShareholderData | null>(null);
  const [meta, setMeta] = useState<ApiResponse<unknown>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<ApiResponse<ShareholderData>>(
          `/api/v1/idx/emitens/${ticker}/shareholders`
        );
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
  }, [ticker]);

  return { data, meta, loading, error };
}
