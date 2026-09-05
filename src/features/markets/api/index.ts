import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { ForeignFlowResponse } from '../types';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export const marketApi = {
  fetchForeignFlow: (date?: string, signal?: AbortSignal) => {
    const query = new URLSearchParams();
    if (date) query.set('date', date);

    return apiGet<ApiResponse<ForeignFlowResponse>>(
      `${API_ENDPOINTS.market.foreignFlow}${query ? `?${query}` : ''}`,
      { signal },
    );
  },
};
