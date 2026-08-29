'use client';

import ReactECharts from 'echarts-for-react';
import { PriceInterval, PricePoint } from '../types';
import type { PricePeriod } from '../utils/pricePeriod';

type EChartsTooltipParam = {
  axisValue: string;
  marker: string;
  value: number[] | number | null;
  dataIndex: number;
  seriesName: string;
};

interface Props {
  data: PricePoint[];
  interval?: PriceInterval;
  period?: PricePeriod;
}

const UP_COLOR = '#22c55e';
const DOWN_COLOR = '#ef4444';
const DEFAULT_VISIBLE_CANDLES = 60;
const ZOOM_ENABLED_PERIODS: PricePeriod[] = ['6M', 'YTD'];

function niceStep(rawStep: number): number {
  const exponent = Math.floor(Math.log10(rawStep));
  const fraction = rawStep / Math.pow(10, exponent);

  let niceFraction: number;
  if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;

  return niceFraction * Math.pow(10, exponent);
}

function computePriceAxisRange(low: number, high: number) {
  if (!Number.isFinite(low) || !Number.isFinite(high)) {
    return {
      min: 0,
      max: 1,
      interval: 0.2,
    };
  }

  if (high <= low) {
    const padding = Math.max(Math.abs(low) * 0.05, 1);

    const interval = niceStep(padding / 2);

    return {
      min: low,
      max: low + interval * 5,
      interval,
    };
  }

  const range = high - low;

  /*
   * ============================================================
   * Y AXIS STRATEGY
   * ============================================================
   *
   * - minimum = harga terendah
   * - minimal 5 interval
   * - maximum dekat dengan harga tertinggi
   * - hanya memberikan sedikit ruang di atas high
   */

  const min = low;

  // Padding atas maksimal sekitar 5% dari range.
  const upperPadding = range * 0.05;

  const targetMax = high + upperPadding;

  /*
   * Cari interval yang menghasilkan setidaknya
   * 5 interval tetapi tidak membuat max terlalu jauh.
   */
  const rawInterval = range / 5;

  let interval = niceStep(rawInterval);

  /*
   * Hitung max berdasarkan interval.
   */
  let max = min + Math.ceil((targetMax - min) / interval) * interval;

  /*
   * Jika interval niceStep membuat max terlalu jauh
   * dari high, coba interval yang lebih kecil.
   */
  const maxAllowed = high + range * 0.12;

  if (max > maxAllowed) {
    const smallerInterval = niceStep(range / 6);

    if (smallerInterval < interval) {
      interval = smallerInterval;

      max = min + Math.ceil((targetMax - min) / interval) * interval;
    }
  }

  /*
   * Pastikan tetap memiliki minimal 5 interval.
   */
  const intervalCount = Math.ceil((high - min) / interval);

  if (intervalCount < 5) {
    interval = niceStep(range / 5);

    max = min + Math.ceil((high - min) / interval) * interval;
  }

  return {
    min,
    max,
    interval,
  };
}

