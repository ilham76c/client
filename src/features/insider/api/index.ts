import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { InsiderActivityResponse, EmitenList } from '../types';

interface Params {
  offset: number;
  limit: number;
  action?: 'BUY' | 'SELL';
  ticker?: string;
}

export const insiderApi = {
  globalActivity: (params: Params, signal?: AbortSignal) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)]),
    ).toString();

    return apiGet<ApiResponse<InsiderActivityResponse>>(
      API_ENDPOINTS.insider.globalActivity + `?${query}`,
      {
        signal,
      },
    );
  },
};

export const emitenApi = {
  /** Search emitens by ticker or name */
  search: (query: string, signal?: AbortSignal) =>
    apiGet<ApiResponse<EmitenList>>(
      `${API_ENDPOINTS.emiten.search}?q=${encodeURIComponent(query)}`,
      { signal },
    ),
};
