import type { ProductDetail, ProductSummary, ProductCategory } from '../types';

// ─── Full product details (for product detail page) ───

const now = new Date().toISOString();

function makePriceEntry(sourceId: string, sourceName: string, domain: string, price: number, currency: 'TWD' | 'USD' = 'TWD', stockStatus: 'in_stock' | 'out_of_stock' | 'unknown' = 'in_stock', note?: string) {
  return {
    source: { id: sourceId, name: sourceName, type: 'retail' as const, domain, country: 'TW' as const },
    price,
    currency,
    stockStatus,
    productUrl: `https://${domain}`,
    capturedAt: now,
    note,
  };
}

const mockDetails: Record<string, ProductDetail> = {
  // ── CPU ──
  'cpu-i7-14700k': {
    id: 'cpu-i7-14700k', name: 'Intel Core i7-14700K', brand: 'Intel', category: 'cpu', subcategory: 'desktop',
    specs: { '核心/執行緒': '20C/28T', '基礎時脈': '3.4 GHz', '最大超頻': '5.6 GHz', 'L3 快取': '33 MB', 'TDP': '125W', '製程': 'Intel 7', '腳位': 'LGA1700', '記憶體支援': 'DDR5-5600 / DDR4-3200' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 13800),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 13990),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 389.99, 'USD'),
      makePriceEntry('ptt', 'PTT HardwareSale', 'ptt.cc', 12500, 'TWD', 'out_of_stock', '二手近全新'),
    ],
    priceHistory: [
      { date: '2024-12-01', price: 14200, source: '原價屋' }, { date: '2024-12-15', price: 14000, source: '原價屋' }, { date: '2025-01-01', price: 13800, source: '原價屋' },
    ],
  },
  'cpu-i5-14600k': {
    id: 'cpu-i5-14600k', name: 'Intel Core i5-14600K', brand: 'Intel', category: 'cpu', subcategory: 'desktop',
    specs: { '核心/執行緒': '14C/20T', '基礎時脈': '3.5 GHz', '最大超頻': '5.3 GHz', 'L3 快取': '24 MB', 'TDP': '125W', '製程': 'Intel 7', '腳位': 'LGA1700', '記憶體支援': 'DDR5-5600 / DDR4-3200' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 9200),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 9350),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 269.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 9500, source: '原價屋' }, { date: '2025-01-01', price: 9200, source: '原價屋' }],
  },
  'cpu-i9-14900k': {
    id: 'cpu-i9-14900k', name: 'Intel Core i9-14900K', brand: 'Intel', category: 'cpu', subcategory: 'desktop',
    specs: { '核心/執行緒': '24C/32T', '基礎時脈': '3.2 GHz', '最大超頻': '6.0 GHz', 'L3 快取': '36 MB', 'TDP': '125W', '製程': 'Intel 7', '腳位': 'LGA1700', '記憶體支援': 'DDR5-5600 / DDR4-3200' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 19800),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 19990),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 549.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 20500, source: '原價屋' }, { date: '2025-01-01', price: 19800, source: '原價屋' }],
  },
  'cpu-r7-7800x3d': {
    id: 'cpu-r7-7800x3d', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', category: 'cpu', subcategory: 'desktop',
    specs: { '核心/執行緒': '8C/16T', '基礎時脈': '4.2 GHz', '最大超頻': '5.0 GHz', 'L3 快取': '96 MB', 'TDP': '120W', '製程': 'TSMC 5nm', '腳位': 'AM5', '記憶體支援': 'DDR5-5200' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 14800),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 14650),
    ],
    priceHistory: [{ date: '2024-12-01', price: 15200, source: '原價屋' }, { date: '2025-01-01', price: 14800, source: '原價屋' }],
  },
  'cpu-r5-7600x': {
    id: 'cpu-r5-7600x', name: 'AMD Ryzen 5 7600X', brand: 'AMD', category: 'cpu', subcategory: 'desktop',
    specs: { '核心/執行緒': '6C/12T', '基礎時脈': '4.7 GHz', '最大超頻': '5.3 GHz', 'L3 快取': '32 MB', 'TDP': '105W', '製程': 'TSMC 5nm', '腳位': 'AM5', '記憶體支援': 'DDR5-5200' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 7900),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 8050),
    ],
    priceHistory: [{ date: '2024-12-01', price: 8200, source: '原價屋' }, { date: '2025-01-01', price: 7900, source: '原價屋' }],
  },
  'cpu-r3-8300x': {
    id: 'cpu-r3-8300x', name: 'AMD Ryzen 3 8300X', brand: 'AMD', category: 'cpu', subcategory: 'desktop',
    specs: { '核心/執行緒': '4C/8T', '基礎時脈': '4.0 GHz', '最大超頻': '5.1 GHz', 'L3 快取': '16 MB', 'TDP': '65W', '製程': 'TSMC 5nm', '腳位': 'AM5', '記憶體支援': 'DDR5-5200' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 5200),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 5100),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 149.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 5500, source: '原價屋' }, { date: '2025-01-01', price: 5200, source: '原價屋' }],
  },
  'cpu-r9-7950x': {
    id: 'cpu-r9-7950x', name: 'AMD Ryzen 9 7950X', brand: 'AMD', category: 'cpu', subcategory: 'desktop',
    specs: { '核心/執行緒': '16C/32T', '基礎時脈': '4.5 GHz', '最大超頻': '5.7 GHz', 'L3 快取': '64 MB', 'TDP': '170W', '製程': 'TSMC 5nm', '腳位': 'AM5', '記憶體支援': 'DDR5-5200' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 19900),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 19800),
    ],
    priceHistory: [{ date: '2024-12-01', price: 20500, source: '原價屋' }, { date: '2025-01-01', price: 19900, source: '原價屋' }],
  },

  // ── GPU ──
  'gpu-rtx4060': {
    id: 'gpu-rtx4060', name: 'NVIDIA GeForce RTX 4060', brand: 'NVIDIA', category: 'gpu', subcategory: 'graphics',
    specs: { 'CUDA 核心': '3072', 'VRAM': '8GB GDDR6', '記憶體介面': '128-bit', '核心時脈': '1830 MHz', 'Boost 時脈': '2460 MHz', 'TDP': '115W', '輸出': 'HDMI 2.1a, DP 1.4a' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 10990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 10850),
    ],
    priceHistory: [{ date: '2024-12-01', price: 11500, source: '原價屋' }, { date: '2025-01-01', price: 10990, source: '原價屋' }],
  },
  'gpu-rtx4070s': {
    id: 'gpu-rtx4070s', name: 'NVIDIA GeForce RTX 4070 Super', brand: 'NVIDIA', category: 'gpu', subcategory: 'graphics',
    specs: { 'CUDA 核心': '7168', 'VRAM': '12GB GDDR6X', '記憶體介面': '192-bit', '核心時脈': '1980 MHz', 'Boost 時脈': '2475 MHz', 'TDP': '220W', '輸出': 'HDMI 2.1a, DP 1.4a' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 21990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 21700),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 599.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 22900, source: '原價屋' }, { date: '2025-01-01', price: 21990, source: '原價屋' }],
  },
  'gpu-rtx4080s': {
    id: 'gpu-rtx4080s', name: 'NVIDIA GeForce RTX 4080 Super', brand: 'NVIDIA', category: 'gpu', subcategory: 'graphics',
    specs: { 'CUDA 核心': '10240', 'VRAM': '16GB GDDR6X', '記憶體介面': '256-bit', '核心時脈': '2295 MHz', 'Boost 時脈': '2550 MHz', 'TDP': '320W', '輸出': 'HDMI 2.1a, DP 1.4a' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 37990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 37500),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 999.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 39900, source: '原價屋' }, { date: '2025-01-01', price: 37990, source: '原價屋' }],
  },
  'gpu-rtx4090': {
    id: 'gpu-rtx4090', name: 'NVIDIA GeForce RTX 4090', brand: 'NVIDIA', category: 'gpu', subcategory: 'graphics',
    specs: { 'CUDA 核心': '16384', 'VRAM': '24GB GDDR6X', '記憶體介面': '384-bit', '核心時脈': '2235 MHz', 'Boost 時脈': '2520 MHz', 'TDP': '450W', '輸出': 'HDMI 2.1a, DP 1.4a' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 67990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 66990),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 1799.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 69900, source: '原價屋' }, { date: '2025-01-01', price: 67990, source: '原價屋' }],
  },
  'gpu-rx7900xtx': {
    id: 'gpu-rx7900xtx', name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', category: 'gpu', subcategory: 'graphics',
    specs: { '串流處理器': '6144', 'VRAM': '24GB GDDR6', '記憶體介面': '384-bit', '核心時脈': '1855 MHz', 'Boost 時脈': '2499 MHz', 'TDP': '355W', '輸出': 'HDMI 2.1, DP 2.1' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 34990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 34500),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 879.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 35900, source: '原價屋' }, { date: '2025-01-01', price: 34990, source: '原價屋' }],
  },
  'gpu-rtx4060ti': {
    id: 'gpu-rtx4060ti', name: 'NVIDIA GeForce RTX 4060 Ti 16GB', brand: 'NVIDIA', category: 'gpu', subcategory: 'graphics',
    specs: { 'CUDA 核心': '4352', 'VRAM': '16GB GDDR6', '記憶體介面': '128-bit', '核心時脈': '2310 MHz', 'Boost 時脈': '2535 MHz', 'TDP': '165W', '輸出': 'HDMI 2.1a, DP 1.4a' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 15990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 15700),
    ],
    priceHistory: [{ date: '2024-12-01', price: 16900, source: '原價屋' }, { date: '2025-01-01', price: 15990, source: '原價屋' }],
  },
  'gpu-rx7800xt': {
    id: 'gpu-rx7800xt', name: 'AMD Radeon RX 7800 XT', brand: 'AMD', category: 'gpu', subcategory: 'graphics',
    specs: { '串流處理器': '3840', 'VRAM': '16GB GDDR6', '記憶體介面': '256-bit', '核心時脈': '1624 MHz', 'Boost 時脈': '2430 MHz', 'TDP': '263W', '輸出': 'HDMI 2.1, DP 2.1' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 18990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 18700),
    ],
    priceHistory: [{ date: '2024-12-01', price: 19500, source: '原價屋' }, { date: '2025-01-01', price: 18990, source: '原價屋' }],
  },

  // ── Motherboard ──
  'mb-asus-z790': {
    id: 'mb-asus-z790', name: 'ASUS ROG STRIX Z790-E GAMING', brand: 'ASUS', category: 'motherboard', subcategory: 'atx',
    specs: { '晶片組': 'Intel Z790', '尺寸': 'ATX', '記憶體插槽': '4x DDR5', '最大記憶體': '192GB', 'PCIe': 'PCIe 5.0 x16', 'M.2 插槽': '5x M.2', 'SATA': '6x SATA 3.0', 'WiFi': 'WiFi 6E' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 12990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 12800),
    ],
    priceHistory: [{ date: '2024-12-01', price: 13500, source: '原價屋' }, { date: '2025-01-01', price: 12990, source: '原價屋' }],
  },
  'mb-gigabyte-b760': {
    id: 'mb-gigabyte-b760', name: '技嘉 GIGABYTE B760 AORUS ELITE', brand: '技嘉', category: 'motherboard', subcategory: 'atx',
    specs: { '晶片組': 'Intel B760', '尺寸': 'ATX', '記憶體插槽': '4x DDR5', '最大記憶體': '192GB', 'PCIe': 'PCIe 4.0 x16', 'M.2 插槽': '3x M.2', 'SATA': '4x SATA 3.0', 'WiFi': 'WiFi 6' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 5890),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 5750),
    ],
    priceHistory: [{ date: '2024-12-01', price: 6200, source: '原價屋' }, { date: '2025-01-01', price: 5890, source: '原價屋' }],
  },
  'mb-msi-b650': {
    id: 'mb-msi-b650', name: '微星 MSI MAG B650 TOMAHAWK', brand: '微星', category: 'motherboard', subcategory: 'atx',
    specs: { '晶片組': 'AMD B650', '尺寸': 'ATX', '記憶體插槽': '4x DDR5', '最大記憶體': '192GB', 'PCIe': 'PCIe 4.0 x16', 'M.2 插槽': '3x M.2', 'SATA': '4x SATA 3.0', 'WiFi': 'WiFi 6E' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 6490),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 6350),
    ],
    priceHistory: [{ date: '2024-12-01', price: 6800, source: '原價屋' }, { date: '2025-01-01', price: 6490, source: '原價屋' }],
  },
  'mb-asus-tuf-b760': {
    id: 'mb-asus-tuf-b760', name: 'ASUS TUF GAMING B760-PLUS WIFI', brand: 'ASUS', category: 'motherboard', subcategory: 'atx',
    specs: { '晶片組': 'Intel B760', '尺寸': 'ATX', '記憶體插槽': '4x DDR5', '最大記憶體': '192GB', 'PCIe': 'PCIe 5.0 x16', 'M.2 插槽': '3x M.2', 'SATA': '4x SATA 3.0', 'WiFi': 'WiFi 6' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 4990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 4850),
    ],
    priceHistory: [{ date: '2024-12-01', price: 5200, source: '原價屋' }, { date: '2025-01-01', price: 4990, source: '原價屋' }],
  },
  'mb-msi-pro-z790': {
    id: 'mb-msi-pro-z790', name: '微星 MSI PRO Z790-A WIFI', brand: '微星', category: 'motherboard', subcategory: 'atx',
    specs: { '晶片組': 'Intel Z790', '尺寸': 'ATX', '記憶體插槽': '4x DDR5', '最大記憶體': '192GB', 'PCIe': 'PCIe 5.0 x16', 'M.2 插槽': '4x M.2', 'SATA': '6x SATA 3.0', 'WiFi': 'WiFi 6E' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 7490),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 7350),
    ],
    priceHistory: [{ date: '2024-12-01', price: 7800, source: '原價屋' }, { date: '2025-01-01', price: 7490, source: '原價屋' }],
  },
  'mb-asus-x670e': {
    id: 'mb-asus-x670e', name: 'ASUS ROG CROSSHAIR X670E HERO', brand: 'ASUS', category: 'motherboard', subcategory: 'atx',
    specs: { '晶片組': 'AMD X670E', '尺寸': 'ATX', '記憶體插槽': '4x DDR5', '最大記憶體': '192GB', 'PCIe': 'PCIe 5.0 x16', 'M.2 插槽': '5x M.2', 'SATA': '6x SATA 3.0', 'WiFi': 'WiFi 6E' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 16990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 16700),
    ],
    priceHistory: [{ date: '2024-12-01', price: 17500, source: '原價屋' }, { date: '2025-01-01', price: 16990, source: '原價屋' }],
  },

  // ── RAM ──
  'ram-ddr5-32g': {
    id: 'ram-ddr5-32g', name: 'Kingston Fury Beast DDR5-5600 32GB', brand: 'Kingston', category: 'ram', subcategory: 'desktop',
    specs: { '容量': '32GB (2x16GB)', '類型': 'DDR5', '時脈': '5600 MHz', '延遲': 'CL36', '電壓': '1.25V', '散熱片': '鋁合金散熱片' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 2990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3050),
    ],
    priceHistory: [{ date: '2024-12-01', price: 3290, source: '原價屋' }, { date: '2025-01-01', price: 2990, source: '原價屋' }],
  },
  'ram-ddr5-64g': {
    id: 'ram-ddr5-64g', name: 'Corsair Vengeance DDR5-6000 64GB', brand: 'Corsair', category: 'ram', subcategory: 'desktop',
    specs: { '容量': '64GB (2x32GB)', '類型': 'DDR5', '時脈': '6000 MHz', '延遲': 'CL30', '電壓': '1.35V', '散熱片': '鋁合金散熱片' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 5990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 5850),
    ],
    priceHistory: [{ date: '2024-12-01', price: 6500, source: '原價屋' }, { date: '2025-01-01', price: 5990, source: '原價屋' }],
  },
  'ram-ddr4-32g': {
    id: 'ram-ddr4-32g', name: 'Crucial Ballistix DDR4-3200 32GB', brand: 'Crucial', category: 'ram', subcategory: 'desktop',
    specs: { '容量': '32GB (2x16GB)', '類型': 'DDR4', '時脈': '3200 MHz', '延遲': 'CL16', '電壓': '1.35V', '散熱片': '鋁合金散熱片' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 1990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 1950),
    ],
    priceHistory: [{ date: '2024-12-01', price: 2290, source: '原價屋' }, { date: '2025-01-01', price: 1990, source: '原價屋' }],
  },
  'ram-ddr5-16g': {
    id: 'ram-ddr5-16g', name: 'G.Skill Trident Z5 DDR5-6000 16GB', brand: 'G.Skill', category: 'ram', subcategory: 'desktop',
    specs: { '容量': '16GB (1x16GB)', '類型': 'DDR5', '時脈': '6000 MHz', '延遲': 'CL36', '電壓': '1.35V', '散熱片': '鋁合金散熱片' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 1590),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 1550),
    ],
    priceHistory: [{ date: '2024-12-01', price: 1790, source: '原價屋' }, { date: '2025-01-01', price: 1590, source: '原價屋' }],
  },
  'ram-ddr5-48g': {
    id: 'ram-ddr5-48g', name: 'Corsair Dominator Titanium DDR5-6400 48GB', brand: 'Corsair', category: 'ram', subcategory: 'desktop',
    specs: { '容量': '48GB (2x24GB)', '類型': 'DDR5', '時脈': '6400 MHz', '延遲': 'CL32', '電壓': '1.4V', '散熱片': '鍛造鋁合金散熱片' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 6990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 6850),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 189.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 7500, source: '原價屋' }, { date: '2025-01-01', price: 6990, source: '原價屋' }],
  },

  // ── SSD ──
  'ssd-990pro-2t': {
    id: 'ssd-990pro-2t', name: 'Samsung 990 Pro 2TB NVMe', brand: 'Samsung', category: 'ssd', subcategory: 'nvme',
    specs: { '容量': '2TB', '介面': 'M.2 NVMe PCIe 4.0', '讀取速度': '7,450 MB/s', '寫入速度': '6,900 MB/s', 'TBW': '1200TB', 'NAND': 'V-NAND 3-bit MLC' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 5888),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 5750),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 159.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 6200, source: '原價屋' }, { date: '2025-01-01', price: 5888, source: '原價屋' }],
  },
  'ssd-sn850x-1t': {
    id: 'ssd-sn850x-1t', name: 'WD Black SN850X 1TB NVMe', brand: 'WD', category: 'ssd', subcategory: 'nvme',
    specs: { '容量': '1TB', '介面': 'M.2 NVMe PCIe 4.0', '讀取速度': '7,300 MB/s', '寫入速度': '6,300 MB/s', 'TBW': '600TB', 'NAND': '3D TLC NAND' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 3990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3890),
    ],
    priceHistory: [{ date: '2024-12-01', price: 4200, source: '原價屋' }, { date: '2025-01-01', price: 3990, source: '原價屋' }],
  },
  'ssd-t500-2t': {
    id: 'ssd-t500-2t', name: 'Crucial T500 2TB NVMe', brand: 'Crucial', category: 'ssd', subcategory: 'nvme',
    specs: { '容量': '2TB', '介面': 'M.2 NVMe PCIe 4.0', '讀取速度': '7,400 MB/s', '寫入速度': '7,000 MB/s', 'TBW': '1200TB', 'NAND': 'Micron 232層 3D TLC' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 4990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 4880),
    ],
    priceHistory: [{ date: '2024-12-01', price: 5400, source: '原價屋' }, { date: '2025-01-01', price: 4990, source: '原價屋' }],
  },
  'ssd-p44pro-1t': {
    id: 'ssd-p44pro-1t', name: 'Solidigm P44 Pro 1TB NVMe', brand: 'Solidigm', category: 'ssd', subcategory: 'nvme',
    specs: { '容量': '1TB', '介面': 'M.2 NVMe PCIe 4.0', '讀取速度': '7,000 MB/s', '寫入速度': '6,500 MB/s', 'TBW': '750TB', 'NAND': '176層 3D TLC' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 3590),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3490),
    ],
    priceHistory: [{ date: '2024-12-01', price: 3800, source: '原價屋' }, { date: '2025-01-01', price: 3590, source: '原價屋' }],
  },
  'ssd-mx500-2t': {
    id: 'ssd-mx500-2t', name: 'Crucial MX500 2TB SATA SSD', brand: 'Crucial', category: 'ssd', subcategory: 'sata',
    specs: { '容量': '2TB', '介面': 'SATA III 6Gb/s', '讀取速度': '560 MB/s', '寫入速度': '510 MB/s', 'TBW': '700TB', 'NAND': '3D NAND TLC' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 3990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3890),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 109.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 4200, source: '原價屋' }, { date: '2025-01-01', price: 3990, source: '原價屋' }],
  },

  // ── HDD ──
  'hdd-seagate-4t': {
    id: 'hdd-seagate-4t', name: 'Seagate IronWolf 4TB NAS', brand: 'Seagate', category: 'hdd', subcategory: '3.5-inch',
    specs: { '容量': '4TB', '轉速': '5,900 RPM', '快取': '64MB', '尺寸': '3.5 吋', '介面': 'SATA 6Gb/s', '適用': 'NAS' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 3290),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3350),
    ],
    priceHistory: [{ date: '2024-12-01', price: 3500, source: '原價屋' }, { date: '2025-01-01', price: 3290, source: '原價屋' }],
  },
  'hdd-wd-8t': {
    id: 'hdd-wd-8t', name: 'WD Red Pro 8TB NAS', brand: 'WD', category: 'hdd', subcategory: '3.5-inch',
    specs: { '容量': '8TB', '轉速': '7,200 RPM', '快取': '128MB', '尺寸': '3.5 吋', '介面': 'SATA 6Gb/s', '適用': 'NAS' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 5990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 5850),
    ],
    priceHistory: [{ date: '2024-12-01', price: 6200, source: '原價屋' }, { date: '2025-01-01', price: 5990, source: '原價屋' }],
  },
  'hdd-seagate-2t': {
    id: 'hdd-seagate-2t', name: 'Seagate BarraCuda 2TB', brand: 'Seagate', category: 'hdd', subcategory: '3.5-inch',
    specs: { '容量': '2TB', '轉速': '7,200 RPM', '快取': '64MB', '尺寸': '3.5 吋', '介面': 'SATA 6Gb/s', '適用': '一般桌上型' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 1990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 2050),
    ],
    priceHistory: [{ date: '2024-12-01', price: 2200, source: '原價屋' }, { date: '2025-01-01', price: 1990, source: '原價屋' }],
  },
  'hdd-toshiba-6t': {
    id: 'hdd-toshiba-6t', name: 'Toshiba X300 6TB 效能碟', brand: 'Toshiba', category: 'hdd', subcategory: '3.5-inch',
    specs: { '容量': '6TB', '轉速': '7,200 RPM', '快取': '128MB', '尺寸': '3.5 吋', '介面': 'SATA 6Gb/s', '適用': '高效能桌上型' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 4590),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 4490),
    ],
    priceHistory: [{ date: '2024-12-01', price: 4800, source: '原價屋' }, { date: '2025-01-01', price: 4590, source: '原價屋' }],
  },

  // ── PSU ──
  'psu-seasonic-850': {
    id: 'psu-seasonic-850', name: '海韻 Focus GX-850 850W 金牌', brand: '海韻', category: 'psu', subcategory: 'atx',
    specs: { '瓦數': '850W', '效率': '80+ Gold', '模組化': '全模組', '尺寸': 'ATX', '風扇': '135mm FDB', '保護': 'OPP/OVP/UVP/SCP', '保固': '10年' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 3990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3890),
    ],
    priceHistory: [{ date: '2024-12-01', price: 4200, source: '原價屋' }, { date: '2025-01-01', price: 3990, source: '原價屋' }],
  },
  'psu-superflower-1000': {
    id: 'psu-superflower-1000', name: '振華 Leadex III 1000W 金牌', brand: '振華', category: 'psu', subcategory: 'atx',
    specs: { '瓦數': '1000W', '效率': '80+ Gold', '模組化': '全模組', '尺寸': 'ATX', '風扇': '135mm HDB', '保護': 'OPP/OVP/UVP/SCP/OCP', '保固': '10年' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 5490),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 5350),
    ],
    priceHistory: [{ date: '2024-12-01', price: 5800, source: '原價屋' }, { date: '2025-01-01', price: 5490, source: '原價屋' }],
  },
  'psu-corair-rm850e': {
    id: 'psu-corair-rm850e', name: '海盜船 RM850e 850W 金牌', brand: '海盜船', category: 'psu', subcategory: 'atx',
    specs: { '瓦數': '850W', '效率': '80+ Gold', '模組化': '全模組', '尺寸': 'ATX', '風扇': '135mm FDB', '保護': 'OPP/OVP/UVP/SCP', '保固': '10年' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 4290),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 4190),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 119.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 4500, source: '原價屋' }, { date: '2025-01-01', price: 4290, source: '原價屋' }],
  },
  'psu-evatron-650': {
    id: 'psu-evatron-650', name: 'EVGA 650 GQ 650W 金牌', brand: 'EVGA', category: 'psu', subcategory: 'atx',
    specs: { '瓦數': '650W', '效率': '80+ Gold', '模組化': '半模組', '尺寸': 'ATX', '風扇': '140mm FDB', '保護': 'OPP/OVP/UVP/SCP', '保固': '7年' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 2590),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 2490),
    ],
    priceHistory: [{ date: '2024-12-01', price: 2800, source: '原價屋' }, { date: '2025-01-01', price: 2590, source: '原價屋' }],
  },
  'psu-cm-750': {
    id: 'psu-cm-750', name: '酷碼 V750 Gold V2 750W 金牌', brand: '酷碼', category: 'psu', subcategory: 'atx',
    specs: { '瓦數': '750W', '效率': '80+ Gold', '模組化': '全模組', '尺寸': 'ATX', '風扇': '140mm HDB', '保護': 'OPP/OVP/UVP/SCP/OCP', '保固': '10年' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 3290),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3190),
    ],
    priceHistory: [{ date: '2024-12-01', price: 3500, source: '原價屋' }, { date: '2025-01-01', price: 3290, source: '原價屋' }],
  },

  // ── Case ──
  'case-lianli-o11': {
    id: 'case-lianli-o11', name: '聯力 O11 Dynamic EVO', brand: '聯力', category: 'case', subcategory: 'mid-tower',
    specs: { '尺寸': 'Mid-Tower', '主機板支援': 'ATX / mATX / ITX', '顯卡長度': '420mm', 'CPU 散熱器高度': '170mm', '風扇支援': '最多 10x 120mm', '水冷支援': '360mm (上/側)', '儲存': '4x 2.5" / 3x 3.5"' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 4590),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 4490),
    ],
    priceHistory: [{ date: '2024-12-01', price: 4900, source: '原價屋' }, { date: '2025-01-01', price: 4590, source: '原價屋' }],
  },
  'case-fractal-north': {
    id: 'case-fractal-north', name: 'Fractal Design North', brand: 'Fractal', category: 'case', subcategory: 'mid-tower',
    specs: { '尺寸': 'Mid-Tower', '主機板支援': 'ATX / mATX / ITX', '顯卡長度': '355mm', 'CPU 散熱器高度': '175mm', '風扇支援': '最多 7x 120mm', '水冷支援': '360mm (前)', '儲存': '4x 2.5" / 2x 3.5"' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 3990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3890),
    ],
    priceHistory: [{ date: '2024-12-01', price: 4200, source: '原價屋' }, { date: '2025-01-01', price: 3990, source: '原價屋' }],
  },
  'case-corsair-5000d': {
    id: 'case-corsair-5000d', name: 'Corsair 5000D Airflow', brand: '海盜船', category: 'case', subcategory: 'mid-tower',
    specs: { '尺寸': 'Mid-Tower', '主機板支援': 'ATX / mATX / ITX', '顯卡長度': '420mm', 'CPU 散熱器高度': '170mm', '風扇支援': '最多 10x 120mm', '水冷支援': '360mm (前/上)', '儲存': '6x 2.5" / 4x 3.5"' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 4990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 4890),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 139.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 5200, source: '原價屋' }, { date: '2025-01-01', price: 4990, source: '原價屋' }],
  },
  'case-nzxt-h7': {
    id: 'case-nzxt-h7', name: 'NZXT H7 Flow', brand: 'NZXT', category: 'case', subcategory: 'mid-tower',
    specs: { '尺寸': 'Mid-Tower', '主機板支援': 'ATX / mATX / ITX', '顯卡長度': '400mm', 'CPU 散熱器高度': '185mm', '風扇支援': '最多 9x 120mm', '水冷支援': '360mm (前/上)', '儲存': '4x 2.5" / 2x 3.5"' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 3990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3890),
    ],
    priceHistory: [{ date: '2024-12-01', price: 4300, source: '原價屋' }, { date: '2025-01-01', price: 3990, source: '原價屋' }],
  },
  'case-cm-h500p': {
    id: 'case-cm-h500p', name: 'Cooler Master H500P Mesh', brand: '酷碼', category: 'case', subcategory: 'mid-tower',
    specs: { '尺寸': 'Mid-Tower', '主機板支援': 'ATX / mATX / ITX', '顯卡長度': '412mm', 'CPU 散熱器高度': '160mm', '風扇支援': '最多 8x 120mm', '水冷支援': '360mm (前)', '儲存': '4x 2.5" / 2x 3.5"' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 3290),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3190),
    ],
    priceHistory: [{ date: '2024-12-01', price: 3500, source: '原價屋' }, { date: '2025-01-01', price: 3290, source: '原價屋' }],
  },

  // ── Cooler ──
  'cooler-nh-d15': {
    id: 'cooler-nh-d15', name: 'Noctua NH-D15 雙塔散熱器', brand: '貓頭鷹', category: 'cooler', subcategory: 'air',
    specs: { '類型': '雙塔空冷', '風扇': '2x NF-A15 140mm', '散熱片材質': '6mm 熱管 x6 / 鋁鰭片', '高度': '165mm', 'TDP': '250W+', '噪音': '24.6 dB(A)', '保固': '6年' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 3690),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 3590),
    ],
    priceHistory: [{ date: '2024-12-01', price: 3800, source: '原價屋' }, { date: '2025-01-01', price: 3690, source: '原價屋' }],
  },
  'cooler-ps120': {
    id: 'cooler-ps120', name: 'Thermalright Peerless Assassin 120 SE', brand: '利民', category: 'cooler', subcategory: 'air',
    specs: { '類型': '雙塔空冷', '風扇': '2x TL-C12 120mm', '散熱片材質': '6mm 熱管 x6 / 鋁鰭片', '高度': '155mm', 'TDP': '245W', '噪音': '25.6 dB(A)', '保固': '3年' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 1290),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 1190),
    ],
    priceHistory: [{ date: '2024-12-01', price: 1450, source: '原價屋' }, { date: '2025-01-01', price: 1290, source: '原價屋' }],
  },
  'cooler-fs140': {
    id: 'cooler-fs140', name: 'ID-COOLING FROSTFLOW X 240 水冷', brand: 'ID-COOLING', category: 'cooler', subcategory: 'aio',
    specs: { '類型': '一體式水冷', '尺寸': '240mm', '風扇': '2x 120mm RGB', '幫浦': '陶瓷軸承幫浦', 'TDP': '250W', '噪音': '28.6 dB(A)', '保固': '3年', 'RGB': 'ARGB 同步' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 1990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 1890),
    ],
    priceHistory: [{ date: '2024-12-01', price: 2200, source: '原價屋' }, { date: '2025-01-01', price: 1990, source: '原價屋' }],
  },
  'cooler-ak620': {
    id: 'cooler-ak620', name: 'DeepCool AK620 雙塔散熱器', brand: '九州風神', category: 'cooler', subcategory: 'air',
    specs: { '類型': '雙塔空冷', '風扇': '2x 120mm PWM', '散熱片材質': '6mm 熱管 x6 / 鋁鰭片', '高度': '160mm', 'TDP': '260W', '噪音': '28 dB(A)', '保固': '3年' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 1590),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 1490),
    ],
    priceHistory: [{ date: '2024-12-01', price: 1790, source: '原價屋' }, { date: '2025-01-01', price: 1590, source: '原價屋' }],
  },
  'cooler-h150i': {
    id: 'cooler-h150i', name: 'Corsair iCUE H150i ELITE 360mm', brand: '海盜船', category: 'cooler', subcategory: 'aio',
    specs: { '類型': '一體式水冷', '尺寸': '360mm', '風扇': '3x ML120 RGB 120mm', '幫浦': '高效能陶瓷幫浦', 'TDP': '350W+', '噪音': '30 dB(A)', '保固': '5年', 'RGB': 'iCUE 控制' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 5990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 5850),
    ],
    priceHistory: [{ date: '2024-12-01', price: 6200, source: '原價屋' }, { date: '2025-01-01', price: 5990, source: '原價屋' }],
  },

  // ── Monitor ──
  'monitor-asus-rog': {
    id: 'monitor-asus-rog', name: 'ASUS ROG Swift PG27AQDM 27" OLED', brand: '華碩', category: 'monitor', subcategory: 'gaming',
    specs: { '尺寸': '27 吋', '面板': 'OLED', '解析度': '2560x1440 (QHD)', '更新率': '240Hz', '反應時間': '0.03ms (GTG)', '色彩': '98.5% DCI-P3', 'HDR': 'HDR10 / DisplayHDR 400', '介面': 'HDMI 2.0 x2, DP 1.4 x1, USB-C' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 25990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 25500),
    ],
    priceHistory: [{ date: '2024-12-01', price: 27900, source: '原價屋' }, { date: '2025-01-01', price: 25990, source: '原價屋' }],
  },
  'monitor-samsung-g7': {
    id: 'monitor-samsung-g7', name: 'Samsung Odyssey G7 32" 4K', brand: '三星', category: 'monitor', subcategory: 'gaming',
    specs: { '尺寸': '32 吋', '面板': 'VA (曲面)', '解析度': '3840x2160 (4K)', '更新率': '144Hz', '反應時間': '1ms (MPRT)', '色彩': '95% DCI-P3', 'HDR': 'HDR10+ / DisplayHDR 600', '介面': 'HDMI 2.1 x2, DP 1.4 x2, USB-C' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 21990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 21500),
    ],
    priceHistory: [{ date: '2024-12-01', price: 23900, source: '原價屋' }, { date: '2025-01-01', price: 21990, source: '原價屋' }],
  },
  'monitor-gigabyte-m27q': {
    id: 'monitor-gigabyte-m27q', name: 'GIGABYTE M27Q 27" 2K IPS', brand: '技嘉', category: 'monitor', subcategory: 'gaming',
    specs: { '尺寸': '27 吋', '面板': 'IPS', '解析度': '2560x1440 (QHD)', '更新率': '170Hz', '反應時間': '0.5ms (MPRT)', '色彩': '92% DCI-P3', 'HDR': 'HDR Ready', '介面': 'HDMI 2.0 x2, DP 1.4 x1, USB-C' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 6990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 6850),
    ],
    priceHistory: [{ date: '2024-12-01', price: 7500, source: '原價屋' }, { date: '2025-01-01', price: 6990, source: '原價屋' }],
  },
  'monitor-lg-27gp950': {
    id: 'monitor-lg-27gp950', name: 'LG 27GP950-B 27" 4K Nano IPS', brand: 'LG', category: 'monitor', subcategory: 'gaming',
    specs: { '尺寸': '27 吋', '面板': 'Nano IPS', '解析度': '3840x2160 (4K)', '更新率': '160Hz', '反應時間': '1ms (GTG)', '色彩': '98% DCI-P3', 'HDR': 'DisplayHDR 600', '介面': 'HDMI 2.1 x2, DP 1.4 x2, USB-C' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 19990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 19500),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 549.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 21900, source: '原價屋' }, { date: '2025-01-01', price: 19990, source: '原價屋' }],
  },
  'monitor-dell-u2724': {
    id: 'monitor-dell-u2724', name: 'Dell UltraSharp U2724D 27" IPS', brand: 'Dell', category: 'monitor', subcategory: 'professional',
    specs: { '尺寸': '27 吋', '面板': 'IPS Black', '解析度': '2560x1440 (QHD)', '更新率': '120Hz', '反應時間': '5ms (GTG)', '色彩': '98% DCI-P3 / 100% sRGB', 'HDR': 'DisplayHDR 400', '介面': 'HDMI 2.1, DP 1.4 x2, USB-C 90W' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 15990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 15500),
    ],
    priceHistory: [{ date: '2024-12-01', price: 16900, source: '原價屋' }, { date: '2025-01-01', price: 15990, source: '原價屋' }],
  },

  // ── Other ──
  'keyboard-logitech': {
    id: 'keyboard-logitech', name: 'Logitech G Pro X 機械鍵盤', brand: 'Logitech', category: 'other', subcategory: 'keyboard',
    specs: { '類型': '機械式', '軸體': 'GX Blue / Red / Brown', '背光': 'RGB', '連接': 'USB-C', '尺寸': 'TKL', '按鍵數': '87', '軟體': 'G HUB', '內建記憶體': '3組設定檔' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 4990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 4890),
    ],
    priceHistory: [{ date: '2024-12-01', price: 5200, source: '原價屋' }, { date: '2025-01-01', price: 4990, source: '原價屋' }],
  },
  'mouse-razer-viper': {
    id: 'mouse-razer-viper', name: 'Razer Viper V2 Pro 無線滑鼠', brand: 'Razer', category: 'other', subcategory: 'mouse',
    specs: { '傳感器': 'Focus Pro 30K', 'DPI': '100-30,000', '按鍵數': '5', '連接': '無線 / USB-C', '電池續航': '80小時', '重量': '58g', '開關': '第3代光學滑鼠按鍵軸' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 2990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 2890),
    ],
    priceHistory: [{ date: '2024-12-01', price: 3200, source: '原價屋' }, { date: '2025-01-01', price: 2990, source: '原價屋' }],
  },
  'webcam-logitech-c920': {
    id: 'webcam-logitech-c920', name: 'Logitech C920 HD Pro 視訊攝影機', brand: 'Logitech', category: 'other', subcategory: 'webcam',
    specs: { '解析度': '1080p / 30fps', '視野': '78 度', '麥克風': '雙聲道立體聲', '連接': 'USB-A', '對焦': '自動對焦', '低光源': '有', '長度': '1.5m 線材' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 2290),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 2190),
      makePriceEntry('pcpartpicker', 'PCPartPicker', 'pcpartpicker.com', 69.99, 'USD'),
    ],
    priceHistory: [{ date: '2024-12-01', price: 2500, source: '原價屋' }, { date: '2025-01-01', price: 2290, source: '原價屋' }],
  },
  'fan-nf-a12x25': {
    id: 'fan-nf-a12x25', name: 'Noctua NF-A12x25 PWM 風扇', brand: '貓頭鷹', category: 'other', subcategory: 'fan',
    specs: { '尺寸': '120x120x25mm', '轉速': '2000 RPM', '風量': '60.1 CFM', '噪音': '22.6 dB(A)', '連接': '4-pin PWM', '軸承': 'SSO2', 'MTTF': '>150,000 小時' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 1090),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 1050),
    ],
    priceHistory: [{ date: '2024-12-01', price: 1200, source: '原價屋' }, { date: '2025-01-01', price: 1090, source: '原價屋' }],
  },
  'headset-sony-wh': {
    id: 'headset-sony-wh', name: 'Sony WH-1000XM5 降噪耳機', brand: 'Sony', category: 'other', subcategory: 'headset',
    specs: { '類型': '無線降噪', '驅動單體': '30mm', '頻率響應': '4Hz-40,000Hz', '降噪': '自適應降噪', '藍牙': '5.2', '續航': '40小時', '充電': 'USB-C / 快充3分鐘可用3小時', '重量': '250g' },
    createdAt: now, updatedAt: now, prices: [
      makePriceEntry('coolpc', '原價屋', 'coolpc.com.tw', 8990),
      makePriceEntry('sinya', '欣亞電子', 'sinya.com.tw', 8750),
    ],
    priceHistory: [{ date: '2024-12-01', price: 9500, source: '原價屋' }, { date: '2025-01-01', price: 8990, source: '原價屋' }],
  },
};

