'use client';

import { useState } from 'react';
import OwnershipChart from './OwnershipChart';
import { useOwnershipChanges } from '../hooks/useOwnershipChanges';

import EmitenSearch from '../components/EmitenSearch';
import ShareholderTable from '../components/ShareholderTable';

export default function OwnershipClient() {
  const [ticker, setTicker] = useState('SSIA');

  const { data, loading, error } = useOwnershipChanges({
    ticker,
    investor_type: 'L',
    start_date: '2025-12-18',
    end_date: '2026-03-16',
    limit: 100,
  });

  const emitens = [
    { ticker: 'MSIN', name: 'PT MNC Digital Entertainment Tbk' },
    { ticker: 'JAYA', name: 'PT Armada Berjaya Trans Tbk.' },
    { ticker: 'SSIA', name: 'PT Surya Semesta Internusa Tbk' },
  ];

  return (
    <>
      <div className='mb-5'>
        <EmitenSearch emitens={emitens} onSelect={(t) => setTicker(t)} />
      </div>

      {loading && (
        <div className='animate-pulse text-gray-400'>Loading ownership...</div>
      )}

      {error && <div className='text-red-600'>{error}</div>}

      {!loading && !error && data && (
        <>
          <h1 className='text-3xl font-bold mb-2'>
            {data.ticker} - {data.name}
          </h1>

          <p className='text-gray-400 mb-8'>Institutional Ownership Trend</p>

          <OwnershipChart key={ticker} data={data} />
        </>
      )}

      <div className='mt-12'>
        <ShareholderTable ticker={ticker} />
      </div>
    </>
  );
}
