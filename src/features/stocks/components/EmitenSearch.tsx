'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useEmitenSearch } from '../hooks/useEmiten';
import type { Emiten } from '../types';

interface Props {
  onSelect: (ticker: string) => void;
}

export default function EmitenSearch({ onSelect }: Props) {
  const [keyword, setKeyword] = useState('');
  const [typing, setTyping] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 300);
  const { data, isFetching, error } = useEmitenSearch(debouncedKeyword);
  const emitens = data?.emitens ?? [];

  useEffect(() => {
    if (debouncedKeyword === keyword) {
      setTyping(false);
    }
  }, [debouncedKeyword, keyword]);

  const handleChange = (value: string) => {
    setKeyword(value);

    if (value.length >= 4) {
      setTyping(true);
    } else {
      setTyping(false);
    }
  };

  const handleSelect = (emiten: Emiten) => {
    setKeyword('');
    setTyping(false);

    onSelect(emiten.ticker);
  };

  const loading = typing || isFetching;
  const showDropdown = keyword.length >= 4 && (loading || emitens.length > 0);

  return (
    <div className='relative w-full max-w-md'>
      <input
        type='text'
        value={keyword}
        placeholder='Search company...'
        onChange={(e) => handleChange(e.target.value)}
        className='w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-white focus:border-gray-500 focus:outline-none'
      />

      {showDropdown && (
        <div className='absolute z-10 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-800 bg-gray-900 shadow-lg'>
          {loading && (
            <div className='flex items-center gap-2 px-4 py-3 text-sm text-gray-400'>
              <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent' />
              Searching...
            </div>
          )}

          {!loading &&
            emitens.map((emiten) => (
              <button
                key={emiten.ticker}
                type='button'
                onClick={() => handleSelect(emiten)}
                className='flex w-full items-center justify-between px-4 py-2 text-left hover:bg-gray-800'
              >
                <span className='font-semibold text-white'>
                  {emiten.ticker}
                </span>

                <span className='ml-3 truncate text-sm text-gray-400'>
                  {emiten.name}
                </span>
              </button>
            ))}
        </div>
      )}

      {error && (
        <p className='mt-2 text-sm text-red-400'>
          {error instanceof Error
            ? error.message
            : 'Failed to search companies.'}
        </p>
      )}
    </div>
  );
}
