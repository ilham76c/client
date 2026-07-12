'use client';

import { Box, LinearProgress, Stack, Typography } from '@mui/material';

import type { SecurityHolding } from '../types';

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
        <Box key={item.security_uid}>
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
              {item.portion.toFixed(1)}%{' • '}
              {item.shares.toLocaleString('id-ID')}
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
      ))}
    </Stack>
  );
}
