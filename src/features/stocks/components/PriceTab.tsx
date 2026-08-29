'use client';

import { useState } from 'react';
import { Skeleton } from '@mui/material';

import { useEmitenPrices } from '../hooks/useEmiten';
import PriceChart from './PriceChart';
import PricePeriodSelector from './PricePeriodSelector';

import { getPeriodParams, PricePeriod } from '../utils/pricePeriod';

import { formatDate, formatNumber } from '@/lib/utils/formatters';

interface Props {
  ticker: string;
}

function StatItem({
  label,
  value,
  valueClassName = 'text-white',
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <div className='text-xs text-gray-500 mb-1'>{label}</div>

      <div className={`text-lg font-semibold ${valueClassName}`}>{value}</div>
    </div>
  );
}

export default function PriceTab({ ticker }: Props) {
  const [period, setPeriod] = useState<PricePeriod>('1D');

  const params = getPeriodParams(period);

  const { data, isLoading, error } = useEmitenPrices(ticker, params);

  const prices = data?.prices ?? [];

  const interval = data?.interval ?? 'daily';

  const summary = data?.summary;

  const first = prices[0];

  const last = prices[prices.length - 1];

  const hasPrices = prices.length > 0;

  // ============================================================
  // CHANGE
  //
  // 1D / INTRADAY:
  //     change vs previous close
  //
  // Other periods:
  //     change during selected period
  // ============================================================

  const isDaily = period === '1D';

  const change = isDaily ? summary?.change : summary?.period_change;

  const changePct = isDaily ? summary?.change_pct : summary?.period_change_pct;

  const isUp = (change ?? 0) >= 0;

  // ============================================================
  // DATE RANGE
  // ============================================================

  const rangeLabel =
    interval === 'intraday'
      ? first?.timestamp
        ? formatDate(first.timestamp, 'DD MMM YYYY')
        : ''
      : first?.timestamp && last?.timestamp
        ? `${formatDate(
            first.timestamp.slice(0, 10),
            'DD MMM YYYY',
          )} – ${formatDate(last.timestamp.slice(0, 10), 'DD MMM YYYY')}`
        : '';

  // ============================================================
  // CHART HEIGHT
  // ============================================================

  const hasVolume = prices.some((price) => price.volume != null);

  const chartHeight = hasVolume ? 420 : 360;

  return (
    <div className='space-y-5'>
      {/* ========================================================
          PERIOD SELECTOR
      ======================================================== */}

      <div className='flex items-center justify-end flex-wrap gap-3'>
        <PricePeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* ========================================================
          LOADING
      ======================================================== */}

      {isLoading && (
        <div className='space-y-5'>
          <Skeleton
            variant='rounded'
            height={80}
            sx={{
              bgcolor: 'rgba(255,255,255,0.08)',
            }}
          />

          <Skeleton
            variant='rounded'
            height={chartHeight}
            sx={{
              bgcolor: 'rgba(255,255,255,0.08)',
            }}
          />
        </div>
      )}

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && !isLoading && (
        <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm'>
          Gagal memuat data harga.
        </div>
      )}

      {/* ========================================================
          DATA
      ======================================================== */}

      {!isLoading && !error && hasPrices && (
        <>
          {/* ==================================================
                PRICE SUMMARY
            ================================================== */}

          <div className='bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between flex-wrap gap-4'>
            <div className='flex items-center gap-6 flex-wrap'>
              {/* ==============================================
                    CLOSE
                ============================================== */}

              {summary?.close != null && (
                <StatItem
                  label='Close'
                  value={formatNumber(summary.close)}
                  valueClassName='text-2xl font-bold text-white'
                />
              )}

              {/* ==============================================
                    PREVIOUS CLOSE
                    ONLY FOR 1D / INTRADAY
                ============================================== */}

              {(isDaily || interval === 'intraday') &&
                summary?.prev_close != null && (
                  <StatItem
                    label='Previous Close'
                    value={formatNumber(summary.prev_close)}
                  />
                )}

              {/* ==============================================
                    CHANGE
                ============================================== */}

              {change != null && (
                <StatItem
                  label={isDaily ? 'Perubahan Hari Ini' : `Perubahan ${period}`}
                  value={`${isUp ? '+' : ''}${formatNumber(change)} (${
                    changePct != null ? changePct.toFixed(2) : '0.00'
                  }%)`}
                  valueClassName={isUp ? 'text-emerald-400' : 'text-red-400'}
                />
              )}

              {/* ==============================================
                    HIGH
                ============================================== */}

              {summary?.high != null && (
                <StatItem
                  label='Tertinggi'
                  value={formatNumber(summary.high)}
                  valueClassName='text-emerald-400'
                />
              )}

              {/* ==============================================
                    LOW
                ============================================== */}

              {summary?.low != null && (
                <StatItem
                  label='Terendah'
                  value={formatNumber(summary.low)}
                  valueClassName='text-red-400'
                />
              )}

              {/* ==============================================
                    VOLUME
                ============================================== */}

              {summary?.volume != null && (
                <StatItem
                  label='Volume'
                  value={
                    summary.volume >= 1_000_000
                      ? `${(summary.volume / 1_000_000).toFixed(2)}jt`
                      : formatNumber(summary.volume)
                  }
                />
              )}
            </div>

            {/* ==================================================
                  DATE RANGE
              ================================================== */}

            <div className='text-sm text-gray-500'>
              {interval === 'intraday' ? 'Tanggal' : 'Periode'}: {rangeLabel}
            </div>
          </div>

          {/* ==================================================
                CHART
            ================================================== */}

          <PriceChart data={prices} interval={interval} period={period} />
        </>
      )}

      {/* ========================================================
          EMPTY
      ======================================================== */}

      {!isLoading && !error && !hasPrices && (
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500'>
          Tidak ada data harga.
        </div>
      )}
    </div>
  );
}
