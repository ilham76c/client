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
  brokers: InsiderBroker[];
}

export function groupInsiderActivities(
  activities: InsiderActivity[],
): GroupedActivity[] {
  const map = new Map<string, GroupedActivity>();

  for (const a of activities) {
    const key = `${a.date}__${a.investor.uid}__${a.action}__${a.shares_change}`;
    const existing = map.get(key);

    if (existing) {
      // Dedupe broker berdasarkan uid, jangan tambahkan yang sudah ada
      if (!existing.brokers.some((b) => b.uid === a.broker.uid)) {
        existing.brokers.push(a.broker);
      }
    } else {
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
        brokers: [a.broker],
      });
    }
  }

  return [...map.values()].sort(
    (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime(),
  );
}
