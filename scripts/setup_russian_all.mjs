/**
 * One-shot: scrape → CSV → Turso table → import
 * Run: node --env-file=.env.local scripts/setup_russian_all.mjs
 */
import * as cheerio from 'cheerio';
import { createClient } from '@libsql/client';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';

const URL = 'https://ru.tingroom.com/cihui/eyshch/105.html';

function parseNamesFromText(content) {
  const lines = content.split('\n').map((l) => l.trim()).filter((l) => l.length > 2);
  const names = [];
  let gender = 'F';

  for (const line of lines) {
    if (/男性|男名|男子/.test(line) && !/父名/.test(line)) {
      gender = 'M';
      continue;
    }
    if (/女性|女名|女子/.test(line) && !/父名/.test(line)) {
      gender = 'F';
      continue;
    }
    if (!/^\d+[\.、]/.test(line)) continue;

    const body = line.replace(/^\d+[\.、]\s*/, '');
    const nameRx = /^([А-Яа-яЁё][А-Яа-яЁё\/\-=]*)\(([^)]+)\)/;
    const nameMatch = body.match(nameRx);
    if (!nameMatch) continue;

    const russian = nameMatch[1];
    const chinese = nameMatch[2];

    let patronymic_ru = '';
    let patronymic_zh = '';
    const patrRx = /父名[：:]\s*([А-Яа-яЁё]+)\(([^)]+)\)/;
    const patrMatch = body.match(patrRx);
    if (patrMatch) {
      patronymic_ru = patrMatch[1];
      patronymic_zh = patrMatch[2];
    }

    const afterMain = body.slice(nameMatch[0].length);
    const nicknameRx = /\b([А-Яа-яЁё]{2,})\b/g;
    const nicknameMatches = [...afterMain.matchAll(nicknameRx)]
      .map((m) => m[1])
      .filter((n) => n !== patronymic_ru && !/^(Авдей|отчество|父名)$/i.test(n));
    const nicknames = nicknameMatches.join(',');

    names.push({ russian, chinese, gender, patronymic_ru, patronymic_zh, nicknames });
  }
  return names;
}

function parseNamesFromBlob(blob) {
  const names = [];
  const maleIdx = blob.search(/\s1\.\s*Абрам\s*\(/);
  const parts = [
    { text: maleIdx > 0 ? blob.slice(0, maleIdx) : blob, gender: 'F' },
    ...(maleIdx > 0 ? [{ text: blob.slice(maleIdx), gender: 'M' }] : []),
  ];

  for (const { text, gender } of parts) {
    const chunks = text.split(/(?=\d{1,3}\.\s*)/).filter((c) => /^\d{1,3}\./.test(c.trim()));
    for (const chunk of chunks) {
      const line = chunk.trim().replace(/^\d{1,3}\.\s*/, '');
      const nameRx = /^([А-Яа-яЁё][А-Яа-яЁё\/\-=（）\s]*?)\(([^)]+)\)/;
      const nameMatch = line.match(nameRx);
      if (!nameMatch) continue;

      const russian = nameMatch[1].trim().replace(/\s+/g, '');
      const chinese = nameMatch[2].trim();

      let patronymic_ru = '';
      let patronymic_zh = '';
      const patrRx = /父名[：:]\s*([А-Яа-яЁё]+)\(([^)]+)\)/;
      const patrMatch = line.match(patrRx);
      if (patrMatch) {
        patronymic_ru = patrMatch[1];
        patronymic_zh = patrMatch[2];
      }

      const afterMain = line.slice(nameMatch[0].length);
      const nicknameRx = /([А-Яа-яЁё]{2,})/g;
      const nicknameMatches = [...afterMain.matchAll(nicknameRx)]
        .map((m) => m[1])
        .filter(
          (n) =>
            n !== patronymic_ru &&
            !/^(父名|Авдей|отчество)$/i.test(n) &&
            !line.includes(`${n}(`)
        );
      const nicknames = [...new Set(nicknameMatches)].join(',');

      names.push({ russian, chinese, gender, patronymic_ru, patronymic_zh, nicknames });
    }
  }
  return names;
}

async function scrape() {
  const res = await fetch(URL);
  const html = await res.text();
  const $ = cheerio.load(html);

  const content =
    $('.article-content').text() ||
    $('.content').text() ||
    $('article').text() ||
    $('.post-content').text() ||
    $('body').text();

  let names = parseNamesFromText(content);
  if (names.length < 100) {
    const blob = content.replace(/\s+/g, ' ');
    names = parseNamesFromBlob(blob);
  }
  return names;
}

function toCsv(data) {
  const rows = ['russian,chinese,gender,patronymic_ru,patronymic_zh,nicknames'];
  for (const r of data) {
    rows.push(
      [r.russian, r.chinese, r.gender, r.patronymic_ru, r.patronymic_zh, r.nicknames]
        .map((v) => `"${(v || '').replace(/"/g, '""')}"`)
        .join(',')
    );
  }
  return rows.join('\n');
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const data = await scrape();
console.log(`抓取到 ${data.length} 条`);
writeFileSync('./scripts/russian_names.csv', toCsv(data), 'utf8');
console.log('已写入 scripts/russian_names.csv');

await db.execute(`
CREATE TABLE IF NOT EXISTS russian_names (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  russian TEXT NOT NULL,
  chinese TEXT NOT NULL,
  gender TEXT,
  patronymic_ru TEXT,
  patronymic_zh TEXT,
  nicknames TEXT
)`);
await db.execute(`CREATE INDEX IF NOT EXISTS idx_ru_russian ON russian_names(russian)`);
await db.execute(`CREATE INDEX IF NOT EXISTS idx_ru_chinese ON russian_names(chinese)`);

const existing = await db.execute('SELECT COUNT(*) as c FROM russian_names');
if (Number(existing.rows[0].c) > 0) {
  await db.execute('DELETE FROM russian_names');
  console.log('已清空旧数据');
}

const csv = readFileSync('./scripts/russian_names.csv', 'utf8');
const rows = parse(csv, { columns: true, skip_empty_lines: true });
for (const r of rows) {
  await db.execute({
    sql: `INSERT INTO russian_names (russian, chinese, gender, patronymic_ru, patronymic_zh, nicknames)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      r.russian,
      r.chinese,
      r.gender || null,
      r.patronymic_ru || null,
      r.patronymic_zh || null,
      r.nicknames || null,
    ],
  });
}

const count = await db.execute('SELECT COUNT(*) as c FROM russian_names');
console.log(`Turso COUNT: ${count.rows[0].c}`);
