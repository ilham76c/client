import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

interface DashboardSummary {
  totalInvestors: number;
  totalCapital: number;
  activeCompanies: number;
  portfolioValue: number;
}

interface DashboardStats {
  timestamp: string;
  value: number;
}

/**
 * Dashboard API functions
 */
export const dashboardApi = {
  getSummary: () => apiClient.get<DashboardSummary>(API_ENDPOINTS.dashboard.summary),

  getStats: () => apiClient.get<DashboardStats[]>(API_ENDPOINTS.dashboard.stats),
};