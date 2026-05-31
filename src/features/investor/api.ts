// app/modules/ownership/api/searchInvestors.ts
import { apiFetch } from '@/lib/api';

export async function searchInvestors(query: string) {
  const res = await apiFetch(`/api/v1/investors/search?q=${query}`) as Response;

  if (!res.ok) throw new Error('Failed to fetch');

  const json = await res.json();

  return json.data; // ⬅️ penting (karena response kamu pakai wrapper)
}