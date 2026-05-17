#!/usr/bin/env node
/**
 * 批次執行所有爬蟲
 * 用法: node scripts/run-all-scrapers.js
 */

const { execSync } = require('child_process');
const path = require('path');

const SCRIPTS_DIR = __dirname;

const scrapers = [
  { name: '原價屋', script: 'scrape-coolpc.js', timeout: 120000 },
  { name: 'PTT HardwareSale', script: 'scrape-ptt-hwsale.js 5', timeout: 120000 },
];

console.log('='.repeat(50));
console.log('🕸️  PartSmart 爬蟲批次執行');
console.log('='.repeat(50));

for (const scraper of scrapers) {
  console.log(`\n📡 [${scraper.name}] 開始爬取...`);
  const start = Date.now();
  try {
    const output = execSync(`node ${path.join(SCRIPTS_DIR, scraper.script)}`, {
      cwd: path.resolve(SCRIPTS_DIR, '..'),
      timeout: scraper.timeout,
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 10,
    });
    // 只顯示最後幾行
    const lines = output.split('\n').filter(l => l.trim());
    const lastLines = lines.slice(-10);
    console.log(lastLines.join('\n'));
    console.log(`✅ [${scraper.name}] 完成 (${((Date.now() - start) / 1000).toFixed(0)}s)`);
  } catch (err) {
    console.error(`❌ [${scraper.name}] 失敗: ${err.message}`);
    if (err.stdout) console.log(err.stdout.toString().slice(-500));
  }
}

console.log('\n' + '='.repeat(50));
console.log('✅ 所有爬蟲執行完畢');
console.log('='.repeat(50));
