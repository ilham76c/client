import { apiGet } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export interface DashboardSummary {
  totalInvestors: number;
  totalCapital: number;
  activeCompanies: number;
  portfolioValue: number;
}

export interface DashboardStats {
  timestamp: string;
  value: number;
}

export const dashboardApi = {
  getSummary: () => apiGet<DashboardSummary>(API_ENDPOINTS.dashboard.summary),
  getStats: () => apiGet<DashboardStats[]>(API_ENDPOINTS.dashboard.stats),
};
