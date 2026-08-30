'use client';

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { DailyMarketRaw } from '../types';
import { formatNumber } from '@/lib/utils/formatters';

const UP_COLOR = '#22c55e';
const DOWN_COLOR = '#ef4444';

interface Props {
  data: DailyMarketRaw[];
}

export default function DailyMarketChart({ data }: Props) {
  const labels = data.map((d) => dayjs(d.date).format('D MMM'));
  const ohlc = data.map((d) => [d.open, d.close, d.low, d.high]);

  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      animationDuration: 400,
      axisPointer: { link: [{ xAxisIndex: 'all' }] },

      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1d1d1d',
        borderColor: '#374151',
        textStyle: { color: '#d5d5d5', fontSize: 12 },
        formatter: (params: any[]) => {
          const idx = params[0]?.dataIndex;
          if (idx == null) return '';
          const d = data[idx];
          const changeColor =
            d.change > 0 ? UP_COLOR : d.change < 0 ? DOWN_COLOR : '#9CA3AF';
          const foreignColor = d.foreign_net >= 0 ? UP_COLOR : DOWN_COLOR;

          return `
            <div style="min-width:180px">
              <div style="font-weight:700;color:#fff;margin-bottom:6px;">${dayjs(d.date).format('DD MMM YYYY')}</div>
              <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Open</span><span>${formatNumber(d.open)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">High</span><span>${formatNumber(d.high)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Low</span><span>${formatNumber(d.low)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Close</span><span style="color:${changeColor};font-weight:600">${formatNumber(d.close)} (${d.change > 0 ? '+' : ''}${d.change})</span></div>
              <div style="display:flex;justify-content:space-between;margin-top:4px;"><span style="color:#9CA3AF">Volume</span><span>${formatNumber(d.volume)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Net Asing</span><span style="color:${foreignColor};font-weight:600">${d.foreign_net > 0 ? '+' : ''}${formatNumber(d.foreign_net)}</span></div>
            </div>
          `;
        },
      },

      // Tiga panel: harga (58%), volume (16%), aliran asing (16%)
      grid: [
        { left: 60, right: 20, top: 20, height: '52%' },
        { left: 60, right: 20, top: '66%', height: '14%' },
        { left: 60, right: 20, top: '84%', height: '14%' },
      ],

      xAxis: [
        {
          type: 'category',
          gridIndex: 0,
          data: labels,
          boundaryGap: true,
          axisLabel: { show: false },
          axisLine: { lineStyle: { color: '#374151' } },
          axisTick: { show: false },
        },
        {
          type: 'category',
          gridIndex: 1,
          data: labels,
          boundaryGap: true,
          axisLabel: { show: false },
          axisLine: { lineStyle: { color: '#374151' } },
          axisTick: { show: false },
        },
        {
          type: 'category',
          gridIndex: 2,
          data: labels,
          boundaryGap: true,
          axisLabel: { fontSize: 11, color: '#6B7280' },
          axisLine: { lineStyle: { color: '#374151' } },
          axisTick: { show: false },
        },
      ],

      yAxis: [
        {
          type: 'value',
          gridIndex: 0,
          scale: true,
          axisLabel: {
            color: '#9CA3AF',
            formatter: (v: number) => v.toLocaleString('id-ID'),
          },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
        },
        {
          type: 'value',
          gridIndex: 1,
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            fontSize: 10,
            color: '#6B7280',
            formatter: (v: number) =>
              v >= 1e6 ? `${(v / 1e6).toFixed(1)}jt` : v,
          },
        },
        {
          type: 'value',
          gridIndex: 2,
          splitLine: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            fontSize: 10,
            color: '#6B7280',
            formatter: (v: number) =>
              Math.abs(v) >= 1e6 ? `${(v / 1e6).toFixed(1)}jt` : v,
          },
        },
      ],

      series: [
        {
          type: 'candlestick',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: ohlc,
          itemStyle: {
            color: UP_COLOR,
            color0: DOWN_COLOR,
            borderColor: UP_COLOR,
            borderColor0: DOWN_COLOR,
          },
        },
        {
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: data.map((d) => ({
            value: d.volume,
            itemStyle: {
              color:
                d.change >= 0 ? 'rgba(34,197,94,0.55)' : 'rgba(239,68,68,0.55)',
            },
          })),
          barMaxWidth: 12,
        },
        {
          type: 'bar',
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: data.map((d) => ({
            value: d.foreign_net,
            itemStyle: { color: d.foreign_net >= 0 ? UP_COLOR : DOWN_COLOR },
          })),
          barMaxWidth: 12,
        },
      ],
    }),
    [data, labels, ohlc],
  );

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
      <div className='flex gap-4 text-[11px] text-gray-500 uppercase tracking-wide mb-1 pl-1'>
        <span className='ml-auto pr-2'>Harga</span>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 460 }}
        notMerge
        lazyUpdate
      />
      <div className='flex justify-between text-[11px] text-gray-600 px-1 mt-1'>
        <span>Volume</span>
        <span>Net Asing (hijau = net beli, merah = net jual)</span>
      </div>
    </div>
  );
}
