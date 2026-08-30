'use client';

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { formatShares, formatNumber } from '@/lib/utils/formatters';
import { InvestorAllocation } from '../types';

interface Props {
  allocations: InvestorAllocation[];
  totalShares: number;
  totalEmitens: number;
}

// Sama persis dengan palet yang dipakai di SecuritiesChart — supaya kedua
// chart terasa satu keluarga visual, bukan dua aplikasi berbeda.
const COLORS = [
  '#378ADD',
  '#1D9E75',
  '#BA7517',
  '#D4537E',
  '#7F77DD',
  '#888780',
];

function concentrationLabel(top3Pct: number) {
  if (top3Pct > 70) return { label: 'Tinggi', color: '#f87171' };
  if (top3Pct > 50) return { label: 'Sedang', color: '#facc15' };
  return { label: 'Terdiversifikasi', color: '#34d399' };
}

export default function PortfolioAllocationChart({
  allocations,
  totalShares,
  totalEmitens,
}: Props) {
  // Jangan asumsikan urutan API — pastikan terurut descending di sini.
  const sorted = useMemo(
    () => [...allocations].sort((a, b) => b.allocation_pct - a.allocation_pct),
    [allocations],
  );

  const top3Pct = sorted
    .slice(0, 3)
    .reduce((sum, item) => sum + item.allocation_pct, 0);

  const concentration = concentrationLabel(top3Pct);

  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1d1d1d',
        borderColor: '#374151',
        textStyle: { color: '#d5d5d5', fontSize: 12 },
        formatter: (params: any) =>
          `${params.marker} ${params.name}<br/>${formatNumber(params.value)} lembar (${params.percent}%)`,
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '75%'],
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            color: '#d1d5db',
            fontSize: 12,
            fontWeight: 500,
          },
          labelLine: {
            show: true,
            lineStyle: { color: '#4b5563' },
          },
          itemStyle: {
            borderColor: '#111827',
            borderWidth: 2,
          },
          data: sorted.map((item, index) => ({
            name: item.ticker,
            value: item.shares,
            itemStyle: { color: COLORS[index % COLORS.length] },
          })),
        },
      ],
    }),
    [sorted],
  );

  if (sorted.length === 0) {
    return (
      <div className='flex items-center justify-center py-16 text-sm text-gray-500'>
        Belum ada data alokasi portofolio.
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <ReactECharts
        option={option}
        style={{ height: 340, width: '100%' }}
        notMerge
        lazyUpdate
      />

      <div className='border-t border-gray-800 pt-4'>
        <div className='text-sm text-gray-400 mb-3'>Ringkasan Portofolio</div>

        <div className='grid grid-cols-3 gap-6'>
          <div>
            <div className='text-xs text-gray-500'>Posisi Terbesar</div>
            <div className='text-lg font-semibold text-white'>
              {sorted[0]?.ticker ?? '-'}
            </div>
            <div className='text-xs text-gray-400'>
              {sorted[0]?.allocation_pct ?? 0}%
            </div>
          </div>

          <div>
            <div className='text-xs text-gray-500'>Top 3 Holdings</div>
            <div className='text-lg font-semibold text-white'>
              {top3Pct.toFixed(1)}%
            </div>
          </div>

          <div>
            <div className='text-xs text-gray-500'>Konsentrasi</div>
            <div
              className='text-lg font-semibold'
              style={{ color: concentration.color }}
            >
              {concentration.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
