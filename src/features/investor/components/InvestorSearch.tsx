'use client';

import { useEffect, useRef, useState } from 'react';
import { useInvestorSearch } from '../hooks/useInvestor';
import type { SearchInvestor } from '../types';

interface Props {
  onSelect: (investor: SearchInvestor) => void;
}

// Highlight bagian nama yang cocok dengan query — mempercepat scanning
// terutama untuk nama institusi yang panjang.
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const index = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (index === -1) return <>{text}</>;

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.trim().length);
  const after = text.slice(index + query.trim().length);

  return (
    <>
      {before}
      <span className='text-emerald-400'>{match}</span>
      {after}
    </>
  );
}

export default function InvestorSearch({ onSelect }: Props) {
  const { inputValue, handleChange, handleSelect, results, loading, error } =
    useInvestorSearch();

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_QUERY_LENGTH = 3;
  const trimmed = inputValue.trim();
  const isTooShort = trimmed.length > 0 && trimmed.length < MIN_QUERY_LENGTH;
  const showEmptyState =
    !loading &&
    !error &&
    trimmed.length >= MIN_QUERY_LENGTH &&
    results.length === 0;

  const showDropdown =
    isOpen &&
    (loading || !!error || isTooShort || showEmptyState || results.length > 0);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [results]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectInvestor(investor: SearchInvestor) {
    handleSelect(investor);
    onSelect(investor);
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && results[highlightedIndex]) {
        e.preventDefault();
        selectInvestor(results[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className='relative w-full max-w-lg'>
      <input
        type='text'
        role='combobox'
        aria-expanded={showDropdown}
        aria-controls='investor-search-listbox'
        aria-autocomplete='list'
        aria-activedescendant={
          highlightedIndex >= 0
            ? `investor-option-${highlightedIndex}`
            : undefined
        }
        placeholder='Cari nama investor atau institusi...'
        value={inputValue}
        onChange={(e) => {
          handleChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className='w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500'
      />

      {showDropdown && (
        <div
          id='investor-search-listbox'
          role='listbox'
          className='absolute mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto'
        >
          {isTooShort && (
            <div className='px-4 py-3 text-sm text-gray-500'>
              Ketik minimal {MIN_QUERY_LENGTH} karakter untuk mencari.
            </div>
          )}

          {loading && (
            <div className='px-4 py-3 text-sm text-gray-400 flex items-center gap-2'>
              <div className='animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full' />
              Mencari...
            </div>
          )}

          {error && !loading && (
            <div className='px-4 py-3 text-sm text-red-400'>
              Gagal mencari investor. Coba lagi.
            </div>
          )}

          {showEmptyState && (
            <div className='px-4 py-6 text-sm text-gray-500 text-center'>
              Tidak ditemukan investor untuk &quot;{trimmed}&quot;.
            </div>
          )}

          {!loading &&
            !error &&
            results.map((investor, index) => (
              <div
                key={investor.uuid}
                id={`investor-option-${index}`}
                role='option'
                aria-selected={highlightedIndex === index}
                onClick={() => selectInvestor(investor)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-3 cursor-pointer ${
                  highlightedIndex === index
                    ? 'bg-gray-800'
                    : 'hover:bg-gray-800'
                }`}
              >
                <div className='font-medium text-white'>
                  <HighlightMatch text={investor.name} query={inputValue} />
                </div>
                <div className='text-xs text-gray-400'>
                  {investor.investor_type === 'L' ? 'Lokal' : 'Perusahaan'}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
