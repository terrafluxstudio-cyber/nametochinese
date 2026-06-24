/**
 * Import German↔Chinese name pairs from data/german_wikidata.csv into Turso german_names table.
 */
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const csv = readFileSync('./data/german_wikidata.csv', 'utf8');
const rows = parse(csv, { columns: true, skip_empty_lines: true });

function isValidLatin(s) {
  return /[A-Za-zÄÖÜäöüßÀ-ÿ]/.test(s) && s.length > 0;
}

function isValidChinese(s) {
  return /[一-鿿]/.test(s) && s.length > 0;
}

let skipped = 0, inserted = 0, batch = [];

async function flushBatch() {
  if (batch.length === 0) return;
  const stmts = batch.map(r => ({
    sql: `INSERT OR IGNORE INTO german_names (german, chinese, gender) VALUES (?, ?, ?)`,
    args: [r.german, r.chinese, r.gender || ''],
  }));
  await db.batch(stmts);
  inserted += batch.length;
  batch = [];
}

for (const r of rows) {
  const german = (r.german || '').trim();
  const zh = (r.chinese || '').trim();
  if (!isValidLatin(german) || !isValidChinese(zh)) { skipped++; continue; }
  batch.push({ german, chinese: zh, gender: r.gender || '' });
  if (batch.length >= 100) {
    process.stdout.write(`\r  已导入 ${inserted}...`);
    await flushBatch();
  }
}

await flushBatch();
console.log(`\n完成：导入 ${inserted} 条，跳过 ${skipped} 条`);
process.exit(0);
