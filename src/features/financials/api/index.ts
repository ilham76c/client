import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { PaginatedResponse, PaginationParams } from '@/lib/types';

export interface Financial {
  id: string;
  companyName: string;
  revenue: number;
  expense: number;
  profit: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Financials API functions
 */
export const financialsApi = {
  list: (params?: PaginationParams) => {
    const query = params ? `?page=${params.page}&limit=${params.limit}` : '';
    return apiClient.get<PaginatedResponse<Financial>>(API_ENDPOINTS.financials.list + query);
  },

  detail: (id: string) => apiClient.get<Financial>(API_ENDPOINTS.financials.detail(id)),

  create: (data: Omit<Financial, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Financial>(API_ENDPOINTS.financials.create, data),

  update: (id: string, data: Partial<Financial>) =>
    apiClient.put<Financial>(API_ENDPOINTS.financials.update(id), data),

  delete: (id: string) => apiClient.delete(API_ENDPOINTS.financials.delete(id)),

  getReport: (id: string) =>
    apiClient.get<{ data: unknown }>(API_ENDPOINTS.financials.report(id)),
};