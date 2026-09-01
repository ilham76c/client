'use client';

import { useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { DailyMarketRaw } from '../types';
import { formatNumber } from '@/lib/utils/formatters';

const UP_COLOR = '#22c55e';
const DOWN_COLOR = '#ef4444';

type ChartView = 'daily' | 'cumulative';

export default function DailyMarketForeignChart({
  data,
}: {
  data: DailyMarketRaw[];
}) {
  const [view, setView] = useState<ChartView>('daily');

  const sorted = useMemo(
    () =>
      [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [data],
  );

  const cumulative = useMemo(() => {
    let running = 0;
    return sorted.map((d) => {
      running += d.foreign_net;
      return running;
    });
  }, [sorted]);

  const isCumulative = view === 'cumulative';
  const totalNet = cumulative[cumulative.length - 1] ?? 0;

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
          const dailyColor = d.foreign_net >= 0 ? UP_COLOR : DOWN_COLOR;

          if (isCumulative) {
            const cum = cumulative[idx];
            const cumColor = cum >= 0 ? UP_COLOR : DOWN_COLOR;
            return `
              <div style="min-width:170px">
                <div style="font-weight:700;color:#fff;margin-bottom:6px;">${dayjs(d.date).format('DD MMM YYYY')}</div>
                <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Net hari ini</span><span style="color:${dailyColor}">${d.foreign_net > 0 ? '+' : ''}${formatNumber(d.foreign_net)}</span></div>
                <div style="display:flex;justify-content:space-between;margin-top:4px;"><span style="color:#9CA3AF">Kumulatif</span><span style="color:${cumColor};font-weight:600">${cum > 0 ? '+' : ''}${formatNumber(cum)}</span></div>
              </div>
            `;
          }

          return `
            <div style="min-width:160px">
              <div style="font-weight:700;color:#fff;margin-bottom:6px;">${dayjs(d.date).format('DD MMM YYYY')}</div>
              <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Foreign Buy</span><span>${formatNumber(d.foreign_buy)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:#9CA3AF">Foreign Sell</span><span>${formatNumber(d.foreign_sell)}</span></div>
              <div style="display:flex;justify-content:space-between;margin-top:4px;"><span style="color:#9CA3AF">Net</span><span style="color:${dailyColor};font-weight:600">${d.foreign_net > 0 ? '+' : ''}${formatNumber(d.foreign_net)}</span></div>
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
      series: isCumulative
        ? [
            {
              type: 'line',
              data: cumulative,
              smooth: 0.2,
              showSymbol: false,
              lineStyle: {
                width: 2,
                color: totalNet >= 0 ? UP_COLOR : DOWN_COLOR,
              },
              areaStyle: {
                color: totalNet >= 0 ? UP_COLOR : DOWN_COLOR,
                opacity: 0.08,
              },
            },
          ]
        : [
            {
              type: 'bar',
              data: sorted.map((d) => ({
                value: d.foreign_net,
                itemStyle: {
                  color: d.foreign_net >= 0 ? UP_COLOR : DOWN_COLOR,
                },
              })),
              barMaxWidth: 20,
            },
          ],
    }),
    [sorted, cumulative, isCumulative, totalNet],
  );

  return (
    <div>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-gray-500'>
            {isCumulative ? 'Total periode:' : 'Net asing per hari'}
          </span>
          {isCumulative && (
            <span
              className='text-sm font-semibold'
              style={{ color: totalNet >= 0 ? UP_COLOR : DOWN_COLOR }}
            >
              {totalNet > 0 ? '+' : ''}
              {formatNumber(totalNet)}
            </span>
          )}
        </div>

        <div className='flex gap-1.5'>
          {(['daily', 'cumulative'] as ChartView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                view === v
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              {v === 'daily' ? 'Per hari' : 'Kumulatif'}
            </button>
          ))}
        </div>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 260 }}
        notMerge
        lazyUpdate
      />
    </div>
  );
}
