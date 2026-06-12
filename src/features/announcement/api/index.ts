import { apiGet } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { DUMMY_ANNOUNCEMENTS, DUMMY_DETAILS } from '../data/dummy';
import type { AnnouncementAnalysis, AnnouncementListItem } from '../types';

const USE_DUMMY = process.env.NEXT_PUBLIC_USE_DUMMY === 'true'
  || process.env.NODE_ENV === 'development';

export const announcementApi = {
  /** Get list, optionally filtered by ticker */
  list: async (ticker?: string): Promise<{ data: AnnouncementListItem[]; total: number }> => {
    if (USE_DUMMY) {
      const data = ticker
        ? DUMMY_ANNOUNCEMENTS.filter((a) => a.ticker === ticker.toUpperCase())
        : DUMMY_ANNOUNCEMENTS;
      return { data, total: data.length };
    }
    return apiGet(
      ticker
        ? API_ENDPOINTS.announcement.byTicker(ticker)
        : API_ENDPOINTS.announcement.list
    );
  },

  /** Get full analysis detail by id */
  detail: async (id: string): Promise<{ data: AnnouncementAnalysis }> => {
    if (USE_DUMMY) {
      const data = DUMMY_DETAILS[id];
      if (!data) throw new Error(`Announcement ${id} not found`);
      return { data };
    }
    return apiGet(API_ENDPOINTS.announcement.detail(id));
  },
};
