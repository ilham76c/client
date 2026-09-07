'use client';

import { useState } from 'react';
import { Skeleton } from '@mui/material';
import dayjs from 'dayjs';

import ForeignFlowSection from './ForeignFlowSection';
import DatePicker from '@/components/ui/DatePicker';
import { useForeignFlow } from '../hooks/useForeignFlow';

function SectionSkeleton() {
  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
      <Skeleton
        width={140}
        height={20}
        sx={{ bgcolor: 'rgba(255,255,255,0.08)', mb: 2 }}
      />
      <div className='flex flex-col gap-2'>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            key={i}
            variant='rounded'
            height={40}
            sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
          />
        ))}
      </div>
    </div>
  );
}

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );

  const { data, isLoading, isError, error } = useForeignFlow(selectedDate);

  const hasData =
    !!data && (data.top_buy.length > 0 || data.top_sell.length > 0);

  return (
    <div className='space-y-6'>
      {/* HEADER — satu-satunya tempat judul + tanggal tampil */}
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-between flex-wrap gap-4'>
        <div>
          <h1 className='text-xl font-semibold text-white mb-1'>
            Aliran Dana Asing
          </h1>
          <p className='text-sm text-gray-500'>
            {data?.trading_date
              ? `Data perdagangan ${dayjs(data.trading_date).format('DD MMMM YYYY')}`
              : 'Top 10 saham dengan net buy dan net sell asing tertinggi.'}
          </p>
        </div>

        <DatePicker
          viewMode='day'
          value={
            selectedDate
              ? selectedDate
              : (data?.trading_date ?? dayjs().format('YYYY-MM-DD'))
          }
          onChange={setSelectedDate}
        />
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      )}

      {/* ERROR */}
      {isError && !isLoading && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm'>
          {error instanceof Error
            ? error.message
            : 'Gagal memuat data aliran dana asing.'}
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && !isError && data && !hasData && (
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-500'>
          Tidak ada data aliran dana asing untuk tanggal yang dipilih.
        </div>
      )}

      {/* DATA */}
      {!isLoading && !isError && data && hasData && (
        <ForeignFlowSection data={data} />
      )}
    </div>
  );
}
