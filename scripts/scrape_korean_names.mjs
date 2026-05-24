import { writeFileSync } from 'fs';

const API = 'https://zh.wikipedia.org/w/api.php?action=parse&page=%E5%8D%97%E9%9F%93%E6%9C%80%E5%8F%97%E6%AD%A1%E8%BF%8E%E5%90%8D%E5%AD%97%E5%88%97%E8%A1%A8&prop=wikitext&format=json';

async function scrape() {
  const res = await fetch(API);
  const json = await res.json();
  const wikitext = json?.parse?.wikitext?.['*'] ?? '';

  if (!wikitext) throw new Error('wikitext 为空，检查 API URL');

  const names = new Map();

  const lines = wikitext.split('\n');
  let currentGender = 'M';
  let rowCols = [];
  let inRow = false;

  for (const line of lines) {
    const t = line.trim();

    if (/女|女性|女生|女孩|Girl|girl/i.test(t) && t.startsWith('=')) {
      currentGender = 'F';
      continue;
    }
    if (/男|男性|男生|男孩|Boy|boy/i.test(t) && t.startsWith('=')) {
      currentGender = 'M';
      continue;
    }

    if (t === '|-') {
      if (rowCols.length >= 3) processRow(rowCols, currentGender, names);
      rowCols = [];
      inRow = true;
      continue;
    }

    if (inRow && t.startsWith('|') && !t.startsWith('|-') && !t.startsWith('||')) {
      rowCols.push(t.slice(1).trim());
    }
  }
  if (rowCols.length >= 3) processRow(rowCols, currentGender, names);

  return Array.from(names.values());
}

function processRow(cols, gender, names) {
  const korean = cols[0]?.trim();
  const english = cols[1]?.trim();
  const chineseRaw = cols[2]?.trim();

  if (!korean || /韩文|谚文|名字|姓名|英文|拼音|中文|数量/.test(korean)) return;
  if (!/[가-힯]/.test(korean)) return;

  let chinese = '';
  if (chineseRaw && chineseRaw !== '\\' && chineseRaw !== '') {
    chinese = chineseRaw
      .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
      .replace(/\{\{[^}]+\}\}/g, '')
      .trim();
    const firstOption = chinese.split(/[、，,]/)[0].trim();
    chinese = firstOption;
  }

  if (!names.has(korean) && korean) {
    names.set(korean, {
      korean,
      chinese,
      english: english || '',
      gender,
    });
  }
}

const data = await scrape();
console.log(`共抓取 ${data.length} 条唯一名字`);
console.log(`有中文译名：${data.filter(r => r.chinese).length} 条`);
console.log(`无中文译名：${data.filter(r => !r.chinese).length} 条`);

const csv = ['korean,chinese,english,gender'];
for (const r of data) {
  const row = [r.korean, r.chinese, r.english, r.gender]
    .map(v => `"${(v || '').replace(/"/g, '""')}"`)
    .join(',');
  csv.push(row);
}
writeFileSync('./scripts/korean_names.csv', csv.join('\n'), 'utf8');
console.log('已写入 scripts/korean_names.csv');

console.log('\n前10条：');
data.slice(0, 10).forEach(r => console.log(JSON.stringify(r)));
