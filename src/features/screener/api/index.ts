import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import type { VolumeSpikeResponse } from '../types';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export const screenerApi = {
  fetchVolumeSpikes: (params?: object, signal?: AbortSignal) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)]),
    ).toString();

    return apiGet<ApiResponse<VolumeSpikeResponse>>(
      `${API_ENDPOINTS.market.volumeSpikes}${query ? `?${query}` : ''}`,
      { signal },
    );
  },
};
