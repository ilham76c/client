'use client';

import ReactECharts from 'echarts-for-react';
import { formatShares, formatNumber } from '@/lib/utils/formatters';
import { InvestorAllocation } from '../types';

interface Props {
  allocations: InvestorAllocation[];
  totalShares: number;
  totalEmitens: number;
}

export default function PortfolioAllocationChart({
  allocations,
  totalShares,
  totalEmitens,
}: Props) {
  const top3Pct = allocations
    .slice(0, 3)
    .reduce((sum, item) => sum + item.allocation_pct, 0);

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}<br />{d}%',
    },

    series: [
      {
        type: 'pie',

        radius: ['45%', '75%'],

        label: {
          show: true,

          formatter: '{b}\n{d}%',

          color: '#fff',

          fontSize: 12,

          fontWeight: 500,
        },

        labelLine: {
          show: true,
        },

        data: allocations.map((item) => ({
          name: item.ticker,
          value: item.shares,
        })),
      },
    ],
  };

  return (
    <div className='space-y-6'>
      <ReactECharts
        option={option}
        style={{
          height: 340,
          width: '100%',
        }}
      />

      <div className='border-t border-gray-800 pt-4'>
        <div className='text-sm text-gray-400 mb-3'>Portfolio Insights</div>

        <div className='grid grid-cols-3 gap-6'>
          <div>
            <div className='text-xs text-gray-500'>Largest Position</div>

            <div className='text-lg font-semibold text-white'>
              {allocations[0]?.ticker ?? '-'}
            </div>

            <div className='text-xs text-gray-400'>
              {allocations[0]?.allocation_pct ?? 0}%
            </div>
          </div>

          <div>
            <div className='text-xs text-gray-500'>Top 3 Holdings</div>

            <div className='text-lg font-semibold text-white'>
              {top3Pct.toFixed(1)}%
            </div>
          </div>

          <div>
            <div className='text-xs text-gray-500'>Concentration</div>

            <div className='text-lg font-semibold text-white'>
              {top3Pct > 70
                ? 'High'
                : top3Pct > 50
                  ? 'Moderate'
                  : 'Diversified'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
