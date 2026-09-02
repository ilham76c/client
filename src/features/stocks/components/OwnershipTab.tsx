'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import OwnershipChart from './OwnershipChart';
import ShareholderTable from './ShareholderTable';
import DatePicker from '@/components/ui/DatePicker';
import { useOwnershipChanges } from '../hooks/useOwnershipChanges';
import DataState from '@/components/ui/DataState';

type InvestorTypeFilter = 'ALL' | 'L' | 'P';

function getMonthRange(month: string) {
  const start = dayjs(`${month}-01`);
  return {
    start_date: start.format('YYYY-MM-DD'),
    end_date: start.endOf('month').format('YYYY-MM-DD'),
  };
}

export default function OwnershipTab({ ticker }: { ticker: string }) {
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [investorType, setInvestorType] = useState<InvestorTypeFilter>('ALL');

  const { start_date, end_date } = getMonthRange(month);

  const { data, loading, error } = useOwnershipChanges({
    ticker,
    investor_type: investorType === 'ALL' ? undefined : investorType,
    start_date,
    end_date,
    limit: 100,
  });

  return (
    <div className='space-y-5'>
      <div className='flex gap-4 items-center justify-between mb-0 flex-wrap'>
        <h2 className='text-white text-lg font-semibold'>Tren Kepemilikan</h2>

        <div className='flex items-center gap-3 flex-wrap'>
          <ToggleButtonGroup
            value={investorType}
            exclusive
            onChange={(_, value) => value && setInvestorType(value)}
            size='small'
            sx={{
              '& .MuiToggleButton-root': {
                fontSize: 12,
                color: '#9ca3af',
                borderColor: '#374151',
                px: 1.5,
              },
              '& .Mui-selected': {
                color: '#34d399 !important',
                backgroundColor: 'rgba(52,211,153,0.1) !important',
              },
            }}
          >
            <ToggleButton value='ALL'>Semua</ToggleButton>
            <ToggleButton value='L'>Lokal</ToggleButton>
            <ToggleButton value='P'>Perusahaan</ToggleButton>
          </ToggleButtonGroup>

          <DatePicker value={month} onChange={setMonth} />
        </div>
      </div>

      {loading && <DataState state='loading' />}

      {error && (
        <DataState
          state='error'
          title='Gagal Memuat Data Kepemilikan'
          message='Silakan coba lagi nanti.'
        />
      )}

      {!loading && !error && data && data.series.length === 0 && (
        <DataState
          state='empty'
          title='Tidak Ada Data Kepemilikan'
          message='Tidak ditemukan data kepemilikan untuk periode yang dipilih.'
        />
      )}

      {!loading && !error && data && data.series.length > 0 && (
        <OwnershipChart
          key={`${ticker}-${month}-${investorType}`}
          data={data}
        />
      )}

      <div>
        <ShareholderTable ticker={ticker} />
      </div>
    </div>
  );
}
