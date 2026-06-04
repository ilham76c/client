import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { PaginatedResponse, PaginationParams } from '@/lib/types';

export interface Ownership {
  id: string;
  investorId: string;
  companyName: string;
  ownershipPercentage: number;
  sharesCount: number;
  sharePrice: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Ownership API functions
 */
export const ownershipApi = {
  list: (params?: PaginationParams) => {
    const query = params ? `?page=${params.page}&limit=${params.limit}` : '';
    return apiClient.get<PaginatedResponse<Ownership>>(API_ENDPOINTS.ownership.list + query);
  },

  detail: (id: string) => apiClient.get<Ownership>(API_ENDPOINTS.ownership.detail(id)),

  create: (data: Omit<Ownership, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<Ownership>(API_ENDPOINTS.ownership.create, data),

  update: (id: string, data: Partial<Ownership>) =>
    apiClient.put<Ownership>(API_ENDPOINTS.ownership.update(id), data),

  delete: (id: string) => apiClient.delete(API_ENDPOINTS.ownership.delete(id)),
};