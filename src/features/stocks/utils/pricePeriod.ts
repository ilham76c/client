import type { PriceInterval, PriceQueryParams } from '../types';

export type PricePeriod = '1D' | '14D' | '1M' | '3M' | '6M' | 'YTD';

export const PRICE_PERIODS: {
  value: PricePeriod;
  label: string;
}[] = [
  { value: '1D', label: '1D' },
  { value: '14D', label: '14D' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: 'YTD', label: 'YTD' },
];

// ============================================================
// Backend memotong hasil ke `limit` titik TERAKHIR (series[-limit:]),
// terlepas dari start_date yang dikirim. Kalau limit lebih kecil dari
// jumlah hari bursa dalam rentang, bagian AWAL periode akan hilang
// diam-diam tanpa error. Karena itu limit dihitung dinamis dari
// jumlah hari kalender, bukan angka statis, supaya selalu cukup
// menampung seluruh rentang yang diminta.
// ============================================================
function estimateTradingDayLimit(calendarDays: number): number {
  const TRADING_DAYS_RATIO = 5 / 7; // 5 hari bursa per 7 hari kalender
  const HOLIDAY_BUFFER = 5; // buffer aman untuk libur nasional/cuti bersama
  return Math.ceil(calendarDays * TRADING_DAYS_RATIO) + HOLIDAY_BUFFER;
}

function daysBetween(start: Date, end: Date): number {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY);
}

export function getPeriodParams(period: PricePeriod): PriceQueryParams {
  const today = new Date();
  const end_date = formatDate(today);

  // ============================================================
  // 1D → data intraday hari ini
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

  switch (period) {
    case '14D':
      start.setDate(start.getDate() - 14);
      break;

    case '1M':
      start.setMonth(start.getMonth() - 1);
      break;

    case '3M':
      start.setMonth(start.getMonth() - 3);
      break;

    case '6M':
      start.setMonth(start.getMonth() - 6);
      break;

    case 'YTD':
      start.setMonth(0, 1);
      break;
  }

  const interval: PriceInterval = 'daily';
  const limit = estimateTradingDayLimit(daysBetween(start, today));

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
