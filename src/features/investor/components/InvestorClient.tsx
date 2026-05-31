'use client';

import InvestorSearch from './InvestorSearch';

export default function InvestorOwnershipPage() {
  return (
    <div className='space-y-6'>

      {/* SEARCH */}
      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
        <h1 className='text-xl font-semibold text-white mb-4'>
          Investor Ownership Intelligence
        </h1>

        <InvestorSearch
          onSelect={(investor) => {
            console.log(investor);
          }}
        />
      </div>

      {/* SUMMARY */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>

        <SummaryCard
          title='Total Emitens'
          value='4'
        />

        <SummaryCard
          title='Total Shares'
          value='123.4M'
        />

        <SummaryCard
          title='Avg Ownership'
          value='6.21%'
        />

        <SummaryCard
          title='Net Change'
          value='+12.5M'
          positive
        />

      </div>

      {/* MIDDLE SECTION */}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        {/* PIE */}

        <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
          <h2 className='font-semibold text-white mb-4'>
            Portfolio Allocation
          </h2>

          <div className='h-[300px] flex items-center justify-center text-gray-500'>
            Pie Chart Here
          </div>
        </div>

        {/* RECENT */}

        <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>
          <h2 className='font-semibold text-white mb-4'>
            Recent Activity
          </h2>

          <div className='space-y-3'>

            <ActivityItem
              positive
              ticker='SSIA'
              change='+12.5M'
            />

            <ActivityItem
              positive
              ticker='INET'
              change='+3.2M'
            />

            <ActivityItem
              ticker='BNBR'
              change='-5.8M'
            />

          </div>
        </div>

      </div>

      {/* HOLDINGS */}

      <div className='bg-gray-900 border border-gray-800 rounded-xl overflow-hidden'>

        <div className='px-6 py-4 border-b border-gray-800'>
          <h2 className='font-semibold text-white'>
            Holdings
          </h2>
        </div>

        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-800 text-sm text-gray-400'>
              <th className='text-left p-4'>Ticker</th>
              <th className='text-right p-4'>Shares</th>
              <th className='text-right p-4'>Ownership</th>
              <th className='text-right p-4'>Change</th>
              <th className='text-center p-4'>Date</th>
            </tr>
          </thead>

          <tbody>

            <HoldingRow
              ticker='SSIA'
              shares='46.9M'
              ownership='5.87%'
              change='+10.2M'
            />

            <HoldingRow
              ticker='BNBR'
              shares='55.0M'
              ownership='0.08%'
              change='-3.1M'
            />

            <HoldingRow
              ticker='INET'
              shares='9.0M'
              ownership='0.45%'
              change='+1.5M'
            />

          </tbody>
        </table>

      </div>

      {/* TREND */}

      <div className='bg-gray-900 border border-gray-800 rounded-xl p-6'>

        <h2 className='font-semibold text-white mb-4'>
          Ownership Trend
        </h2>

        <div className='h-[420px] flex items-center justify-center text-gray-500'>
          ECharts Ownership Trend
        </div>

      </div>

    </div>
  );
}

function SummaryCard({
  title,
  value,
  positive,
}: {
  title: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className='bg-gray-900 border border-gray-800 rounded-xl p-5'>
      <div className='text-sm text-gray-400'>
        {title}
      </div>

      <div
        className={`text-2xl font-bold mt-2 ${
          positive
            ? 'text-green-400'
            : 'text-white'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ActivityItem({
  ticker,
  change,
  positive,
}: {
  ticker: string;
  change: string;
  positive?: boolean;
}) {
  return (
    <div className='flex justify-between border border-gray-800 rounded-lg p-3'>

      <span className='font-medium text-white'>
        {ticker}
      </span>

      <span
        className={
          positive
            ? 'text-green-400'
            : 'text-red-400'
        }
      >
        {change}
      </span>

    </div>
  );
}

function HoldingRow({
  ticker,
  shares,
  ownership,
  change,
}: {
  ticker: string;
  shares: string;
  ownership: string;
  change: string;
}) {
  return (
    <tr className='border-b border-gray-800 hover:bg-gray-800/40'>

      <td className='p-4 text-blue-400 font-semibold'>
        {ticker}
      </td>

      <td className='p-4 text-right text-white'>
        {shares}
      </td>

      <td className='p-4 text-right text-white'>
        {ownership}
      </td>

      <td
        className={`p-4 text-right ${
          change.startsWith('+')
            ? 'text-green-400'
            : 'text-red-400'
        }`}
      >
        {change}
      </td>

      <td className='p-4 text-center text-gray-400'>
        2026-02-27
      </td>

    </tr>
  );
}