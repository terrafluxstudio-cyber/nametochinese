import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

const URL = 'https://ru.tingroom.com/cihui/eyshch/105.html';

async function scrape() {
  const res = await fetch(URL);
  const html = await res.text();
  const $ = cheerio.load(html);

  const content =
    $('.article-content').text() ||
    $('.content').text() ||
    $('article').text() ||
    $('.post-content').text();

  let names = [];
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  let gender = 'F';

  for (const line of lines) {
    if (/男性|男名|男子/.test(line) && !/父名/.test(line)) { gender = 'M'; continue; }
    if (/女性|女名|女子/.test(line) && !/父名/.test(line)) { gender = 'F'; continue; }

    if (!/^\d+[\.、]/.test(line)) continue;

    const body = line.replace(/^\d+[\.、]\s*/, '');

    const nameRx = /^([А-Яа-яЁё][А-Яа-яЁё\/\-]*)\(([^)]+)\)/;
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
      .map(m => m[1])
      .filter(n => n !== patronymic_ru && !n.match(/^(Авдей|отчество)$/));
    const nicknames = nicknameMatches.join(',');

    names.push({ russian, chinese, gender, patronymic_ru, patronymic_zh, nicknames });
  }

  if (names.length < 100) {
    const blob = content.replace(/\s+/g, ' ');
    const maleIdx = blob.search(/\s1\.\s*Абрам\s*\(/);
    const parts = [
      { text: maleIdx > 0 ? blob.slice(0, maleIdx) : blob, gender: 'F' },
      ...(maleIdx > 0 ? [{ text: blob.slice(maleIdx), gender: 'M' }] : []),
    ];
    names = [];
    for (const { text, g } of parts.map((p) => ({ text: p.text, g: p.gender }))) {
      gender = g;
      const chunks = text.split(/(?=\d{1,3}\.\s)/).filter((c) => /^\d{1,3}\.\s/.test(c.trim()));
      for (const chunk of chunks) {
        const body = chunk.trim().replace(/^\d{1,3}\.\s*/, '');
        const nameRx = /^([А-Яа-яЁё][А-Яа-яЁё\/\-=（）\s]*?)\(([^)]+)\)/;
        const nameMatch = body.match(nameRx);
        if (!nameMatch) continue;
        const russian = nameMatch[1].trim().replace(/\s+/g, '');
        const chinese = nameMatch[2].trim();
        let patronymic_ru = '';
        let patronymic_zh = '';
        const patrRx = /父名[：:]\s*([А-Яа-яЁё]+)\(([^)]+)\)/;
        const patrMatch = body.match(patrRx);
        if (patrMatch) {
          patronymic_ru = patrMatch[1];
          patronymic_zh = patrMatch[2];
        }
        const afterMain = body.slice(nameMatch[0].length);
        const nicknameRx = /([А-Яа-яЁё]{2,})/g;
        const nicknameMatches = [...afterMain.matchAll(nicknameRx)]
          .map((m) => m[1])
          .filter((n) => n !== patronymic_ru && !/^(父名|Авдей|отчество)$/i.test(n) && !body.includes(`${n}(`));
        const nicknames = [...new Set(nicknameMatches)].join(',');
        names.push({ russian, chinese, gender, patronymic_ru, patronymic_zh, nicknames });
      }
    }
  }

  return names;
}

const data = await scrape();
console.log(`抓取到 ${data.length} 条`);

const csv = ['russian,chinese,gender,patronymic_ru,patronymic_zh,nicknames'];
for (const r of data) {
  const row = [r.russian, r.chinese, r.gender, r.patronymic_ru, r.patronymic_zh, r.nicknames]
    .map(v => `"${(v || '').replace(/"/g, '""')}"`)
    .join(',');
  csv.push(row);
}

writeFileSync('./scripts/russian_names.csv', csv.join('\n'), 'utf8');
console.log('已写入 scripts/russian_names.csv');

console.log('\n前5条：');
data.slice(0, 5).forEach(r => console.log(JSON.stringify(r, null, 2)));
