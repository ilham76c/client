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

export interface SecurityHistoryEntry {
  date: string;
  /** ⚠️ Backend kadang mengirim angka besar sebagai string notasi ilmiah (mis. "1.75000E+9"),
   *  bukan number murni — selalu bungkus dengan Number(...) sebelum dipakai untuk kalkulasi/chart. */
  shares: string | number;
  prev_shares: string | number;
  shares_change: string | number;
}

export interface SecurityHolding {
  security_uid: string;
  code: string;
  name: string;
  shares: number;
  /** Persentase porsi sekuritas ini terhadap total kepemilikan investor di emiten ini (0–100) */
  portion: number;
  history: SecurityHistoryEntry[];
}

export interface Emiten {
  uid: string;
  ticker: string;
  company_name: string;
}

export interface Ownership {
  /** Sumber laporan kepemilikan, mis. '5_PERCENT' atau '1_PERCENT' — bukan indikator pct aktual, hanya jenis threshold laporan */
  source: string;
  /** Tanggal laporan kepemilikan, format ISO 'YYYY-MM-DD' */
  date: string;
  shares: number;
  prev_shares: number | null;
  shares_change: number | null;
  /** ⚠️ Backend mengembalikan ini sebagai string (mis. "0"), bukan number seperti field lain.
   *  Lihat catatan normalisasi di bawah. */
  cumulative_shares_change: number | null;
  pct: number;
}
export interface InvestorHolding {
  emiten: Emiten;
  ownership: Ownership;
  securities: SecurityHolding[];
}

export interface InvestorHoldingsSummary {
  total_emitens: number;
  total_shares: number;
  above_5_percent: number;
  one_to_five_percent: number;
}

export interface BrokerDistribution {
  emiten: Emiten;
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
  investor: {
    uid: string;
    name: string;
    type: 'L' | 'P'; // Lokal / Perusahaan(asing) — sesuaikan kalau kode aslinya beda
  };
  summary: InvestorHoldingsSummary;
  holdings: InvestorHolding[];
}
