export type OwnershipChange = {
  ownership_date: string;
  emiten_ticker: string;
  investor_name: string;
  investor_type: string;
  shares: number;
  prev_shares: number | null;
  shares_change: number | null;
  action: 'BUY' | 'SELL' | 'NO_CHANGE';
};

export type OwnershipRow = {
  ownership_date: string;
  emiten_ticker: string;
  investor_name: string;
  investor_type: string;
  shares: number;
  prev_shares: number | null;
  shares_change: number | null;
  cumulative_shares_change: number | null;
};

export type OwnershipData = {
  ticker: string;
  name: string;
  total_shares: string;
  series: object[];
  periods: string[];
};

export type OwnershipQueryParams = {
  ticker?: string;
  investor_type?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
};

export type ShareholderData = {
  ticker: string;
  total_shares: number;
  total_percentage: string;
  shareholders: object[];
};

export type ShareholderRow = {
  name: string;
  investor_type: string;
  category: string;
  shares_count: number;
  percentage: string;
  is_controller: boolean;
};

export type EmitenList = {
  emitens: Emiten[];
};

export interface Emiten {
  ticker: string;
  name: string;
}

export interface EmitenProfile {
  ticker: string;
  name: string;

  address: string | null;
  email: string | null;
  phone: string | null;
  fax: string | null;
  website: string | null;

  npwp: string | null;
  npkp: string | null;
  bae: string | null;

  sector: string | null;
  sub_sector: string | null;

  industry: string | null;
  sub_industry: string | null;

  listing_board: string | null;
  listing_date: string | null;

  main_business: string | null;

  logo_url: string | null;
}

export type PriceInterval = 'daily' | 'hourly';

export type PricePoint = {
  timestamp: string; // ISO datetime, e.g. "2026-06-19T09:00:00" or "2026-06-19T00:00:00" for daily
  close: number;
  open: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
};

export type PriceData = {
  ticker: string;
  interval: PriceInterval;
  start_date: string | null;
  end_date: string | null;
  prices: PricePoint[];
};

export type PriceQueryParams = {
  interval?: PriceInterval;
  start_date?: string;
  end_date?: string;
  limit?: number;
};

// types.ts (tambahan)
export interface InsiderInvestor {
  uid: string;
  name: string;
  type: string;
}

export type BrokerType =
  | 'BANK KUSTODIAN'
  | 'CLOSED MEMBER'
  | 'PERUSAHAAN SEKURITAS'
  | string;

export interface InsiderBroker {
  uid: string;
  code: string;
  name: string;
  shares: number;
  type: BrokerType;
}
export interface InsiderActivity {
  date: string;
  investor: InsiderInvestor;
  broker: InsiderBroker;
  action: 'BUY' | 'SELL';
  shares: number;
  shares_change: number;
  prev_shares: number;
  current_shares: number;
  ownership_pct: number;
}

export interface InsiderSummary {
  total_activities: number;
  buy_count: number;
  sell_count: number;
  net_shares_change: number;
}

export interface InsiderActivityResponse {
  emiten: {
    uid: string;
    ticker: string;
    name: string;
  };
  summary: InsiderSummary;
  activities: InsiderActivity[];
}
