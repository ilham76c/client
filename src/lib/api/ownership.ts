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
  announcements: Ownership[];
};

type ApiResponse<T> = {
  status: string;
  data: T;
};

export async function getOwnershipAnnouncements(): Promise<OwnershipResponse> {
  const res = await apiFetch<ApiResponse<OwnershipResponse>>(
    'ownership/announcements',
  );

  return res.data;
}
