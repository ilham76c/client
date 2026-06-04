'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api';

/**
 * Hook for fetching dashboard data
 */
export const useDashboard = () => {
  const summaryQuery = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardApi.getSummary(),
  });

  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats(),
  });

  return {
    summary: summaryQuery.data,
    stats: statsQuery.data,
    isLoading: summaryQuery.isLoading || statsQuery.isLoading,
    error: summaryQuery.error || statsQuery.error,
  };
};