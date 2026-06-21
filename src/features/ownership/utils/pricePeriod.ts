import type { PriceInterval, PriceQueryParams } from '../types';

export type PricePeriod = '1D' | '1W' | '1M' | 'YTD';

export const PRICE_PERIODS: { value: PricePeriod; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: 'YTD', label: 'YTD' },
];

/**
 * Resolve a PricePeriod into the query params sent to the price endpoint.
 *
 * - '1D' uses interval='hourly' — backend returns intraday closes
 *   (09:00–16:30) for the most recent trading day.
 * - '1W' / '1M' / 'YTD' use interval='daily' with a computed date range.
 */
export function getPeriodParams(period: PricePeriod): PriceQueryParams {
  const today = new Date();
  const end_date = formatDate(today);

  if (period === '1D') {
    const interval: PriceInterval = 'hourly';
    return { interval, end_date };
  }

  const start = new Date(today);

  switch (period) {
    case '1W':
      start.setDate(start.getDate() - 7);
      break;
    case '1M':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'YTD':
      start.setMonth(0, 1); // Jan 1st of current year
      break;
  }

  const interval: PriceInterval = 'daily';
  return { interval, start_date: formatDate(start), end_date };
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}