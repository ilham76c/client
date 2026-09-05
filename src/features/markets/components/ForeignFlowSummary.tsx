'use client';

import { useMemo } from 'react';
import type { ForeignFlowResponse } from '../types';

function formatCompact(v: number) {
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return `${(abs / 1_000_000_000).toFixed(2)}M`;
  if (abs >= 1_000_000) return `${(abs / 1_000_000).toFixed(2)}jt`;
  return abs.toLocaleString('id-ID');
}

export default function ForeignFlowSummary({
  data,
}: {
  data: ForeignFlowResponse;
}) {
  const { totalBuy, totalSell, buyShare } = useMemo(() => {
    const totalBuy = data.top_buy.reduce((sum, i) => sum + i.foreign_buy, 0);
    const totalSell = data.top_sell.reduce((sum, i) => sum + i.foreign_sell, 0);
    const total = totalBuy + totalSell;
    const buyShare = total > 0 ? (totalBuy / total) * 100 : 50;
    return { totalBuy, totalSell, buyShare };
  }, [data]);

  const sellShare = 100 - buyShare;
  const dominance =
    buyShare >= 55 ? 'buy' : buyShare <= 45 ? 'sell' : 'balanced';

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
      <div className='flex items-center justify-between mb-3 flex-wrap gap-2'>
        <h3 className='font-semibold text-white text-sm'>
          Komposisi Aliran (Top 10 + Top 10)
        </h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-md border ${
            dominance === 'buy'
              ? 'text-green-400 border-green-500/30 bg-green-500/10'
              : dominance === 'sell'
                ? 'text-red-400 border-red-500/30 bg-red-500/10'
                : 'text-gray-400 border-gray-700 bg-gray-800'
          }`}
        >
          {dominance === 'buy'
            ? 'Didominasi aksi beli'
            : dominance === 'sell'
              ? 'Didominasi aksi jual'
              : 'Relatif seimbang'}
        </span>
      </div>

      {/* Stacked bar hijau-merah */}
      <div className='flex h-3 rounded-full overflow-hidden mb-2'>
        <div
          className='bg-emerald-500 transition-all'
          style={{ width: `${buyShare}%` }}
        />
        <div
          className='bg-red-500 transition-all'
          style={{ width: `${sellShare}%` }}
        />
      </div>

      <div className='flex items-center justify-between text-xs'>
        <div>
          <span className='text-emerald-400 font-semibold'>
            {buyShare.toFixed(1)}%
          </span>
          <span className='text-gray-500 ml-1'>
            Beli · {formatCompact(totalBuy)} lembar
          </span>
        </div>
        <div className='text-right'>
          <span className='text-red-400 font-semibold'>
            {sellShare.toFixed(1)}%
          </span>
          <span className='text-gray-500 ml-1'>
            Jual · {formatCompact(totalSell)} lembar
          </span>
        </div>
      </div>

      <p className='text-[10px] text-gray-600 mt-2'>
        Dihitung dari total lembar top 10 buy vs top 10 sell — bukan keseluruhan
        pasar.
      </p>
    </div>
  );
}
