import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const csv = readFileSync('./scripts/russian_names.csv', 'utf8');
const rows = parse(csv, { columns: true, skip_empty_lines: true });

let count = 0;
for (const r of rows) {
  await db.execute({
    sql: `INSERT INTO russian_names (russian, chinese, gender, patronymic_ru, patronymic_zh, nicknames)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [r.russian, r.chinese, r.gender || null, r.patronymic_ru || null, r.patronymic_zh || null, r.nicknames || null],
  });
  count++;
}
console.log(`导入 ${count} 条完成`);
