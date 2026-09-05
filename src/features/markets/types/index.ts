// types.ts
export interface ForeignFlowItem {
  ticker: string;
  name: string;
  foreign_buy: number;
  foreign_sell: number;
  foreign_net: number;
  tradeable_shares: number | null;
  volume: number | null;
  foreign_buy_pct: number | null;
  foreign_sell_pct: number | null;
  foreign_net_pct: number | null;
  foreign_buy_pct_volume: number | null;
  foreign_sell_pct_volume: number | null;
  foreign_net_pct_volume: number | null;
}

export interface ForeignFlowResponse {
  trading_date: string;
  top_buy: ForeignFlowItem[];
  top_sell: ForeignFlowItem[];
}
