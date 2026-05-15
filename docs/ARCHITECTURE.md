# PartSmart — 技術架構規劃文件

| 文件資訊 | 內容 |
|---------|------|
| **專案** | PartSmart 電腦零件查價工具 |
| **版本** | 1.0.0 |
| **技術棧** | Expo + React Native + Vercel + OpenRouter |
| **平台** | iOS / Android App + Web（Mobile-first 響應式） |

---

## 目錄

1. [目錄結構](#1-目錄結構)
2. [資料流架構](#2-資料流架構)
3. [狀態管理設計](#3-狀態管理設計)
4. [API 路由設計](#4-api-路由設計)
5. [爬蟲模組設計](#5-爬蟲模組設計)
6. [響應式 UI 策略](#6-響應式-ui-策略)
7. [Component 樹狀圖](#7-component-樹狀圖)
8. [TypeScript 型別設計](#8-typescript-型別設計)
9. [效能優化策略](#9-效能優化策略)
10. [安全性考量](#10-安全性考量)

---

## 1. 目錄結構

```
PartSmart/
├── app/                    # Expo Router (file-based routing)
│   ├── (tabs)/             # 底部導航分頁
│   │   ├── _layout.tsx     # Tab 佈局
│   │   ├── index.tsx       # 首頁
│   │   ├── search.tsx      # 搜尋頁
│   │   ├── favorites.tsx   # 收藏頁
│   │   └── settings.tsx    # 設定頁
│   ├── product/            # 零件相關頁面
│   │   ├── [id].tsx        # 零件詳情頁
│   │   └── compare.tsx     # 價格比較頁 (Phase 2)
│   └── _layout.tsx         # 根佈局
│
├── src/
│   ├── components/         # 可複用元件
│   │   ├── ui/             # 基礎 UI 元件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── PriceTag.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Loading.tsx
│   │   ├── product/        # 產品相關元件
│   │   │   ├── ProductCard.tsx
│   │   │   ├── PriceTable.tsx
│   │   │   ├── PriceChart.tsx    # (Phase 2)
│   │   │   ├── SourceBadge.tsx
│   │   │   └── SpecList.tsx
│   │   ├── layout/         # 佈局元件
│   │   │   ├── Header.tsx
│   │   │   ├── CategoryGrid.tsx
│   │   │   └── TabBar.tsx
│   │   └── common/         # 通用元件
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── stores/             # Zustand 狀態管理
│   │   ├── productStore.ts
│   │   ├── searchStore.ts
│   │   ├── favoriteStore.ts
│   │   └── uiStore.ts
│   │
│   ├── services/           # API 服務 + 業務邏輯
│   │   ├── api.ts          # API 客戶端
│   │   ├── products.ts     # 產品 API
│   │   ├── prices.ts       # 價格 API
│   │   └── categories.ts   # 分類 API
│   │
│   ├── hooks/              # 自訂 Hooks
│   │   ├── useProduct.ts
│   │   ├── useSearch.ts
│   │   ├── useFavorites.ts
│   │   └── useDebounce.ts
│   │
│   ├── types/              # TypeScript 型別
│   │   ├── product.ts
│   │   ├── price.ts
│   │   ├── api.ts
│   │   └── navigation.ts
│   │
│   ├── utils/              # 工具函數
│   │   ├── format.ts       # 價格/日期格式化
│   │   ├── storage.ts      # AsyncStorage 包裝
│   │   ├── constants.ts    # 常數
│   │   └── platform.ts     # 平台檢測
│   │
│   └── styles/             # 樣式
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
│
├── api/                    # Vercel Edge Functions (API Routes)
│   ├── products/
│   │   ├── index.ts        # GET /api/products
│   │   └── [id].ts         # GET /api/products/:id
│   ├── prices/
│   │   └── [productId].ts  # GET /api/prices/:productId
│   ├── categories/
│   │   └── index.ts        # GET /api/categories
│   ├── trending.ts         # GET /api/trending
│   └── _utils/
│       ├── db.ts           # 資料庫連線
│       └── cache.ts        # Redis 快取
│
├── crawlers/               # 爬蟲程式（Vercel Cron Jobs）
│   ├── coolpc.ts           # 原價屋爬蟲
│   ├── sinya.ts            # 欣亞爬蟲
│   ├── pcpartpicker.ts     # PCPartPicker 爬蟲
│   ├── ptt-hw-sale.ts      # PTT HardwareSale 爬蟲
│   ├── normalizer.ts       # 資料正規化
│   └── utils/
│       ├── browser.ts      # Puppeteer 設定
│       └── parser.ts       # HTML 解析工具
│
├── data/                   # 靜態資料
│   ├── categories.json     # 分類定義
│   └── sources.json        # 通路定義
│
├── docs/                   # 文件
│   ├── PRD.md
│   └── ARCHITECTURE.md
│
├── app.json                # Expo 設定
├── eas.json                # EAS Build 設定
├── vercel.json             # Vercel 部署設定
├── tsconfig.json
├── package.json
└── .env.example            # 環境變數範例
```

---

## 2. 資料流架構

### 2.1 整體資料流

```
使用者 ──→ App UI ──→ Zustand Store ──→ API Service ──→ Vercel Edge Functions
                                                              │
                                                              ├──→ Vercel Postgres (持久化)
                                                              └──→ Vercel KV (Redis 快取)

                                                              ↑
                                                    爬蟲 (Cron Jobs) ──→ 原價屋/欣亞/Dcard...
```

### 2.2 請求生命週期

```
1. 用戶輸入搜尋關鍵字
2. useDebounce hook 等待 300ms
3. searchStore.fetchResults(query) 被呼叫
4. Store 設定 loading=true
5. productsService.search(query) 發送 API 請求
6. Vercel Edge Function 接收請求
7. 檢查 Redis 快取
   ├── 命中 → 回傳快取資料
   └── 未命中 → 查詢 Postgres → 寫入快取 → 回傳
8. Store 更新資料 + 設定 loading=false
9. UI 自動重新渲染
```

### 2.3 離線策略

| 資料類型 | 策略 | 儲存位置 |
|---------|------|---------|
| 收藏清單 | 持久化，可離線讀寫 | AsyncStorage |
| 搜尋歷史 | 持久化，可離線讀取 | AsyncStorage |
| 價格資料 | 快取 5 分鐘，離線顯示最後快取 | AsyncStorage + Memory |
| 分類列表 | 快取 24 小時 | AsyncStorage |

---

## 3. 狀態管理設計 (Zustand)

### 3.1 Store 架構

```typescript
// productStore.ts — 產品資料
interface ProductStore {
  products: Product[];
  currentProduct: ProductDetail | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  searchProducts: (query: string) => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  clearResults: () => void;
}

// searchStore.ts — 搜尋狀態
interface SearchStore {
  query: string;
  history: string[];
  filters: SearchFilters;
  
  // Actions
  setQuery: (query: string) => void;
  addToHistory: (query: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearHistory: () => void;
}

// favoriteStore.ts — 收藏清單
interface FavoriteStore {
  items: FavoriteItem[];
  
  // Actions
  toggleFavorite: (productId: string) => void;
  isFavorited: (productId: string) => boolean;
  removeFavorite: (productId: string) => void;
  loadFavorites: () => Promise<void>; // from AsyncStorage
}

// uiStore.ts — UI 狀態
interface UIStore {
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  
  // Actions
  setTheme: (theme: string) => void;
  setOnline: (status: boolean) => void;
}
```

### 3.2 Store 通訊原則

- **ProductStore**：主要資料來源，負責所有 API 資料
- **SearchStore**：僅管理 UI 搜尋欄狀態與歷史記錄
- **FavoriteStore**：本地持久化，使用 `persist` middleware（AsyncStorage）
- **UIStore**：全域 UI 偏好設定
- Store 之間不直接引用 — 透過元件的 `useStore` 各自讀取

---

## 4. API 路由設計

### 4.1 Vercel Edge Functions

| Method | Route | 描述 | 快取 |
|--------|-------|------|------|
| GET | `/api/products?q=&category=&page=` | 搜尋/列表 | Redis 5min |
| GET | `/api/products/:id` | 零件詳情 | Redis 5min |
| GET | `/api/products/:id/prices` | 各通路價格 | Redis 5min |
| GET | `/api/products/:id/history` | 價格歷史 | Redis 1h |
| GET | `/api/categories` | 分類列表 | Redis 24h |
| GET | `/api/sources` | 通路列表 | Redis 24h |
| GET | `/api/trending` | 熱門搜尋 | Redis 1h |

### 4.2 回應格式

```typescript
// 通用包裝
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    page: number;
    total: number;
    cachedAt: string;
  };
}

// 產品搜尋回應
interface SearchResponse {
  products: ProductSummary[];
  total: number;
}

// 零件詳情回應
interface ProductDetailResponse {
  product: Product;
  prices: PriceEntry[];
  priceHistory: PricePoint[];
  dcardPosts?: DcardPost[];   // (Phase 3)
}
```

### 4.3 錯誤處理

```typescript
// 統一錯誤格式
interface ApiError {
  code: 'NOT_FOUND' | 'RATE_LIMIT' | 'CRAWLER_DOWN' | 'INTERNAL';
  message: string;
  retryAfter?: number;
}
```

---

## 5. 爬蟲模組設計

### 5.1 爬蟲排程

| 爬蟲 | 頻率 | 觸發方式 | 優先級 |
|------|------|---------|--------|
| 原價屋 | 每 6 小時 | Vercel Cron | P0 |
| 欣亞電子 | 每 6 小時 | Vercel Cron | P0 |
| PTT HardwareSale | 每 12 小時 | Vercel Cron | P1 |
| PCPartPicker | 每 24 小時 | Vercel Cron | P1 |

### 5.2 爬蟲流程

```
Cron Trigger
    │
    ▼
Fetch HTML/JSON from source
    │
    ▼
Parse & Extract (Cheerio / RegExp)
    │
    ▼
Normalize (統一命名、規格、價格格式)
    │
    ▼
Deduplicate & Merge (與現有資料比對)
    │
    ▼
Store to Postgres + Invalidate Cache
```

### 5.3 爬蟲程式碼架構

```typescript
// 爬蟲基底介面
interface Crawler {
  name: string;
  source: PriceSource;
  crawl(): Promise<CrawlResult>;
}

interface CrawlResult {
  source: string;
  items: CrawledItem[];
  timestamp: Date;
  success: boolean;
  error?: string;
}

interface CrawledItem {
  name: string;
  price: number;         // 單位：元（TWD）
  currency: string;
  stockStatus: 'in_stock' | 'out_of_stock' | 'unknown';
  productUrl: string;
  specs?: Record<string, string>;
}

// 正規化器
interface Normalizer {
  normalizeCategory(raw: string): string;
  normalizeBrand(raw: string): string;
  normalizeSpec(raw: string): Record<string, string>;
  matchProduct(item: CrawledItem): Promise<string | null>; // 回傳 productId
}
```

### 5.4 注意事項

- 所有爬蟲使用 Puppeteer 或 Cheerio，視網站動態程度決定
- 每請求間隔 3-5 秒，避免被 ban
- 遵守 robots.txt
- 設定 User-Agent 輪換
- 原價屋/欣亞：新品價格來源
- PTT：二手行情參考（價格區間非精準報價）

---

## 6. 響應式 UI 策略

### 6.1 Mobile-First 斷點

| 裝置 | 寬度 | 佈局 |
|------|------|------|
| Phone | < 768px | 單欄，底部 Tab |
| Tablet | 768-1024px | 雙欄，側邊欄或底部 Tab |
| Desktop | > 1024px | 寬版，頂部導航 + 側邊過濾 |

### 6.2 Responsive 策略

```typescript
// 使用 useWindowDimensions 或自訂 hook
function useResponsive() {
  const { width } = useWindowDimensions();
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    columns: width < 768 ? 1 : width < 1024 ? 2 : 3,
  };
}
```

### 6.3 導航差異

| 平台 | 導航方式 |
|------|---------|
| **Mobile** | Bottom Tab Navigator + Stack |
| **Web** | Top Nav + Sidebar（寬版）或 Bottom Tab（窄版） |

### 6.4 Web 特定優化

- 使用 `expo-router` 的 Web 支援（URL-based routing）
- Desktop 搜尋結果支援鍵盤快捷鍵
- 商品連結使用 `<a>` 標籤可直接開啟（SEO）
- 支援 PWA 離線存取（Phase 2）

---

## 7. Component 樹狀圖

```
App
├── Layout (Root)
│   ├── Header
│   │   ├── SearchBar
│   │   └── ThemeToggle
│   │
│   ├── TabNavigator
│   │   ├── HomeScreen
│   │   │   ├── SearchBar (快速搜尋)
│   │   │   ├── CategoryGrid
│   │   │   │   └── CategoryCard × 8
│   │   │   ├── TrendingTags
│   │   │   │   └── Tag × 5
│   │   │   └── RecentDeals
│   │   │       └── ProductCard × 3
│   │   │
│   │   ├── SearchScreen
│   │   │   ├── SearchBar
│   │   │   ├── FilterChips
│   │   │   │   └── FilterChip × N
│   │   │   └── ProductList
│   │   │       └── ProductCard × N
│   │   │
│   │   ├── ProductDetailScreen
│   │   │   ├── ProductImage
│   │   │   ├── ProductInfo (name, brand, specs)
│   │   │   ├── PriceTable
│   │   │   │   └── PriceRow × N (含 SourceBadge)
│   │   │   ├── PriceChart (Phase 2)
│   │   │   └── ActionButtons (收藏, 分享, 購買)
│   │   │
│   │   ├── FavoritesScreen
│   │   │   └── FavoriteList
│   │   │       └── ProductCard × N
│   │   │
│   │   └── SettingsScreen
│   │       ├── ThemePicker
│   │       └── AboutSection
│   │
│   └── Common
│       ├── Loading
│       ├── ErrorBoundary
│       └── EmptyState
```

---

## 8. TypeScript 型別設計

### 8.1 核心型別

```typescript
// === 產品 ===
interface Product {
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

type ProductCategory =
  | 'cpu' | 'gpu' | 'motherboard' | 'ram'
  | 'ssd' | 'hdd' | 'psu' | 'case'
  | 'cooler' | 'monitor' | 'other';

// === 價格 ===
interface PriceEntry {
  source: PriceSource;
  price: number;           // 單位：元
  currency: 'TWD' | 'USD';
  stockStatus: StockStatus;
  productUrl: string;
  capturedAt: string;
  note?: string;           // 如「國際參考價」、「含運」
}

type StockStatus = 'in_stock' | 'out_of_stock' | 'unknown';

// === 通路 ===
interface PriceSource {
  id: string;
  name: string;            // 原價屋、欣亞、PTT...
  type: 'retail' | 'marketplace' | 'forum';
  domain: string;
  logoUrl?: string;
  country: 'TW' | 'US';
}

// === 價格歷史 ===
interface PricePoint {
  date: string;
  price: number;
  source: string;
}

// === 搜尋 ===
interface SearchFilters {
  category?: ProductCategory;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  source?: string;
  sortBy: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

// === 收藏 ===
interface FavoriteItem {
  productId: string;
  addedAt: string;
  priceAlert?: number;     // 降價通知門檻 (Phase 2)
}
```

---

## 9. 效能優化策略

### 9.1 前端優化

| 策略 | 實作方式 | 預期效果 |
|------|---------|---------|
| **搜尋防抖** | useDebounce 300ms | 減少 API 請求 80% |
| **無限滾動** | FlatList + onEndReached | 避免一次載入大量資料 |
| **圖片 Lazy Load** | expo-image + blurhash | 減少初始載入時間 |
| **列表 Recycler** | FlashList (Shopify) | 滾動效能提升 10x |
| **快取優先** | Redis → AsyncStorage → Memory | 離線可用 + 快速回應 |
| **Bundle Splitting** | Expo Router + lazy loading | 減少初始 JS 大小 40% |

### 9.2 後端優化

| 策略 | 實作 | 說明 |
|------|------|------|
| **Redis 快取** | 熱點資料 5 分鐘 TTL | 減少 Postgres 查詢 |
| **Edge Functions** | Vercel Edge 全球節點 | < 50ms 冷啟動 |
| **增量爬蟲** | 只爬取更新部分 | 減少爬蟲時間 90% |
| **DB Index** | product name, category, brand | 查詢速度 < 20ms |

---

## 10. 安全性考量

### 10.1 API 安全

- **Rate Limiting**：每 IP 每分鐘 60 次請求
- **CORS**：僅允許自家 domain
- **輸入驗證**：所有 API 輸入做 sanitize
- **HTTPS Only**：Vercel 強制 HTTPS

### 10.2 資料安全

- **快取/存儲**：不儲存使用者個人資料
- **收藏清單**：僅存本地 AsyncStorage，不送伺服器
- **爬蟲免責**：顯示「價格僅供參考，以各平台為準」

### 10.3 爬蟲風險管理

- **頻率控制**：每 6 小時爬取一次，不密集
- **來源標示**：每個價格明確標示來源
- **法律免責**：app 內標註資料來源與免責聲明
- **IP 輪換**：避免被限制爬蟲

---

*本文檔由 Hermes 根據 PRD 與專案需求撰寫。*
