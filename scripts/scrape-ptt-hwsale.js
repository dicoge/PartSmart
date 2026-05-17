#!/usr/bin/env node
/**
 * PTT HardwareSale 爬蟲 — 抓取二手電腦零件報價
 * 用法: node scripts/scrape-ptt-hwsale.js [pages=5]
 * 輸出: data/ptt-products.json
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.ptt.cc';
const BOARD = '/bbs/HardwareSale';
const OUTPUT = path.join(__dirname, '..', 'data', 'ptt-products.json');
const MAX_PAGES = parseInt(process.argv[2] || '5', 10);

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Cookie': 'over18=1' },
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// 解析 r-ent 區塊 — [title, href, author, date] 或 null
function parseRentBlock(block) {
  // 找 title 和 href
  const tMatch = block.match(/<div class="title">\s*<a[^>]*href="([^"]*)">([^<]*)<\/a>/);
  if (!tMatch) return null;
  
  const authorMatch = block.match(/<div class="author">([^<]*)<\/div>/);
  const dateMatch = block.match(/<div class="date">([^<]*)<\/div>/);
  
  return {
    title: tMatch[2].trim(),
    href: BASE + BOARD + tMatch[1],
    author: authorMatch ? authorMatch[1].trim() : '',
    date: dateMatch ? dateMatch[1].trim() : '',
  };
}

function parseList(html) {
  const posts = [];
  // Match each r-ent block: <div class="r-ent">...</div> (followed by next r-ent or end)
  const regex = /<div class="r-ent">(.*?)<\/div>\s*(?=<div class="r-ent"|<!--|$)/gs;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const post = parseRentBlock(m[1]);
    if (post) posts.push(post);
  }
  return posts;
}

function getPrevPage(html) {
  const m = html.match(/<a class="btn wide"[^>]*href="([^"]*)"[^>]*>[^<]*上頁</);
  return m ? BASE + m[1] : null;
}

// 從 PTT 標題解析產品
function parsePTTTitle(title) {
  const headerMatch = title.match(/^\[([^\]]+)\/([^\]]*)\]\s*(.*)/);
  if (!headerMatch) return null;
  
  const action = headerMatch[1];
  const parts = headerMatch[2].split('/').map(s => s.trim());
  const location = parts[0] || '';
  const delivery = parts[1] || '';
  
  let productText = headerMatch[3].trim();
  
  let price = 0;
  const priceMatch = productText.match(/\$?\s*([\d,]{3,})\s*(?:元)?$/);
  if (priceMatch) {
    price = parseInt(priceMatch[1].replace(/,/g, ''), 10);
    productText = productText.replace(/\$?[\d,]+\s*(?:元)?/, '').trim();
  }
  
  const productName = productText.replace(/\s+/g, ' ').replace(/^[-–—]\s*/, '').replace(/\s*[-–—]\s*$/, '').trim();
  if (!productName || productName.length < 2) return null;
  
  return { action, location, delivery, name: productName, price, rawTitle: title };
}

// 分類
const CATEGORY_KEYWORDS = [
  { kw: /CPU|處理器|i[3-9]-\d|R[3579]-\d|Ryzen|Athlon/, cat: 'cpu' },
  { kw: /主機板|[MB]\s|B\d{2,}|H\d{2,}|Z\d{2,}|X\d{2,}|A\d{2,}/, cat: 'motherboard' },
  { kw: /記憶體|RAM|DDR[4-5]|記憶卡/, cat: 'ram' },
  { kw: /顯卡|顯示卡|VGA|GPU|RTX|GTX|RX|Radeon|GeForce|TITAN/, cat: 'gpu' },
  { kw: /SSD|固態硬碟|M\.2|NVMe|硬碟|HDD/, cat: 'ssd' },
  { kw: /電源|PSU|電供/, cat: 'psu' },
  { kw: /機殼|CASE|機箱/, cat: 'case' },
  { kw: /散熱|水冷|塔散|散熱器|風扇/, cat: 'cooler' },
  { kw: /螢幕|顯示器|monitor|液晶/, cat: 'monitor' },
  { kw: /筆電|notebook|laptop/, cat: 'laptop' },
  { kw: /鍵盤|keyboard|滑鼠|mouse|耳機|耳麥|喇叭/, cat: 'peripheral' },
];

