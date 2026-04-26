'use client';

import ReactECharts from 'echarts-for-react';
import { OwnershipData } from '../types';

type SeriesItem = {
  investor: string;
  shares: Array<number | null>;
};

export default function OwnershipChangesChart({
  data,
}: {
  data: OwnershipData;
}) {
  function toOwnershipPercent(series: SeriesItem[], totalShares: number) {
    return series.map((s) => ({
      ...s,
      percent: s.shares.map((val) => {
        if (!val || totalShares === 0) return null;
        return (val / totalShares) * 100;
      }),
    }));
  }

  const percentSeries = toOwnershipPercent(
    data.series as SeriesItem[],
    Number(data.total_shares),
  );

  const series = percentSeries.map((s) => ({
    name: s.investor,
    type: 'line',
    data: s.percent,
    smooth: true, // 🔥 lebih halus
    showSymbol: false, // 🔥 hilangkan noise
    symbol: 'circle',
    symbolSize: 6,

    lineStyle: {
      width: 2,
    },

    emphasis: {
      focus: 'series',
      lineStyle: {
        width: 3,
      },
    },

    // 🔥 area gradient tipis (depth)
    areaStyle: {
      opacity: 0.05,
    },
  }));

  const maxLegendLength = Math.max(
    ...data.series.map((s: SeriesItem) => s.investor.length),
  );
  const legendWidth = maxLegendLength * 7 + 60;

  const option = {
    animationEasing: 'cubicOut',
    animationDuration: 600,

    tooltip: {
      trigger: 'axis',

      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#6B7280',
          width: 1,
          type: 'dashed',
        },
      },
      backgroundColor: 'transparent',
      borderColor: '#374151',
      borderWidth: 1,
      textStyle: {
        color: '#E5E7EB',
      },
      extraCssText: 'border-radius: 8px; padding: 12px;',
      formatter: (params: any[]) => {
        let html = `
          <div style="margin-bottom:8px;font-weight:600">
            ${params[0]?.axisValue ?? ''}
          </div>
        `;

        params.forEach((p) => {
          const original = (data.series[p.seriesIndex] as SeriesItem).shares;

          const current = original[p.dataIndex] ?? 0;
          const prev = p.dataIndex > 0 ? (original[p.dataIndex - 1] ?? 0) : 0;

          const change = current - prev;
          const percent = (current / Number(data.total_shares)) * 100;

          let color = '#9CA3AF';
          if (change > 0) color = '#22c55e';
          if (change < 0) color = '#ef4444';

          html += `
            <div style="margin-bottom:10px">
              
              <!-- Title -->
              <div style="display:flex;align-items:center;gap:6px;font-weight:500">
                ${p.marker}
                <span>${p.seriesName}</span>
              </div>

              <!-- Data grid -->
              <div style="margin-left:18px;font-size:12px;line-height:1.6">
                
                <div style="display:flex;justify-content:space-between">
                  <span style="color:#9CA3AF">Shares</span>
                  <span>${current.toLocaleString()}</span>
                </div>

                <div style="display:flex;justify-content:space-between">
                  <span style="color:#9CA3AF">Ownership</span>
                  <span>${percent.toFixed(2)}%</span>
                </div>

                <div style="display:flex;justify-content:space-between">
                  <span style="color:#9CA3AF">Δ Change</span>
                  <span style="color:${color};font-weight:600">
                    ${change > 0 ? '+' : ''}${change.toLocaleString()}
                  </span>
                </div>

              </div>
            </div>
          `;
        });

        return html;
      },
    },

    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 0,
      top: 10,
      bottom: 10,

      textStyle: {
        color: '#9CA3AF',
        fontSize: 12,
      },

      itemWidth: 10,
      itemHeight: 10,
    },

    grid: {
      left: 50,
      right: legendWidth,
      top: 30,
      bottom: 40,
    },

    xAxis: {
      type: 'category',
      data: data.periods,

      axisLine: {
        lineStyle: { color: '#374151' },
      },

      axisTick: { show: false },

      axisLabel: {
        color: '#9CA3AF',
      },

      splitLine: {
        show: false,
      },
    },

    yAxis: {
      type: 'value',
      scale: true,

      axisLabel: {
        formatter: (v: number) => `${v.toFixed(2)}%`,
        color: '#9CA3AF', // 🔥 jangan putih (biar tidak terlalu kuat)
      },

      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.08)', // 🔥 lebih subtle
          width: 1,
        },
      },
    },

    series,
  };

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
      <ReactECharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        style={{ height: 420 }}
      />
    </div>
  );
}
