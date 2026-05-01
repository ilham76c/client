// app/modules/ownership/api/searchEmiten.ts
import { apiFetch } from '@/lib/api';

export async function searchEmiten(query: string) {
  const res = await apiFetch(`/api/emiten/search?q=${query}`) as Response;

  if (!res.ok) throw new Error('Failed to fetch');

  const json = await res.json();

  return json.data; // ⬅️ penting (karena response kamu pakai wrapper)
}