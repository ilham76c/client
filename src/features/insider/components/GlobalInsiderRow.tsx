'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import { Typography, Tooltip } from '@mui/material';
import { brokerTypeMeta } from '@/lib/helpers/brokerType';
import { brokerOwnershipMeta } from '@/lib/helpers/brokerOwnership';
import { formatNumber } from '@/lib/utils/formatters';

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

function BrokerChip({ broker }) {
  const { icon: Icon, label: typeLabel } = brokerTypeMeta(broker.type ?? '');
  const { color, label: ownershipLabel } = brokerOwnershipMeta(
    broker.ownership ?? null,
  );

  return (
    <Tooltip title={`${broker.name} • ${typeLabel} • ${ownershipLabel}`}>
      <span className='inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-gray-800'>
        <Icon sx={{ fontSize: 12, color: '#9ca3af' }} />
        <span style={{ color, fontWeight: 600 }}>{broker.code}</span>
      </span>
    </Tooltip>
  );
}

export default function GlobalInsiderRow({ activity }) {
  return (
    <div className='flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg hover:bg-gray-800/40 transition-colors'>
      <Link
        href={{
          pathname: `/stocks`,
          query: { ticker: activity.emiten.ticker },
        }}
        className='w-28 shrink-0'
      >
        <div className='font-semibold text-white text-sm hover:text-emerald-400 transition-colors'>
          {activity.emiten.ticker}
        </div>
        <div className='text-[11px] text-gray-500 truncate'>
          {activity.emiten.name}
        </div>
      </Link>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <ActionBadge action={activity.action} />
          <Typography
            variant='body2'
            sx={{ color: '#e5e5e5', fontWeight: 500 }}
            noWrap
          >
            {activity.investor.name}
          </Typography>
        </div>
        <div className='mt-1'>
          <BrokerChip broker={activity.broker} />
        </div>
      </div>

      <div className='text-right shrink-0 w-32'>
        <div
          className='text-sm font-semibold tabular-nums'
          style={{ color: activity.action === 'BUY' ? '#4ade80' : '#f87171' }}
        >
          {activity.shares_change > 0 ? '+' : ''}
          {formatNumber(activity.shares_change)}
        </div>
        <div className='text-[11px] text-gray-500'>
          {activity.ownership_pct}% kepemilikan
        </div>
      </div>

      <div className='text-xs text-gray-600 w-24 shrink-0 text-right'>
        {dayjs(activity.date).format('DD MMM YYYY')}
      </div>
    </div>
  );
}
