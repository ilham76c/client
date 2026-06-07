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

// Individual holding (saham di satu emiten)
export interface InvestorHolding {
  emiten_uid: string;
  ticker: string;
  shares: number;
  shares_change: number | null;
  cumulative_shares_change: string;
  ownership_date: string;
  ownership_pct: number | null;
}

export interface InvestorActivity {
  ticker: string;
  shares_change: number;
  cumulative_shares_change: number;
  ownership_date: string;
}

// Complete investor details response
export interface InvestorDetailsResponse {
  investor: InvestorBasicInfo;
  summary: InvestorSummary;
  holdings: InvestorHolding[];
  recent_activities: InvestorActivity[];
}

// API meta information
export interface ApiMeta {
  count: number;
  limit: number | null;
  offset: number | null;
  total: number | null;
}

// Full API response structure
export interface InvestorDetailsApiResponse {
  success: boolean;
  data: InvestorDetailsResponse;
  meta: ApiMeta;
}

// Search parameters
export interface InvestorSearchParams {
  name: string;
  page?: number;
  limit?: number;
}
