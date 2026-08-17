'use client';

import { useState } from 'react';
import InvestorSearch from './InvestorSearch';
import PortfolioAllocationChart from './PortfolioAllocationChart';
import InvestorHoldings from './InvestorHoldings';
import { useInvestorDetails } from '../hooks/useInvestor';
import { Investor } from '../types';
import { LoadingSpinner } from '@/components/ui';
import { formatNumber, formatDate } from '@/lib/utils/formatters';

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
        className={`text-2xl font-bold mt-2 ${positive === true
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
    <div className='flex items-start gap-4 py-3 border-b border-gray-800'>
      <div
        className={`mt-1 h-3 w-3 rounded-full ${positive ? 'bg-green-400' : 'bg-red-400'
          }`}
      />

      <div className='flex-1'>
        <div className='flex items-center gap-2'>
          <span className='font-semibold text-white'>{activity.ticker}</span>

          <span
            className={`text-xs px-2 py-0.5 rounded-full ${positive
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
              }`}
          >
            {positive ? 'Buy' : 'Sell'}
          </span>
        </div>

        <div className='text-xs text-gray-500 mt-1'>
          {formatDate(activity.ownership_date, 'DD MMM YYYY')}
        </div>
      </div>

      <div className='text-right'>
        <div
          className={`font-semibold ${positive ? 'text-green-400' : 'text-red-400'
            }`}
        >
          {positive ? '+' : ''}
          {formatNumber(activity.shares_change)}
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div className='text-xs text-gray-500'>
            Prev:
          </div>
          <div className='text-xs text-gray-500'>
            {formatNumber(activity.prev_shares)}
          </div>
          <div className='text-xs text-gray-500'>
            Current:
          </div>
          <div className='text-xs text-gray-500'>
            {formatNumber(activity.shares)}
          </div>
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
        <h1 className='text-xl font-semibold text-white mb-4'>
          Investor Ownership Intelligence
        </h1>
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

      {/* DATA */}
      {details && (
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
              <div className='flex items-center justify-between mb-4'>
                <h2 className='font-semibold text-white'>Recent Activity</h2>

                <span className='text-xs text-gray-400'>
                  {filteredActivities.length} activities
                </span>

                <select
                  value={activityTicker}
                  onChange={(e) => setActivityTicker(e.target.value)}
                  className='bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white'
                >
                  <option value='ALL'>All Emitens</option>
                  {details.allocation.map((item) => (
                    <option key={item.ticker} value={item.ticker}>
                      {item.ticker}
                    </option>
                  ))}
                </select>
              </div>

              <div className='activity-scroll max-h-[460px] overflow-y-auto pr-2 space-y-3'>
                {filteredActivities.map((activity) => (
                  <ActivityItem
                    key={`${activity.ticker}-${activity.ownership_date}`}
                    activity={activity}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* HOLDINGS TABLE */}
          <div className='bg-gray-900 border border-gray-800 rounded-xl overflow-hidden'>
            <InvestorHoldings investorUid={selectedInvestor?.uuid} />
          </div>
        </>
      )}

      {/* EMPTY STATE */}
      {!selectedInvestor && !isLoading && (
        <div className='bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-500'>
          Search for an investor above to view their holdings
        </div>
      )}
    </div>
  );
}
