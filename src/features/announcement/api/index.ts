import { apiGet } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';

import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  AnnouncementAnalysisResponse,
  AnnouncementListResponse,
} from '../types';

export const announcementApi = {
  /** Get list, optionally filtered by ticker */
  list: async (ticker?: string) => {
    return apiGet<ApiResponse<AnnouncementListResponse>>(
      ticker
        ? API_ENDPOINTS.announcements.byTicker(ticker)
        : API_ENDPOINTS.announcements.list,
    );
  },

  /** Get full analysis detail by announcement uuid */
  analysis: async (announcement_uuid: string) =>
    apiGet<ApiResponse<AnnouncementAnalysisResponse>>(
      API_ENDPOINTS.announcements.analysis(announcement_uuid),
    ),
};
