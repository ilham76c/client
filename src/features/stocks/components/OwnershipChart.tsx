'use client';

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
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

const COLORS = [
  '#378ADD',
  '#1D9E75',
  '#BA7517',
  '#D4537E',
  '#7F77DD',
  '#888780',
];
const MUTED_COLOR = '#4b5563';
const MAX_LEGEND_WIDTH = 220;

const KEEP_UPPERCASE = new Set(['PT', 'TBK', 'CV', 'PLC', 'LLC', 'LTD']);

function toDisplayName(name: string) {
  return name
    .split(' ')
    .map((word) =>
      KEEP_UPPERCASE.has(word)
        ? word
        : word.charAt(0) + word.slice(1).toLowerCase(),
    )
    .join(' ');
}

function firstLastNonNull(values: Array<number | null>) {
  const nonNull = values.filter((v): v is number => v != null);
  return nonNull.length > 0
    ? { first: nonNull[0], last: nonNull[nonNull.length - 1] }
    : { first: null, last: null };
}

function hasActualChange(values: Array<number | null>) {
  const distinct = new Set(values.filter((v): v is number => v != null));
  return distinct.size > 1;
}

function formatCompact(v: number) {
  if (Math.abs(v) >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)}M`;
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}jt`;
  return v.toLocaleString('id-ID');
}

