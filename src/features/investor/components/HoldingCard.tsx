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

import dayjs from 'dayjs';
import 'dayjs/locale/id';

import SecuritiesChart from './SecuritiesChart';
import type { InvestorHolding } from '../types';
import { formatNumber } from '@/lib/utils/formatters';

dayjs.locale('id');

interface Props {
  holding: InvestorHolding;
  defaultOpen?: boolean;
}

export default function HoldingCard({ holding, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const { emiten, ownership, securities } = holding;

  const uniqueSecurities = securities.filter((s) => s.portion >= 0.1).length;
  const date = dayjs(ownership.date).format('D MMM YYYY');

  return (
    <Card
      variant='outlined'
      sx={{
        borderRadius: 2,
        transition: 'border-color 0.15s',
        '&:hover': { borderColor: 'divider' },
      }}
    >
      <CardContent sx={{ p: '12px 16px !important' }}>
        {/* Header row */}
        <div className='flex items-start justify-between gap-2'>
          <div className='flex flex-col items-start gap-3 flex-wrap'>
            <div className='flex items-center gap-2 flex-wrap'>
              <Chip
                label={emiten.ticker}
                size='small'
                color='primary'
                variant='outlined'
                sx={{ fontWeight: 600, fontSize: 12, height: 22 }}
              />
              <Chip
                label={`${ownership.pct}%`}
                size='small'
                color='success'
                variant='filled'
                sx={{ fontWeight: 600, fontSize: 12, height: 22 }}
              />
            </div>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ fontSize: 14 }}
            >
              {emiten.company_name}
            </Typography>
          </div>

          <div className='flex items-center gap-1 shrink-0'>
            <div className='flex gap-1'>
              <Typography
                variant='caption'
                color='text.disabled'
                sx={{
                  color: '#9ca3af',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Ownership date:
              </Typography>
              <Typography
                variant='caption'
                color='text.disabled'
                sx={{ fontSize: 12 }}
              >
                {date}
              </Typography>
            </div>
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
          </div>
        </div>

        {/* Stats */}
        <div className='flex gap-8 my-1'>
          <div>
            <Typography
              variant='caption'
              sx={{
                color: '#9ca3af',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Sekuritas
            </Typography>
            <Typography variant='body2' sx={{ fontSize: 14, fontWeight: 500 }}>
              {uniqueSecurities}
            </Typography>
          </div>
          <div>
            <Typography
              variant='caption'
              sx={{
                color: '#9ca3af',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Prev Shares
            </Typography>
            <Typography variant='body2' sx={{ fontSize: 14, fontWeight: 500 }}>
              {formatNumber(ownership.prev_shares)}
            </Typography>
          </div>
          <div>
            <Typography
              variant='caption'
              sx={{
                color: '#9ca3af',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Current Shares
            </Typography>
            <Typography variant='body2' sx={{ fontSize: 14, fontWeight: 500 }}>
              {formatNumber(ownership.shares)}
            </Typography>
          </div>
          <div>
            <Typography
              variant='caption'
              sx={{
                color: '#9ca3af',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Shares Change
            </Typography>
            {/* <Typography variant='body2' sx={{ fontSize: 14, fontWeight: 500 }}>
              {formatNumber(ownership.shares_change)}
            </Typography> */}
            <Typography
              variant='body2'
              sx={{
                fontWeight: 600,
                color:
                  ownership.shares_change > 0
                    ? 'success.main'
                    : ownership.shares_change < 0
                      ? 'error.main'
                      : 'text.secondary',
              }}
            >
              {ownership.shares_change > 0 ? '+' : ''}
              {formatNumber(ownership.shares_change)}
            </Typography>
          </div>
        </div>

        {/* Chart */}
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
      </CardContent>
    </Card>
  );
}
