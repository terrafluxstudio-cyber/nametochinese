import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const csv = readFileSync('./scripts/korean_names.csv', 'utf8');
const rows = parse(csv, { columns: true, skip_empty_lines: true });

let count = 0;
for (const r of rows) {
  await db.execute({
    sql: `INSERT INTO korean_names (korean, chinese, english, gender) VALUES (?, ?, ?, ?)`,
    args: [r.korean, r.chinese || null, r.english || null, r.gender || null],
  });
  count++;
}
console.log(`导入 ${count} 条完成`);
