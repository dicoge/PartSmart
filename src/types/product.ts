export type ProductCategory =
  | 'cpu' | 'gpu' | 'motherboard' | 'ram'
  | 'ssd' | 'hdd' | 'psu' | 'case'
  | 'cooler' | 'monitor' | 'other';

import type { PriceEntry, PricePoint } from './price';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  imageUrl?: string;
  specs: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  imageUrl?: string;
  lowestPrice: number;
  lowestSource: string;
  priceCount: number;
}

export interface ProductDetail extends Product {
  prices: PriceEntry[];
  priceHistory: PricePoint[];
}