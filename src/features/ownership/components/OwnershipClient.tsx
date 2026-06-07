'use client';

import { useState } from 'react';
import dayjs from 'dayjs';

import OwnershipChart from './OwnershipChart';
import EmitenSearch from './EmitenSearch';
import ShareholderTable from './ShareholderTable';
import DatePicker from '@/components/ui/DatePicker';
import { useOwnershipChanges } from '../hooks/useOwnershipChanges';
import { LoadingSpinner } from '@/components/ui';

function getMonthRange(month: string) {
  const start = dayjs(`${month}-01`);
  return {
    start_date: start.format('YYYY-MM-DD'),
    end_date: start.endOf('month').format('YYYY-MM-DD'),
  };
}

export default function OwnershipClient() {
  const [ticker, setTicker] = useState('SSIA');
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));

  const { start_date, end_date } = getMonthRange(month);

  const { data, loading, error } = useOwnershipChanges({
    ticker,
    investor_type: 'L',
    start_date,
    end_date,
    limit: 100,
  });

  return (
    <>
      <div className="mb-5 flex gap-4 items-center flex-wrap">
        <EmitenSearch onSelect={setTicker} />
        <DatePicker value={month} onChange={setMonth} />
      </div>

      {loading && <LoadingSpinner />}

      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && data && (
        <>
          <h1 className="text-3xl font-bold mb-2">
            {data.ticker} – {data.name}
          </h1>
          <p className="text-gray-400 mb-8">Institutional Ownership Trend</p>
          <OwnershipChart key={`${ticker}-${month}`} data={data} />
        </>
      )}

      <div className="mt-12">
        <ShareholderTable ticker={ticker} />
      </div>
    </>
  );
}
