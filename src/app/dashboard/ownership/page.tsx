'use client';

import { useOwnershipChanges } from '@/features/ownership/hooks/useOwnershipChanges';
import OwnershipChart from '@/features/ownership/components/OwnershipChart';

export default function OwnershipPage() {
  const { data, loading, error } = useOwnershipChanges({
    ticker: 'MSIN',
    investor_type: 'L',
    start_date: '2026-01-20',
    end_date: '2026-02-05',
    limit: 100,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='text-red-600'>{error}</div>;

  return (
    <div className='h-screen m-5'>
      <OwnershipChart data={data} />
    </div>
  );
}
