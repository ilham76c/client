'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Collapse,
  Chip,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

import dayjs from 'dayjs';
import 'dayjs/locale/id';

import SecuritiesChart from './SecuritiesChart';
import type { InvestorHolding } from '../types';
import { formatNumber } from '@/lib/utils/formatters';

dayjs.locale('id');

interface HoldingCardProps {
  holding: InvestorHolding;
  defaultOpen?: boolean;
  /** Tampilkan tombol & panel "lihat sekuritas". Set false untuk holding <5% yang tidak punya history sekuritas. */
  showSecurities?: boolean;
}

const captionSx = {
  color: '#9ca3af',
  fontSize: 11,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  display: 'block',
};

function StatItem({
  label,
  value,
  tooltip,
  valueColor,
  align = 'left',
}: {
  label: string;
  value: React.ReactNode;
  tooltip?: string;
  valueColor?: string;
  align?: 'left' | 'center' | 'right';
}) {
  const captionEl = (
    <Typography
      variant='caption'
      sx={{ ...captionSx, textAlign: align === 'right' ? 'right' : 'left' }}
    >
      {label}
    </Typography>
  );

  return (
    <div style={{ textAlign: align }}>
      {tooltip ? <Tooltip title={tooltip}>{captionEl}</Tooltip> : captionEl}
      <Typography
        variant='body2'
        sx={{ fontSize: 14, fontWeight: 300, color: valueColor }}
      >
        {value}
      </Typography>
    </div>
  );
}

function changeColor(value: number) {
  if (value > 0) return 'success.main';
  if (value < 0) return 'error.main';
  return 'text.secondary';
}

function signed(value: number) {
  return `${value > 0 ? '+' : ''}${formatNumber(value)}`;
}

/** ≥5% = success (hijau), <5% = warning (kuning/amber) — memberi sinyal cepat tingkat kepemilikan. */
function pctChipColor(pct: number): 'success' | 'warning' {
  return pct >= 5 ? 'success' : 'warning';
}

export default function HoldingCard({
  holding,
  defaultOpen = false,
  showSecurities = true,
}) {
  const { emiten, ownership, securities } = holding;

  // Pengaman tambahan: kalau data securities memang kosong, jangan tampilkan toggle
  // meskipun showSecurities dikirim true dari parent.
  const canShowSecurities = showSecurities && (securities?.length ?? 0) > 0;

  const [open, setOpen] = useState(canShowSecurities && defaultOpen);

  const uniqueSecurities = securities.filter((s) => s.portion >= 0.1).length;
  const date = dayjs(ownership.date).format('DD MMMM YYYY');

  return (
    <Card
      variant='outlined'
      sx={{
        borderRadius: 3,
        transition: 'border-color 0.15s',
        '&:hover': { borderColor: 'divider' },
      }}
    >
      <CardContent sx={{ p: '16px 20px !important' }}>
        {/* Header row */}
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-start gap-3'>
            <div className='flex items-center gap-2 flex-wrap'>
              <Chip
                label={emiten.ticker}
                size='small'
                color='primary'
                variant='outlined'
                sx={{ fontWeight: 600, fontSize: 12, height: 22 }}
              />

              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ fontSize: 14 }}
              >
                {emiten.company_name}
              </Typography>
            </div>

          </div>

          {canShowSecurities && (
            <Tooltip title={open ? 'Sembunyikan' : 'Lihat sekuritas'}>
              <IconButton
                size='small'
                onClick={() => setOpen((v) => !v)}
                sx={{
                  transition: 'transform 0.2s',
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <KeyboardArrowDownIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </div>

        {/* Stats */}
        <div className='flex flex-wrap items-stretch gap-5 mt-3'>
          {canShowSecurities && (
            <>
              {/* Grup: alur perubahan saham (Prev -> Current -> Change) */}
              <div className='flex grow justify-left gap-3 bg-gray-800 rounded-lg px-3 py-2'>
                <div className='flex gap-3'>
                  <StatItem
                    label='Previous shares'
                    value={formatNumber(ownership.prev_shares)}
                    align='right'
                  />
                  <ArrowRightAltIcon
                    sx={{ fontSize: 18, color: '#d1d5db', mt: 1.5 }}
                  />
                  <StatItem
                    label='Current shares'
                    value={formatNumber(ownership.shares)}
                    align='right'
                  />
                </div>

                <div className='w-px self-stretch bg-gray-200 mx-2' />

                <StatItem
                  label='Shares Change'
                  tooltip='Perubahan jumlah saham dari kepemilikan sebelumnya'
                  value={signed(ownership.shares_change)}
                  valueColor={changeColor(ownership.shares_change)}
                  align='right'
                />

                <div className='w-px self-stretch bg-gray-200 mx-2' />

                <StatItem
                  label='Cumulative change'
                  tooltip='Perubahan jumlah saham secara kumulatif'
                  value={signed(ownership.cumulative_shares_change)}
                  valueColor={changeColor(ownership.cumulative_shares_change)}
                  align='right'
                />

              </div>

              {/* <div className='flex gap-3 py-2'>
                <StatItem
                  label='Cumulative change'
                  tooltip='Perubahan jumlah saham secara kumulatif'
                  value={signed(ownership.cumulative_shares_change)}
                  valueColor={changeColor(ownership.cumulative_shares_change)}
                  align='right'
                />


              </div> */}
            </>
          )}

          {!canShowSecurities && (
            <StatItem
              label='Current shares'
              value={formatNumber(ownership.shares)}
            />
          )}

          {/* Metadata tanggal, didorong ke kanan agar terpisah dari angka kepemilikan */}
          <div className='ml-auto inline-flex items-start gap-3 pt-2'>
            <StatItem label='Sekuritas' value={uniqueSecurities} align='center' />
            <StatItem label='Ownership' value={`${ownership.pct}%`} align='center' valueColor='orange' />
            <StatItem label='Ownership date' value={date} align='right' />
          </div>
        </div>

        {/* Chart */}
        {canShowSecurities && (
          <Collapse in={open} timeout={200} unmountOnExit>
            <div className='mt-3 pt-3 border-t border-divider'>
              <Typography
                variant='caption'
                color='text.disabled'
                sx={{
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                Distribusi per sekuritas
              </Typography>
              <SecuritiesChart securities={securities} />
            </div>
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
}