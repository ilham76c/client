'use client';

import { useEmitenSearch } from '../hooks/useEmiten';

interface Props {
  onSelect: (ticker: string) => void;
}

export default function EmitenSearch({ onSelect }: Props) {
  const { handleChange, handleSelect, results, loading } = useEmitenSearch();

  return (
    <div className='relative w-full max-w-md'>
      <input
        type='text'
        placeholder='Search company...'
        onChange={(e) => handleChange(e.target.value)}
        className='w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500'
      />

      {(results.length > 0 || loading) && (
        <div className='absolute mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto'>
          {loading && (
            <div className='px-4 py-3 text-sm text-gray-400 flex items-center gap-2'>
              <div className='animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full' />
              Searching...
            </div>
          )}
          {!loading &&
            results.map((emiten) => (
              <div
                key={emiten.ticker}
                onClick={() => {
                  handleSelect(emiten);
                  onSelect(emiten.ticker);
                }}
                className='px-4 py-2 hover:bg-gray-800 cursor-pointer flex justify-between'
              >
                <span className='font-semibold text-white'>
                  {emiten.ticker}
                </span>
                <span className='text-sm text-gray-400 truncate ml-3'>
                  {emiten.name}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
