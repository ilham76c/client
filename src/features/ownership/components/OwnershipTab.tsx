import { useState } from 'react';
import dayjs from 'dayjs';

import OwnershipChart from './OwnershipChart';
import ShareholderTable from './ShareholderTable';
import DatePicker from '@/components/ui/DatePicker';
import { useOwnershipChanges } from '../hooks/useOwnershipChanges';
import DataState from '@/components/ui/DataState';

function getMonthRange(month: string) {
  const start = dayjs(`${month}-01`);
  return {
    start_date: start.format('YYYY-MM-DD'),
    end_date: start.endOf('month').format('YYYY-MM-DD'),
  };
}

export default function OwnershipTab({ ticker }: { ticker: string }) {
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
      <div className='flex gap-4 items-center justify-between mb-4'>
        <h2 className='text-gray-400 text-2xl font-bold'>Ownership Trend</h2>
        <DatePicker value={month} onChange={setMonth} />
      </div>

      {loading && <DataState state='loading' />}

      {error && (
        <DataState
          state='error'
          title='Unable to Load Ownership Data'
          message='Please try again later.'
        />
      )}

      {!loading && !error && data && data.series.length === 0 && (
        <DataState
          state='empty'
          title='No Ownership Data'
          message='No ownership information found for the selected period.'
        />
      )}

      {!loading && !error && data && data.series.length > 0 && (
        <OwnershipChart key={`${ticker}-${month}`} data={data} />
      )}

      <div className='mt-12'>
        <ShareholderTable ticker={ticker} />
      </div>
    </>
  );
}
