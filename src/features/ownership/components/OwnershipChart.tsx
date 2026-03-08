'use client';

import ReactECharts from 'echarts-for-react';

export default function OwnershipChart({ data }: any) {
  const totalShares = Number(data.total_shares);

  const series = data.series.map((s: any) => ({
    name: s.investor,
    type: 'line',
    smooth: true,
    data: s.shares.map((share: number) => (share / totalShares) * 100),
  }));

  const maxLegendLength = Math.max(
    ...data.series.map((s) => s.investor.length),
  );

  const legendWidth = maxLegendLength * 7 + 60;

  const option = {
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value: number) => value.toFixed(2) + '%',
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
      left: 20,
      right: legendWidth,
      top: 20,
      bottom: 20,
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
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
      },
      axisLine: {
        lineStyle: {
          color: '#374151',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#1f2937',
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
