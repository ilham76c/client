'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api/client';

type Emiten = {
  ticker: string;
  name: string;
};

interface ApiResponse<T> {
  data: T;
}

interface Props {
  onSelect: (ticker: string) => void;
}

export default function EmitenSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Emiten[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 4) {
      setResults([]);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch<ApiResponse<Emiten[]>>(
          `/api/v1/emiten/search?q=${query}`,
          { signal: controller.signal }
        );
        setResults(res.data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search company..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
      />

      {(results.length > 0 || loading) && (
        <div className="absolute mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-10">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
              Searching...
            </div>
          )}
          {!loading &&
            results.map((emiten) => (
              <div
                key={emiten.ticker}
                onClick={() => {
                  onSelect(emiten.ticker);
                  setQuery('');
                  setResults([]);
                }}
                className="px-4 py-2 hover:bg-gray-800 cursor-pointer flex justify-between"
              >
                <span className="font-semibold text-white">{emiten.ticker}</span>
                <span className="text-sm text-gray-400 truncate ml-3">{emiten.name}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
