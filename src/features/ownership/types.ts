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
