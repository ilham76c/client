'use client';

import { useInvestorSearch } from '../hooks/useInvestor';
import type { SearchInvestor } from '../types';

interface Props {
  onSelect: (investor: SearchInvestor) => void;
}

export default function InvestorSearch({ onSelect }: Props) {
  const { inputValue, handleChange, handleSelect, results, loading } =
    useInvestorSearch();

  return (
    <div className='relative w-full max-w-lg'>
      <input
        type='text'
        placeholder='Search investor...'
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        className='w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500'
      />

      {(results.length > 0 || loading) && (
        <div className='absolute mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto'>
          {loading && (
            <div className='px-4 py-3 text-sm text-gray-400 flex items-center gap-2'>
              <div className='animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full' />
              Searching...
            </div>
          )}
          {!loading &&
            results.map((investor) => (
              <div
                key={investor.uuid}
                onClick={() => {
                  handleSelect(investor);
                  onSelect(investor);
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
