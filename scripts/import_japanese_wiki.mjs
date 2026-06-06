/**
 * Import Japanese name pairs from data/japanese_wiki.csv into Turso japanese_names table.
 * Columns: japanese (kanji/kana), chinese (Simplified), romaji, gender
 * Creates table + indexes if absent. INSERT OR IGNORE to skip duplicates. Batches of 100.
 */
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await db.execute(`
  CREATE TABLE IF NOT EXISTS japanese_names (
    japanese    TEXT NOT NULL,
    chinese     TEXT NOT NULL,
    romaji      TEXT,
    romaji_norm TEXT,
    gender      TEXT,
    UNIQUE(japanese, chinese)
  )
`);
await db.execute(`CREATE INDEX IF NOT EXISTS idx_ja_chinese ON japanese_names(chinese)`);
await db.execute(`CREATE INDEX IF NOT EXISTS idx_ja_japanese ON japanese_names(japanese)`);
await db.execute(`CREATE INDEX IF NOT EXISTS idx_ja_romaji ON japanese_names(romaji_norm)`);

const CSV_PATH = process.argv[2] || './data/japanese_wiki.csv';
const csv = readFileSync(CSV_PATH, 'utf8');
const rows = parse(csv, { columns: true, skip_empty_lines: true });

function isChinese(s) { return /[一-鿿]/.test(s); }
function isLatin(s) { return /[a-zA-Z]/.test(s); }

// 去掉括号注释：安倍晋三 (政治家) → 安倍晋三
function stripParen(s) {
  return s.replace(/\s*[（(].*?[）)]\s*/g, '').trim();
}

// 罗马字归一化：去音标符 + 小写（Shinzō Abe → shinzo abe）
function normRomaji(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

let skipped = 0;
let inserted = 0;
let batch = [];

async function flushBatch() {
  if (batch.length === 0) return;
  const stmts = batch.map(r => ({
    sql: `INSERT OR IGNORE INTO japanese_names (japanese, chinese, romaji, romaji_norm, gender)
          VALUES (?, ?, ?, ?, ?)`,
    args: [r.japanese, r.chinese, r.romaji || null, normRomaji(r.romaji || ''), r.gender || ''],
  }));
  await db.batch(stmts);
  inserted += batch.length;
  batch = [];
}

for (const r of rows) {
  const jp = stripParen(r.japanese || '');
  const zh = stripParen(r.chinese || '');
  const ro = stripParen(r.romaji || '');
  if (!isChinese(zh) || !isLatin(ro)) { skipped++; continue; }

  batch.push({ japanese: jp, chinese: zh, romaji: ro, gender: r.gender || '' });
  if (batch.length >= 100) {
    process.stdout.write(`\r  已导入 ${inserted}...`);
    await flushBatch();
  }
}
await flushBatch();

console.log(`\n完成：导入 ${inserted} 条，跳过 ${skipped} 条`);
process.exit(0);
