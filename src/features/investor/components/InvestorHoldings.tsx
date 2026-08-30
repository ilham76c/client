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
    <div className='flex flex-col gap-2 p-4 border border-gray-800 rounded-xl bg-gray-900'>
      <div className='flex gap-2'>
        <Skeleton
          variant='rounded'
          width={56}
          height={22}
          sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
        />
        <Skeleton
          variant='text'
          width={180}
          height={22}
          sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
        />
      </div>
      <div className='flex gap-6 mt-1'>
        <Skeleton
          variant='rounded'
          width={220}
          height={44}
          sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
        />
      </div>
    </div>
  );
}

function sortHoldings(holdings: any[], sort: SortKey) {
  return [...holdings].sort((a, b) => {
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
}

function SortSelect({
  value,
  onChange,
  disabled,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
  disabled?: boolean;
}) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      size='small'
      variant='outlined'
      disabled={disabled}
      sx={{
        fontSize: 13,
        height: 32,
        color: '#e5e7eb',
        '.MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
      }}
    >
      <MenuItem value='pct_desc'>% Kepemilikan ↓</MenuItem>
      <MenuItem value='pct_asc'>% Kepemilikan ↑</MenuItem>
      <MenuItem value='shares_desc'>Jumlah saham ↓</MenuItem>
      <MenuItem value='date_desc'>Terbaru</MenuItem>
    </Select>
  );
}

function HoldingSection({
  title,
  holdings,
  isLoading,
  sort,
  setSort,
}: {
  title: string;
  holdings: any[];
  isLoading: boolean;
  sort: SortKey;
  setSort: (v: SortKey) => void;
}) {
  const sorted = sortHoldings(holdings, sort);

  return (
    <div className='mb-6 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden'>
      {/* Toolbar */}
      <div className='flex items-center justify-between gap-3 px-4 py-4 border-b border-gray-800'>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
          {title}
        </Typography>

        <div className='flex items-center gap-3'>
          <Typography variant='body2' color='text.secondary'>
            {isLoading ? (
              <Skeleton variant='text' width={80} />
            ) : (
              `${holdings.length} emiten`
            )}
          </Typography>
          <SortSelect value={sort} onChange={setSort} disabled={isLoading} />
        </div>
      </div>

      {/* Cards — grid 2 kolom di layar lebar; card yang sedang expand
          otomatis mengklaim kedua kolom (diatur dari dalam HoldingCard) */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 p-4'>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : sorted.length === 0 ? (
          <div className='col-span-full flex items-center justify-center py-6'>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Tidak ada data
            </Typography>
          </div>
        ) : (
          sorted.map((holding) => (
            <HoldingCard
              key={holding.emiten.uid}
              holding={holding}
              defaultOpen={holdings.length === 1}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function InvestorHoldings({ investorUid }: Props) {
  const [sortAbove, setSortAbove] = useState<SortKey>('pct_desc');
  const [sortBelow, setSortBelow] = useState<SortKey>('pct_desc');

  const { data, isLoading, isError, error } = useInvestorHoldings(investorUid);

  const holdings = data?.holdings ?? [];
  const aboveFive = holdings.filter((h) => h.ownership.pct >= 5);
  const belowFive = holdings.filter((h) => h.ownership.pct < 5);

  if (isError) {
    return (
      <Alert severity='error' sx={{ borderRadius: 2 }}>
        {error instanceof Error ? error.message : 'Terjadi kesalahan'}
      </Alert>
    );
  }

  return (
    <div>
      <HoldingSection
        title='Holdings ≥ 5%'
        holdings={aboveFive}
        isLoading={isLoading}
        sort={sortAbove}
        setSort={setSortAbove}
      />

      <HoldingSection
        title='Holdings < 5%'
        holdings={belowFive}
        isLoading={isLoading}
        sort={sortBelow}
        setSort={setSortBelow}
      />
    </div>
  );
}
