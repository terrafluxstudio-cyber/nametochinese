import { writeFileSync } from 'fs';

const API_BASE = 'https://zh.wikipedia.org/w/api.php';
const MAIN_PAGE = 'Wikipedia:外語譯音表';
const PREFIX = 'Wikipedia:外語譯音表/';
const USER_AGENT =
  'NameToChineseBot/1.0 (https://nametochinese.com; transliteration data import)';

async function wikiGet(params) {
  const url = `${API_BASE}?${params}&format=json`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Api-User-Agent': USER_AGENT,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function discoverFromLinks() {
  const langs = [];
  let continueToken;

  do {
    const params = new URLSearchParams({
      action: 'query',
      titles: MAIN_PAGE,
      prop: 'links',
      plnamespace: '4',
      pllimit: '500',
    });
    if (continueToken) params.set('plcontinue', continueToken);

    const json = await wikiGet(params);
    const page = Object.values(json.query?.pages ?? {})[0];
    for (const link of page?.links ?? []) {
      if (link.title?.startsWith(PREFIX)) {
        langs.push(link.title.slice(PREFIX.length).trim());
      }
    }
    continueToken = json.continue?.plcontinue;
  } while (continueToken);

  return langs;
}

async function discoverFromWikitext() {
  const params = new URLSearchParams({
    action: 'parse',
    page: MAIN_PAGE,
    prop: 'wikitext',
  });
  const json = await wikiGet(params);
  const text = json?.parse?.wikitext?.['*'] ?? '';
  return [...text.matchAll(/\[\[Wikipedia:外語譯音表\/([^\]|]+)/g)]
    .map(m => m[1].trim())
    .filter(Boolean);
}

const fromLinks = await discoverFromLinks();
const fromWikitext = await discoverFromWikitext().catch(() => []);
const links = [...new Set([...fromLinks, ...fromWikitext])].sort((a, b) =>
  a.localeCompare(b, 'zh-Hant')
);

console.log(`发现 ${links.length} 个语言子页面：`);
links.forEach(l => console.log(' -', l));

writeFileSync('./scripts/lang_list.json', JSON.stringify(links, null, 2), 'utf8');
