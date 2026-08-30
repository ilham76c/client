'use client';

import { useMemo } from 'react';
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

// Sama dengan palet di SecuritiesChart/PortfolioAllocationChart — supaya
// semua chart di app ini terasa satu keluarga visual.
const COLORS = [
  '#378ADD',
  '#1D9E75',
  '#BA7517',
  '#D4537E',
  '#7F77DD',
  '#888780',
];
const MAX_LEGEND_WIDTH = 220;

export default function OwnershipChangesChart({
  data,
}: {
  data: OwnershipData;
}) {
  const hasData = data.periods.length > 0 && data.series.length > 0;
  const totalShares = Number(data.total_shares) || 0;

  const percentSeries = useMemo(() => {
    return (data.series as SeriesItem[]).map((s) => ({
      ...s,
      percent: s.shares.map((val) => {
        if (val == null || totalShares === 0) return null;
        return (Number(val) / totalShares) * 100;
      }),
    }));
  }, [data.series, totalShares]);

  const legendWidth = useMemo(() => {
    const maxLegendLength = Math.max(
      ...data.series.map((s: SeriesItem) => s.investor.length),
      0,
    );
    return Math.min(maxLegendLength * 7 + 60, MAX_LEGEND_WIDTH);
  }, [data.series]);

  const option = useMemo(() => {
    const series = percentSeries.map((s, index) => ({
      name: s.investor,
      type: 'line',
      data: s.percent,
      smooth: true,
      showSymbol: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { width: 2, color: COLORS[index % COLORS.length] },
      itemStyle: { color: COLORS[index % COLORS.length] },
      emphasis: {
        focus: 'series',
        lineStyle: { width: 3 },
      },
      areaStyle: { color: COLORS[index % COLORS.length], opacity: 0.05 },
    }));

    return {
      animationEasing: 'cubicOut',
      animationDuration: 600,

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: { color: '#6B7280', width: 1, type: 'dashed' },
        },
        backgroundColor: 'transparent',
        borderColor: '#374151',
        borderWidth: 1,
        textStyle: { color: '#E5E7EB' },
        extraCssText: 'border-radius: 8px; padding: 12px; max-width: 90vw;',
        formatter: (params: EChartsTooltipParam[]) => {
          const date = params[0]?.axisValue ?? '';
          let rows = '';

          params.forEach((p) => {
            const original = (data.series[p.seriesIndex] as SeriesItem).shares;
            const current = original[p.dataIndex] ?? 0;
            const prev = p.dataIndex > 0 ? (original[p.dataIndex - 1] ?? 0) : 0;
            const change = current - prev;
            const percent = totalShares > 0 ? (current / totalShares) * 100 : 0;

            let color = '#9CA3AF';
            if (change > 0) color = '#22c55e';
            if (change < 0) color = '#ef4444';

            rows += `
              <tr>
                <td style="padding:6px 12px 6px 0; white-space:nowrap; max-width:220px; overflow:hidden; text-overflow:ellipsis;">
                  ${p.marker} ${p.seriesName}
                </td>
                <td style="padding:6px 12px; text-align:right; color:#E5E7EB; white-space:nowrap;">
                  ${current.toLocaleString('id-ID')}
                </td>
                <td style="padding:6px 12px; text-align:right; color:#E5E7EB; white-space:nowrap;">
                  ${percent.toFixed(2)}%
                </td>
                <td style="padding:6px 0; text-align:right; color:${color}; font-weight:600; white-space:nowrap;">
                  ${change > 0 ? '+' : ''}${change.toLocaleString('id-ID')}
                </td>
              </tr>
            `;
          });

          return `
            <div style="padding:6px 8px; min-width:min(520px, 85vw);">
              <div style="font-weight:700; margin-bottom:10px; color:#fff; font-size:14px;">
                ${date}
              </div>
              <table style="width:100%; border-collapse:collapse; font-size:12px;">
                <thead>
                  <tr style="color:#9CA3AF; text-align:left; border-bottom:1px solid rgba(255,255,255,0.08);">
                    <th style="padding-bottom:8px;">Investor</th>
                    <th style="padding-bottom:8px; text-align:right;">Saham</th>
                    <th style="padding-bottom:8px; text-align:right;">Kepemilikan</th>
                    <th style="padding-bottom:8px; text-align:right;">Δ Perubahan</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
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
        width: legendWidth - 16, // dikunci sama dengan ruang di grid.right, dikurangi sedikit padding
        textStyle: {
          color: '#9CA3AF',
          fontSize: 12,
          overflow: 'truncate', // potong nama panjang dengan "...", bukan wrap/meluber
          width: legendWidth - 40,
        },
        itemWidth: 10,
        itemHeight: 10,
        tooltip: {
          show: true, // supaya nama yang terpotong tetap bisa dibaca lengkap via hover
        },
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
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF' },
        splitLine: { show: false },
      },

      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (v: number) => `${v.toFixed(2)}%`,
          color: '#9CA3AF',
        },
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(255,255,255,0.08)', width: 1 },
        },
      },

      series,
    };
  }, [percentSeries, legendWidth, data.periods, data.series, totalShares]);

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
            Belum Ada Data Tren Kepemilikan
          </div>
          <div className='text-sm text-gray-500 max-w-md'>
            Data historis kepemilikan belum tersedia untuk saham ini.
          </div>
        </div>
      )}
    </div>
  );
}
