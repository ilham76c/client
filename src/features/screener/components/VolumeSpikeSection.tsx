// VolumeSpikeSection.tsx
'use client';

import { useMemo, useState } from 'react';
import VolumeSpikeRow from './VolumeSpikeRow';
import type { VolumeSpikeResponse } from '../types';

type RatioKey = 'volume_ratio_5d' | 'volume_ratio_20d';

export default function VolumeSpikeSection({
  data,
}: {
  data: VolumeSpikeResponse;
}) {
  const [ratioKey, setRatioKey] = useState<RatioKey>('volume_ratio_20d');

  const sorted = useMemo(
    () => [...data.volume_spikes].sort((a, b) => b[ratioKey] - a[ratioKey]),
    [data.volume_spikes, ratioKey],
  );

  const maxLogRatio = useMemo(() => {
    const max = Math.max(...sorted.map((i) => i[ratioKey]), 1);
    return Math.log10(max);
  }, [sorted, ratioKey]);

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
      <div className='flex items-center justify-between mb-1 flex-wrap gap-2'>
        <h3 className='font-semibold text-white text-sm'>Volume Tidak Biasa</h3>
        <div className='flex gap-1.5'>
          {(['volume_ratio_5d', 'volume_ratio_20d'] as RatioKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setRatioKey(k)}
              className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                ratioKey === k
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              vs Rata-rata {k === 'volume_ratio_5d' ? '5 Hari' : '20 Hari'}
            </button>
          ))}
        </div>
      </div>
      <p className='text-[11px] text-gray-600 mb-2'>
        Volume hari ini dibanding rata-rata historis — bukan indikasi arah
        harga.
      </p>

      {sorted.length === 0 ? (
        <p className='text-xs text-gray-600 text-center py-6'>
          Tidak ada anomali volume terdeteksi.
        </p>
      ) : (
        <div className='flex flex-col divide-y divide-gray-800/60'>
          {sorted.map((item, i) => (
            <VolumeSpikeRow
              key={item.ticker}
              item={item}
              ratioKey={ratioKey}
              maxLogRatio={maxLogRatio}
              rank={i + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
