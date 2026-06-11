import { apiGet, apiPost, apiPut, apiDelete, apiFetch } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { PaginatedResponse, PaginationParams } from '@/lib/types';
import type { Emiten } from '../types';

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

export const ownershipApi = {
  list: (params?: PaginationParams) => {
    const query = params ? `?page=${params.page}&limit=${params.limit}` : '';
    return apiGet<PaginatedResponse<Ownership>>(API_ENDPOINTS.ownership.list + query);
  },
  detail: (id: string) =>
    apiGet<Ownership>(API_ENDPOINTS.ownership.detail(id)),
  create: (data: Omit<Ownership, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiPost<Ownership>(API_ENDPOINTS.ownership.create, data),
  update: (id: string, data: Partial<Ownership>) =>
    apiPut<Ownership>(API_ENDPOINTS.ownership.update(id), data),
  delete: (id: string) =>
    apiDelete(API_ENDPOINTS.ownership.delete(id)),
};

/** Search emitens by ticker or name */
export const searchEmitens = (query: string, signal?: AbortSignal) =>
  apiFetch<{ data: Emiten[] }>(
    `/emiten/search?q=${encodeURIComponent(query)}`,
    { signal }
  );