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
  const series = data.series.map((s: SeriesItem) => ({
    name: s.investor,
    type: 'line',
    smooth: false,
    connectNulls: false,
    showSymbol: true,
    symbolSize: 6,
    lineStyle: { width: 2 },
    data: s.shares,
  }));

  const maxLegendLength = Math.max(
    ...data.series.map((s: SeriesItem) => s.investor.length),
  );
  const legendWidth = maxLegendLength * 7 + 60;

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        let result = `<b>${params[0]?.axisValue ?? ''}</b><br/>`;

        params.forEach((p) => {
          const seriesData = series[p.seriesIndex].data;

          const current = seriesData[p.dataIndex] ?? 0;
          const prev = p.dataIndex > 0 ? (seriesData[p.dataIndex - 1] ?? 0) : 0;

          const change = current - prev;

          let color = '#9CA3AF';
          if (change > 0) color = '#22c55e';
          if (change < 0) color = '#ef4444';

          const formattedChange =
            p.dataIndex === 0
              ? ''
              : ` (${change > 0 ? '+' : ''}${change.toLocaleString()})`;

          result += `
        ${p.marker} ${p.seriesName}: 
        ${current.toLocaleString()}
        <span style="color:${color};font-weight:600">
          ${formattedChange}
        </span>
        <br/>
      `;
        });

        return result;
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
    },

    grid: {
      left: 50,
      right: legendWidth,
      top: 20,
      bottom: 40,
    },

    xAxis: {
      type: 'category',
      data: data.periods,
      axisLine: {
        lineStyle: { color: '#374151' },
      },
    },

    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: (value: number) => {
          const abs = Math.abs(value);

          if (abs >= 1e9) return (value / 1e9).toFixed(1) + 'B';
          if (abs >= 1e6) return (value / 1e6).toFixed(1) + 'M';
          if (abs >= 1e3) return (value / 1e3).toFixed(1) + 'K';

          return value;
        },
      },
    },

    series,
  };

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
      <ReactECharts option={option} style={{ height: 420 }} />
    </div>
  );
}
