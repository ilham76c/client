'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { DailyMarket, DailyMarketRaw } from '../types';
import { formatNumber } from '@/lib/utils/formatters';

const PAGE_SIZE = 15;

function ChangeCell({ change }: { change: number }) {
  const color =
    change > 0
      ? 'text-green-400'
      : change < 0
        ? 'text-red-400'
        : 'text-gray-500';
  return (
    <span className={color}>
      {change > 0 ? '+' : ''}
      {Math.trunc(change)}
    </span>
  );
}

function ForeignNetCell({ net }: { net: number }) {
  const color =
    net > 0 ? 'text-green-400' : net < 0 ? 'text-red-400' : 'text-gray-500';
  return (
    <span className={color}>
      {net > 0 ? '+' : ''}
      {formatNumber(net)}
    </span>
  );
}

export default function DailyMarketTable({
  data,
  embedded = false,
}: {
  data: DailyMarketRaw[];
  embedded?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Data terbaru di atas, konsisten dengan pola tabel/list lain di app
  const sorted = [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const visible = sorted.slice(0, visibleCount);
  const hasMore = sorted.length > visibleCount;

  return (
    <div
      className={
        embedded ? '' : 'bg-gray-900 border border-gray-800 rounded-xl p-6'
      }
    >
      {!embedded && (
        <h2 className='font-semibold text-white mb-4'>
          Detail Perdagangan Harian
        </h2>
      )}

      <div className='overflow-x-auto'>
        <table className='w-full text-sm min-w-[760px]'>
          <thead className='text-gray-500 border-b border-gray-800'>
            <tr>
              <th className='text-left pb-3 font-medium'>Tanggal</th>
              <th className='text-right pb-3 font-medium'>Open</th>
              <th className='text-right pb-3 font-medium'>High</th>
              <th className='text-right pb-3 font-medium'>Low</th>
              <th className='text-right pb-3 font-medium'>Close</th>
              <th className='text-right pb-3 font-medium'>Change</th>
              <th className='text-right pb-3 font-medium'>Volume</th>
              <th className='text-right pb-3 font-medium'>Nilai (Rp)</th>
              <th className='text-right pb-3 font-medium'>Freq</th>
              <th className='text-right pb-3 font-medium'>Net Asing</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((d) => (
              <tr
                key={d.date}
                className='border-b border-gray-800 hover:bg-gray-800/40 transition-colors'
              >
                <td className='py-2.5 text-gray-300'>
                  {dayjs(d.date).format('DD MMM YYYY')}
                </td>
                <td className='text-right text-gray-400 tabular-nums'>
                  {formatNumber(d.open)}
                </td>
                <td className='text-right text-gray-400 tabular-nums'>
                  {formatNumber(d.high)}
                </td>
                <td className='text-right text-gray-400 tabular-nums'>
                  {formatNumber(d.low)}
                </td>
                <td className='text-right text-white font-medium tabular-nums'>
                  {formatNumber(d.close)}
                </td>
                <td className='text-right tabular-nums'>
                  <ChangeCell change={d.change} />
                </td>
                <td className='text-right text-gray-400 tabular-nums'>
                  {formatNumber(d.volume)}
                </td>
                <td className='text-right text-gray-400 tabular-nums'>
                  {formatNumber(d.value)}
                </td>
                <td className='text-right text-gray-400 tabular-nums'>
                  {formatNumber(d.frequency)}
                </td>
                <td className='text-right tabular-nums'>
                  <ForeignNetCell net={d.foreign_net} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <button
          onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
          className='w-full text-sm text-gray-400 hover:text-white border border-gray-800 rounded-lg py-2.5 mt-4 transition-colors'
        >
          Muat lebih banyak ({sorted.length - visibleCount} lainnya)
        </button>
      )}
    </div>
  );
}
