'use client';

import { useEffect, useState } from 'react';

type Emiten = {
  ticker: string;
  name: string;
};

export default function EmitenSearch({
  emitens,
  onSelect,
}: {
  emitens: Emiten[];
  onSelect: (ticker: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Emiten[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      const filtered = emitens
        .filter((e) =>
          `${e.ticker} ${e.name}`.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 8);

      setResults(filtered);
      setLoading(false);
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query, emitens]);

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
