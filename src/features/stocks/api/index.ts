import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/client';
import type { ApiResponse } from '@/lib/api/types';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { PaginatedResponse, PaginationParams } from '@/lib/types';
import type {
  Emiten,
  EmitenProfile,
  PriceQueryParams,
  PriceData,
  EmitenList,
} from '../types';

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
    return apiGet<PaginatedResponse<Ownership>>(
      API_ENDPOINTS.ownership.list + query,
    );
  },
  detail: (id: string) => apiGet<Ownership>(API_ENDPOINTS.ownership.detail(id)),
  create: (data: Omit<Ownership, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiPost<Ownership>(API_ENDPOINTS.ownership.create, data),
  update: (id: string, data: Partial<Ownership>) =>
    apiPut<Ownership>(API_ENDPOINTS.ownership.update(id), data),
  delete: (id: string) => apiDelete(API_ENDPOINTS.ownership.delete(id)),
};

export const emitenApi = {
  /** Search emitens by ticker or name */
  search: (query: string, signal?: AbortSignal) =>
    apiGet<ApiResponse<EmitenList>>(
      `${API_ENDPOINTS.emiten.search}?q=${encodeURIComponent(query)}`,
      { signal },
    ),

  /** Get a single emiten's ticker + name by ticker code */
  detail: (ticker: string, signal?: AbortSignal) =>
    apiGet<ApiResponse<Emiten>>(API_ENDPOINTS.emiten.detail(ticker), {
      signal,
    }),

  /** Get a single emiten's full profile (contact, sector, listing info) */
  profile: (ticker: string, signal?: AbortSignal) =>
    apiGet<ApiResponse<EmitenProfile>>(API_ENDPOINTS.emiten.profile(ticker), {
      signal,
    }),

  /** Get historical closing price series for an emiten */
  prices: (ticker: string, params?: PriceQueryParams, signal?: AbortSignal) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined && v !== '')
        .map(([k, v]) => [k, String(v)]),
    ).toString();

    return apiGet<ApiResponse<PriceData>>(
      `${API_ENDPOINTS.emiten.prices(ticker)}${query ? `?${query}` : ''}`,
      { signal },
    );
  },
};
