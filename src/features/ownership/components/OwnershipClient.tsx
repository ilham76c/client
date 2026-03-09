'use client';

import OwnershipChart from './OwnershipChart';
import { useOwnershipMonthlyChanges } from '../hooks/useOwnershipChanges';

export default function OwnershipClient({ ticker }: { ticker: string }) {
  const { data, loading, error } = useOwnershipMonthlyChanges({
    ticker,
    investor_type: 'L',
    start_date: '2025-01-01',
    end_date: '2026-12-31',
    limit: 100,
  });

  if (loading) {
    return (
      <div className='animate-pulse text-gray-400'>Loading ownership...</div>
    );
  }
  if (error) return <div className='text-red-600'>{error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <>
      <h1 className='text-3xl font-bold mb-2'>
        {data.ticker} - {data.name}
      </h1>

      <p className='text-gray-400 mb-8'>Institutional Ownership Trend</p>
      <OwnershipChart data={data} />
    </>
  );
}
