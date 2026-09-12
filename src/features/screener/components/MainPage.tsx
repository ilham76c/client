// MainPage.tsx (page-level, mengikuti pola header + DatePicker seperti ForeignFlow)
'use client';

import { useState } from 'react';
import { Skeleton } from '@mui/material';
import dayjs from 'dayjs';

import VolumeSpikeSection from './VolumeSpikeSection';
import { useVolumeSpikes } from '../hooks/useVolumeSpikes';

export default function MainPage() {
  const [minRatio, setMinRatio] = useState(2);
  const { data, isLoading, isError, error } = useVolumeSpikes({
    limit: 15,
    period: 20,
    minRatio,
  });

  return (
    <div className='space-y-6'>
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-between flex-wrap gap-4'>
        <div>
          <h1 className='text-xl font-semibold text-white mb-1'>
            Volume Spike Screener
          </h1>
          <p className='text-sm text-gray-500'>
            {data?.trading_date
              ? `Data perdagangan ${dayjs(data.trading_date).format('DD MMMM YYYY')}`
              : 'Saham dengan lonjakan volume di luar kebiasaan.'}
          </p>
        </div>

        <select
          value={minRatio}
          onChange={(e) => setMinRatio(Number(e.target.value))}
          className='bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white'
        >
          <option value={2}>Min. 2x rata-rata</option>
          <option value={5}>Min. 5x rata-rata</option>
          <option value={10}>Min. 10x rata-rata</option>
        </select>
      </div>

      {isLoading && (
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
          <div className='flex flex-col gap-3'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                variant='rounded'
                height={48}
                sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
              />
            ))}
          </div>
        </div>
      )}

      {isError && !isLoading && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm'>
          {error instanceof Error
            ? error.message
            : 'Gagal memuat data volume spike.'}
        </div>
      )}

      {!isLoading && !isError && data && <VolumeSpikeSection data={data} />}
    </div>
  );
}
