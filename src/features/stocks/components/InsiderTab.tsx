'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  MenuItem,
  Select,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

import { useInsiderActivity } from '.././hooks/useInsiderActivity';
import { formatNumber } from '@/lib/utils/formatters';
import { brokerTypeMeta } from '@/lib/helpers/brokerType';
import { brokerOwnershipMeta } from '@/lib/helpers/brokerOwnership';
import { InsiderBroker, InsiderActivity } from '../types';

interface Props {
  ticker: string;
}

type FilterKey = 'all' | 'BUY' | 'SELL';
type ChartView = 'daily' | 'cumulative';

const PAGE_SIZE = 10;
// Batas fetch untuk data chart/dropdown investor — jauh lebih besar dari
// PAGE_SIZE karena tujuannya menampilkan tren keseluruhan, bukan halaman
// yang sedang dilihat. Kalau ternyata ada ticker dengan histori insider
// >1000 transaksi, angka ini perlu dinaikkan atau diganti pendekatan lain
// (lihat catatan di bawah kode).
const TREND_FETCH_LIMIT = 100;
const ALL_INVESTORS = 'ALL';

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

function BrokerChip({ broker }: { broker: InsiderBroker }) {
  const { icon: Icon, label } = brokerTypeMeta(broker.type);
  const { color, label: ownershipLabel } = brokerOwnershipMeta(
    broker.ownership,
  );

  return (
    <Tooltip title={`${broker.name} • ${label}`}>
      <span className='inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-gray-800 text-gray-400'>
        <Icon sx={{ fontSize: 13, color: '#9ca3af' }} />
        <span style={{ color, fontWeight: 600 }}>{broker.code}</span>
      </span>
    </Tooltip>
  );
}

function ActivityRow({ activity }) {
  const [expanded, setExpanded] = useState(false);

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

      <div className='flex items-center mt-2.5 gap-1'>
        <BrokerChip broker={activity.broker} key={activity.broker.uid} />
      </div>
    </div>
  );
}

function NetChangeChart({
  grouped,
  view,
}: {
  grouped: InsiderActivity[];
  view: ChartView;
}) {
  const byDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of grouped) {
      map.set(g.date, (map.get(g.date) ?? 0) + g.shares_change);
    }
    return [...map.entries()].sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime(),
    );
  }, [grouped]);

  const cumulativeData = useMemo(() => {
    let running = 0;
    return byDate.map(([date, v]) => {
      running += v;
      return [date, running] as [string, number];
    });
  }, [byDate]);

  const activeData = view === 'daily' ? byDate : cumulativeData;
  const isCumulative = view === 'cumulative';

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
        data: activeData.map(([date]) => dayjs(date).format('D MMM')),
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
      series: isCumulative
        ? [
            {
              type: 'line',
              data: activeData.map(([, v]) => v),
              smooth: 0.2,
              showSymbol: false,
              lineStyle: { width: 2, color: '#34d399' },
              areaStyle: { color: '#34d399', opacity: 0.08 },
            },
          ]
        : [
            {
              type: 'bar',
              data: activeData.map(([, v]) => ({
                value: v,
                itemStyle: { color: v >= 0 ? '#22c55e' : '#ef4444' },
              })),
              barMaxWidth: 24,
            },
          ],
    }),
    [activeData, isCumulative],
  );

  if (activeData.length === 0) {
    return (
      <div className='h-[180px] flex items-center justify-center'>
        <p className='text-xs text-gray-600'>
          Tidak ada aktivitas untuk investor ini.
        </p>
      </div>
    );
  }

  return (
    <ReactECharts option={option} style={{ height: 180 }} notMerge lazyUpdate />
  );
}

