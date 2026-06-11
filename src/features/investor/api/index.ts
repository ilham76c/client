import { apiGet, apiPost, apiPut, apiDelete, apiFetch } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { PaginatedResponse, PaginationParams } from '@/lib/types';
import type { InvestorDetailsApiResponse, SearchInvestor } from '../types';

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

export const investorApi = {
  list: (params?: PaginationParams) => {
    const query = params ? `?page=${params.page}&limit=${params.limit}` : '';
    return apiGet<PaginatedResponse<Investor>>(
      API_ENDPOINTS.investor.list + query,
    );
  },
  detail: (id: string) => apiGet<Investor>(API_ENDPOINTS.investor.detail(id)),
  create: (data: Omit<Investor, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiPost<Investor>(API_ENDPOINTS.investor.create, data),
  update: (id: string, data: Partial<Investor>) =>
    apiPut<Investor>(API_ENDPOINTS.investor.update(id), data),
  delete: (id: string) => apiDelete(API_ENDPOINTS.investor.delete(id)),
  getPortfolio: (id: string) =>
    apiGet<{ portfolio: unknown }>(API_ENDPOINTS.investor.portfolio(id)),
};

/** Search investors by name/keyword */
export const searchInvestors = (query: string, signal?: AbortSignal) =>
  apiFetch<{ data: { investors: SearchInvestor[] } }>(
    `/investors/search?q=${encodeURIComponent(query)}`,
    { signal },
  );

/** Fetch full investor details including holdings */
export const fetchInvestorDetails = (uuid: string) =>
  apiFetch<InvestorDetailsApiResponse>(`/investors/${uuid}/details`);
