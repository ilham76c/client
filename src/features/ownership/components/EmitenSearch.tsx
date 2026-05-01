'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

type Emiten = {
  ticker: string;
  name: string;
};

type ApiResponse<T> = {
  data: T;
  meta?: {
    count?: number;
    limit?: number;
    offset?: number;
    total?: number;
  };
};

export default function EmitenSearch({
  onSelect,
}: {
  onSelect: (ticker: string) => void;
}) {
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
        const res = await apiFetch<ApiResponse<Emiten[]>>(`/api/v1/emiten/search?q=${query}`, {
          signal: controller.signal,
        });

        setResults(res.data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort(); // 🔥 penting biar ga race condition
    };
  }, [query]);

  return (
    <div className='relative w-full max-w-md'>
      <input
        type='text'
        placeholder='Search company...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500'
      />

      {(results.length > 0 || loading) && (
        <div className='absolute mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-10'>
          {loading && (
            <div className='px-4 py-3 text-sm text-gray-400 flex items-center gap-2'>
              <div className='animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full'></div>
              Searching...
            </div>
          )}

          {!loading &&
            results.map((e) => (
              <div
                key={e.ticker}
                onClick={() => {
                  onSelect(e.ticker);
                  setQuery('');
                  setResults([]);
                }}
                className='px-4 py-2 hover:bg-gray-800 cursor-pointer flex justify-between'
              >
                <span className='font-semibold text-white'>{e.ticker}</span>

                <span className='text-sm text-gray-400 truncate ml-3'>
                  {e.name}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}