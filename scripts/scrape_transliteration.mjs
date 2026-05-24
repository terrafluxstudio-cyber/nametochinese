import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { parseWikitable } from './parse_wikitable.mjs';

const API_BASE = 'https://zh.wikipedia.org/w/api.php';
const USER_AGENT =
  'NameToChineseBot/1.0 (https://nametochinese.com; transliteration data import)';
const langs = JSON.parse(readFileSync('./scripts/lang_list.json', 'utf8'));

mkdirSync('./data/transliteration', { recursive: true });

async function wikiGet(params) {
  const url = `${API_BASE}?${params}&format=json`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Api-User-Agent': USER_AGENT,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchWikitext(subpage) {
  const title = `Wikipedia:外語譯音表/${subpage}`;
  const params = new URLSearchParams({
    action: 'query',
    titles: title,
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
  });
  const json = await wikiGet(params);
  const page = Object.values(json.query?.pages ?? {})[0];
  if (page?.missing !== undefined) return '';
  const rev = page?.revisions?.[0];
  return rev?.slots?.main?.['*'] ?? rev?.['*'] ?? '';
}

function tablesToRules(tables, langName) {
  const result = {
    language: langName,
    tables: [],
    raw_note: '',
  };

  tables.forEach((table, i) => {
    if (table.headers.length === 0 || table.rows.length === 0) return;
    result.tables.push({
      type: i === 0 ? 'person' : 'place',
      headers: table.headers,
      rows: table.rows.map(row => ({
        key: row[0] || '',
        values: row.slice(1),
      })),
    });
  });

  return result;
}

const results = { success: [], failed: [] };

for (const lang of langs) {
  try {
    console.log(`处理: ${lang}`);
    const wikitext = await fetchWikitext(lang);
    if (!wikitext) {
      results.failed.push({ lang, reason: '页面不存在' });
      continue;
    }

    const tables = parseWikitable(wikitext);
    if (tables.length === 0) {
      results.failed.push({ lang, reason: '未找到表格' });
      continue;
    }

    const rules = tablesToRules(tables, lang);
    const filename = lang.replace(/\//g, '_').replace(/\s/g, '_');
    writeFileSync(
      `./data/transliteration/${filename}.json`,
      JSON.stringify(rules, null, 2),
      'utf8'
    );
    results.success.push(lang);

    await new Promise(r => setTimeout(r, 300));
  } catch (e) {
    results.failed.push({ lang, reason: e.message });
  }
}

console.log(`\n成功: ${results.success.length} 个`);
console.log(`失败: ${results.failed.length} 个`);
results.failed.forEach(f => console.log(` - ${f.lang}: ${f.reason}`));

writeFileSync('./scripts/scrape_results.json', JSON.stringify(results, null, 2), 'utf8');
