'use client';

import { useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import InvestorSearch from './InvestorSearch';
import PortfolioAllocationChart from './PortfolioAllocationChart';
import InvestorHoldings from './InvestorHoldings';
import { useInvestorDetails } from '../hooks/useInvestor';
import { Investor } from '../types';
import { LoadingSpinner } from '@/components/ui';
import { formatNumber, formatDate } from '@/lib/utils/formatters';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SummaryCardProps {
  title: string;
  value: string | number;
  positive?: boolean;
}

function SummaryCard({ title, value, positive }: SummaryCardProps) {
  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
      <div className='text-sm text-gray-400'>{title}</div>
      <div
        className={`text-2xl font-bold mt-2 ${
          positive === true
            ? 'text-green-400'
            : positive === false
              ? 'text-red-400'
              : 'text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

type ActivityItemProps = {
  activity: {
    ticker: string;
    shares_change: number;
    prev_shares: number;
    shares: number;
    ownership_date: string;
  };
};

function ActivityItem({ activity }: ActivityItemProps) {
  const positive = activity.shares_change > 0;

  return (
    <div className='flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors cursor-pointer'>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='font-semibold text-white'>{activity.ticker}</span>

          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              positive
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {positive ? '↑' : '↓'} {positive ? 'Buy' : 'Sell'}
          </span>
        </div>

        <div className='text-xs text-gray-500 mt-1'>
          {formatDate(activity.ownership_date, 'DD MMM YYYY')}
        </div>
      </div>

      <div className='text-right shrink-0'>
        <div
          className={`font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}
        >
          {positive ? '+' : ''}
          {formatNumber(activity.shares_change)}
        </div>

        <div className='flex items-center gap-1.5 text-xs text-gray-500 mt-0.5'>
          <span>{formatNumber(activity.prev_shares)}</span>
          <span className='text-gray-700'>→</span>
          <span className='text-gray-400'>{formatNumber(activity.shares)}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MainPage() {
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(
    null,
  );
  const [activityTicker, setActivityTicker] = useState('ALL');

  const { data, isLoading, error } = useInvestorDetails(
    selectedInvestor?.uuid ?? null,
  );

  const details = data?.data;

  const filteredActivities =
    activityTicker === 'ALL'
      ? (details?.recent_activities ?? [])
      : (details?.recent_activities ?? []).filter(
          (activity) => activity.ticker === activityTicker,
        );

  const netChange =
    details?.holdings.reduce((acc, h) => acc + (h.shares_change ?? 0), 0) ?? 0;

  return (
    <div className='space-y-6'>
      {/* SEARCH */}
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-1'>
          <div className='w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0'>
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-emerald-400'
            >
              <circle cx='11' cy='11' r='8' />
              <path d='m21 21-4.35-4.35' />
            </svg>
          </div>
          <h1 className='text-xl font-semibold text-white'>
            Investor Ownership Intelligence
          </h1>
        </div>

        <p className='text-sm text-gray-500 mb-5 ml-11'>
          Cari nama investor atau institusi untuk melihat portofolio dan
          aktivitas kepemilikannya.
        </p>

        <InvestorSearch onSelect={setSelectedInvestor} />
      </div>

      {/* LOADING */}
      {isLoading && <LoadingSpinner />}

      {/* ERROR */}
      {error && (
        <div className='text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-4'>
          {error instanceof Error
            ? error.message
            : 'Failed to load investor data'}
        </div>
      )}

      {/* DATA — destructure selectedInvestor bareng details supaya TypeScript
          tahu keduanya pasti ada di dalam blok ini, tanpa perlu non-null assertion (!) */}
      {details && selectedInvestor && (
        <>
          {/* SUMMARY */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <SummaryCard
              title='Total Emitens'
              value={details.summary.total_emitens}
            />
            <SummaryCard
              title='Total Shares'
              value={formatNumber(details.summary.total_shares)}
            />
            <SummaryCard
              title='Investor Type'
              value={details.investor.type === 'L' ? 'Lokal' : 'Perusahaan'}
            />
            <SummaryCard
              title='Net Change'
              value={`${netChange >= 0 ? '+' : ''}${formatNumber(netChange)}`}
              positive={
                netChange > 0 ? true : netChange < 0 ? false : undefined
              }
            />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* PIE */}
            <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
              <h2 className='font-semibold text-white mb-4'>
                Portfolio Allocation
              </h2>

              <PortfolioAllocationChart
                allocations={details.allocation}
                totalShares={details.summary.total_shares}
                totalEmitens={details.summary.total_emitens}
              />
            </div>

            {/* RECENT */}
            <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-4 gap-3'>
                <h2 className='font-semibold text-white'>Recent Activity</h2>

                <div className='flex items-center gap-3'>
                  <span className='text-xs text-gray-400 whitespace-nowrap'>
                    {filteredActivities.length} activities
                  </span>

                  <Select
                    value={activityTicker}
                    onChange={(e) => setActivityTicker(e.target.value)}
                    size='small'
                    sx={{
                      fontSize: 13,
                      height: 32,
                      bgcolor: '#1f2937',
                      color: '#fff',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: '#374151',
                      },
                    }}
                  >
                    <MenuItem value='ALL'>All Emitens</MenuItem>
                    {details.allocation.map((item) => (
                      <MenuItem key={item.ticker} value={item.ticker}>
                        {item.ticker}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className='activity-scroll max-h-[460px] overflow-y-auto pr-2 space-y-3'>
                {filteredActivities.length === 0 ? (
                  <p className='text-sm text-gray-600 text-center py-8'>
                    Tidak ada aktivitas untuk filter ini.
                  </p>
                ) : (
                  filteredActivities.map((activity) => (
                    <ActivityItem
                      key={`${activity.ticker}-${activity.ownership_date}`}
                      activity={activity}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* HOLDINGS TABLE */}
          <InvestorHoldings investorUid={selectedInvestor.uuid} />
        </>
      )}

      {/* EMPTY STATE */}
      {!selectedInvestor && !isLoading && (
        <div className='bg-gray-900 border border-gray-800 rounded-xl px-12 py-16 text-center'>
          <div className='w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4'>
            <PersonSearchIcon sx={{ fontSize: 22, color: '#34d399' }} />
          </div>

          <h3 className='text-base font-medium text-gray-300 mb-1.5'>
            Belum ada investor yang dipilih
          </h3>

          <p className='text-sm text-gray-500 max-w-sm mx-auto'>
            Cari nama investor atau institusi di kolom pencarian di atas untuk
            melihat portofolio dan aktivitas kepemilikannya.
          </p>
        </div>
      )}
    </div>
  );
}
