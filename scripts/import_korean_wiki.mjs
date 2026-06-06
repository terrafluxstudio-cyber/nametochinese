/**
 * Import Korean name pairs from data/korean_wiki.csv into Turso korean_names table.
 * Columns: korean (Hangul), chinese (Simplified), english (romanization), gender
 * INSERT OR IGNORE to skip duplicates. Batches of 100.
 */
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const csv = readFileSync('./data/korean_wiki.csv', 'utf8');
const rows = parse(csv, { columns: true, skip_empty_lines: true });

function isHangul(s) { return /[가-힯]/.test(s); }
function isChinese(s) { return /[一-鿿]/.test(s); }

// 去掉括号注释：크러쉬 (음악가) → 크러쉬，Crush (歌手) → Crush
function stripParen(s) {
  return s.replace(/\s*[（(].*?[）)]\s*/g, '').trim();
}

let skipped = 0;
let inserted = 0;
let batch = [];

async function flushBatch() {
  if (batch.length === 0) return;
  const stmts = batch.map(r => ({
    sql: `INSERT OR IGNORE INTO korean_names (korean, chinese, english, gender)
          VALUES (?, ?, ?, ?)`,
    args: [r.korean, r.chinese, r.english || null, r.gender || ''],
  }));
  await db.batch(stmts);
  inserted += batch.length;
  batch = [];
}

for (const r of rows) {
  const ko = stripParen(r.korean || '');
  const zh = stripParen(r.chinese || '');
  const en = stripParen(r.english || '');
  if (!isHangul(ko) || !isChinese(zh)) { skipped++; continue; }

  batch.push({ korean: ko, chinese: zh, english: en, gender: r.gender || '' });
  if (batch.length >= 100) {
    process.stdout.write(`\r  已导入 ${inserted}...`);
    await flushBatch();
  }
}
await flushBatch();

console.log(`\n完成：导入 ${inserted} 条，跳过 ${skipped} 条`);
process.exit(0);
