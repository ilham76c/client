export interface Emiten {
  uid: string;
  ticker: string;
  name: string;
}

export type EmitenList = {
  emitens: Emiten[];
};

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

export interface InsiderActivityResponse {
  activities: InsiderActivity[];
  meta: {
    count: number;
  };
}
