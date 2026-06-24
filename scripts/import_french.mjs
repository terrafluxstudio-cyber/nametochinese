/**
 * Import French↔Chinese name pairs from data/french_wikidata.csv into Turso french_names table.
 */
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const csv = readFileSync('./data/french_wikidata.csv', 'utf8');
const rows = parse(csv, { columns: true, skip_empty_lines: true });

function isValidLatin(s) {
  return /[A-Za-zÀ-ÿ]/.test(s) && s.length > 0;
}

function isValidChinese(s) {
  return /[一-鿿]/.test(s) && s.length > 0;
}

let skipped = 0, inserted = 0, batch = [];

async function flushBatch() {
  if (batch.length === 0) return;
  const stmts = batch.map(r => ({
    sql: `INSERT OR IGNORE INTO french_names (french, chinese, gender) VALUES (?, ?, ?)`,
    args: [r.french, r.chinese, r.gender || ''],
  }));
  await db.batch(stmts);
  inserted += batch.length;
  batch = [];
}

for (const r of rows) {
  const french = (r.french || '').trim();
  const zh = (r.chinese || '').trim();
  if (!isValidLatin(french) || !isValidChinese(zh)) { skipped++; continue; }
  batch.push({ french, chinese: zh, gender: r.gender || '' });
  if (batch.length >= 100) {
    process.stdout.write(`\r  已导入 ${inserted}...`);
    await flushBatch();
  }
}

await flushBatch();
console.log(`\n完成：导入 ${inserted} 条，跳过 ${skipped} 条`);
process.exit(0);
