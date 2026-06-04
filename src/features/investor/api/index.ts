import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { PaginatedResponse, PaginationParams } from '@/lib/types';

export interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  investmentAmount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

/**
 * Investor API functions
 */
export const investorApi = {
  list: (params?: PaginationParams) => {
    const query = params ? `?page=${params.page}&limit=${params.limit}` : '';
    return apiClient.get<PaginatedResponse<Investor>>(API_ENDPOINTS.investor.list + query);
  },

  detail: (id: string) => apiClient.get<Investor>(API_ENDPOINTS.investor.detail(id)),

  create: (data: Omit<Investor, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Investor>(API_ENDPOINTS.investor.create, data),

  update: (id: string, data: Partial<Investor>) =>
    apiClient.put<Investor>(API_ENDPOINTS.investor.update(id), data),

  delete: (id: string) => apiClient.delete(API_ENDPOINTS.investor.delete(id)),

  getPortfolio: (id: string) =>
    apiClient.get<{ portfolio: unknown }>(API_ENDPOINTS.investor.portfolio(id)),
};