'use client';

import { Box, LinearProgress, Stack, Typography, Skeleton } from '@mui/material';
import { formatNumber } from '@/lib/utils/formatters';
import type { SecurityHolding } from '../types';
import { useState } from 'react';

const COLORS = [
  '#378ADD',
  '#1D9E75',
  '#BA7517',
  '#D4537E',
  '#7F77DD',
  '#888780',
];

function shortenName(name: string) {
  return name
    .replace(' SEKURITAS', ' SEK.')
    .replace(' INDONESIA', '')
    .replace(' DIGITAL', '');
}

export default function SecuritiesChart({
  securities,
}: {
  securities: SecurityHolding[];
}) {
  return (
    <Stack spacing={2}>
      {securities.map((item, index) => (
        <SecurityHistory key={item.security_uid} item={item} index={index} />
      ))}
    </Stack>
  );
}


function SecurityHistory({ item, index }) {
  const [open, setOpen] = useState(false);
  const isLoading = false;
  return (
    <Stack direction='column' spacing={0.5} key={item.security_uid}>
      <Stack direction='row' spacing={1.5} >
        <Box key={item.security_uid} sx={{ flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 0.5,
            }}
          >
            <Stack direction='row' sx={{ spacing: 1, alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  px: 1,
                  borderRadius: 1,
                  bgcolor: '#2b2b2b',
                  color: '#d5d5d5',
                  fontSize: 12,
                  minWidth: 30,
                  textAlign: 'center',
                }}
              >
                {item.code}
              </Box>

              <Typography variant='body2' color='#cfcfcf'>
                {shortenName(item.name)}
              </Typography>
            </Stack>

            <Typography variant='body2' color='#9c9c9c'>
              {item.portion}%&nbsp;{' • '}&nbsp;
              {formatNumber(item.shares)}
            </Typography>
          </Box>

          <LinearProgress
            variant='determinate'
            value={item.portion}
            sx={{
              height: 8,
              borderRadius: 99,

              bgcolor: '#1d1d1d',

              '& .MuiLinearProgress-bar': {
                borderRadius: 99,
                backgroundColor: COLORS[index % COLORS.length],
              },
            }}
          />
        </Box>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={`${open ? 'Sembunyikan' : 'Lihat'} riwayat ${item.name}`}
          className={`
              flex items-center gap-1.5 shrink-0
              text-xs px-2.5 py-1 rounded-md border transition-colors
              ${open
              ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
              : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'}
            `}
        >
          <svg
            width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </svg>
          Riwayat
          <svg
            width="11" height="11" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </Stack>

      {open && (
        <div className="bg-gray-950 border-t border-gray-800">
          {isLoading ? (
            <div className="px-4 py-3 space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  height={24}
                  sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}
                />
              ))}
            </div>
          ) : item.history.length === 0 ? (
            <p className="px-4 py-3 text-xs text-gray-600">
              Tidak ada riwayat tersedia.
            </p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/60">
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">
                    No.
                  </th>
                  <th className="px-4 py-2 text-left text-gray-500 font-medium">
                    Tanggal
                  </th>
                  <th className="px-4 py-2 text-right text-gray-500 font-medium">
                    Saham
                  </th>
                  <th className="px-4 py-2 text-right text-gray-500 font-medium">
                    Sebelumnya
                  </th>
                  <th className="px-4 py-2 text-right text-gray-500 font-medium">
                    Perubahan
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.history.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800/60 last:border-0 hover:bg-gray-800/30"
                  >
                    <td className="px-4 py-2 text-gray-400">
                      {i + 1}.
                    </td>
                    <td className="px-4 py-2 text-gray-400">
                      {row.date}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-300">
                      {formatNumber(row.shares)}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-500">
                      {formatNumber(row.prev_shares)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {/* <ChangeCell value={row.shares_change} /> */}
                      {Number(row.shares_change) > 0 ? (
                        <span className="text-green-500">+{formatNumber(row.shares_change)}</span>
                      ) : Number(row.shares_change) < 0 ? (
                        <span className="text-red-500">{formatNumber(row.shares_change)}</span>
                      ) : (
                        <span className="text-gray-500">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </Stack>
  )
}