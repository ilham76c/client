import { apiFetch } from './client';

export interface OwnershipAnnouncement {
  id: number;
  company: string;
  shareholder: string;
  percentage: number;
  date: string;
}

interface OwnershipAnnouncementsResponse {
  total: number;
  announcements: OwnershipAnnouncement[];
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

export async function getOwnershipAnnouncements({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<OwnershipAnnouncementsResponse> {
  const res = await apiFetch<ApiResponse<OwnershipAnnouncementsResponse>>(
    `/api/v1/ownership/announcements?limit=${limit}&offset=${offset}`
  );
  return res.data;
}

export async function uploadOwnershipAnnouncement(file: File): Promise<Blob> {
  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/ownership/announcements/upload`,
    {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.blob();
}
