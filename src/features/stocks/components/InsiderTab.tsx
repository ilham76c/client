'use client';

import { useMemo, useState } from 'react';
import { Alert, Skeleton, Typography } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

import { useInsiderActivity } from '.././hooks/useInsiderActivity';
import {
  groupInsiderActivities,
  type GroupedActivity,
} from '.././utils/groupInsiderActivities';
import { formatNumber } from '@/lib/utils/formatters';

interface Props {
  ticker: string;
}

type FilterKey = 'all' | 'BUY' | 'SELL';

function MetricCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className='flex-1 min-w-[120px] rounded-lg bg-gray-900/60 border border-gray-800 px-4 py-3'>
      <p className='text-[11px] uppercase tracking-wide text-gray-500 mb-1'>
        {label}
      </p>
      <p className='text-lg font-medium' style={{ color: valueColor }}>
        {value}
      </p>
    </div>
  );
}

function ActionBadge({ action }: { action: 'BUY' | 'SELL' }) {
  const isBuy = action === 'BUY';
  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
        isBuy
          ? 'text-green-400 border-green-500/40 bg-green-500/10'
          : 'text-red-400 border-red-500/40 bg-red-500/10'
      }`}
    >
      {isBuy ? 'BUY' : 'SELL'}
    </span>
  );
}

function ActivityRow({ activity }: { activity: GroupedActivity }) {
  const [expanded, setExpanded] = useState(false);
  const visibleBrokers = expanded
    ? activity.brokers
    : activity.brokers.slice(0, 3);
  const hiddenCount = activity.brokers.length - visibleBrokers.length;

  return (
    <div className='rounded-lg border border-gray-800 bg-gray-950 px-4 py-3'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2 flex-wrap'>
            <ActionBadge action={activity.action} />
            <Typography
              variant='body2'
              sx={{ color: '#e5e5e5', fontWeight: 500 }}
            >
              {activity.investor.name}
            </Typography>
          </div>
          <Typography variant='caption' sx={{ color: '#6b7280' }}>
            {dayjs(activity.date).format('DD MMMM YYYY')}
          </Typography>
        </div>

        <div className='text-right shrink-0'>
          <Typography
            variant='body2'
            sx={{
              fontWeight: 600,
              color: activity.action === 'BUY' ? '#4ade80' : '#f87171',
            }}
          >
            {activity.shares_change > 0 ? '+' : ''}
            {formatNumber(activity.shares_change)}
          </Typography>
          <Typography variant='caption' sx={{ color: '#6b7280' }}>
            {activity.ownership_pct}% kepemilikan
          </Typography>
        </div>
      </div>

      <div className='flex items-center gap-1.5 flex-wrap mt-2.5'>
        {visibleBrokers.map((b) => (
          <span
            key={b.uid}
            className='text-[11px] px-2 py-0.5 rounded bg-gray-800 text-gray-400'
            title={b.name}
          >
            {b.code}
          </span>
        ))}
        {hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className='text-[11px] px-2 py-0.5 rounded bg-gray-800 text-blue-400 hover:text-blue-300'
          >
            +{hiddenCount} lainnya
          </button>
        )}
      </div>
    </div>
  );
}

function DailyNetChangeChart({ grouped }: { grouped: GroupedActivity[] }) {
  const byDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of grouped) {
      map.set(g.date, (map.get(g.date) ?? 0) + g.shares_change);
    }
    return [...map.entries()].sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
    );
  }, [grouped]);

  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      grid: { left: 56, right: 16, top: 16, bottom: 32 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#1d1d1d',
        borderColor: '#374151',
        textStyle: { color: '#d5d5d5', fontSize: 12 },
        valueFormatter: (v: number) => formatNumber(v),
      },
      xAxis: {
        type: 'category',
        data: byDate.map(([date]) => dayjs(date).format('D MMM')),
        axisLine: { lineStyle: { color: '#374151' } },
        axisTick: { show: false },
        axisLabel: { fontSize: 11, color: '#6b7280' },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#1f2937' } },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          fontSize: 11,
          color: '#6b7280',
          formatter: (v: number) =>
            v >= 1_000_000 || v <= -1_000_000
              ? `${(v / 1_000_000).toFixed(0)}jt`
              : formatNumber(v),
        },
      },
      series: [
        {
          type: 'bar',
          data: byDate.map(([, v]) => ({
            value: v,
            itemStyle: { color: v >= 0 ? '#22c55e' : '#ef4444' },
          })),
          barMaxWidth: 24,
        },
      ],
    }),
    [byDate],
  );

  return (
    <ReactECharts option={option} style={{ height: 180 }} notMerge lazyUpdate />
  );
}

export default function InsiderTab({ ticker }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const { data, isLoading, isError, error } = useInsiderActivity(ticker);

  const grouped = useMemo(
    () => (data ? groupInsiderActivities(data.activities) : []),
    [data],
  );

  const filtered = useMemo(
    () =>
      filter === 'all' ? grouped : grouped.filter((g) => g.action === filter),
    [grouped, filter],
  );

  if (isError) {
    return (
      <Alert severity='error' sx={{ borderRadius: 2 }}>
        {error instanceof Error ? error.message : 'Terjadi kesalahan'}
      </Alert>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* Summary */}
      <div className='flex gap-3 flex-wrap'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              variant='rounded'
              width={140}
              height={64}
              sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
            />
          ))
        ) : (
          <>
            <MetricCard
              label='Total aktivitas'
              value={String(data!.summary.total_activities)}
            />
            <MetricCard
              label='Buy'
              value={String(data!.summary.buy_count)}
              valueColor='#4ade80'
            />
            <MetricCard
              label='Sell'
              value={String(data!.summary.sell_count)}
              valueColor='#f87171'
            />
            <MetricCard
              label='Net perubahan'
              value={`${data!.summary.net_shares_change > 0 ? '+' : ''}${formatNumber(
                data!.summary.net_shares_change,
              )}`}
              valueColor={
                data!.summary.net_shares_change >= 0 ? '#4ade80' : '#f87171'
              }
            />
          </>
        )}
      </div>

      {/* Chart */}
      {!isLoading && grouped.length > 0 && (
        <div className='rounded-lg border border-gray-800 bg-gray-950 px-4 py-3'>
          <p className='text-[11px] uppercase tracking-wide text-gray-500 mb-2'>
            Net perubahan per hari
          </p>
          <DailyNetChangeChart grouped={grouped} />
        </div>
      )}

      {/* Filter */}
      <div className='flex gap-1.5'>
        {(['all', 'BUY', 'SELL'] as FilterKey[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded-md border transition-colors ${
              filter === f
                ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'BUY' ? 'Buy' : 'Sell'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className='flex flex-col gap-2'>
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                variant='rounded'
                height={78}
                sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
              />
            ))
          : filtered.map((g) => <ActivityRow key={g.key} activity={g} />)}

        {!isLoading && filtered.length === 0 && (
          <p className='text-xs text-gray-600 text-center py-6'>
            Tidak ada aktivitas.
          </p>
        )}
      </div>
    </div>
  );
}
