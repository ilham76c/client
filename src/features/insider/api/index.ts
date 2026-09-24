import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { InsiderActivityResponse } from '../types';

interface Params {
  page: number;
  limit: number;
  action?: 'BUY' | 'SELL';
}

export const insiderApi = {
  globalActivity: ({ page, limit, action }: Params, signal?: AbortSignal) => {
    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });

    if (action) params.set('action', action);

    return apiGet<ApiResponse<InsiderActivityResponse>>(
      API_ENDPOINTS.insider.globalActivity + `?${params.toString()}`,
      {
        signal,
      },
    );
  },
};
