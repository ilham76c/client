'use client';

import ReactECharts from 'echarts-for-react';
import { PriceInterval, PricePoint } from '../types';

type EChartsTooltipParam = {
  axisValue: string;
  marker: string;
  value: number | null;
  dataIndex: number;
  seriesName: string;
};

interface Props {
  data: PricePoint[];
  interval?: PriceInterval;
}

export default function PriceChart({ data, interval = 'daily' }: Props) {
  const hasData = data.length > 0;
  const hasVolume = data.some((p) => p.volume != null);

  const labels = data.map((p) => formatAxisLabel(p.timestamp, interval));
  const closes = data.map((p) => p.close);
  const volumes = data.map((p) => p.volume ?? 0);

  const firstClose = closes[0] ?? 0;
  const lastClose = closes[closes.length - 1] ?? 0;
  const isUp = lastClose >= firstClose;
  const lineColor = isUp ? '#22c55e' : '#ef4444';

  const highIndex = closes.length
    ? closes.reduce((best, v, i) => (v > closes[best] ? i : best), 0)
    : -1;
  const lowIndex = closes.length
    ? closes.reduce((best, v, i) => (v < closes[best] ? i : best), 0)
    : -1;

  const option = {
    animationEasing: 'cubicOut',
    animationDuration: 600,

    axisPointer: hasVolume
      ? {
          link: [{ xAxisIndex: 'all' }],
        }
      : undefined,

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: '#6B7280',
          width: 1,
          type: 'dashed',
        },
        label: {
          backgroundColor: '#1f2937',
          color: '#E5E7EB',
        },
      },
      backgroundColor: 'transparent',
      borderColor: '#374151',
      borderWidth: 1,
      textStyle: { color: '#E5E7EB' },
      extraCssText: 'border-radius: 8px; padding: 10px 14px;',
      formatter: (params: EChartsTooltipParam[]) => {
        const p = params.find((x) => x.seriesName === 'price');
        if (!p) return '';

        const current = closes[p.dataIndex] ?? 0;
        const prev = p.dataIndex > 0 ? closes[p.dataIndex - 1] : current;
        const change = current - prev;
        const changePct = prev !== 0 ? (change / prev) * 100 : 0;
        const color =
          change > 0 ? '#22c55e' : change < 0 ? '#ef4444' : '#9CA3AF';
        const priceLabel = interval === 'hourly' ? 'Price' : 'Close';
        const volume = volumes[p.dataIndex];

        const volumeRow = hasVolume
          ? `
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span style="color:#9CA3AF;">Volume</span>
              <span style="color:#E5E7EB; font-weight:600;">
                ${volume.toLocaleString('id-ID')}
              </span>
            </div>`
          : '';

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
            ${volumeRow}
          </div>
        `;
      },
    },

    grid: hasVolume
      ? [
          { left: 60, right: 20, top: 20, height: '62%' },
          { left: 60, right: 20, top: '78%', height: '16%' },
        ]
      : { left: 60, right: 20, top: 20, bottom: 40 },

    xAxis: hasVolume
      ? [
          {
            type: 'category',
            gridIndex: 0,
            data: labels,
            boundaryGap: false,
            axisLine: { lineStyle: { color: '#374151' } },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false },
          },
          {
            type: 'category',
            gridIndex: 1,
            data: labels,
            boundaryGap: true,
            axisLine: { lineStyle: { color: '#374151' } },
            axisTick: { show: false },
            axisLabel: { color: '#9CA3AF', fontSize: 11 },
            splitLine: { show: false },
          },
        ]
      : {
          type: 'category',
          data: labels,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#374151' } },
          axisTick: { show: false },
          axisLabel: { color: '#9CA3AF' },
          splitLine: { show: false },
        },

    yAxis: hasVolume
      ? [
          {
            type: 'value',
            gridIndex: 0,
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
          {
            type: 'value',
            gridIndex: 1,
            splitLine: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
              color: '#6B7280',
              fontSize: 10,
              formatter: (v: number) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}jt`
                  : v.toLocaleString('id-ID'),
            },
          },
        ]
      : {
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
        name: 'price',
        xAxisIndex: hasVolume ? 0 : undefined,
        yAxisIndex: hasVolume ? 0 : undefined,
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
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: isUp ? 'rgba(34,197,94,0.22)' : 'rgba(239,68,68,0.22)',
              },
              {
                offset: 1,
                color: isUp ? 'rgba(34,197,94,0)' : 'rgba(239,68,68,0)',
              },
            ],
          },
        },
        markLine: {
          symbol: ['none', 'none'],
          silent: true,
          lineStyle: { type: 'dashed', color: '#6B7280', width: 1 },
          label: {
            color: '#9CA3AF',
            fontSize: 11,
            formatter: () => `Awal: ${firstClose.toLocaleString('id-ID')}`,
            position: 'insideEndTop',
          },
          data: [{ yAxis: firstClose }],
        },
        markPoint: {
          symbolSize: 8,
          label: {
            fontSize: 10,
            color: '#fff',
            formatter: (p: { data: { value: number } }) =>
              p.data.value.toLocaleString('id-ID'),
          },
          data: [
            ...(highIndex >= 0
              ? [
                  {
                    name: 'Tertinggi',
                    coord: [highIndex, closes[highIndex]],
                    value: closes[highIndex],
                    symbol: 'pin',
                    symbolSize: 32,
                    symbolOffset: [0, -8],
                    itemStyle: { color: '#22c55e' },
                    label: { position: 'top' },
                  },
                ]
              : []),
            ...(lowIndex >= 0
              ? [
                  {
                    name: 'Terendah',
                    coord: [lowIndex, closes[lowIndex]],
                    value: closes[lowIndex],
                    symbol: 'pin',
                    symbolSize: 32,
                    symbolOffset: [0, 8],
                    symbolRotate: 180,
                    itemStyle: { color: '#ef4444' },
                    label: { position: 'bottom' },
                  },
                ]
              : []),
            {
              name: 'Sekarang',
              coord: [closes.length - 1, lastClose],
              value: lastClose,
              symbol: 'circle',
              itemStyle: {
                color: lineColor,
                borderColor: '#111827',
                borderWidth: 2,
              },
              label: { show: false },
            },
          ],
        },
      },
      ...(hasVolume
        ? [
            {
              name: 'volume',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: volumes.map((v, i) => ({
                value: v,
                itemStyle: {
                  color:
                    i === 0
                      ? 'rgba(107,114,128,0.6)'
                      : closes[i] >= closes[i - 1]
                        ? 'rgba(34,197,94,0.55)'
                        : 'rgba(239,68,68,0.55)',
                },
              })),
              barMaxWidth: interval === 'hourly' ? 8 : 12,
            },
          ]
        : []),
    ],
  };

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
      {hasData ? (
        <ReactECharts
          option={option}
          notMerge={true}
          lazyUpdate={true}
          style={{ height: hasVolume ? 420 : 360 }}
        />
      ) : (
        <div className='h-[360px] flex flex-col items-center justify-center text-center'>
          <div className='text-lg font-medium text-gray-300 mb-2'>
            No Price Data
          </div>
          <div className='text-sm text-gray-500 max-w-md'>
            Historical price data is not available yet for this stock.
          </div>
        </div>
      )}
    </div>
  );
}

function formatAxisLabel(timestamp: string, interval: PriceInterval): string {
  const d = new Date(timestamp);

  if (interval === 'hourly') {
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}
