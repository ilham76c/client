'use client';

import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/lib/api/client';

export type Investor = {
  uuid: string;
  name: string;
  investor_type: string;
};

interface ApiResponse<T> {
  data: T;
}

interface Props {
  onSelect: (investor: Investor) => void;
}

export default function InvestorSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [results, setResults] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const isSelectingRef = useRef(false);

  useEffect(() => {
    if (isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch<ApiResponse<{ investors: Investor[] }>>(
          `/api/v1/investors/search?q=${query}`,
          { signal: controller.signal }
        );
        setResults(res.data.investors ?? []);
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
    <div className="relative w-full max-w-lg">
      <input
        type="text"
        placeholder="Search investor..."
        value={selectedInvestor ? selectedInvestor.name : query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          if (selectedInvestor && value !== selectedInvestor.name) {
            setSelectedInvestor(null);
          }
          setShowDropdown(true);
        }}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gray-500"
      />

      {showDropdown && (results.length > 0 || loading) && (
        <div className="absolute mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
              Searching...
            </div>
          )}
          {!loading &&
            results.map((investor) => (
              <div
                key={investor.uuid}
                onClick={() => {
                  isSelectingRef.current = true;
                  setSelectedInvestor(investor);
                  setQuery(investor.name);
                  onSelect(investor);
                  setResults([]);
                  setShowDropdown(false);
                }}
                className="px-4 py-3 hover:bg-gray-800 cursor-pointer"
              >
                <div className="font-medium text-white">{investor.name}</div>
                <div className="text-xs text-gray-400">
                  {investor.investor_type === 'L' ? 'Lokal' : 'Asing'}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
