export interface PriceState {
  buy: number;
  sell: number;
  buyChange: number;
  sellChange: number;
  usdIdr: number;
  high: number;
  low: number;
  spread: number;
  titikOn: number;
  promoStatus: 'ON' | 'OFF' | 'UNKNOWN';
  limit: number;
  markState: 'MARKUP' | 'MARKDOWN' | 'STABIL';
  markAmount: number;
  lastUpdated: string;
}

export interface NominalTier {
  nominal: number; // in Rupiah, e.g. 10000000
  label: string; // e.g. "10jt"
  grams: number;
  spreadRp: number;
}

export interface HistoryRecord {
  id: string;
  time: string;
  timestamp: number;
  buy: number;
  sell: number;
  buyChange: number;
  sellChange: number;
  spread: number;
  usdIdr: number;
  markState: string;
  markAmount: number;
  tiers: {
    nominal: number;
    grams: number;
    spreadRp: number;
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  impact: 'low' | 'medium' | 'high';
  timeWib: string;
  dateStr: string;
  ts: number;
  actual?: string;
  forecast?: string;
  previous?: string;
  signal?: {
    label: string;
    type: 'up' | 'down' | 'wait';
  };
}

export interface SoundConfig {
  priceUp: boolean;
  highUp: boolean;
  priceDown: boolean;
  highDown: boolean;
  promo: boolean;
  countdown: boolean;
  volume: number;
}
