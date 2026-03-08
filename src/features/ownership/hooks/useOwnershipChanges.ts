'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import {
  OwnershipData,
  OwnershipRow,
  OwnershipQueryParams,
} from '@/features/ownership/types';

type ApiResponse<T> = {
  data: T;
  meta?: {
    count?: number;
    limit?: number;
    offset?: number;
    total?: number;
  };
};

export function useOwnershipChanges(params: OwnershipQueryParams) {
  const [data, setData] = useState<OwnershipRow[]>([]);
  const [meta, setMeta] = useState<ApiResponse<any>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ BUILD QUERY STRING DI SINI
        const qs = new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== '')
            .map(([k, v]) => [k, String(v)]),
        ).toString();

        const res = await apiFetch<ApiResponse<OwnershipRow[]>>(
          `/api/v1/ownership/changes?${qs}`,
        );

        // ✅ UNWRAP RESPONSE
        setData(res.data);
        setMeta(res.meta);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(params)]);

  return { data, meta, loading, error };
}

export function useOwnershipMonthlyChanges(params: OwnershipQueryParams) {
  const [data, setData] = useState<OwnershipData>(null);
  const [meta, setMeta] = useState<ApiResponse<any>['meta'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const qs = new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== '')
            .map(([k, v]) => [k, String(v)]),
        ).toString();

        const res = await apiFetch<ApiResponse<OwnershipData>>(
          `/api/v1/ownership/monthly/changes?${qs}`,
        );

        // ✅ UNWRAP RESPONSE
        setData(res.data);
        setMeta(res.meta);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(params)]);

  return { data, meta, loading, error };
}
