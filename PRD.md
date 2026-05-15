# PC Parts Price Checker — 電腦零件查價工具 PRD

## 產品需求文檔 (Product Requirements Document)

| 文件資訊 | 內容 |
|---------|------|
| **專案名稱** | PC Parts Price Checker（電腦零件查價工具） |
| **專案代號** | PartSmart |
| **版本** | 1.0.0 (Draft) |
| **作者** | Manus + Hermes |
| **創建日期** | 2026-05-15 |
| **狀態** | 草稿 |
| **相關專案** | hunterCard（完全相同技術棧） |

---

## 目錄

1. [產品概述與目標](#1-產品概述與目標)
2. [目標用戶](#2-目標用戶)
3. [核心功能列表（MVP 優先）](#3-核心功能列表mvp-優先)
4. [資料來源與爬蟲策略](#4-資料來源與爬蟲策略)
5. [使用者流程與 Wireframe 描述](#5-使用者流程與-wireframe-描述)
6. [技術架構](#6-技術架構)
7. [資料庫/資料結構設計](#7-資料庫資料結構設計)
8. [API 設計](#8-api-設計)
9. [非功能性需求](#9-非功能性需求)
10. [里程碑與開發時程](#10-里程碑與開發時程)

---

## 1. 產品概述與目標

### 1.1 產品願景

**PartSmart** — 專為台灣電腦 DIY 玩家設計的即時零件查價工具。使用者在組裝電腦、升級零件時，可快速查詢原價屋、欣亞電子、PCPartPicker 三大平台的即時價格，省去手動開多個網頁比價的困擾。

如同 hunterCard 之於 Hololive 卡牌價格查詢，PartSmart 將成為電腦零件市場的價格查詢首選工具。

### 1.2 核心價值主張

- **⚡ 即時比價**：一秒內呈現台灣兩大零售商 + 國際比價平台的價格
- **🔍 多模式查詢**：支援文字搜尋、分類瀏覽、條碼掃描
- **📊 價格趨勢**：歷史價格走勢圖，掌握最佳入手時機
- **💬 社群參考**：整合 Dcard 電腦版討論，了解真實用戶評價
- **🎯 台灣在地化**：專注台灣本地通路，價格單位新台幣

### 1.3 解決的問題

| 痛點 | 解決方案 |
|------|---------|
| 比價需手動開多個分頁 | 一站整合原價屋、欣亞、PCPartPicker 價格 |
| 零件型號複雜難記 | 支援條碼掃描，免打字 |
| 不知道何時入手最划算 | 提供價格歷史趨勢圖 |
| 只看價格怕踩雷 | 整合 Dcard 討論區評價摘要 |

### 1.5 平台策略：Mobile-First Web + App

本專案同時支援 **Web（Responsive）** 與 **Mobile App（iOS/Android）**，以手機介面為主要設計基準：

- **Mobile App**：透過 Expo React Native 建置 iOS / Android 原生 App
- **Web 版本**：透過 Expo Web（expo-router）提供響應式網頁
- **Mobile-First**：所有 UI 設計先以手機螢幕為核心，再擴展到平板/桌機
- **共用程式碼**：90%+ 的商業邏輯與元件可在 Web 與 App 間共用

| 指標 | 目標值 |
|------|--------|
| DAU (Daily Active Users) | MVP 上線後 3 個月內達 500+ |
| 每次搜尋平均時間 | < 3 秒完成查價 |
| 價格資料涵蓋率 | 涵蓋台灣前三大通路 90% 以上熱門零件 |
| 用戶留存率 (7 日) | > 30% |
| 資料更新頻率 | 每 4-6 小時自動更新一次 |

---

## 2. 目標用戶

### 2.1 主要用戶群

#### 🎮 電腦 DIY 玩家（核心用戶）
- **年齡**：18–35 歲
- **特徵**：定期關注硬體新聞，喜歡自己組裝/升級電腦
- **需求**：快速比價、關注特定零件價格波動
- **使用頻率**：每週 2–3 次

#### 🎓 學生族群
- **年齡**：16–24 歲
- **特徵**：預算有限，組裝第一台電腦
- **需求**：找到最划算的組合
- **使用頻率**：組機期間每日使用

#### 💼 遠端工作者 / 工程師
- **年齡**：25–45 歲
- **特徵**：需要高效能工作設備
- **需求**：快速查詢特定工作站的零件價格
- **使用頻率**：專案期間密集使用

### 2.2 用戶 Persona

| Persona | 姓名 | 背景 | 使用場景 | 核心需求 |
|---------|------|------|---------|---------|
| **DIY 玩家** | 小明（25 歲） | 工程師，業餘組裝電腦 | 每週逛電商看零件價格，想升級顯卡 | 即時比價、價格提醒 |
| **學生族** | 小華（19 歲） | 大學生，預算 3 萬 | 想組第一台電腦 | 總價計算、最划算組合 |
| **小店老闆** | 阿誠（38 歲） | 開小型電腦維修店 | 每天需報價給客戶 | 批量查價、報價單 |

---

## 3. 核心功能列表（MVP 優先）

### 3.1 MVP（Phase 1）— 核心比價功能

| 功能 | 描述 | 優先級 | 預估工時 |
|------|------|--------|---------|
| **零件搜尋** | 支援關鍵字搜尋零件名稱、型號、品牌 | P0 | 2 週 |
| **價格顯示** | 顯示原價屋、欣亞、PCPartPicker 三方價格 | P0 | 2 週 |
| **分類瀏覽** | CPU / GPU / MB / RAM / SSD / PSU / Case 七大分類 | P0 | 1 週 |
| **零件詳情頁** | 顯示型號規格、各平台價格、最低價標示 | P0 | 1.5 週 |
| **通路來源標示** | 每個價格清楚標示來自哪個通路 | P0 | 0.5 週 |
| **外部連結** | 一鍵跳轉至原價屋/欣亞購買頁面 | P1 | 0.5 週 |
| **搜尋歷史** | 記錄最近搜尋的零件 | P1 | 0.5 週 |
| **收藏/關注** | 收藏零件，快速查看價格變化 | P1 | 1 週 |

### 3.2 Phase 2 — 進階功能

| 功能 | 描述 | 優先級 | 預估工時 |
|------|------|--------|---------|
| **價格趨勢圖** | 7 天/30 天/90 天價格走勢 | P1 | 2 週 |
| **整機估價** | 逐步選擇零件，自動計算總價 | P1 | 2 週 |
| **價格提醒** | 當零件降至目標價時推送通知 | P1 | 1.5 週 |
| **規格篩選** | 按品牌、價格區間、規格篩選 | P2 | 1 週 |
| **條碼掃描** | 透過相機掃描產品條碼快速查價 | P1 | 2 週 |

### 3.3 Phase 3 — 社群與生態系

| 功能 | 描述 | 優先級 | 預估工時 |
|------|------|--------|---------|
| **Dcard 評價整合** | 顯示 Dcard 電腦版討論串與摘要 | P2 | 2 週 |
| **用戶評價** | 使用者可對零件評分與評論 | P2 | 2 週 |
| **組裝清單分享** | 分享整機配置單給朋友 | P2 | 1 週 |
| **價格預測** | AI 模型預測價格走勢（使用 OpenRouter） | P3 | 3 週 |
| **多國貨幣** | 支援 TWD/USD/JPY 價格顯示 | P3 | 1 週 |
| **暗黑模式** | 系統深色模式支援 | P2 | 0.5 週 |

---

## 4. 資料來源與爬蟲策略

### 4.1 資料來源總覽

| 來源 | 類型 | 更新頻率 | 取得方式 | 重要性 |
|------|------|---------|---------|--------|
| **原價屋** (coolpc.com.tw) | 台灣最大零售商 | 新品 | 每日 2 次 | Web Scraping | ⭐⭐⭐⭐⭐ |
| **欣亞電子** (sinya.com.tw) | 台灣第二大零售商 | 新品 | 每日 2 次 | Web Scraping | ⭐⭐⭐⭐⭐ |
| **PCPartPicker** (pcpartpicker.com) | 國際比價平台 | 新品/國際 | 每週 1 次 | Web Scraping | ⭐⭐⭐⭐ |
| **PTT HardwareSale** (ptt.cc) | 台灣最大二手零件交易板 | 二手 | 每日監控 | Web Scraping (低頻) | ⭐⭐⭐⭐ |
| **蝦皮購物** (shopee.tw) | 台灣最大拍賣平台 | 二手/新品 | 每日 1 次 | Web Scraping (高風險) | ⭐⭐⭐ |
| **旋轉拍賣 Carousell** | 行動拍賣平台 | 二手 | 每日 1 次 | Web Scraping | ⭐⭐⭐ |
| **Facebook 二手社團** | 社群交易 | 二手 | — | 手動/不易 | ⭐⭐ |
| **Mobile01 二手市集** | 論壇交易 | 二手 | 每週 2 次 | Web Scraping (容易) | ⭐⭐ |
| **Dcard 電腦版** (dcard.tw) | 社群討論 | 新品/二手參考 | 每週 1 次 | Web Scraping | ⭐⭐⭐ |

### 4.2 爬蟲策略詳解

#### 原價屋爬蟲
- **目標**: https://www.coolpc.com.tw/evaluate.php
- **方法**: 解析估價頁面 HTML 表格結構
- **工具**: `axios` + `cheerio`（靜態）+ `Puppeteer`（動態備用）
- **反爬**: 隨機 User-Agent、請求間隔 3–5 秒
- **爬取範圍**: CPU / MB / RAM / GPU / SSD / PSU / Case / 散熱器 / 螢幕
- **排程**: 週一/三/五 3:00 AM（Vercel Cron Jobs）

#### 欣亞電子爬蟲
- **目標**: https://www.sinya.com.tw/diy/select/
- **方法**: 解析 AJAX API（JSON 格式）或 HTML fallback
- **反爬**: 模擬瀏覽器 Headers，注意 API Rate Limit

#### PCPartPicker 爬蟲
- **目標**: https://pcpartpicker.com/products/
- **方法**: 解析產品列表頁與詳細頁
- **注意**: 嚴格爬蟲限制，降低頻率（每週 1–2 次）
- **用途**: 國際價格參考，匯率轉換

#### Dcard 爬蟲
- **目標**: https://www.dcard.tw/f/computer
- **方法**: 透過 Dcard 公開 JSON API
- **AI 關聯**: 用 OpenRouter (DeepSeek V4 Flash) 自動匹配零件與討論

### 4.3 爬蟲架構

```
Vercel Cron Jobs
  ├── 原價屋爬蟲 (Puppeteer+Cheerio) ─┐
  ├── 欣亞爬蟲 (Puppeteer+Axios)    ─┤
  ├── PCPartPicker (fetch+cheerio)   ─┤
  └── Dcard (fetch+AI過濾)           ─┤
                                       ▼
                              ┌─────────────────┐
                              │ 資料正規化模組    │
                              │ (Normalizer)    │
                              │ - 統一命名       │
                              │ - 規格標準化      │
                              │ - 重複去除       │
                              └────────┬────────┘
                                       ▼
                              ┌─────────────────┐
                              │ PostgreSQL       │
                              │ (Vercel Postgres) │
                              └─────────────────┘
```

---

## 5. 使用者流程與 Wireframe 描述

### 5.1 整體用戶流程

```
打開 App → 首頁 ─┬─ 搜尋零件 → 搜尋結果 → 零件詳情頁
                 ├─ 分類瀏覽 → 分類列表  → 零件詳情頁
                 ├─ 收藏清單 → 收藏列表  → 零件詳情頁
                 └─ 設定
```

### 5.2 頁面說明

#### 首頁
- 置頂搜尋欄（placeholder: 「搜尋零件名稱或型號...」）
- 8 個分類圖標（2×4 網格）：CPU / GPU / MB / RAM / SSD / PSU / Case / 更多
- 熱門搜尋標籤（橫向滾動）
- 近期降價卡片列表
- 底部導航：首頁 | 搜尋 | 收藏 | 設定

#### 搜尋結果頁
- 搜尋欄 + 關鍵字顯示
- 平台篩選器（全部 / 原價屋 / 欣亞）
- 結果卡片：零件名稱 + 各平台價格並列 + 最低價標示 ⭐
- 下拉無限滾動

#### 零件詳情頁
- 零件圖片（placeholder 或通路圖片）
- 完整型號名稱與規格（結構化展示）
- 各通路價格列表（依價格低→高排序，最低價通路高亮）
- 「前往購買」外部連結按鈕
- 價格趨勢圖區塊（Phase 2）
- Dcard 討論摘要區塊（Phase 3）
- 收藏按鈕

#### 設定頁
- 偏好通路設定
- 貨幣單位選擇
- 通知設定
- 關於/版本資訊

---

## 6. 技術架構

### 6.1 整體架構

```
┌─────────────────────────────────────────────┐
│             Expo (React Native) App           │
│  SearchScreen → ProductDetail → Favorites     │
│         ↓ (HTTPS)                             │
│         Vercel Edge Functions                 │
│  API Routes | Crawlers | Cron Jobs            │
│         ↓                                     │
│  Vercel Postgres + Vercel KV (Redis)          │
│         ↑ (AI)                                │
│  OpenRouter → DeepSeek V4 Flash               │
└─────────────────────────────────────────────┘
```

### 6.2 技術棧

| 層級 | 技術 | 用途 |
|------|------|------|
| **前端框架** | Expo (React Native) ~52.x | 跨平台 App + Web（mobile-first 響應式） |
| **程式語言** | TypeScript ~5.x | 全端型別安全 |
| **導航** | React Navigation 7.x（Web: expo-router） | 頁面路由，Web 支援 |
| **響應式 UI** | Tailwind CSS / NativeWind | Mobile-first，Web 自適應 |
| **狀態管理** | Zustand 4.x | 輕量級全局狀態 |
| **本地存儲** | AsyncStorage | 收藏清單、設定快取 |
| **後端** | Vercel Edge Functions | API 端點 |
| **數據庫** | Vercel Postgres (Neon) | 持久化價格數據 |
| **快取** | Vercel KV (Redis) | 熱點資料快取 |
| **爬蟲** | Puppeteer + Cheerio | 動/靜態網頁爬取 |
| **AI** | OpenRouter → DeepSeek V4 Flash | 搜尋理解、分類、摘要 |
| **排程** | Vercel Cron Jobs | 定期觸發爬蟲 |

### 6.3 與 hunterCard 共通點

| 項目 | hunterCard | PartSmart | 備註 |
|------|-----------|-----------|------|
| 前端框架 | Expo (React Native) | Expo (React Native) | ✅ 相同 |
| 後端部署 | Vercel Edge Functions | Vercel Edge Functions | ✅ 相同 |
| AI API | OpenRouter | OpenRouter | ✅ 相同 |
| 狀態管理 | Zustand（待導入） | Zustand（直接導入） | ⚡ 最佳實踐 |
| 爬蟲需求 | 靜態 JSON | Puppeteer/Cheerio | 🆕 新增 |

---

## 7. 資料庫/資料結構設計

### 7.1 ERD

```
Products {
  id PK
  name VARCHAR(255)
  brand VARCHAR(100)
  category VARCHAR(50)       -- cpu/gpu/mb/ram/ssd/psu/case
  subcategory VARCHAR(50)    -- nvidia-rtx-5070, amd-ryzen-7
  specs JSONB                -- {"vram":"12GB","pcie":"5.0"}
  image_url TEXT
  created_at TIMESTAMP
  updated_at TIMESTAMP
}

Prices {
  id PK
  product_id FK → Products
  source_id FK → PriceSources
  price_cents INTEGER
  currency VARCHAR(3)        -- TWD/USD
  stock_status VARCHAR(20)   -- in_stock/out_of_stock/unknown
  product_url TEXT
  captured_at TIMESTAMP
}

PriceSources {
  id PK
  name VARCHAR(50)           -- 原價屋/欣亞/PCPartPicker
  domain VARCHAR(255)
  country VARCHAR(2)         -- TW/US
  logo_url TEXT
  is_active BOOLEAN
}

PriceHistory {
  id PK
  product_id FK → Products
  source_id FK → PriceSources
  price_cents INTEGER
  recorded_at TIMESTAMP
}
```

### 7.2 Products 表欄位

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| `id` | SERIAL PK | 自動遞增 ID | 1 |
| `name` | VARCHAR(255) | 產品名稱 | GIGABYTE RTX 5070 GAMING OC 12G |
| `brand` | VARCHAR(100) | 品牌 | GIGABYTE |
| `category` | VARCHAR(50) | 分類 | gpu |
| `subcategory` | VARCHAR(50) | 子分類 | nvidia-rtx-5070 |
| `specs` | JSONB | 結構化規格 | {"vram":"12GB","gddr":"7"} |
| `image_url` | TEXT | 產品圖片 | https://...jpg |
| `created_at` | TIMESTAMP | 創建時間 | 2026-05-15 |
| `updated_at` | TIMESTAMP | 更新時間 | 2026-05-15 |

---

## 8. API 設計

### 8.1 API 端點總覽

| Method | Endpoint | 描述 |
|--------|----------|------|
| GET | `/api/products` | 搜尋零件 |
| GET | `/api/products/:id` | 零件詳情（含所有通路價格） |
| GET | `/api/products/:id/history` | 價格歷史 |
| GET | `/api/categories` | 分類列表 |
| GET | `/api/sources` | 通路列表 |
| GET | `/api/trending` | 熱門搜尋 |

### 8.2 API 回應格式範例

#### GET /api/products?q=RTX+5070

```json
{
  "products": [
    {
      "id": 1,
      "name": "GIGABYTE RTX 5070 GAMING OC 12G",
      "brand": "GIGABYTE",
      "category": "gpu",
      "image_url": null,
      "lowest_price": 24500,
      "prices": [
        { "source": "原價屋", "price": 24990, "currency": "TWD", "url": "..." },
        { "source": "欣亞", "price": 24500, "currency": "TWD", "url": "..." },
        { "source": "PCPartPicker", "price": 26100, "currency": "TWD", "note": "USD $899" }
      ]
    }
  ],
  "total": 12
}
```

#### GET /api/products/1

```json
{
  "id": 1,
  "name": "GIGABYTE RTX 5070 GAMING OC 12G",
  "brand": "GIGABYTE",
  "category": "gpu",
  "specs": {
    "vram": "12GB",
    "gddr": "7",
    "pcie": "5.0",
    "tdp": "300W"
  },
  "prices": [
    { "source": "原價屋", "price": 24990, "stock": "in_stock", "url": "..." },
    { "source": "欣亞", "price": 24500, "stock": "in_stock", "url": "..." }
  ],
  "price_history": [
    { "date": "2026-05-08", "price": 25990 },
    { "date": "2026-05-10", "price": 25500 },
    { "date": "2026-05-15", "price": 24500 }
  ]
}
```

---

## 9. 非功能性需求

### 9.1 效能

| 項目 | 目標 |
|------|------|
| API 回應時間 (搜尋) | < 500ms（有快取） |
| App 啟動時間 | < 3 秒 |
| 零件詳情頁載入 | < 1 秒 |
| 價格資料庫查詢 | < 200ms |

### 9.2 擴展性

- API 支援分頁（預設每頁 20 筆）
- Vercel Edge Functions 自動擴展
- Redis 快取熱點資料，減少資料庫查詢
- 爬蟲獨立排程，不影響 API 回應

### 9.3 安全性

- API Rate Limiting（每 IP 每分鐘 60 次請求）
- HTTPS 加密傳輸
- CORS 限制
- 爬蟲 IP 輪換避免被封

### 9.4 可用性

- 爬蟲失敗時回傳上次成功快取
- 任一通路下線不影響其他通路顯示
- 顯示資料更新時間提醒

---

## 10. 里程碑與開發時程

| Phase | 時程 | 內容 | 負責工具 |
|-------|------|------|---------|
| **P0** | 第 1–2 週 | 後端 API + 爬蟲 + 資料庫架設 | Codex → Claude Code |
| **P0** | 第 3–4 週 | App 搜尋 + 價格顯示 + 分類瀏覽 | Claude Code |
| **P0** | 第 5 週 | 零件詳情頁 + 收藏功能 | Claude Code |
| **P1** | 第 6 週 | 測試 + Bug 修復 + 部署 | OpenClaw+184 |
| **P1** | 第 7–8 週 | 價格趨勢圖 + 規格篩選 | OpenCode |
| **P2** | 第 9–10 週 | Dcard 整合 + 條碼掃描 | Claude Code |
| **P2** | 第 11–12 週 | 價格提醒 + 效能優化 | OpenCode |
| **P3** | 第 13+ 週 | 價格預測 + 社群功能 | OpenClaw+184 |

---

*本文檔由 Manus（專屬 API Key）生成初稿，Hermes 整理完成。*
