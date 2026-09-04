'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { DailyMarketRaw } from '../types';
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

function ChangePctCell({ change, pct }: { change: number; pct: number }) {
  const color =
    change > 0
      ? 'text-green-400'
      : change < 0
        ? 'text-red-400'
        : 'text-gray-500';
  return (
    <span className={color}>
      {pct > 0 ? '+' : ''}
      {pct.toFixed(2)}%
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

/** % perubahan dari previous close. change = close - prevClose, jadi prevClose = close - change. */
function calcChangePct(close: number, change: number) {
  const prevClose = close - change;
  if (prevClose === 0) return 0;
  return (change / prevClose) * 100;
}

export default function DailyMarketTable({
  data,
  embedded = false,
}: {
  data: DailyMarketRaw[];
  embedded?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
        <table className='w-full text-sm min-w-[880px]'>
          <thead className='text-gray-500 border-b border-gray-800'>
            <tr>
              <th className='text-left pb-3 font-medium'>Tanggal</th>
              <th className='text-right pb-3 font-medium'>Open</th>
              <th className='text-right pb-3 font-medium'>High</th>
              <th className='text-right pb-3 font-medium'>Low</th>
              <th className='text-right pb-3 font-medium'>Close</th>
              <th className='text-right pb-3 font-medium'>Chg</th>
              <th className='text-right pb-3 font-medium'>Chg (%)</th>
              <th className='text-right pb-3 font-medium'>Volume</th>
              <th className='text-right pb-3 font-medium'>Nilai (Rp)</th>
              <th className='text-right pb-3 font-medium'>Freq</th>
              <th className='text-right pb-3 font-medium'>F. Net (Lbr)</th>
              <th className='text-right pb-3 font-medium'>F. Buy (Rp)</th>
              <th className='text-right pb-3 font-medium'>F. Sell (Rp)</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((d) => {
              const changePct = calcChangePct(d.close, d.change);

              return (
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
                  <td className='text-right tabular-nums'>
                    <ChangePctCell change={d.change} pct={changePct} />
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
                  <td className='text-right tabular-nums'>
                    {/* <ForeignValueCell value={foreignNetValue} /> */}
                    {formatNumber(d.foreign_buy)}
                  </td>
                  <td className='text-right tabular-nums'>
                    {formatNumber(d.foreign_sell)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className='text-[11px] text-gray-600 mt-2'>
        ≈ Net Value Asing dihitung dari jumlah lembar × harga close, bukan nilai
        transaksi aktual dari bursa.
      </p>

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
