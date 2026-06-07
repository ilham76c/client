import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
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

export const financialsApi = {
  list: (params?: PaginationParams) => {
    const query = params ? `?page=${params.page}&limit=${params.limit}` : '';
    return apiGet<PaginatedResponse<Financial>>(API_ENDPOINTS.financials.list + query);
  },
  detail: (id: string) =>
    apiGet<Financial>(API_ENDPOINTS.financials.detail(id)),
  create: (data: Omit<Financial, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiPost<Financial>(API_ENDPOINTS.financials.create, data),
  update: (id: string, data: Partial<Financial>) =>
    apiPut<Financial>(API_ENDPOINTS.financials.update(id), data),
  delete: (id: string) =>
    apiDelete(API_ENDPOINTS.financials.delete(id)),
  getReport: (id: string) =>
    apiGet<{ data: unknown }>(API_ENDPOINTS.financials.report(id)),
};
