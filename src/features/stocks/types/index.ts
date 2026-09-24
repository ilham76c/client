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

export type PriceInterval = 'daily' | 'intraday';

export type PricePoint = {
  timestamp: string; // ISO datetime, e.g. "2026-06-19T09:00:00" or "2026-06-19T00:00:00" for daily
  close: number;
  open: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
};

export type PriceSummary = {
  close: number | null;
  prev_close: number | null;
  change: number | null;
  change_pct: number | null;
  period_change: number | null;
  period_change_pct: number | null;
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
  summary: PriceSummary;
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
  emiten: Emiten;
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
  activities: InsiderActivity[];
  summary: InsiderSummary;
  meta: {
    count: number;
  };
}

export interface InsiderBroker {
  uid: string;
  code: string;
  name: string;
  type: string;
  ownership: string | null;
}


export interface DailyMarketResponse {
  market_history: DailyMarketRaw[]
}

export interface DailyMarketRaw {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  volume: number;
  value: number;
  frequency: number;
  index_individual: string;
  weight_for_index: string;
  offer: string;
  offer_volume: number;
  bid: string;
  bid_volume: number;
  listed_shares: number;
  tradeable_shares: number;
  foreign_buy: number;
  foreign_sell: number;
  foreign_net: number;
  non_regular_volume: number;
  non_regular_value: string;
  non_regular_frequency: number;
}

export interface DailyMarket {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  volume: number;
  value: number;
  frequency: number;
  offer: number;
  offerVolume: number;
  bid: number;
  bidVolume: number;
  foreignBuy: number;
  foreignSell: number;
  foreignNet: number;
}