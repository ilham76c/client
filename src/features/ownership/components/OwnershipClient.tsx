'use client';

import { useState } from 'react';
import dayjs from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import OwnershipChart from './OwnershipChart';
import { useOwnershipChanges } from '../hooks/useOwnershipChanges';

import EmitenSearch from '../components/EmitenSearch';
import ShareholderTable from '../components/ShareholderTable';
import DatePicker from "@/components/ui/DatePicker";

export default function OwnershipClient() {
  const [ticker, setTicker] = useState('SSIA');

  // 🔥 default month
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));

  // 🔥 range (AMAN - no timezone bug)
  function getMonthRange(month: string) {
    const start = dayjs(month + '-01');
    const end = start.endOf('month');

    return {
      start_date: start.format('YYYY-MM-DD'),
      end_date: end.format('YYYY-MM-DD'),
    };
  }

  const { start_date, end_date } = getMonthRange(month);

  const { data, loading, error } = useOwnershipChanges({
    ticker,
    investor_type: 'L',
    start_date,
    end_date,
    limit: 100,
  });

  const emitens = [
    { ticker: 'MSIN', name: 'PT MNC Digital Entertainment Tbk' },
    { ticker: 'JAYA', name: 'PT Armada Berjaya Trans Tbk.' },
    { ticker: 'SSIA', name: 'PT Surya Semesta Internusa Tbk' },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <div className='mb-5 flex gap-4 items-center'>
          <EmitenSearch emitens={emitens} onSelect={(t) => setTicker(t)} />

          <DatePicker value={month} onChange={setMonth} />
        </div>

        {loading && (
          <div className='animate-pulse text-gray-400'>
            Loading {month} data...
          </div>
        )}

        {error && <div className='text-red-600'>{error}</div>}

        {!loading && !error && data && (
          <>
            <h1 className='text-3xl font-bold mb-2'>
              {data.ticker} - {data.name}
            </h1>

            <p className='text-gray-400 mb-8'>
              Institutional Ownership Trend
            </p>

            <OwnershipChart key={`${ticker}-${month}`} data={data} />
          </>
        )}

        <div className='mt-12'>
          <ShareholderTable ticker={ticker} />
        </div>
      </>
    </LocalizationProvider>
  );
}