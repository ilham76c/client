// VolumeSpikeRow.tsx
'use client';

import Link from 'next/link';

function formatCompact(v: number) {
  const abs = Math.abs(v);
  if (abs >= 1_000_000_000) return `${(abs / 1_000_000_000).toFixed(2)}M`;
  if (abs >= 1_000_000) return `${(abs / 1_000_000).toFixed(2)}jt`;
  if (abs >= 1_000) return `${(abs / 1_000).toFixed(1)}rb`;
  return abs.toLocaleString('id-ID');
}

// Skala warna intensitas — netral (bukan hijau/merah), karena rasio
// volume bukan sinyal bullish/bearish, cuma penanda "tidak biasa".
function ratioIntensity(ratio: number) {
  if (ratio >= 30)
    return {
      color: '#fb923c',
      bg: 'rgba(251,146,60,0.12)',
      label: 'Sangat tinggi',
    };
  if (ratio >= 15)
    return { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', label: 'Tinggi' };
  return { color: '#a3a3a3', bg: 'rgba(163,163,163,0.1)', label: 'Meningkat' };
}

export default function VolumeSpikeRow({
  item,
  ratioKey,
  maxLogRatio,
  rank,
}: {
  item: import('../types').VolumeSpikeItem;
  ratioKey: 'volume_ratio_5d' | 'volume_ratio_20d';
  maxLogRatio: number;
  rank: number;
}) {
  const ratio = item[ratioKey];
  const { color, bg, label } = ratioIntensity(ratio);

  // Skala log supaya rentang 5x–59x tetap proporsional secara visual,
  // bukan bar linear yang membuat nilai kecil nyaris tak terlihat.
  const barWidth =
    maxLogRatio > 0
      ? Math.min((Math.log10(ratio) / maxLogRatio) * 100, 100)
      : 0;

  const isUp = item.change > 0;
  const isDown = item.change < 0;
  const changePct =
    item.previous_close !== 0 ? (item.change / item.previous_close) * 100 : 0;
  const hasValidOpen = item.open > 0;

  return (
    <Link
      href={`/stocks/${item.ticker}`}
      className='
        group
        block
        rounded-lg
        px-2
        py-2.5
        transition-colors
        hover:bg-gray-800/40
      '
    >
      {/* Row utama */}
      <div
        className='grid items-center gap-4'
        style={{
          gridTemplateColumns: '28px 260px 90px minmax(0, 1fr) 90px',
        }}
      >
        {/* Rank */}
        <div className='text-xs text-gray-600 tabular-nums'>{rank}</div>

        {/* Emiten */}
        <div className='min-w-0'>
          <div className='text-sm font-semibold text-white'>{item.ticker}</div>
          <div className='truncate text-xs text-gray-500'>{item.name}</div>
        </div>

        {/* Price */}
        <div className='text-right'>
          <div className='text-sm font-medium text-white tabular-nums'>
            {item.close.toLocaleString('id-ID')}
          </div>

          <div
            className={`text-xs tabular-nums ${
              isUp
                ? 'text-green-400'
                : isDown
                  ? 'text-red-400'
                  : 'text-gray-500'
            }`}
          >
            {isUp ? '+' : ''}
            {changePct.toFixed(2)}%
          </div>
        </div>

        {/* Volume info */}
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='truncate text-xs text-gray-500'>
              Vol {formatCompact(item.volume)} vs avg{' '}
              {formatCompact(item.volume_avg_20d)}
            </span>

            <span
              className='shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums'
              style={{
                color,
                backgroundColor: bg,
              }}
            >
              {ratio.toFixed(1)}x
            </span>
          </div>

          <div className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-800'>
            <div
              className='h-full rounded-full'
              style={{
                width: `${barWidth}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>

        {/* Foreign */}
        <div className='text-right'>
          <div
            className={`text-xs font-medium tabular-nums ${
              item.foreign_net > 0
                ? 'text-green-400'
                : item.foreign_net < 0
                  ? 'text-red-400'
                  : 'text-gray-500'
            }`}
          >
            {item.foreign_net > 0 ? '+' : ''}
            {formatCompact(item.foreign_net)}
          </div>

          <div className='text-[10px] text-gray-600'>net asing</div>
        </div>
      </div>
    </Link>
  );
}
