'use client';

import { useState } from 'react';
import InvestorSearch, { Investor } from './InvestorSearch';
import { useInvestorDetails } from '../hooks/useInvestor';
import { InvestorHolding } from '../types';
import { LoadingSpinner } from '@/components/ui';
import { formatNumber } from '@/lib/utils/formatters';

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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="text-sm text-gray-400">{title}</div>
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

interface HoldingRowProps {
  holding: InvestorHolding;
}

function HoldingRow({ holding }: HoldingRowProps) {
  const change = holding.shares_change;
  const isPositive = change !== null && change > 0;
  const isNegative = change !== null && change < 0;

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800/40">
      <td className="p-4 text-blue-400 font-semibold">{holding.ticker}</td>
      <td className="p-4 text-right text-white">{formatNumber(holding.shares)}</td>
      <td
        className={`p-4 text-right font-medium ${
          isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'
        }`}
      >
        {change !== null
          ? `${isPositive ? '+' : ''}${formatNumber(change)}`
          : '—'}
      </td>
      <td className="p-4 text-center text-gray-400">{holding.ownership_date}</td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function InvestorClient() {
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  const { data, isLoading, error } = useInvestorDetails(selectedInvestor?.uuid ?? null);
  const details = data?.data;

  const netChange = details?.holdings.reduce(
    (acc, h) => acc + (h.shares_change ?? 0),
    0
  ) ?? 0;

  return (
    <div className="space-y-6">
      {/* SEARCH */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-white mb-4">
          Investor Ownership Intelligence
        </h1>
        <InvestorSearch onSelect={setSelectedInvestor} />
      </div>

      {/* LOADING */}
      {isLoading && <LoadingSpinner />}

      {/* ERROR */}
      {error && (
        <div className="text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          {error instanceof Error ? error.message : 'Failed to load investor data'}
        </div>
      )}

      {/* DATA */}
      {details && (
        <>
          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard title="Total Emitens" value={details.summary.total_emitens} />
            <SummaryCard
              title="Total Shares"
              value={formatNumber(details.summary.total_shares)}
            />
            <SummaryCard
              title="Investor Type"
              value={details.investor.type === 'L' ? 'Lokal' : 'Perusahaan'}
            />
            <SummaryCard
              title="Net Change"
              value={`${netChange >= 0 ? '+' : ''}${formatNumber(netChange)}`}
              positive={netChange > 0 ? true : netChange < 0 ? false : undefined}
            />
          </div>

          {/* HOLDINGS TABLE */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="font-semibold text-white">Holdings</h2>
            </div>

            {details.holdings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No holdings data available</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-sm text-gray-400">
                    <th className="text-left p-4">Ticker</th>
                    <th className="text-right p-4">Shares</th>
                    <th className="text-right p-4">Change</th>
                    <th className="text-center p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {details.holdings.map((holding) => (
                    <HoldingRow key={holding.emiten_uid} holding={holding} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* EMPTY STATE */}
      {!selectedInvestor && !isLoading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-500">
          Search for an investor above to view their holdings
        </div>
      )}
    </div>
  );
}