export default function PriceChart({
  data,
  interval = 'daily',
  period,
}: Props) {
  const hasData = data.length > 0;
  const hasOHLC =
    hasData &&
    data.every((p) => p.open != null && p.high != null && p.low != null);
  const hasVolume = data.some((p) => p.volume != null);

  const labels = data.map((p) => formatAxisLabel(p.timestamp, interval));
  const closes = data.map((p) => p.close);
  const volumes = data.map((p) => p.volume ?? 0);
  const ohlc = data.map((p) => [
    p.open ?? p.close,
    p.close,
    p.low ?? p.close,
    p.high ?? p.close,
  ]);

  const firstClose = closes[0] ?? 0;
  const lastClose = closes[closes.length - 1] ?? 0;
  const isUp = lastClose >= firstClose;
  const lineColor = isUp ? UP_COLOR : DOWN_COLOR;

  const highValues = hasOHLC ? data.map((p) => p.high ?? p.close) : closes;
  const lowValues = hasOHLC ? data.map((p) => p.low ?? p.close) : closes;
  const highIndex = highValues.length
    ? highValues.reduce((best, v, i) => (v > highValues[best] ? i : best), 0)
    : -1;
  const lowIndex = lowValues.length
    ? lowValues.reduce((best, v, i) => (v < lowValues[best] ? i : best), 0)
    : -1;

  const axisLow = hasData ? Math.min(...lowValues) : 0;
  const axisHigh = hasData ? Math.max(...highValues) : 0;
  const priceAxisRange = computePriceAxisRange(axisLow, axisHigh);

  const needsZoom = period
    ? ZOOM_ENABLED_PERIODS.includes(period)
    : data.length > DEFAULT_VISIBLE_CANDLES;

  const zoomStartPercent = needsZoom
    ? Math.max(0, (1 - DEFAULT_VISIBLE_CANDLES / data.length) * 100)
    : 0;

  const chartHeight = hasVolume ? 420 : 360;
  const topPad = 20;
  const gapBetweenGrids = 10;
  const volumeHeight = hasVolume ? 70 : 0;
  const dateLabelReserve = 24;
  const sliderReserve = needsZoom ? 28 : 0;

  const bottomReserve = dateLabelReserve + sliderReserve;
  const priceGridBottom =
    bottomReserve + volumeHeight + (hasVolume ? gapBetweenGrids : 0);
  const volumeGridBottom = bottomReserve;

  const dataZoom = needsZoom
    ? [
        {
          type: 'inside' as const,
          xAxisIndex: hasVolume ? [0, 1] : [0],
          start: zoomStartPercent,
          end: 100,
          filterMode: 'none' as const,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          moveOnMouseWheel: false,
        },
        {
          type: 'slider' as const,
          xAxisIndex: hasVolume ? [0, 1] : [0],
          start: zoomStartPercent,
          end: 100,
          filterMode: 'none' as const,
          bottom: 4,
          height: 16,
          borderColor: 'transparent',
          backgroundColor: 'rgba(255,255,255,0.04)',
          fillerColor: 'rgba(107,114,128,0.35)',
          handleStyle: { color: '#6B7280', borderColor: '#9CA3AF' },
          moveHandleStyle: { color: '#6B7280' },
          textStyle: { color: '#9CA3AF', fontSize: 10 },
          dataBackground: {
            lineStyle: { color: '#374151' },
            areaStyle: { color: 'rgba(55,65,81,0.3)' },
          },
        },
      ]
    : undefined;

  const option = {
    animationEasing: 'cubicOut',
    animationDuration: 600,

    axisPointer: hasVolume ? { link: [{ xAxisIndex: 'all' }] } : undefined,

    dataZoom,

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        lineStyle: { color: '#6B7280', width: 1, type: 'dashed' },
        label: { backgroundColor: '#1f2937', color: '#E5E7EB' },
      },
      backgroundColor: 'transparent',
      borderColor: '#374151',
      borderWidth: 1,
      textStyle: { color: '#E5E7EB' },
      extraCssText: 'border-radius: 8px; padding: 10px 14px;',
      formatter: (params: EChartsTooltipParam[]) => {
        const p = params.find((x) => x.seriesName === 'price');
        if (!p) return '';

        const idx = p.dataIndex;
        const current = closes[idx] ?? 0;
        const prev = idx > 0 ? closes[idx - 1] : current;
        const change = current - prev;
        const changePct = prev !== 0 ? (change / prev) * 100 : 0;
        const color =
          change > 0 ? UP_COLOR : change < 0 ? DOWN_COLOR : '#9CA3AF';

        const ohlcRows = hasOHLC
          ? `
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span style="color:#9CA3AF;">Open</span>
              <span style="color:#E5E7EB;">${data[idx].open?.toLocaleString('id-ID')}</span>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span style="color:#9CA3AF;">High</span>
              <span style="color:#E5E7EB;">${data[idx].high?.toLocaleString('id-ID')}</span>
            </div>
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span style="color:#9CA3AF;">Low</span>
              <span style="color:#E5E7EB;">${data[idx].low?.toLocaleString('id-ID')}</span>
            </div>`
          : '';

        const volumeRow = hasVolume
          ? `
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span style="color:#9CA3AF;">Volume</span>
              <span style="color:#E5E7EB; font-weight:600;">${volumes[idx].toLocaleString('id-ID')}</span>
            </div>`
          : '';

        return `
          <div style="min-width:170px">
            <div style="font-weight:700; margin-bottom:6px; color:#fff; font-size:13px;">
              ${p.axisValue}
            </div>
            ${ohlcRows}
            <div style="display:flex; justify-content:space-between; gap:12px;">
              <span style="color:#9CA3AF;">Close</span>
              <span style="color:#E5E7EB; font-weight:600;">${current.toLocaleString('id-ID')}</span>
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
          { left: 60, right: 20, top: topPad, bottom: priceGridBottom },
          {
            left: 60,
            right: 20,
            height: volumeHeight,
            bottom: volumeGridBottom,
          },
        ]
      : {
          left: 60,
          right: 20,
          top: topPad,
          bottom: dateLabelReserve + sliderReserve,
        },

    xAxis: hasVolume
      ? [
          {
            type: 'category',
            gridIndex: 0,
            data: labels,
            boundaryGap: hasOHLC,
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
          boundaryGap: hasOHLC,
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
            min: priceAxisRange.min,
            max: priceAxisRange.max,
            interval: priceAxisRange.interval,
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
          min: priceAxisRange.min,
          max: priceAxisRange.max,
          interval: priceAxisRange.interval,
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
      hasOHLC
        ? {
            name: 'price',
            type: 'candlestick',
            xAxisIndex: hasVolume ? 0 : undefined,
            yAxisIndex: hasVolume ? 0 : undefined,
            data: ohlc,
            itemStyle: {
              color: UP_COLOR,
              color0: DOWN_COLOR,
              borderColor: UP_COLOR,
              borderColor0: DOWN_COLOR,
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
                // Kedua pin (Tertinggi & Terendah) sengaja diposisikan DI ATAS
                // titik datanya masing-masing (bukan di bawah) — supaya pin
                // "Terendah" tidak pernah keluar dari area grid harga dan
                // menimpa grid volume di bawahnya, berapapun nilai axis min-nya.
                ...(highIndex >= 0
                  ? [
                      {
                        name: 'Tertinggi',
                        coord: [highIndex, highValues[highIndex]],
                        value: highValues[highIndex],
                        symbol: 'pin',
                        symbolSize: 32,
                        symbolOffset: [0, -8],
                        itemStyle: { color: UP_COLOR },
                        label: { position: 'top' },
                      },
                    ]
                  : []),
                ...(lowIndex >= 0
                  ? [
                      {
                        name: 'Terendah',
                        coord: [lowIndex, lowValues[lowIndex]],
                        value: lowValues[lowIndex],
                        symbol: 'pin',
                        symbolSize: 32,
                        symbolOffset: [0, -8],
                        itemStyle: { color: DOWN_COLOR },
                        label: { position: 'top' },
                      },
                    ]
                  : []),
              ],
            },
          }
        : {
            name: 'price',
            type: 'line',
            xAxisIndex: hasVolume ? 0 : undefined,
            yAxisIndex: hasVolume ? 0 : undefined,
            data: closes,
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 2, color: lineColor },
            itemStyle: { color: lineColor },
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
                    color: isUp
                      ? 'rgba(34,197,94,0.22)'
                      : 'rgba(239,68,68,0.22)',
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
          },
      ...(hasVolume
        ? [
            {
              name: 'volume',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: volumes.map((v, i) => {
                const up = hasOHLC
                  ? data[i].close >= (data[i].open ?? data[i].close)
                  : i === 0 || closes[i] >= closes[i - 1];
                return {
                  value: v,
                  itemStyle: {
                    color: up ? 'rgba(34,197,94,0.55)' : 'rgba(239,68,68,0.55)',
                  },
                };
              }),
              barMaxWidth: interval === 'intraday' ? 8 : 12,
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
          style={{ height: chartHeight }}
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

  if (interval === 'intraday') {
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}
