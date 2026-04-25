'use client';

import { useState } from 'react';
import OwnershipChart from './OwnershipChart';
import { useOwnershipChanges } from '../hooks/useOwnershipChanges';

import EmitenSearch from '../components/EmitenSearch';
import ShareholderTable from '../components/ShareholderTable';
import MonthPicker from "../components/MonthPicker";


export default function OwnershipClient() {
  const [ticker, setTicker] = useState('SSIA');
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const [month, setMonth] = useState(defaultMonth);

  function getMonthRange(month: string) {
    const [year, m] = month.split("-").map(Number);

    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0); // last day of month

    const format = (d: Date) => d.toISOString().slice(0, 10);

    return {
      start_date: format(start),
      end_date: format(end),
    };
  }

  const { start_date, end_date } = getMonthRange(month);


  const { data, loading, error } = useOwnershipChanges({
    ticker,
    investor_type: 'L',
    start_date: start_date,
    end_date: end_date,
    limit: 100,
  });

  const emitens = [
    { ticker: 'MSIN', name: 'PT MNC Digital Entertainment Tbk' },
    { ticker: 'JAYA', name: 'PT Armada Berjaya Trans Tbk.' },
    { ticker: 'SSIA', name: 'PT Surya Semesta Internusa Tbk' },
  ];

  return (
    <>
      <div className='mb-5 flex gap-4'>
        <EmitenSearch emitens={emitens} onSelect={(t) => setTicker(t)} />
        <MonthPicker value={month} onChange={setMonth} />
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
