'use client';

import Link from 'next/link';
import type { ForeignFlowItem, ForeignFlowResponse } from '../types';
import ForeignFlowSummary from './ForeignFlowSummary';
import ForeignFlowRatioChart from './ForeignFlowRatioChart';

interface Props {
  data: ForeignFlowResponse;
}

function formatCompact(v: number) {
  const abs = Math.abs(v);
  const sign = v < 0 ? '-' : '';
  if (abs >= 1_000_000_000)
    return `${sign}${(abs / 1_000_000_000).toFixed(2)}M`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}jt`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(2)}rb`;
  return `${sign}${abs}`;
}

function FlowRow({
  item,
  isBuy,
  maxPct,
}: {
  item: ForeignFlowItem;
  isBuy: boolean;
  maxPct: number;
}) {
  const netValue = isBuy ? item.foreign_buy : -item.foreign_sell;
  const pctVolume = isBuy
    ? item.foreign_buy_pct_volume
    : item.foreign_sell_pct_volume;
  const hasVolumeData = pctVolume != null;
  const barWidth =
    hasVolumeData && maxPct > 0
      ? Math.min((Math.abs(pctVolume) / maxPct) * 100, 100)
      : 0;
  const color = isBuy ? '#22c55e' : '#ef4444';

  return (
    <Link
      href={`/stocks/${item.ticker}`}
      className='flex items-center gap-3 py-2.5 px-1 -mx-1 rounded-lg hover:bg-gray-800/40 transition-colors'
    >
      <span className='font-semibold text-white text-sm w-14 shrink-0'>
        {item.ticker}
      </span>

      <span className='text-xs text-gray-500 flex-1 min-w-0 truncate'>
        {item.name}
      </span>

      <div className='flex flex-col items-end gap-1 shrink-0 w-28'>
        <span className='text-sm font-semibold tabular-nums' style={{ color }}>
          {isBuy ? '+' : ''}
          {formatCompact(netValue)}
        </span>
        <div className='w-full h-1 rounded-full bg-gray-800 overflow-hidden'>
          <div
            className='h-full rounded-full'
            style={{ width: `${barWidth}%`, backgroundColor: color }}
          />
        </div>
      </div>

      <span
        className='text-xs font-medium tabular-nums w-14 text-right shrink-0'
        style={{ color }}
      >
        {hasVolumeData ? `${Math.abs(pctVolume).toFixed(2)}%` : '—'}
      </span>
    </Link>
  );
}

function FlowList({
  title,
  items,
  isBuy,
}: {
  title: string;
  items: ForeignFlowItem[];
  isBuy: boolean;
}) {
  const validPcts = items
    .map((i) => (isBuy ? i.foreign_buy_pct_volume : i.foreign_sell_pct_volume))
    .filter((v): v is number => v != null)
    .map(Math.abs);
  const maxPct = validPcts.length > 0 ? Math.max(...validPcts) : 0;

  const totalNet = items.reduce(
    (sum, i) => sum + (isBuy ? i.foreign_buy : -i.foreign_sell),
    0,
  );
  const color = isBuy ? '#4ade80' : '#f87171';

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
      <div className='flex items-center justify-between mb-1'>
        <h3 className='font-semibold text-white text-sm'>{title}</h3>
        <span className='text-xs font-medium tabular-nums' style={{ color }}>
          {isBuy ? '+' : ''}
          {formatCompact(totalNet)} (top 10)
        </span>
      </div>
      <p className='text-[11px] text-gray-600 mb-2'>
        % terhadap volume transaksi harian
      </p>

      {items.length === 0 ? (
        <p className='text-xs text-gray-600 text-center py-6'>
          Tidak ada data.
        </p>
      ) : (
        <div className='flex flex-col divide-y divide-gray-800/60'>
          {items.map((item) => (
            <FlowRow
              key={item.ticker}
              item={item}
              isBuy={isBuy}
              maxPct={maxPct}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ForeignFlowSection({ data }: Props) {
  return (
    <div className='space-y-4'>
      <ForeignFlowSummary data={data} />

      <ForeignFlowRatioChart topBuy={data.top_buy} topSell={data.top_sell} />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <FlowList title='Top Foreign Buy' items={data.top_buy} isBuy />
        <FlowList
          title='Top Foreign Sell'
          items={data.top_sell}
          isBuy={false}
        />
      </div>

      <p className='text-[11px] text-gray-600'>
        Net dihitung dari jumlah lembar saham (foreign buy − foreign sell),
        persentase relatif terhadap volume transaksi harian. Bukan nilai
        transaksi dalam Rupiah.
      </p>
    </div>
  );
}
