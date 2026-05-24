import { createClient } from '@libsql/client';
import { writeFileSync, mkdirSync } from 'fs';
import { pinyin } from 'pinyin';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

mkdirSync('./data', { recursive: true });

console.log('查询中文人名...');
const result = await db.execute({
  sql: `SELECT chinese FROM persons WHERE nationality LIKE '%中%' AND chinese IS NOT NULL LIMIT 200000`,
  args: [],
});

const names = result.rows.map((r) => r.chinese).filter(Boolean);
console.log(`共 ${names.length} 条中文人名`);

const surnameFreq = new Map();
const givenCharFreq = new Map();

for (const name of names) {
  if (!name || name.length < 2) continue;
  const surname = name[0];
  const given = name.slice(1);

  surnameFreq.set(surname, (surnameFreq.get(surname) || 0) + 1);
  for (const char of given) {
    givenCharFreq.set(char, (givenCharFreq.get(char) || 0) + 1);
  }
}

const surnamePinyinMap = {};
for (const [char, freq] of surnameFreq.entries()) {
  const py = pinyin(char, { style: pinyin.STYLE_NORMAL })[0]?.[0];
  if (!py) continue;
  if (!surnamePinyinMap[py]) surnamePinyinMap[py] = [];
  surnamePinyinMap[py].push({ char, freq });
}
for (const py of Object.keys(surnamePinyinMap)) {
  surnamePinyinMap[py].sort((a, b) => b.freq - a.freq);
}

const givenPinyinMap = {};
for (const [char, freq] of givenCharFreq.entries()) {
  if (freq < 5) continue;
  const py = pinyin(char, { style: pinyin.STYLE_NORMAL })[0]?.[0];
  if (!py) continue;
  if (!givenPinyinMap[py]) givenPinyinMap[py] = [];
  givenPinyinMap[py].push({ char, freq });
}
for (const py of Object.keys(givenPinyinMap)) {
  givenPinyinMap[py].sort((a, b) => b.freq - a.freq);
  givenPinyinMap[py] = givenPinyinMap[py].slice(0, 15);
}

writeFileSync('./data/surname_pinyin.json', JSON.stringify(surnamePinyinMap, null, 2));
writeFileSync('./data/given_pinyin.json', JSON.stringify(givenPinyinMap, null, 2));

console.log(`姓拼音种类：${Object.keys(surnamePinyinMap).length}`);
console.log(`名字拼音种类：${Object.keys(givenPinyinMap).length}`);
console.log('示例 zhang →', surnamePinyinMap['zhang']?.slice(0, 5));
console.log('示例 wei →', givenPinyinMap['wei']?.slice(0, 5));
