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

export interface Emiten {
  ticker: string;
  name: string;
};

export interface EmitenProfile {
  ticker: string
  name: string

  address: string | null
  email: string | null
  phone: string | null
  fax: string | null
  website: string | null

  npwp: string | null
  npkp: string | null
  bae: string | null

  sector: string | null
  sub_sector: string | null

  industry: string | null
  sub_industry: string | null

  listing_board: string | null
  listing_date: string | null

  main_business: string | null

  logo_url: string | null
}