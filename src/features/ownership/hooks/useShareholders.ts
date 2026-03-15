'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { ShareholderData } from '@/features/ownership/types';

type ApiResponse<T> = {
  data: T;
  meta?: {
    count?: number;
    limit?: number;
    offset?: number;
    total?: number;
  };
};

export function useShareholders({ ticker }: { ticker: string }) {
  const [data, setData] = useState<ShareholderData | null>(null);
  const [meta, setMeta] = useState<ApiResponse<any>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await apiFetch<ApiResponse<ShareholderData>>(
          `/api/v1/idx/emitens/${ticker}/shareholders`,
        );

        setData(res.data);
        setMeta(res.meta);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  return { data, meta, loading, error };
}
