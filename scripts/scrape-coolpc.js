#!/usr/bin/env node
/**
 * 原價屋爬蟲 — 從 evaluate.php 抓取所有產品與價格
 *
 * 用法: node scripts/scrape-coolpc.js
 * 輸出: data/coolpc-products.json
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const URL = 'https://www.coolpc.com.tw/evaluate.php';
const OUTPUT = path.join(__dirname, '..', 'data', 'coolpc-products.json');

// ============================================================
// 1. 動態偵測分類 — 從 HTML 中提取每個 select 對應的分類名稱
// ============================================================
function detectCategories(html) {
  const cats = {};
  // TD is implicitly closed by next TD (no </TD> tag), and may contain <a> tags
  const pattern = /<TR[^>]*bgColor[^>]*>[\s\S]*?<TD\s+class=w[^>]*>(\d+)<TD\s+class=t[^>]*>(.*?)<TD\s+noWrap[\s\S]*?<SELECT[^>]*name=(n\d+)/g;
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const name = match[2].trim();
    const selectName = match[3];
    // Clean up: some names have extra HTML entities
    const clean = name.replace(/&amp;/g, '&').replace(/&#?\w+;/g, '').trim();
    cats[selectName] = clean;
  }
  return cats;
}

// 從分類名稱推斷 PartSmart 分類
const CATEGORY_MAP_PATTERNS = [
  { pattern: /CPU|處理器/, category: 'cpu' },
  { pattern: /主機板/, category: 'motherboard' },
  { pattern: /記憶體/, category: 'ram' },
  { pattern: /顯示卡/, category: 'gpu' },
  { pattern: /SSD|固態硬碟/, category: 'ssd' },
  { pattern: /硬碟/, category: 'hdd' },
  { pattern: /電源/, category: 'psu' },
  { pattern: /機殼|機箱/, category: 'case' },
  { pattern: /散熱/, category: 'cooler' },
  { pattern: /螢幕|液晶/, category: 'monitor' },
];

function mapCategory(name) {
  for (const { pattern, category } of CATEGORY_MAP_PATTERNS) {
    if (pattern.test(name)) return category;
  }
  return 'other';
}

// ============================================================
// 2. 抓取頁面
// ============================================================
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks);
        const decoded = iconv.decode(raw, 'big5');
        resolve(decoded);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ============================================================
// 3. 解析 HTML 提取所有 select 中的 option
// ============================================================
function parseProductSelects(html, categoryNames) {
  const results = {};

  for (const [selectName, catName] of Object.entries(categoryNames)) {
    const selectRegex = new RegExp(
      `<SELECT[^>]*name=${selectName}[^>]*class=s[^>]*>(.*?)</SELECT>`,
      'is'
    );
    const match = html.match(selectRegex);
    if (!match) {
      console.warn(`  ⚠ 找不到分類 ${selectName}`);
      continue;
    }

    const selectContent = match[1];
    const products = [];

    // 解析所有 option
    const optionRegex = /<OPTION(?:\s+[^>]*)?>\s*([^<]+?)\s*<\/OPTION>/g;
    let optMatch;

    while ((optMatch = optionRegex.exec(selectContent)) !== null) {
      const rawText = optMatch[1].trim();

      // 跳過分隔線/說明文字/分類標題
      if (rawText.startsWith('　　') || rawText.startsWith('☆') || rawText.startsWith('❤')) continue;
      if (rawText.includes('※') || rawText.includes('⚠') || rawText.includes('此商品為專業性產品')) continue;
      if (rawText.startsWith('共有商品')) continue;

      // 解析產品名稱和價格
      // 格式: "產品名稱, $價格" 
      const priceMatch = rawText.match(/,\s*\$?([\d,]+)\s*(?:★|◆|❤|$)/);
      if (!priceMatch) continue;

      const price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
      if (isNaN(price) || price === 0) continue;

      // 產品名稱 = 價格前面的部分
      const namePart = rawText.split(/,\s*\$/)[0].trim();
      if (!namePart || namePart.length < 3) continue;

      products.push({
        name: namePart,
        price,
        raw: rawText,
      });
    }

    if (products.length > 0) {
      const category = mapCategory(catName);
      results[selectName] = {
        categoryName: catName,
        category,
        productCount: products.length,
        products,
      };
      console.log(`  ✅ [${selectName}] ${catName.padEnd(20)} → ${category.padEnd(12)} ${products.length}項`);
    }
  }

  return results;
}

// ============================================================
// 4. 轉換為 PartSmart 格式
// ============================================================
function toPartSmartFormat(parsed) {
  const allProducts = [];
  const productIdMap = {};

  for (const [selectName, data] of Object.entries(parsed)) {
    for (const p of data.products) {
      const idBase = p.name
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 60);

      let id = `${data.category}-${idBase}`;
      if (productIdMap[id]) {
        let suff = 2;
        while (productIdMap[`${id}-${suff}`]) suff++;
        id = `${id}-${suff}`;
      }
      productIdMap[id] = true;

      const brandMatch = p.name.match(/^([A-Za-z\u4e00-\u9fff\u00c0-\u024f]+)\s/);
      const brand = brandMatch ? brandMatch[1] : data.categoryName;

      allProducts.push({
        id,
        name: p.name,
        brand,
        category: data.category,
        price: p.price,
        source: 'coolpc',
        sourceName: '原價屋',
        selectCategory: data.categoryName,
        lastSeen: new Date().toISOString(),
      });
    }
  }

  return allProducts;
}

// ============================================================
// 5. 主流程
// ============================================================
async function main() {
  console.log('🕸️  原價屋爬蟲啟動...');
  console.log(`📡 抓取 ${URL}`);

  const html = await fetchPage(URL);
  console.log(`📄 已取得頁面 (${(html.length / 1024).toFixed(0)} KB)`);

  console.log('\n📊 偵測分類...');
  const categoryNames = detectCategories(html);
  console.log(`  找到 ${Object.keys(categoryNames).length} 個分類`);

  console.log('\n📊 解析產品...');
  const parsed = parseProductSelects(html, categoryNames);

  const totalProducts = Object.values(parsed).reduce((s, d) => s + d.productCount, 0);
  console.log(`\n📦 總計 ${totalProducts} 項產品`);

  console.log('\n🔄 轉換為 PartSmart 格式...');
  const partSmartData = toPartSmartFormat(parsed);
  console.log(`✅ 轉換完成: ${partSmartData.length} 項`);

  partSmartData.sort((a, b) => a.price - b.price);

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(partSmartData, null, 2), 'utf-8');
  console.log(`\n💾 已寫入 ${OUTPUT}`);
  console.log(`📏 檔案大小: ${(fs.statSync(OUTPUT).size / 1024).toFixed(0)} KB`);

  console.log('\n📊 分類統計:');
  const byCategory = {};
  for (const p of partSmartData) {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  }
  for (const [cat, count] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(15)} ${count} 項`);
  }
}

main().catch((err) => {
  console.error('❌ 失敗:', err.message);
  process.exit(1);
});
