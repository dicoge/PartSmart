/**
 * 產品資料層 — 使用真實爬蟲資料
 * 
 * 資料來源:
 *   - 原價屋: data/coolpc-products.json (由 scrape-coolpc.js 定時產生)
 */

import type { ProductDetail, ProductSummary, ProductCategory, PriceEntry } from '../types';

// 使用 require 載入 JSON
const coolpcData: any[] = require('../../data/coolpc-products.json');

interface CrawledProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  source: string;
  sourceName: string;
  selectCategory: string;
  lastSeen: string;
}

const crawledProducts: CrawledProduct[] = coolpcData as CrawledProduct[];

const CATEGORY_NAMES: Record<string, string> = {
  cpu: 'CPU',
  gpu: '顯示卡',
  motherboard: '主機板',
  ram: '記憶體',
  ssd: 'SSD',
  hdd: '硬碟',
  psu: '電源供應器',
  case: '機殼',
  cooler: '散熱器',
  monitor: '螢幕',
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_NAMES[category] || category;
}

export function getActiveCategories(): string[] {
  const cats = new Set(crawledProducts.map((p: CrawledProduct) => p.category));
  return Object.keys(CATEGORY_NAMES).filter(c => cats.has(c));
}

function crawledToSummary(p: CrawledProduct): ProductSummary {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category as ProductCategory,
    lowestPrice: p.price,
    lowestSource: p.source,
    priceCount: 1,
  };
}

export function searchProducts(
  query: string,
  category?: string,
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular'
): ProductSummary[] {
  const q = query.toLowerCase().trim();

  let results = crawledProducts
    .filter((p: CrawledProduct) => p.category !== 'other')
    .map(crawledToSummary);

  if (q) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  // 去重
  const seen = new Set<string>();
  results = results.filter((p) => {
    const key = p.name.substring(0, 30).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (sortBy) {
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.lowestPrice - b.lowestPrice;
        case 'price_desc': return b.lowestPrice - a.lowestPrice;
        default: return b.priceCount - a.priceCount;
      }
    });
  }

  return results;
}

export function getProductsByCategory(category: string): ProductSummary[] {
  return searchProducts('', category);
}

export function getProductDetailById(id: string): ProductDetail | null {
  const crawled = crawledProducts.find((p: CrawledProduct) => p.id === id);
  if (!crawled) return null;

  const now = new Date().toISOString();
  const priceEntry: PriceEntry = {
    source: {
      id: 'coolpc',
      name: '原價屋',
      type: 'retail' as const,
      domain: 'coolpc.com.tw',
      country: 'TW' as const,
    },
    price: crawled.price,
    currency: 'TWD' as const,
    stockStatus: 'in_stock' as const,
    productUrl: 'https://www.coolpc.com.tw/evaluate.php',
    capturedAt: now,
  };

  return {
    id: crawled.id,
    name: crawled.name,
    brand: crawled.brand,
    category: crawled.category as ProductCategory,
    subcategory: crawled.selectCategory || 'other',
    imageUrl: undefined,
    specs: {},
    createdAt: crawled.lastSeen,
    updatedAt: crawled.lastSeen,
    prices: [priceEntry],
    priceHistory: [],
  };
}

export function getPopularProducts(): ProductSummary[] {
  const byCategory = new Map<string, CrawledProduct>();
  for (const p of crawledProducts) {
    if (p.category === 'other') continue;
    const existing = byCategory.get(p.category);
    if (!existing || p.price < existing.price) {
      byCategory.set(p.category, p);
    }
  }
  return Array.from(byCategory.values())
    .map(crawledToSummary)
    .sort((a, b) => a.lowestPrice - b.lowestPrice);
}