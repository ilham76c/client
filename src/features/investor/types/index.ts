// Basic investor information
export interface InvestorBasicInfo {
  uid: string;
  name: string;
  type: 'L' | 'P'; // L=Lokal, P=Perusahaan
}

// Investor summary (ownership overview)
export interface InvestorSummary {
  total_emitens: number;
  total_shares: number;
}

// Allocation breakdown (percentage ownership per emiten)
export interface InvestorAllocation {
  ticker: string;
  shares: number;
  allocation_pct: number;
  ownership_pct: number | null;
}

// Individual holding (saham di satu emiten)
// export interface InvestorHolding {
//   emiten_uid: string;
//   ticker: string;
//   shares: number;
//   shares_change: number | null;
//   cumulative_shares_change: string;
//   ownership_date: string;
//   ownership_pct: number | null;
// }

export interface InvestorActivity {
  ticker: string;
  shares_change: number;
  cumulative_shares_change: number;
  ownership_date: string;
  prev_shares: number;
  shares: number;
}

export interface InvestorAllocationSummary {
  top3_pct: number;
  total_emitens: number;
  total_shares: number;
}

// Complete investor details response
export interface InvestorDetails {
  investor: InvestorBasicInfo;
  summary: InvestorSummary;
  holdings: InvestorHolding[];
  recent_activities: InvestorActivity[];
  allocation: InvestorAllocation[];
  allocation_summary: InvestorAllocationSummary;
}

// API meta information
export interface ApiMeta {
  count: number;
  limit: number | null;
  offset: number | null;
  total: number | null;
}

// Search parameters
export interface InvestorSearchParams {
  name: string;
  page?: number;
  limit?: number;
}

// Result item from /investors/search endpoint
export interface SearchInvestor {
  uuid: string;
  name: string;
  investor_type: string;
}

export interface Investor {
  uuid: string;
  name: string;
  investor_type: string;
}

export interface SecurityHolding {
  account_holding_uid: string;
  security_uid: string;
  code: string;
  name: string;
  shares: number;
  portion: number;
  history: Array<{
    date: string;
    prev_shares: string;
    shares: string; 
    shares_change: string;
  }>;
}

export interface InvestorHolding {
  cumulative_shares_change: string;
  emiten_uid: string;
  ownership_date: string;
  ownership_pct: string;
  shares: number;
  shares_change: number;
  ticker: string;
}

export interface BrokerDistribution {
  emiten: {
    uid: string;
    ticker: string;
    company_name: string;
  };
  ownership: {
    date: string;
    pct: number;
    shares: number;
    prev_shares: number;
    shares_change: number;
  };
  securities: SecurityHolding[];
}

export interface InvestorHoldingsResponse {
  holdings: BrokerDistribution[];
}
