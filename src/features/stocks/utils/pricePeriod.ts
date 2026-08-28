import type { PriceInterval, PriceQueryParams } from '../types';

export type PricePeriod = '1D' | '14D' | '1M' | '3M' | '6M' | 'YTD';

export const PRICE_PERIODS: {
  value: PricePeriod;
  label: string;
}[] = [
  {
    value: '1D',
    label: '1D',
  },
  {
    value: '14D',
    label: '14D',
  },
  {
    value: '1M',
    label: '1M',
  },
  {
    value: '3M',
    label: '3M',
  },
  {
    value: '6M',
    label: '6M',
  },
  {
    value: 'YTD',
    label: 'YTD',
  },
];

export function getPeriodParams(period: PricePeriod): PriceQueryParams {
  const today = new Date();

  const end_date = formatDate(today);

  // ============================================================
  // 1D
  // ============================================================

  if (period === '1D') {
    const interval: PriceInterval = 'intraday';

    return {
      interval,
      end_date,
    };
  }

  // ============================================================
  // DAILY
  // ============================================================

  const start = new Date(today);
  let limit = 90;

  switch (period) {
    case '14D':
      start.setDate(start.getDate() - 14);
      limit = 10;
      break;

    case '1M':
      start.setMonth(start.getMonth() - 1);
      limit = 22;
      break;

    case '3M':
      start.setMonth(start.getMonth() - 3);
      limit = 45;
      break;

    case '6M':
      start.setMonth(start.getMonth() - 6);
      limit = 60;
      break;

    case 'YTD':
      start.setMonth(0, 1);
      limit = 80;
      break;
  }

  const interval: PriceInterval = 'daily';

  return {
    interval,
    limit,
    start_date: formatDate(start),
    end_date,
  };
}

// ============================================================
// IMPORTANT:
// Jangan gunakan toISOString() karena dapat menggeser
// tanggal akibat timezone.
// ============================================================

function formatDate(d: Date): string {
  const year = d.getFullYear();

  const month = String(d.getMonth() + 1).padStart(2, '0');

  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
