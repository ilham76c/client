'use client';

import { useState } from 'react';
import { Skeleton } from '@mui/material';
import { useEmitenPrices } from '../hooks/useEmiten';
import PriceChart from './PriceChart';
import PricePeriodSelector from './PricePeriodSelector';
import { getPeriodParams, PricePeriod } from '../utils/pricePeriod';
import { formatDate } from '@/lib/utils/formatters';

interface Props {
  ticker: string;
}

export default function PriceTab({ ticker }: Props) {
  const [period, setPeriod] = useState<PricePeriod>('1M');
  const params = getPeriodParams(period);

  const { data, isLoading, error } = useEmitenPrices(ticker, params);
  const prices = data?.data.prices ?? [];
  const interval = data?.data.interval ?? 'daily';

  const last = prices[prices.length - 1];
  const first = prices[0];
  const change = last && first ? last.close - first.close : 0;
  const changePct =
    first && first.close !== 0 ? (change / first.close) * 100 : 0;
  const isUp = change >= 0;

  const rangeLabel =
    interval === 'hourly'
      ? first?.timestamp
        ? formatDate(first.timestamp, 'DD MMM YYYY')
        : ''
      : first?.timestamp && last?.timestamp
        ? `${formatDate(first.timestamp.slice(0, 10), 'DD MMM YYYY')} – ${formatDate(last.timestamp.slice(0, 10), 'DD MMM YYYY')}`
        : '';

  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-end flex-wrap gap-3'>
        <PricePeriodSelector value={period} onChange={setPeriod} />
      </div>

      {isLoading && (
        <div className='space-y-5'>
          <Skeleton
            variant='rounded'
            height={80}
            sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
          />
          <Skeleton
            variant='rounded'
            height={360}
            sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
          />
        </div>
      )}

      {error && !isLoading && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm'>
          Gagal memuat data harga.
        </div>
      )}

      {!isLoading && !error && (
        <>
          {last && (
            <div className='bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between'>
              <div className='flex items-center gap-6 flex-wrap'>
                <div>
                  <div className='text-xs text-gray-500 mb-1'>
                    {interval === 'hourly' ? 'Last Price' : 'Last Close'}
                  </div>
                  <div className='text-2xl font-bold text-white'>
                    {last.close.toLocaleString('id-ID')}
                  </div>
                </div>

                <div>
                  <div className='text-xs text-gray-500 mb-1'>
                    {interval === 'hourly' ? 'Hari Ini' : 'Periode Ini'}
                  </div>
                  <div
                    className={`text-lg font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {isUp ? '+' : ''}
                    {change.toLocaleString('id-ID')} ({changePct.toFixed(2)}%)
                  </div>
                </div>
              </div>

              <div className='text-sm text-gray-500'>
                {interval === 'hourly' ? 'Tanggal' : 'Periode'}: {rangeLabel}
              </div>
            </div>
          )}

          <PriceChart data={prices} interval={interval} />
        </>
      )}
    </div>
  );
}
