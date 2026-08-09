'use client';

import { useState } from 'react';
import { Alert, MenuItem, Select, Skeleton, Typography } from '@mui/material';

import HoldingCard from './HoldingCard';
import { useInvestorHoldings } from '../hooks/useInvestor';

interface Props {
  investorUid: string;
}

type SortKey = 'pct_desc' | 'pct_asc' | 'shares_desc' | 'date_desc';

function CardSkeleton() {
  return (
    <div className='flex flex-col gap-2 p-4 border border-gray-200 rounded-xl'>
      <div className='flex gap-2'>
        <Skeleton variant='rounded' width={56} height={22} />
        <Skeleton variant='rounded' width={48} height={22} />
        <Skeleton variant='text' width={180} height={22} />
      </div>
      <div className='flex gap-6 mt-1'>
        <Skeleton variant='text' width={80} height={20} />
        <Skeleton variant='text' width={40} height={20} />
      </div>
    </div>
  );
}

export default function InvestorHoldings({ investorUid }: Props) {
  const [sort, setSort] = useState<SortKey>('pct_desc');

  const { data, isLoading, isError, error } = useInvestorHoldings(investorUid);

  const holdings = data?.holdings ?? [];

  const sorted = [...holdings].sort((a, b) => {
    switch (sort) {
      case 'pct_desc':
        return b.ownership.pct - a.ownership.pct;
      case 'pct_asc':
        return a.ownership.pct - b.ownership.pct;
      case 'shares_desc':
        return b.ownership.shares - a.ownership.shares;
      case 'date_desc':
        return (
          new Date(b.ownership.date).getTime() -
          new Date(a.ownership.date).getTime()
        );
      default:
        return 0;
    }
  });

  if (isError) {
    return (
      <Alert severity='error' sx={{ borderRadius: 2 }}>
        {error instanceof Error ? error.message : 'Terjadi kesalahan'}
      </Alert>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className='flex items-center justify-between my-4 px-4 rounded-xl'>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: '#fff',
          }}
        >
          Holdings
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {isLoading ? (
            <Skeleton variant='text' width={100} />
          ) : (
            `${holdings.length} emiten`
          )}
        </Typography>

        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          size='small'
          variant='outlined'
          disabled={isLoading}
          sx={{ fontSize: 13, height: 32 }}
        >
          <MenuItem value='pct_desc'>% Kepemilikan ↓</MenuItem>
          <MenuItem value='pct_asc'>% Kepemilikan ↑</MenuItem>
          <MenuItem value='shares_desc'>Jumlah saham ↓</MenuItem>
          <MenuItem value='date_desc'>Terbaru</MenuItem>
        </Select>
      </div>

      {/* Cards */}
      <div className='flex flex-col gap-3'>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : sorted.map((holding) => (
              <HoldingCard
                key={holding.emiten.uid}
                holding={holding}
                defaultOpen={holdings.length <= 3}
              />
            ))}
      </div>
    </div>
  );
}
