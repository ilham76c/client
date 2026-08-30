// lib/groupInsiderActivities.ts
import type { InsiderActivity, InsiderBroker } from '../types';

export interface GroupedActivity {
  key: string;
  date: string;
  investor: InsiderActivity['investor'];
  action: 'BUY' | 'SELL';
  shares: number;
  shares_change: number;
  prev_shares: number;
  current_shares: number;
  ownership_pct: number;
  broker: InsiderBroker;
}

export function groupInsiderActivities(
  activities: InsiderActivity[],
): GroupedActivity[] {
  const map = new Map<string, GroupedActivity>();

  for (const a of activities) {
    const key = `${a.date}__${a.investor.uid}__${a.action}__${a.shares_change}`;

    // Broker pertama yang tercatat untuk transaksi ini dianggap sebagai
    // broker yang sebenarnya dipakai — entri berikutnya dengan key sama
    // diabaikan (data mentah bisa punya duplikat relasi broker lain
    // yang tidak relevan dengan transaksi ini).
    if (map.has(key)) continue;

    map.set(key, {
      key,
      date: a.date,
      investor: a.investor,
      action: a.action,
      shares: a.shares,
      shares_change: a.shares_change,
      prev_shares: a.prev_shares,
      current_shares: a.current_shares,
      ownership_pct: a.ownership_pct,
      broker: a.broker,
    });
  }

  return [...map.values()].sort(
    (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime(),
  );
}
