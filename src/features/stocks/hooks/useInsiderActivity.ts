// hooks/useInsiderActivity.ts
import { useQuery } from '@tanstack/react-query';
import type { InsiderActivityResponse } from '../types';
import { insiderApi } from '../api';

async function fetchInsiderActivity(
  emitenUid: string,
): Promise<InsiderActivityResponse> {
  const res = await fetch(`/api/v1/insider/${emitenUid}`);
  if (!res.ok) throw new Error('Gagal memuat data insider activity');
  const json = await res.json();
  return json.data ?? json;
}

export function useInsiderActivity(ticker: string) {
  return useQuery({
    queryKey: ['insider-activity', ticker],
    queryFn: () => insiderApi.insiderActivity(ticker),
    enabled: !!ticker,
    select: (res) => res.data,
  });
}
