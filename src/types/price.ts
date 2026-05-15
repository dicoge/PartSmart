export type StockStatus = 'in_stock' | 'out_of_stock' | 'unknown';
export type SourceType = 'retail' | 'marketplace' | 'forum';

export interface PriceSource {
  id: string;
  name: string;
  type: SourceType;
  domain: string;
  logoUrl?: string;
  country: 'TW' | 'US';
}

export interface PriceEntry {
  source: PriceSource;
  price: number;
  currency: 'TWD' | 'USD';
  stockStatus: StockStatus;
  productUrl: string;
  capturedAt: string;
  note?: string;
}

export interface PricePoint {
  date: string;
  price: number;
  source: string;
}