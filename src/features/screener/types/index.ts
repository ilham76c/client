// types.ts
export interface VolumeSpikeItem {
  ticker: string;
  name: string;
  trading_date: string;
  volume: number;
  value: number;
  frequency: number;
  close: number;
  change: number;
  previous_close: number;
  open: number;
  high: number;
  low: number;
  tradeable_shares: number;
  foreign_buy: number;
  foreign_sell: number;
  foreign_net: number;
  volume_avg_5d: number;
  volume_avg_20d: number;
  volume_ratio_5d: number;
  volume_ratio_20d: number;
  volume_change_pct_20d: number;
}

export interface VolumeSpikeResponse {
  trading_date: string;
  volume_spikes: VolumeSpikeItem[];
}
