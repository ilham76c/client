// DailyMarketForeignChart.tsx
'use client';

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { DailyMarketRaw } from '../types';
import { formatNumber } from '@/lib/utils/formatters';

const UP_COLOR = '#22c55e';
const DOWN_COLOR = '#ef4444';

export default function DailyMarketForeignChart({
  data,
}: {
  data: DailyMarketRaw[];
}) {
  const sorted = useMemo(
    () =>
      [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [data],
  );

  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      grid: { left: 60, right: 20, top: 20, bottom: 40 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1d1d1d',
        borderColor: '#374151',
        textStyle: { color: '#d5d5d5', fontSize: 12 },
        formatter: (params: any[]) => {
          const idx = params[0]?.dataIndex;
          const d = sorted[idx];
          if (!d) return '';
          const color = d.foreign_net >= 0 ? UP_COLOR : DOWN_COLOR;
          return `
            <div style="min-width:160px">
              <div style="font-weight:700;color:#fff;margin-bottom:6px;">${dayjs(d.date).format('DD MMM YYYY')}</div>
              <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Foreign Buy</span><span>${formatNumber(d.foreign_buy)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Foreign Sell</span><span>${formatNumber(d.foreign_sell)}</span></div>
              <div style="display:flex;justify-content:space-between;margin-top:4px;"><span style="color:#9CA3AF">Net</span><span style="color:${color};font-weight:600">${d.foreign_net > 0 ? '+' : ''}${formatNumber(d.foreign_net)}</span></div>
            </div>
          `;
        },
      },
      xAxis: {
        type: 'category',
        data: sorted.map((d) => dayjs(d.date).format('D MMM')),
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false },
        axisLabel: { fontSize: 11, color: '#6B7280' },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          fontSize: 11,
          color: '#9CA3AF',
          formatter: (v: number) =>
            Math.abs(v) >= 1e6 ? `${(v / 1e6).toFixed(1)}jt` : v,
        },
      },
      series: [
        {
          type: 'bar',
          data: sorted.map((d) => ({
            value: d.foreign_net,
            itemStyle: { color: d.foreign_net >= 0 ? UP_COLOR : DOWN_COLOR },
          })),
          barMaxWidth: 20,
        },
      ],
    }),
    [sorted],
  );

  return (
    <ReactECharts option={option} style={{ height: 280 }} notMerge lazyUpdate />
  );
}
