import type { ProductCategory } from './product';
import type { PriceSource } from './price';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    page: number;
    total: number;
    cachedAt: string;
  };
}

export interface SearchParams {
  q?: string;
  category?: ProductCategory;
  page?: number;
  limit?: number;
}

export interface SearchFilters {
  category?: ProductCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  source?: string;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

export interface ApiError {
  code: 'NOT_FOUND' | 'RATE_LIMIT' | 'CRAWLER_DOWN' | 'INTERNAL';
  message: string;
  retryAfter?: number;
}