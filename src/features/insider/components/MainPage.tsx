'use client';

import { useMemo, useState } from 'react';
import { Skeleton } from '@mui/material';
import { useGlobalInsiderActivity } from '../hooks/useInsider';
import GlobalInsiderRow from './GlobalInsiderRow';
import EmitenSearch from './EmitenSearch';

type ActionFilter = 'ALL' | 'BUY' | 'SELL';
const PAGE_SIZE = 10;

export default function InsiderActivityPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<ActionFilter>('ALL');
  const [tickerFilter, setTickerFilter] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useGlobalInsiderActivity({
    offset: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    action: actionFilter === 'ALL' ? undefined : actionFilter,
    ticker: tickerFilter ?? undefined,
  });

  const activities = data?.data.activities ?? [];
  const total = typeof data?.meta.count === 'number' ? data.meta.count : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleActionFilterChange(f: ActionFilter) {
    setActionFilter(f);
    setPage(1);
  }

  function handleTickerSelect(ticker: string) {
    setTickerFilter(ticker);
    setPage(1);
  }

  function clearTickerFilter() {
    setTickerFilter(null);
    setPage(1);
  }

  return (
    <div className='space-y-5'>
      {/* HEADER — judul di kiri, filter emiten + filter aksi digabung di kanan */}
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-between flex-wrap gap-4'>
        <div>
          <h1 className='text-xl font-semibold text-white mb-1'>
            Aktivitas Insider
          </h1>
          <p className='text-sm text-gray-500'>
            {total > 0
              ? `${total.toLocaleString('id-ID')} transaksi tercatat`
              : 'Transaksi insider seluruh emiten.'}
          </p>
        </div>

        <div className='flex items-center gap-2.5 flex-wrap'>
          {tickerFilter ? (
            <span className='inline-flex items-center gap-1.5 text-sm bg-gray-800 text-gray-200 px-2.5 py-1.5 rounded-lg shrink-0'>
              {tickerFilter}
              <button
                onClick={clearTickerFilter}
                aria-label={`Hapus filter ${tickerFilter}`}
                className='text-gray-500 hover:text-white leading-none'
              >
                ×
              </button>
            </span>
          ) : (
            <div className='w-44 shrink-0'>
              <EmitenSearch onSelect={handleTickerSelect} />
            </div>
          )}

          <div className='flex gap-1.5 shrink-0'>
            {(['ALL', 'BUY', 'SELL'] as ActionFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => handleActionFilterChange(f)}
                className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                  actionFilter === f
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                {f === 'ALL' ? 'Semua' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
        {isLoading ? (
          <div className='flex flex-col gap-2'>
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton
                key={i}
                variant='rounded'
                height={56}
                sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
              />
            ))}
          </div>
        ) : isError ? (
          <p className='text-sm text-red-400'>
            {error instanceof Error ? error.message : 'Gagal memuat data.'}
          </p>
        ) : activities.length === 0 ? (
          <p className='text-sm text-gray-600 text-center py-8'>
            {tickerFilter
              ? `Tidak ada aktivitas insider untuk ${tickerFilter} dengan filter ini.`
              : 'Tidak ada aktivitas untuk filter ini.'}
          </p>
        ) : (
          <div className='flex flex-col divide-y divide-gray-800/60'>
            {activities.map((a) => (
              <GlobalInsiderRow
                key={`${a.date}-${a.emiten.uid}-${a.investor.uid}-${a.broker.uid}-${a.shares_change}`}
                activity={a}
              />
            ))}
          </div>
        )}

        {!isLoading && total > 0 && (
          <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-800'>
            <span className='text-xs text-gray-500'>
              Halaman {page} dari {totalPages.toLocaleString('id-ID')}
            </span>
            <div className='flex gap-2'>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className='text-xs px-3 py-1.5 rounded-md border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:pointer-events-none transition-colors'
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className='text-xs px-3 py-1.5 rounded-md border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:pointer-events-none transition-colors'
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
