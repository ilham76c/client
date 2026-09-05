'use client';

import { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { ForeignFlowItem } from '../types';

type Tab = 'buy' | 'sell';

export default function ForeignFlowRatioChart({
  topBuy,
  topSell,
}: {
  topBuy: ForeignFlowItem[];
  topSell: ForeignFlowItem[];
}) {
  const [tab, setTab] = useState<Tab>('buy');

  const items = tab === 'buy' ? topBuy : topSell;
  // Reverse supaya ticker dengan % tertinggi tampil di atas (echarts
  // kategori vertikal menggambar index 0 di bawah secara default).
  const sorted = useMemo(() => [...items].reverse(), [items]);

  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      grid: { left: 60, right: 50, top: 10, bottom: 10 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#1d1d1d',
        borderColor: '#374151',
        textStyle: { color: '#d5d5d5', fontSize: 12 },
        formatter: (params: any[]) => {
          const idx = sorted.length - 1 - params[0]?.dataIndex;
          const item = items[idx];
          if (!item) return '';

          const hasVolumeData = item.foreign_buy_pct_volume != null;

          return `
            <div style="min-width:180px">
              <div style="font-weight:700;color:#fff;margin-bottom:4px;">${item.ticker} — ${item.name}</div>
              ${
                hasVolumeData
                  ? `
                <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Buy % volume</span><span style="color:#4ade80">${item.foreign_buy_pct_volume!.toFixed(2)}%</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Sell % volume</span><span style="color:#f87171">${item.foreign_sell_pct_volume!.toFixed(2)}%</span></div>
              `
                  : `<div style="color:#9CA3AF">Data volume tidak tersedia</div>`
              }
            </div>
          `;
        },
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: (v: number) => `${Math.abs(v)}%`,
          color: '#6b7280',
          fontSize: 10,
        },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: sorted.map((i) => i.ticker),
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false },
        axisLabel: { color: '#9ca3af', fontSize: 11 },
      },
      series: [
        {
          name: 'Sell % volume',
          type: 'bar',
          stack: 'total',
          data: sorted.map((i) => -(i.foreign_sell_pct_volume ?? 0)),
          itemStyle: { color: '#ef4444' },
          barMaxWidth: 14,
        },
        {
          name: 'Buy % volume',
          type: 'bar',
          stack: 'total',
          data: sorted.map((i) => i.foreign_buy_pct_volume ?? 0),
          itemStyle: { color: '#22c55e' },
          barMaxWidth: 14,
        },
      ],
    }),
    [sorted, items],
  );

  if (items.length === 0) {
    return (
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
        <h3 className='font-semibold text-white text-sm mb-2'>
          Buy % vs Sell % terhadap Volume Transaksi
        </h3>
        <div className='h-[280px] flex items-center justify-center'>
          <p className='text-xs text-gray-600'>
            Tidak ada data untuk ditampilkan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
      <div className='flex items-center justify-between mb-3 flex-wrap gap-2'>
        <h3 className='font-semibold text-white text-sm'>
          Buy % vs Sell % terhadap Volume Transaksi
        </h3>
        <div className='flex gap-1.5'>
          {(['buy', 'sell'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                tab === t
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              Top {t === 'buy' ? 'Buy' : 'Sell'}
            </button>
          ))}
        </div>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 320 }}
        notMerge
        lazyUpdate
      />

      <p className='text-[10px] text-gray-600 mt-1'>
        % dihitung dari lembar saham asing dibagi volume transaksi harian
        emiten.
      </p>
    </div>
  );
}
