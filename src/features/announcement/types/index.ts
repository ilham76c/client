export type AnnouncementCategory =
  | 'PMTHMETD'   // Penambahan Modal Tanpa HMETD
  | 'PMHMETD'    // Rights Issue
  | 'DIVIDEN'    // Dividen
  | 'MERGER'     // Merger & Akuisisi
  | 'BUYBACK'    // Buyback Saham
  | 'LAPKEU'     // Laporan Keuangan
  | 'RUPS'       // Rapat Umum Pemegang Saham
  | 'OTHER';

export type ImpactSentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
export type PricePrediction = 'BULLISH' | 'BEARISH' | 'SIDEWAYS';

/** Item in the list view — lightweight, no full analysis */
export interface AnnouncementListItem {
  id: string;
  ticker: string;
  company_name: string;
  announcement_date: string;
  category: AnnouncementCategory;
  title: string;
  impact_sentiment: ImpactSentiment;
  impact_score: number;
  price_prediction: PricePrediction;
}

/** Full analysis detail — fetched when user opens an item */
export interface AnnouncementAnalysis extends AnnouncementListItem {
  summary: string;
  key_facts: string[];
  impact_reasons: string[];
  prediction_rationale: string;
  short_term_outlook: string;
  medium_term_outlook: string;
  raw_data?: Record<string, string>;
}
