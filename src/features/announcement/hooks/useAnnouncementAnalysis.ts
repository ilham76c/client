'use client';

import { useQuery } from '@tanstack/react-query';
import { announcementApi } from '../api';

/** Hook for announcement list, optionally filtered by ticker */
export const useAnnouncements = (ticker?: string) => {
  return useQuery({
    queryKey: ['announcements', ticker ?? 'all'],
    queryFn: () => announcementApi.list(ticker),
  });
};

/** Hook for single announcement detail */
export const useAnnouncementDetail = (id: string | null) => {
  return useQuery({
    queryKey: ['announcement', id],
    queryFn: () => announcementApi.detail(id!),
    enabled: !!id,
  });
};
