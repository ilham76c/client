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

      formatter: (params: any) => {
        const item = allocations.find((x) => x.ticker === params.name);

        return `
          <div>
            <div style="font-weight:600;margin-bottom:6px">
              ${params.name}
            </div>

            <div>
              Shares:
              <b>${formatNumber(params.value)}</b>
            </div>

            <div>
              Portfolio:
              <b>${item?.allocation_pct ?? 0}%</b>
            </div>

            <div>
              Ownership:
              <b>${item?.ownership_pct ?? 0}%</b>
            </div>
          </div>
        `;
      },
    },

    legend: {
      show: false,
    },

    graphic: [
      {
        type: 'text',
        left: '22%',
        top: '41%',
        style: {
          text: formatShares(totalShares),
          fill: '#fff',
          fontSize: 20,
          fontWeight: 700,
          textAlign: 'center',
        },
      },
      {
        type: 'text',
        left: '22%',
        top: '52%',
        style: {
          text: `Shares\n${totalEmitens} Emitens`,
          fill: '#9ca3af',
          fontSize: 12,
          textAlign: 'center',
        },
      },
    ],

    series: [
      {
        type: 'pie',

        radius: ['58%', '82%'],

        center: ['42%', '48%'],

        avoidLabelOverlap: true,

        label: {
          show: false,
        },

        emphasis: {
          scale: true,
          scaleSize: 8,
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
