// lib/api/ownership.ts

import { apiFetch } from './client';

type Ownership = {
  id: number;
  company: string;
  shareholder: string;
  percentage: number;
  date: string;
};

type OwnershipResponse = {
  total: number;
  announcements: Ownership[];
};

type ApiResponse<T> = {
  status: string;
  data: T;
};

export async function getOwnershipAnnouncements({limit, offset}: {limit: number, offset: number}): Promise<OwnershipResponse> {
  const res = await apiFetch<ApiResponse<OwnershipResponse>>(
    `ownership/announcements?limit=${limit}&offset=${offset}`,
  );

  return res.data;
}