export default function InsiderTab({ ticker }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [chartView, setChartView] = useState<ChartView>('daily');
  const [investorFilter, setInvestorFilter] = useState<string>(ALL_INVESTORS);
  const [page, setPage] = useState(1);

  // Fetch untuk LIST — dipaginasi, filter aksi (BUY/SELL) diterapkan
  // server-side supaya jumlah halaman selalu akurat terhadap filter aktif.
  const {
    data: pageData,
    isLoading: isPageLoading,
    isError,
    error,
  } = useInsiderActivity({
    ticker,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    action: filter === 'all' ? undefined : filter,
  });

  // Fetch terpisah untuk CHART & dropdown investor — sengaja TIDAK ikut
  // pagination/filter aksi, supaya tren yang ditampilkan tetap mencakup
  // seluruh histori ticker ini, bukan cuma 10 baris yang sedang terlihat.
  const { data: trendData, isLoading: isTrendLoading } = useInsiderActivity({
    ticker,
    limit: TREND_FETCH_LIMIT,
    offset: 0,
  });

  const pageGrouped = useMemo(
    () => (pageData?.data?.activities ? pageData.data.activities : []),
    [pageData],
  );

  const trendGrouped = useMemo(
    () => (trendData?.data?.activities ? trendData.data.activities : []),
    [trendData],
  );

  const investorOptions = useMemo(() => {
    const names = Array.from(new Set(trendGrouped.map((g) => g.investor.name)));
    return names.sort((a, b) => a.localeCompare(b));
  }, [trendGrouped]);

  const chartData = useMemo(
    () =>
      investorFilter === ALL_INVESTORS
        ? trendGrouped
        : trendGrouped.filter((g) => g.investor.name === investorFilter),
    [trendGrouped, investorFilter],
  );

  function handleFilterChange(f: FilterKey) {
    setFilter(f);
    setPage(1); // reset ke halaman 1 saat filter aksi berubah
  }

  const total =
    typeof pageData?.meta.count === 'number' ? pageData.meta.count : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
        {isPageLoading ? (
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
              value={String(pageData!.meta.count)}
            />
            <MetricCard
              label='Buy'
              value={String(pageData!.data.summary.buy_count)}
              valueColor='#4ade80'
            />
            <MetricCard
              label='Sell'
              value={String(pageData!.data.summary.sell_count)}
              valueColor='#f87171'
            />
            <MetricCard
              label='Net perubahan'
              value={`${pageData!.data.summary.net_shares_change > 0 ? '+' : ''}${formatNumber(pageData!.data.summary.net_shares_change)}`}
              valueColor={
                pageData!.data.summary.net_shares_change >= 0
                  ? '#4ade80'
                  : '#f87171'
              }
            />
          </>
        )}
      </div>

      {/* Chart */}
      {!isTrendLoading && trendGrouped.length > 0 && (
        <div className='rounded-lg border border-gray-800 bg-gray-950 px-4 py-3'>
          <div className='flex items-center justify-between mb-2 flex-wrap gap-2'>
            <p className='text-[11px] uppercase tracking-wide text-gray-500'>
              {chartView === 'daily'
                ? 'Net perubahan per hari'
                : 'Akumulasi perubahan'}
              {investorFilter !== ALL_INVESTORS && (
                <span className='normal-case text-gray-400'>
                  {' '}
                  — {investorFilter}
                </span>
              )}
            </p>

            <div className='flex items-center gap-2 flex-wrap'>
              <Select
                value={investorFilter}
                onChange={(e) => setInvestorFilter(e.target.value)}
                size='small'
                sx={{
                  fontSize: 12,
                  height: 28,
                  color: '#e5e7eb',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: '#374151',
                  },
                }}
              >
                <MenuItem value={ALL_INVESTORS}>Semua investor</MenuItem>
                {investorOptions.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>

              <div className='flex gap-1.5'>
                {(['daily', 'cumulative'] as ChartView[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setChartView(v)}
                    className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                      chartView === v
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                    }`}
                  >
                    {v === 'daily' ? 'Per hari' : 'Kumulatif'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <NetChangeChart grouped={chartData} view={chartView} />
        </div>
      )}

      {/* Filter aksi (BUY/SELL) — untuk list di bawah */}
      <div className='flex gap-1.5'>
        {(['all', 'BUY', 'SELL'] as FilterKey[]).map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`text-xs px-3 py-1 rounded-md border transition-colors ${
              filter === f
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'BUY' ? 'Buy' : 'Sell'}
          </button>
        ))}
      </div>

      {/* List — dipaginasi server-side */}
      <div className='flex flex-col gap-2'>
        {isPageLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                variant='rounded'
                height={78}
                sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
              />
            ))
          : pageGrouped.map((g, i) => <ActivityRow key={i} activity={g} />)}

        {!isPageLoading && pageGrouped.length === 0 && (
          <p className='text-xs text-gray-600 text-center py-6'>
            Tidak ada aktivitas.
          </p>
        )}

        {!isPageLoading && total > 0 && (
          <div className='flex items-center justify-between mt-2 pt-3 border-t border-gray-800'>
            <span className='text-xs text-gray-500'>
              Halaman {page} dari {totalPages.toLocaleString('id-ID')}
            </span>
            <div className='flex gap-2'>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className='text-xs px-3 py-1.5 rounded-md border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:pointer-events-none transition-colors'
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className='text-xs px-3 py-1.5 rounded-md border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-40 disabled:pointer-events-none transition-colors'
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
