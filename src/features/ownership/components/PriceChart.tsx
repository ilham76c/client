'use client';

import ReactECharts from 'echarts-for-react';
import { PriceInterval, PricePoint } from '../types';

type EChartsTooltipParam = {
  axisValue: string;
  marker: string;
  value: number | null;
  dataIndex: number;
};

interface Props {
  data: PricePoint[];
  interval?: PriceInterval;
}

export default function PriceChart({ data, interval = 'daily' }: Props) {
  const hasData = data.length > 0;

  const labels = data.map((p) => formatAxisLabel(p.timestamp, interval));
  const closes = data.map((p) => p.close);

  const firstClose = closes[0] ?? 0;
  const lastClose = closes[closes.length - 1] ?? 0;
  const isUp = lastClose >= firstClose;
  const lineColor = isUp ? '#22c55e' : '#ef4444';

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
      textStyle: { color: '#E5E7EB' },
      extraCssText: 'border-radius: 8px; padding: 10px 14px;',
      formatter: (params: EChartsTooltipParam[]) => {
        const p = params[0];
        if (!p) return '';

        const current = closes[p.dataIndex] ?? 0;
        const prev = p.dataIndex > 0 ? closes[p.dataIndex - 1] : current;
        const change = current - prev;
        const changePct = prev !== 0 ? (change / prev) * 100 : 0;
        const color = change > 0 ? '#22c55e' : change < 0 ? '#ef4444' : '#9CA3AF';
        const priceLabel = interval === 'hourly' ? 'Price' : 'Close';

        return `
          <div style="min-width:160px">
            <div style="font-weight:700; margin-bottom:6px; color:#fff; font-size:13px;">
              ${p.axisValue}
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span style="color:#9CA3AF;">${priceLabel}</span>
              <span style="color:#E5E7EB; font-weight:600;">
                ${current.toLocaleString('id-ID')}
              </span>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span style="color:#9CA3AF;">Change</span>
              <span style="color:${color}; font-weight:600;">
                ${change > 0 ? '+' : ''}${change.toLocaleString('id-ID')} (${changePct.toFixed(2)}%)
              </span>
            </div>
          </div>
        `;
      },
    },

    grid: {
      left: 60,
      right: 20,
      top: 20,
      bottom: 40,
    },

    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#374151' } },
      axisTick: { show: false },
      axisLabel: { color: '#9CA3AF' },
      splitLine: { show: false },
    },

    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: (v: number) => v.toLocaleString('id-ID'),
        color: '#9CA3AF',
      },
      splitLine: {
        show: true,
        lineStyle: { color: 'rgba(255,255,255,0.08)', width: 1 },
      },
    },

    series: [
      {
        name: interval === 'hourly' ? 'Price' : 'Close',
        type: 'line',
        data: closes,
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: lineColor },
        itemStyle: { color: lineColor },
        emphasis: {
          focus: 'series',
          lineStyle: { width: 3 },
        },
        areaStyle: {
          color: lineColor,
          opacity: 0.08,
        },
      },
    ],
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {hasData ? (
        <ReactECharts
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{ height: 360 }}
        />
      ) : (
        <div className="h-[360px] flex flex-col items-center justify-center text-center">
          <div className="text-lg font-medium text-gray-300 mb-2">
            No Price Data
          </div>
          <div className="text-sm text-gray-500 max-w-md">
            Historical price data is not available yet for this stock.
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Format the x-axis label based on interval:
 * - hourly: show time only (e.g. "09:00")
 * - daily:  show date only (e.g. "19 Jun")
 */
function formatAxisLabel(timestamp: string, interval: PriceInterval): string {
  const d = new Date(timestamp);

  if (interval === 'hourly') {
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}