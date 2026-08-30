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
    <Typography variant='caption' sx={{ ...captionSx, textAlign: align }}>
      {label}
    </Typography>
  );

  return (
    <div style={{ textAlign: align }}>
      {tooltip ? <Tooltip title={tooltip}>{captionEl}</Tooltip> : captionEl}
      <Typography
        variant='body2'
        sx={{ fontSize: 14, fontWeight: 500, color: valueColor }}
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

export default function HoldingCard({
  holding,
  defaultOpen = false,
  showSecurities = true,
}: HoldingCardProps) {
  const { emiten, ownership, securities } = holding;

  const canShowSecurities = showSecurities && (securities?.length ?? 0) > 0;
  const [open, setOpen] = useState(canShowSecurities && defaultOpen);

  const uniqueSecurities = securities.filter((s) => s.portion >= 0.1).length;
  const date = dayjs(ownership.date).format('DD MMMM YYYY');
  const isAboveThreshold = ownership.pct >= 5;

  return (
    <Card
      variant='outlined'
      sx={{
        borderRadius: 3,
        borderColor: '#1f2937',
        bgcolor: '#111827',
        transition: 'border-color 0.15s, grid-column 0.15s',
        // Saat dibuka (dan memang ada chart untuk ditampilkan), card ini
        // melebar mengklaim kedua kolom grid — supaya chart distribusi
        // sekuritas tetap dapat ruang penuh, bukan terjepit di setengah lebar.
        gridColumn: open && canShowSecurities ? '1 / -1' : 'auto',
        '&:hover': { borderColor: '#374151' },
      }}
    >
      <CardContent sx={{ p: '16px 20px !important' }}>
        {/* Header row */}
        <div className='flex items-start justify-between gap-2'>
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

        {/* Grup utama: alur perubahan saham (Prev -> Current -> Change -> Cumulative) */}
        <div className='flex flex-wrap items-stretch gap-3 mt-3'>
          <div className='flex w-full items-center gap-3 bg-gray-800 rounded-lg px-3 py-2'>
            <div className='flex gap-3 grow'>
              <StatItem
                label='Previous'
                value={formatNumber(ownership.prev_shares)}
                align='center'
              />
              <ArrowRightAltIcon
                sx={{ fontSize: 18, color: '#4b5563', mt: 1.5 }}
              />
              <StatItem
                label='Current'
                value={formatNumber(ownership.shares)}
                align='center'
              />
            </div>

            <div className='w-px self-stretch bg-gray-700 mx-1' />

            <StatItem
              label='Change'
              tooltip='Perubahan jumlah saham dari kepemilikan sebelumnya'
              value={signed(ownership.shares_change)}
              valueColor={changeColor(ownership.shares_change)}
              align='center'
            />

            <div className='w-px self-stretch bg-gray-700 mx-1' />

            <StatItem
              label='Cumulative'
              tooltip='Perubahan jumlah saham secara kumulatif'
              value={signed(ownership.cumulative_shares_change)}
              valueColor={changeColor(ownership.cumulative_shares_change)}
              align='center'
            />
          </div>
        </div>

        {/* Metadata: baris ringan terpisah — tidak bersaing perhatian dengan grup di atas */}
        <div className='flex items-center gap-4 mt-2.5 pl-1 flex-wrap'>
          {canShowSecurities && (
            <span className='text-xs text-gray-500'>
              <span className='text-gray-300 font-medium'>
                {uniqueSecurities}
              </span>{' '}
              sekuritas
            </span>
          )}
          <span className='text-xs text-gray-500'>
            Kepemilikan{' '}
            <span
              className={`font-medium ${isAboveThreshold ? 'text-emerald-400' : 'text-amber-400'}`}
            >
              {ownership.pct}%
            </span>
          </span>
          <span className='text-xs text-gray-500 ml-auto'>{date}</span>
        </div>

        {/* Chart */}
        {canShowSecurities && (
          <Collapse in={open} timeout={200} unmountOnExit>
            <div className='mt-3 pt-3 border-t border-gray-800'>
              <Typography
                variant='caption'
                sx={{
                  color: '#6b7280',
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