export default function OwnershipChangesChart({
  data,
}: {
  data: OwnershipData;
}) {
  const hasData = data.periods.length > 0 && data.series.length > 0;
  const totalShares = Number(data.total_shares) || 0;
  const canShowPercent = totalShares > 0;
  const dateLabels = useMemo(
    () => data.periods.map((p) => dayjs(p).format('D MMM')),
    [data.periods],
  );

  const analyzedSeries = useMemo(() => {
    return (data.series as SeriesItem[]).map((s) => {
      const displayValues = canShowPercent
        ? s.shares.map((val) =>
            val == null ? null : (Number(val) / totalShares) * 100,
          )
        : s.shares;

      const changed = hasActualChange(s.shares);
      const { first, last } = firstLastNonNull(s.shares);
      const netChange = first != null && last != null ? last - first : null;

      // Rentang pergerakan sesungguhnya (min-max), dipakai untuk deteksi
      // "berfluktuasi tapi net 0" dan untuk auto-zoom sumbu-Y di bawah.
      const nonNullValues = displayValues.filter((v): v is number => v != null);
      const minValue = nonNullValues.length ? Math.min(...nonNullValues) : null;
      const maxValue = nonNullValues.length ? Math.max(...nonNullValues) : null;

      return { ...s, displayValues, changed, netChange, minValue, maxValue };
    });
  }, [data.series, totalShares, canShowPercent]);

  const changedSeries = analyzedSeries.filter((s) => s.changed);
  const changedCount = changedSeries.length;

  // Sumbu-Y di-zoom ke rentang data investor yang BERUBAH saja, bukan
  // seluruh investor — karena investor yang flat tidak butuh resolusi
  // visual, dan kalau ikut menentukan skala, fluktuasi kecil pada
  // investor yang berubah bisa "hilang" tergencet skala yang terlalu lebar.
  const yRange = useMemo(() => {
    const relevantSeries =
      changedSeries.length > 0 ? changedSeries : analyzedSeries;
    const mins = relevantSeries
      .map((s) => s.minValue)
      .filter((v): v is number => v != null);
    const maxs = relevantSeries
      .map((s) => s.maxValue)
      .filter((v): v is number => v != null);

    if (mins.length === 0 || maxs.length === 0)
      return { min: undefined, max: undefined, decimals: 2 };

    const dataMin = Math.min(...mins);
    const dataMax = Math.max(...maxs);
    const range = dataMax - dataMin;

    // Padding minimum absolut supaya rentang tidak "nol" (garis benar-benar
    // datar secara visual) saat perubahan sangat kecil.
    const minAbsolutePadding = canShowPercent
      ? 0.05
      : Math.max(dataMax * 0.02, 1);
    const padding = Math.max(range * 0.25, minAbsolutePadding);

    // Rentang sempit butuh lebih banyak angka desimal supaya label
    // sumbu-Y tidak menampilkan angka yang sama berulang (mis. "5.00%"
    // di setiap grid line padahal datanya 4.98%–5.05%).
    const decimals = canShowPercent ? (range < 0.5 ? 3 : range < 5 ? 2 : 1) : 0;

    return {
      min: Number((dataMin - padding).toFixed(6)),
      max: Number((dataMax + padding).toFixed(6)),
      decimals,
    };
  }, [changedSeries, analyzedSeries, canShowPercent]);

  const legendWidth = useMemo(() => {
    const maxLegendLength = Math.max(
      ...data.series.map((s: SeriesItem) => toDisplayName(s.investor).length),
      0,
    );
    return Math.min(maxLegendLength * 6.5 + 60, MAX_LEGEND_WIDTH);
  }, [data.series]);

  const option = useMemo(() => {
    let colorIndex = 0;
    const series = analyzedSeries.map((s) => {
      const color = s.changed
        ? COLORS[colorIndex++ % COLORS.length]
        : MUTED_COLOR;

      return {
        name: toDisplayName(s.investor),
        type: 'line',
        data: s.displayValues,
        smooth: true,
        showSymbol: s.changed,
        symbol: 'circle',
        symbolSize: 6,
        z: s.changed ? 10 : 1,
        lineStyle: {
          width: s.changed ? 2.5 : 1.5,
          color,
          opacity: s.changed ? 1 : 0.45,
        },
        itemStyle: { color },
        emphasis: {
          focus: 'series',
          lineStyle: { width: s.changed ? 3.5 : 2, opacity: 1 },
        },
        areaStyle: s.changed ? { color, opacity: 0.05 } : undefined,
      };
    });

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
            const percent = canShowPercent
              ? (current / totalShares) * 100
              : null;

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
                  ${percent != null ? `${percent.toFixed(yRange.decimals)}%` : '—'}
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
        width: legendWidth - 16,
        textStyle: {
          color: '#9CA3AF',
          fontSize: 12,
          overflow: 'truncate',
          width: legendWidth - 40,
        },
        itemWidth: 10,
        itemHeight: 10,
        tooltip: { show: true },
      },

      grid: {
        left: 70,
        right: legendWidth,
        top: 30,
        bottom: 40,
      },

      xAxis: {
        type: 'category',
        data: dateLabels,
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF', fontSize: 11 },
        splitLine: { show: false },
      },

      yAxis: {
        type: 'value',
        min: yRange.min,
        max: yRange.max,
        axisLabel: {
          formatter: (v: number) =>
            canShowPercent
              ? `${v.toFixed(yRange.decimals)}%`
              : formatCompact(v),
          color: '#9CA3AF',
        },
        splitLine: {
          show: true,
          lineStyle: { color: 'rgba(255,255,255,0.08)', width: 1 },
        },
      },

      series,
    };
  }, [
    analyzedSeries,
    legendWidth,
    dateLabels,
    data.series,
    totalShares,
    canShowPercent,
    yRange,
  ]);

  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
      {hasData ? (
        <>
          <div className='flex items-center gap-3 flex-wrap mb-4 pb-4 border-b border-gray-800'>
            <span className='text-sm text-gray-400'>
              <span className='text-white font-medium'>{changedCount}</span>{' '}
              dari {analyzedSeries.length} investor mengubah kepemilikan periode
              ini
            </span>

            {changedSeries.map((s) => {
              const netChange = s.netChange ?? 0;
              // Net 0 tapi "changed" berarti dia sempat naik/turun lalu
              // kembali ke titik semula — beda makna dari "tidak berubah
              // sama sekali", jadi diberi warna & label netral (amber),
              // bukan hijau/merah yang menyiratkan naik/turun bersih.
              const isFlat = netChange === 0;
              const isUp = netChange > 0;

              return (
                <span
                  key={s.investor}
                  className={`text-xs px-2 py-0.5 rounded-md border ${
                    isFlat
                      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                      : isUp
                        ? 'text-green-400 border-green-500/30 bg-green-500/10'
                        : 'text-red-400 border-red-500/30 bg-red-500/10'
                  }`}
                >
                  {toDisplayName(s.investor)}{' '}
                  {isFlat
                    ? 'berfluktuasi, kembali ke semula'
                    : `${isUp ? '+' : ''}${netChange.toLocaleString('id-ID')}`}
                </span>
              );
            })}
          </div>

          {!canShowPercent && (
            <p className='text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-2 mb-4'>
              Total saham beredar tidak tersedia untuk emiten ini — grafik
              menampilkan jumlah lembar saham, bukan persentase kepemilikan.
            </p>
          )}

          <ReactECharts
            option={option}
            notMerge={true}
            lazyUpdate={true}
            style={{ height: 420 }}
          />
        </>
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