// ─── Product summaries (for search results / popular products) ───

function toSummary(detail: ProductDetail, lowestPrice: number, lowestSource: string): ProductSummary {
  return {
    id: detail.id,
    name: detail.name,
    brand: detail.brand,
    category: detail.category,
    imageUrl: detail.imageUrl,
    lowestPrice,
    lowestSource,
    priceCount: detail.prices.length,
  };
}

export const allProductSummaries: ProductSummary[] = Object.values(mockDetails).map((d) => {
  if (d.prices.length === 0) {
    return toSummary(d, 0, 'other');
  }
  const lowest = d.prices.reduce((min, p) => (p.price < min.price ? p : min));
  const srcId = lowest.source.id;
  const srcName =
    srcId === 'coolpc' ? 'coolpc' :
    srcId === 'sinya' ? 'sinya' :
    srcId === 'pcpartpicker' ? 'pcpartpicker' :
    srcId === 'ptt' ? 'ptt' : 'other';
  return toSummary(d, lowest.price, srcName);
});

export function getProductsByCategory(category: ProductCategory): ProductSummary[] {
  return allProductSummaries.filter((p) => p.category === category);
}

export function getProductDetailById(id: string): ProductDetail | null {
  return mockDetails[id] || null;
}

export function searchProducts(query: string, category?: ProductCategory, sortBy?: string): ProductSummary[] {
  let results = allProductSummaries;
  const q = query.toLowerCase().trim();

  if (q) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  // Filter by category if specified
  if (category) {
    results = results.filter((p) => p.category === category);
  }

  // Sort results
  if (sortBy) {
    const detailMap = mockDetails;
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.lowestPrice - b.lowestPrice;
        case 'price_desc':
          return b.lowestPrice - a.lowestPrice;
        case 'newest': {
          const aDetail = detailMap[a.id];
          const bDetail = detailMap[b.id];
          return new Date(bDetail?.updatedAt || 0).getTime() - new Date(aDetail?.updatedAt || 0).getTime();
        }
        case 'popular': {
          const aDetail = detailMap[a.id];
          const bDetail = detailMap[b.id];
          return (bDetail?.prices.length || 0) - (aDetail?.prices.length || 0);
        }
        default:
          return 0;
      }
    });
  }

  return results;
}