function categorize(name) {
  for (const { kw, cat } of CATEGORY_KEYWORDS) {
    if (kw.test(name)) return cat;
  }
  return 'other';
}

function guessBrand(name) {
  const brands = ['Intel', 'AMD', 'NVIDIA', 'ASUS', '華碩', '技嘉', 'GIGABYTE', '微星', 'MSI',
    '華擎', 'ASRock', '三星', 'Samsung', 'WD', 'Seagate', '美光', 'Micron',
    'Kingston', '金士頓', 'Corsair', 'EVGA', '振華', '海韻', 'Seasonic',
    'LG', 'Dell', 'HP', 'Lenovo', 'Acer', '羅技', 'Logitech', 'Razer', 'Noctua',
    'Cooler Master', '酷碼', '聯力', 'Fractal', 'NZXT', 'Sony', '鐵三角',
    'BENQ', 'ViewSonic', 'PHILIPS', 'HyperX', 'SteelSeries'];
  for (const b of brands) {
    if (name.includes(b)) return b;
  }
  return '其他';
}

async function main() {
  console.log('🕸️  PTT HardwareSale 爬蟲啟動...');
  console.log(`📄 抓取 ${MAX_PAGES} 頁`);

  let allPosts = [];
  let currentUrl = BASE + BOARD + '/index.html';
  
  for (let page = 0; page < MAX_PAGES; page++) {
    try {
      console.log(`  📄 第 ${page + 1} 頁: ${currentUrl}`);
      const html = await fetch(currentUrl);
      const posts = parseList(html);
      console.log(`     → ${posts.length} 篇文章`);
      if (posts.length === 0) { console.log('  ⚠ 無文章，停止'); break; }
      
      allPosts = allPosts.concat(posts);
      
      const prevUrl = getPrevPage(html);
      if (!prevUrl) break;
      currentUrl = prevUrl;
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`  ❌ 第 ${page + 1} 頁失敗: ${err.message}`);
      break;
    }
  }

  console.log(`\n📊 共 ${allPosts.length} 篇文章`);

  // 解析產品
  const products = [];
  const seenUrls = new Set();
  
  for (const post of allPosts) {
    if (seenUrls.has(post.href)) continue;
    seenUrls.add(post.href);
    
    const info = parsePTTTitle(post.title);
    if (!info || info.price === 0) continue;
    
    const category = categorize(info.name);
    const idBase = info.name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 40);
    
    products.push({
      id: `ptt-${idBase}`,
      name: info.name,
      brand: guessBrand(info.name),
      category,
      price: info.price,
      action: info.action,
      location: info.location,
      delivery: info.delivery,
      source: 'ptt',
      sourceName: 'PTT HardwareSale',
      author: post.author,
      url: post.href,
      date: post.date,
      lastSeen: new Date().toISOString(),
    });
  }
  
  // 去重
  products.sort((a, b) => a.price - b.price);
  const uniq = [];
  const seen = new Set();
  for (const p of products) {
    const key = p.name.substring(0, 30).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(p);
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(uniq, null, 2), 'utf-8');
  
  console.log(`\n✅ 完成: ${uniq.length} 項產品 (去重後)`);
  console.log(`💾 ${OUTPUT}`);
  
  const byCat = {};
  for (const p of uniq) byCat[p.category] = (byCat[p.category] || 0) + 1;
  console.log('\n📊 分類:');
  for (const [c, n] of Object.entries(byCat).sort((a, b) => b[1] - a[1]))
    console.log(`  ${c.padEnd(15)} ${n} 項`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
