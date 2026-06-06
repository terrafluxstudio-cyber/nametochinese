/**
 * Import Russian↔Chinese name pairs from data/russian_wikidata.csv into Turso russian_names table.
 * - Strips parenthetical notes from Russian names: "Хабиб (певец)" → "Хабиб"
 * - Uses INSERT OR IGNORE to skip exact duplicates
 * - Inserts in batches of 100 for speed
 */
import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const csv = readFileSync('./data/russian_wikidata.csv', 'utf8');
const rows = parse(csv, { columns: true, skip_empty_lines: true });

function cleanRussian(s) {
  // Strip parenthetical notes: "Хабиб (певец)" → "Хабиб"
  return s.replace(/\s*\(.*?\)\s*/g, '').trim();
}

function isValidRussian(s) {
  // Must contain Cyrillic
  return /[Ѐ-ӿ]/.test(s) && s.length > 0;
}

function isValidChinese(s) {
  return /[一-鿿]/.test(s) && s.length > 0;
}

let skipped = 0;
let inserted = 0;
let batch = [];

async function flushBatch() {
  if (batch.length === 0) return;
  // Turso doesn't support multi-row VALUES natively, insert one by one in a transaction
  const stmts = batch.map(r => ({
    sql: `INSERT OR IGNORE INTO russian_names (russian, chinese, gender, patronymic_ru, patronymic_zh, nicknames)
          VALUES (?, ?, ?, NULL, NULL, NULL)`,
    args: [r.russian, r.chinese, r.gender || ''],
  }));
  await db.batch(stmts);
  inserted += batch.length;
  batch = [];
}

for (const r of rows) {
  const ru = cleanRussian(r.russian || '');
  const zh = (r.chinese || '').trim();

  if (!isValidRussian(ru) || !isValidChinese(zh)) {
    skipped++;
    continue;
  }

  batch.push({ russian: ru, chinese: zh, gender: r.gender || '' });

  if (batch.length >= 100) {
    process.stdout.write(`\r  已导入 ${inserted}...`);
    await flushBatch();
  }
}

await flushBatch();

console.log(`\n完成：导入 ${inserted} 条，跳过 ${skipped} 条`);
process.exit(0);
