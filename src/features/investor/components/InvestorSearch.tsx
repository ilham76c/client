'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

export type Investor = {
  uuid: string;
  name: string;
  investor_type: string;
};

type ApiResponse<T> = {
  data: T;
};

export default function InvestorSearch({
  onSelect,
}: {
  onSelect: (investor: Investor) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch<
          ApiResponse<{
            investors: Investor[];
          }>
        >(`/api/v1/investors/search?q=${query}`, {
          signal: controller.signal,
        });

        setResults(res.data.investors ?? []);
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
      controller.abort();
    };
  }, [query]);

  return (
    <div className='relative w-full max-w-lg'>
      <input
        type='text'
        placeholder='Search investor...'
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        className='w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500'
      />

      {showDropdown && (results.length > 0 || loading) && (
        <div className='absolute mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto'>
          {loading && (
            <div className='px-4 py-3 text-sm text-gray-400 flex items-center gap-2'>
              <div className='animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full'></div>
              Searching...
            </div>
          )}

          {!loading &&
            results.map((investor) => (
              <div
                key={investor.uuid}
                onClick={() => {
                  onSelect(investor);
                  setQuery(investor.name);
                  setResults([]);
                  setShowDropdown(false);
                }}
                className='px-4 py-3 hover:bg-gray-800 cursor-pointer'
              >
                <div className='font-medium text-white'>{investor.name}</div>

                <div className='text-xs text-gray-400'>
                  {investor.investor_type === 'L' ? 'Lokal' : 'Asing'}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
