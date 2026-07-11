'use client';

import { useQuery } from '@tanstack/react-query';
import { announcementApi } from '../api';

/** Hook for announcement list, optionally filtered by ticker */
export const useAnnouncements = (ticker?: string) => {
  return useQuery({
    queryKey: ['announcements', ticker],
    queryFn: () => announcementApi.list(ticker),
    select: (res) => res.data,
  });
};

/** Hook for single announcement detail */
export const useAnnouncementAnalysis = (announcementUuid: string) => {
  return useQuery({
    queryKey: ['announcement', 'analysis', announcementUuid],
    queryFn: () => announcementApi.analysis(announcementUuid),
    enabled: !!announcementUuid,
    select: (res) => res.data,
  });
};
