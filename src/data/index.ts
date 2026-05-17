/**
 * 產品資料層 — 合併所有爬蟲資料來源
 *
 * 資料來源:
 *   - 原價屋: data/coolpc-products.json (新品價格)
 *   - PTT: data/ptt-products.json (二手價格)
 */

import type { ProductDetail, ProductSummary, ProductCategory, PriceEntry } from '../types';

const coolpcData: any[] = require('../../data/coolpc-products.json');
const pttData: any[] = require('../../data/ptt-products.json');

interface CrawledProduct {
  id: string; name: string; brand: string; category: string;
  price: number; source: string; sourceName: string;
  lastSeen: string; url?: string;
}

const coolpcProducts: CrawledProduct[] = coolpcData as CrawledProduct[];
const pttProducts: CrawledProduct[] = pttData as CrawledProduct[];

const CATEGORY_NAMES: Record<string, string> = {
  cpu: 'CPU', gpu: '顯示卡', motherboard: '主機板', ram: '記憶體',
  ssd: 'SSD', hdd: '硬碟', psu: '電源供應器', case: '機殼',
  cooler: '散熱器', monitor: '螢幕', peripheral: '周邊',
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_NAMES[category] || category;
}

export function getActiveCategories(): string[] {
  const cats = new Set([
    ...coolpcProducts.map((p: CrawledProduct) => p.category),
    ...pttProducts.map((p: CrawledProduct) => p.category),
  ]);
  return Object.keys(CATEGORY_NAMES).filter(c => cats.has(c));
}

function toSummary(p: CrawledProduct): ProductSummary {
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

  let results = [
    ...coolpcProducts
      .filter((p: CrawledProduct) => p.category !== 'other')
      .map(toSummary),
    ...pttProducts.map(toSummary),
  ];

  if (q) {
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  // 去重 (同名同類別取低價)
  const seen = new Map<string, ProductSummary>();
  for (const p of results) {
    const key = p.name.substring(0, 25).toLowerCase() + '-' + p.category;
    const existing = seen.get(key);
    if (!existing || p.lowestPrice < existing.lowestPrice) {
      seen.set(key, p);
    }
  }
  results = Array.from(seen.values());

  if (sortBy) {
    results.sort((a, b) => {
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
  const coolpc = coolpcProducts.find((p: CrawledProduct) => p.id === id);
  const ptt = pttProducts.find((p: CrawledProduct) => p.id === id);

  if (!coolpc && !ptt) return null;

  const now = new Date().toISOString();
  const prices: PriceEntry[] = [];

  if (coolpc) {
    prices.push({
      source: { id: 'coolpc', name: '原價屋', type: 'retail' as const, domain: 'coolpc.com.tw', country: 'TW' as const },
      price: coolpc.price,
      currency: 'TWD' as const,
      stockStatus: 'in_stock' as const,
      productUrl: 'https://www.coolpc.com.tw/evaluate.php',
      capturedAt: now,
      note: '新品',
    });
  }

  if (ptt) {
    prices.push({
      source: { id: 'ptt', name: 'PTT HardwareSale', type: 'marketplace' as const, domain: 'ptt.cc', country: 'TW' as const },
      price: ptt.price,
      currency: 'TWD' as const,
      stockStatus: 'out_of_stock' as const,
      productUrl: ptt.url || 'https://www.ptt.cc/bbs/HardwareSale/',
      capturedAt: now,
      note: '二手',
    });
  }

  const sourceProduct: CrawledProduct | undefined = coolpc || ptt;
  if (!sourceProduct) return null;

  return {
    id: sourceProduct.id,
    name: sourceProduct.name,
    brand: sourceProduct.brand,
    category: sourceProduct.category as ProductCategory,
    subcategory: 'other',
    imageUrl: undefined,
    specs: {},
    createdAt: sourceProduct.lastSeen,
    updatedAt: sourceProduct.lastSeen,
    prices,
    priceHistory: [],
  };
}

export function getPopularProducts(): ProductSummary[] {
  const byCategory = new Map<string, ProductSummary>();

  const all = [...coolpcProducts.map(toSummary), ...pttProducts.map(toSummary)];
  for (const p of all) {
    if (p.category === 'other') continue;
    const existing = byCategory.get(p.category);
    if (!existing || p.lowestPrice < existing.lowestPrice) {
      byCategory.set(p.category, p);
    }
  }

  return Array.from(byCategory.values()).sort((a, b) => a.lowestPrice - b.lowestPrice);
}
