'use client';

import ReactECharts from 'echarts-for-react';
import { OwnershipData } from '../types';


type EChartsTooltipParam = {
  axisValue: string;
  seriesIndex: number;
  dataIndex: number;
  marker: string;
  seriesName: string;
  value: number | null;
};
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
        if (val == null || totalShares === 0) {
          return null;
        }

        return (Number(val) / totalShares) * 100;
      }),
    }));
  }

  const hasData = data.periods.length > 0 && data.series.length > 0;

  const percentSeries = toOwnershipPercent(
    data.series as SeriesItem[],
    Number(data.total_shares),
  );

  const series = percentSeries.map((s) => ({
    name: s.investor,
    type: 'line',
    data: s.percent,
    smooth: true, // 🔥 lebih halus
    showSymbol: true,
    symbol: 'circle',
    symbolSize: 6,
    // step: 'middle',

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
      formatter: (params: EChartsTooltipParam[]) => {
        const date = params[0]?.axisValue ?? '';

        let rows = '';

        params.forEach((p) => {
          const original = (data.series[p.seriesIndex] as SeriesItem).shares;

          const current = original[p.dataIndex] ?? 0;

          const prev = p.dataIndex > 0 ? (original[p.dataIndex - 1] ?? 0) : 0;

          const change = current - prev;

          const percent = (current / Number(data.total_shares)) * 100;

          let color = '#9CA3AF';

          if (change > 0) color = '#22c55e';

          if (change < 0) color = '#ef4444';

          rows += `
          <tr>

            <!-- Investor -->
            <td style="
              padding:6px 12px 6px 0;
              white-space:nowrap;
              max-width:220px;
              overflow:hidden;
              text-overflow:ellipsis;
            ">
              ${p.marker}
              ${p.seriesName}
            </td>

            <!-- Shares -->
            <td style="
              padding:6px 12px;
              text-align:right;
              color:#E5E7EB;
              white-space:nowrap;
            ">
              ${current.toLocaleString()}
            </td>

            <!-- Ownership -->
            <td style="
              padding:6px 12px;
              text-align:right;
              color:#E5E7EB;
              white-space:nowrap;
            ">
              ${percent.toFixed(2)}%
            </td>

            <!-- Change -->
            <td style="
              padding:6px 0;
              text-align:right;
              color:${color};
              font-weight:600;
              white-space:nowrap;
            ">
              ${change > 0 ? '+' : ''}${change.toLocaleString()}
            </td>

          </tr>
        `;
        });

        return `
        <div style="
          padding:6px 8px;
          min-width:520px;
        ">

          <!-- Date -->
          <div style="
            font-weight:700;
            margin-bottom:10px;
            color:#fff;
            font-size:14px;
          ">
            ${date}
          </div>

          <!-- Table -->
          <table style="
            width:100%;
            border-collapse:collapse;
            font-size:12px;
          ">

            <thead>
              <tr style="
                color:#9CA3AF;
                text-align:left;
                border-bottom:1px solid rgba(255,255,255,0.08);
              ">

                <th style="padding-bottom:8px">
                  Investor
                </th>

                <th style="
                  padding-bottom:8px;
                  text-align:right;
                ">
                  Shares
                </th>

                <th style="
                  padding-bottom:8px;
                  text-align:right;
                ">
                  Ownership
                </th>

                <th style="
                  padding-bottom:8px;
                  text-align:right;
                ">
                  Δ Change
                </th>

              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>

          </table>
        </div>
      `;
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
      {hasData ? (
        <ReactECharts
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{ height: 420 }}
        />
      ) : (
        <div className='h-[420px] flex flex-col items-center justify-center text-center'>
          <div className='text-lg font-medium text-gray-300 mb-2'>
            No Ownership Trend Data
          </div>

          <div className='text-sm text-gray-500 max-w-md'>
            Historical ownership data is not available yet for this stock.
          </div>
        </div>
      )}
    </div>
  );
}
