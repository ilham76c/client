import { OwnershipRow } from '@/features/ownership/types';

type Point = {
  date: string;
  value: number;
};

export function buildOwnershipChangeSeries(rows: OwnershipRow[]): Point[] {
  const map = new Map<string, number>();

  rows.forEach((row) => {
    const date = row.ownership_date;
    const change = row.shares_change ?? 0;

    map.set(date, (map.get(date) ?? 0) + change);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value }));
}

type SeriesPoint = {
  date: string;
  value: number;
};

export function buildStackedLineByInvestorType(rows: OwnershipRow[]) {
  const seriesName = {};
  rows.forEach((row) => {
    if (!seriesName[row.investor_name]) {
      seriesName[row.investor_name] = {
        name: row.investor_name,
        type: 'line',
        stack: 'Total',
        smooth: false,
        data: [],
      };
    }

    seriesName[row.investor_name].data.push({
      value: row.cumulative_shares_change ?? 0,
      change: row.shares_change ?? 0,
    });
  });

  const series = Object.values(seriesName);
  const legend = Object.keys(seriesName);
  const xAxisData = Array.from(new Set(rows.map((row) => row.ownership_date)));

  return { series, legend, xAxisData };
}
