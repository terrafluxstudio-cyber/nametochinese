import fs from 'fs';
import path from 'path';
import { Converter } from 'opencc-js';

// 译音表数据源是繁体 wiki，输出统一转简体
const toSimplified = Converter({ from: 't', to: 'cn' });

export type Segment = {
  input: string;
  output: string;
  color: number;
  missing?: boolean; // 该音在该语言表中无对应汉字
};

export type TranslitResult = {
  result: string;
  segments: Segment[];
  language: string;
  hasRules: boolean;
  hasMissing?: boolean;
};

type LangTable = {
  language: string;
  tables: {
    type: 'person' | 'place';
    headers: string[];
    rows: { key: string; values: string[] }[];
  }[];
};

const ruleCache = new Map<string, LangTable>();

/** Russian matrix columns when headers are placeholder col1…colN */
const RU_CONSONANTS = [
  '',
  'б',
  'п',
  'д',
  'т',
  'г',
  'к',
  'в',
  'ф',
  'з',
  'с',
  'ж',
  'ш',
  'щ',
  'ч',
  'ч',
  'ц',
  'х',
  'м',
  'н',
  'л',
  'р',
];

/** English matrix columns (Wikipedia 英语译音表) */
const EN_CONSONANTS = [
  '',
  'b',
  'p',
  'd',
  't',
  'g',
  'c',
  'k',
  'v',
  'w',
  'f',
  'z',
  'c',
  's',
  'zh',
  'sh',
  'j',
  'ch',
  'h',
  'm',
  'n',
  'l',
  'r',
  'y',
  'gu',
  'qu',
  'hu',
  'w',
];

const RU_LATIN_TO_CYR: [string, string][] = [
  ['shch', 'щ'],
  ['sch', 'щ'],
  ['zh', 'ж'],
  ['ch', 'ч'],
  ['sh', 'ш'],
  ['kh', 'х'],
  ['ts', 'ц'],
  ['yo', 'ё'],
  ['ye', 'е'],
  ['ya', 'я'],
  ['yu', 'ю'],
  ['ay', 'ай'],
  ['ey', 'ей'],
  ['oy', 'ой'],
  ['iy', 'ий'],
  ['uy', 'уй'],
  ['a', 'а'],
  ['b', 'б'],
  ['v', 'в'],
  ['g', 'г'],
  ['d', 'д'],
  ['e', 'е'],
  ['z', 'з'],
  ['i', 'и'],
  ['y', 'ы'],
  ['k', 'к'],
  ['l', 'л'],
  ['m', 'м'],
  ['n', 'н'],
  ['o', 'о'],
  ['p', 'п'],
  ['r', 'р'],
  ['s', 'с'],
  ['t', 'т'],
  ['u', 'у'],
  ['f', 'ф'],
  ['h', 'х'],
  ['c', 'ц'],
  ['j', 'й'],
];

export function loadRules(langFile: string): LangTable | null {
  if (ruleCache.has(langFile)) return ruleCache.get(langFile)!;

  const filePath = path.join(process.cwd(), 'data', 'transliteration', `${langFile}.json`);
  if (!fs.existsSync(filePath)) return null;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as LangTable;
  ruleCache.set(langFile, data);
  return data;
}

function cleanChinese(cell: string): string {
  if (!cell) return '';
  const stripped = cell
    .replace(/-\{|\}-/g, '') // MediaWiki 中文变体标记 -{于}- → 于
    .replace(/\|/g, '')
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/rowspan="[^"]*"/gi, '')
    .replace(/&ZeroWidthSpace;/g, '')
    .replace(/<[^>]+>/g, '')
    .trim();
  if (!/[\u4e00-\u9fff]/.test(stripped)) return '';
  const m = stripped.match(/^([\u4e00-\u9fff]+)/);
  return m?.[1] ?? stripped.split(/[（(]/)[0]?.trim() ?? '';
}

function isPlaceholderHeader(h: string): boolean {
  return !h || /^col\d+$/i.test(h);
}

function parseVowelVariants(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(/[\s/、,，]+/)
    .map(v => v.replace(/[^a-zàâäéèêëíìîïóòôöúùûüýÿāăąćčďđēėęěğħīįıķłńņňōőœřśšťūůűųźżžа-яёА-ЯЁ]/gi, ''))
    .filter(v => v.length > 0);
}

function expandConsonantHeader(header: string): string[] {
  if (!header || header === '輔音' || header === '元音') return [''];
  if (isPlaceholderHeader(header)) return [];
  const parts = header
    .replace(/[()（）]/g, ' ')
    .split(/(?=[a-z])/i)
    .join(' ')
    .split(/[\s*+]+/)
    .map(p => p.trim().toLowerCase())
    .filter(p => /^[a-zà-žа-яё]+$/i.test(p));
  return parts.length > 0 ? parts : [header.toLowerCase()];
}

// 德语列头被抓取丢了分隔符（'mmm''dddtd''kckc*'），expandConsonantHeader 会拆错列。
// 手工给标准《德语译音表》列序（对齐 values：[0]=元音空列, 之后各辅音）。
const DE_CONSONANTS = [
  '', 'b', 'p', 'd', 't', 'g', 'k', 'w', 'f', 'z',
  's', 'sch', 'tsch', 'ch', 'h', 'm', 'n', 'l', 'r', 'j',
];

function getConsonantsForTable(table: LangTable['tables'][0], langFile: string): string[] {
  if (langFile === '德語') {
    const maxCols = Math.max(0, ...table.rows.map(r => r.values.length));
    return DE_CONSONANTS.slice(0, maxCols);
  }
  const headers = table.headers.slice(1);
  if (headers.some(h => !isPlaceholderHeader(h) && h !== '輔音')) {
    const out: string[] = [];
    for (const h of headers) {
      const parts = expandConsonantHeader(h);
      if (parts.length === 1) out.push(parts[0]);
      else if (parts.length > 1) out.push(...parts);
      else out.push('');
    }
    return out;
  }

  const maxCols = Math.max(0, ...table.rows.map(r => r.values.length));
  if (langFile === '俄語' || langFile.includes('俄')) {
    return RU_CONSONANTS.slice(0, maxCols);
  }
  if (langFile === '英語' || langFile.includes('英')) {
    return EN_CONSONANTS.slice(0, maxCols);
  }
  return Array.from({ length: maxCols }, (_, i) => (i === 0 ? '' : `c${i}`));
}

function addToMap(map: Map<string, string>, key: string, value: string) {
  const k = key.toLowerCase();
  if (!k || !value) return;
  if (!map.has(k)) map.set(k, value);
}

/** Lead hanzi on vowel rows → Latin vowel key */
const EN_VOWEL_LEAD: Record<string, string> = {
  阿: 'a',
  埃: 'e',
  厄: 'e',
  伊: 'i',
  奥: 'o',
  奧: 'o',
  乌: 'u',
  烏: 'u',
  尤: 'u',
  艾: 'ai',
  安: 'an',
  昂: 'ang',
  恩: 'en',
  因: 'in',
  英: 'ing',
  温: 'un',
  溫: 'un',
  翁: 'ong',
};

const EN_VOWEL_ROW_ORDER = [
  'a',
  'e',
  'e',
  'i',
  'o',
  'u',
  'u',
  'ai',
  'au',
  'an',
  'ang',
  'en',
  'in',
  'ing',
  'un',
  'ong',
];

/** Consonant-only row (zero vowel) hanzi → Latin consonant */
const EN_CONSONANT_LEAD: Record<string, string> = {
  布: 'b',
  普: 'p',
  德: 'd',
  特: 't',
  格: 'g',
  克: 'k',
  夫: 'f',
  兹: 'z',
  茨: 'c',
  斯: 's',
  日: 'zh',
  什: 'sh',
  奇: 'ch',
  赫: 'h',
  姆: 'm',
  恩: 'n',
  尔: 'r',
  勒: 'r',
};

/** Russian consonant-only (辅音零行) */
const RU_CONSONANT_ONLY: Record<string, string> = {
  '': '',
  б: '布',
  п: '普',
  д: '德',
  т: '特',
  г: '格',
  к: '克',
  в: '夫',
  ф: '夫',
  з: '兹',
  с: '斯',
  ж: '日',
  ш: '什',
  щ: '希',
  ч: '奇',
  ц: '茨',
  х: '赫',
  м: '姆',
  н: '恩',
  л: '尔',
  р: '尔',
};

const RU_EXTRA_SYLLABLES: [string, string][] = [
  ['кс', '克斯'],
  ['дз', '兹'],
  ['дж', '吉'],
  ['тс', '茨'],
  ['нд', '恩德'],
  ['др', '德尔'],
  ['ндр', '恩德尔'],
  ['екс', '埃克斯'],
  ['андр', '安德'],
  ['анд', '安德'],
  ['лан', '兰'],
  ['лекс', '列克斯'],
  ['сан', '桑'],
  ['санд', '桑德'],
  ['сандр', '桑德尔'],
];

function buildEnglishLookupMap(table: LangTable['tables'][0]): Map<string, string> {
  const map = new Map<string, string>();
  const consonants = EN_CONSONANTS;
  let vowelRowIdx = 0;

  for (const row of table.rows) {
    const values = row.values.map(cleanChinese);
    const chineseCount = values.filter(Boolean).length;
    if (chineseCount < 8) continue;

    const lead = values.find(Boolean) ?? '';
    const isConsonantRow = EN_CONSONANT_LEAD[lead] !== undefined;

    if (isConsonantRow) {
      const firstIdx = values.findIndex(v => v);
      values.forEach((chinese, i) => {
        if (!chinese) return;
        const c = consonants[i - firstIdx] ?? '';
        if (c) addToMap(map, c, chinese);
      });
      continue;
    }

    let vowel = EN_VOWEL_LEAD[lead] ?? '';
    if (!vowel) {
      vowel = EN_VOWEL_ROW_ORDER[vowelRowIdx] ?? '';
      vowelRowIdx++;
    }
    if (!vowel) continue;

    const firstIdx = values.findIndex(v => v);
    values.forEach((chinese, i) => {
      if (!chinese) return;
      const colIdx = i - firstIdx;
      const c = consonants[colIdx] ?? '';
      if (!c) {
        addToMap(map, vowel, chinese);
        return;
      }
      addToMap(map, `${c}${vowel}`, chinese);
    });
  }

  return map;
}

function buildFromVowelRow(
  map: Map<string, string>,
  vowelVariants: string[],
  consonants: string[],
  values: string[]
) {
  values.forEach((cell, i) => {
    const chinese = cleanChinese(cell);
    if (!chinese) return;
    const c = consonants[i] ?? '';
    for (const v of vowelVariants.length ? vowelVariants : ['']) {
      const key = `${c}${v}`.toLowerCase();
      addToMap(map, key, chinese);
      if (!c && v) addToMap(map, v, chinese);
    }
  });
}

export function buildLookupMap(
  table: LangTable['tables'][0],
  langFile: string
): Map<string, string> {
  if (langFile === '英語') {
    return buildEnglishLookupMap(table);
  }

  const map = new Map<string, string>();
  const consonants = getConsonantsForTable(table, langFile);

  for (const row of table.rows) {
    const keyVariants = parseVowelVariants(row.key);
    const hasCyrillicKey = /[а-яё]/i.test(row.key);

    // 辅音基准行（firstCell 恰为'元音'）：映射裸辅音 b→布、l→尔…（原逻辑整行丢弃 → 词尾/双辅音吐?）
    // 注意精确匹配：'i ie ih y(元音後)' 等行含"元音"子串，不能误判
    if ((row.values[0] ?? '').trim() === '元音') {
      buildFromVowelRow(map, [''], consonants, row.values.slice(1));
      continue;
    }

    if (hasCyrillicKey && keyVariants.length > 0) {
      buildFromVowelRow(map, keyVariants, consonants, row.values);
      continue;
    }

    const firstCell = row.values[0] ?? '';
    const vowelFromValues = parseVowelVariants(firstCell);
    const looksLikeVowelLabel =
      vowelFromValues.length > 0 && /[a-zà-ž]/i.test(firstCell) && firstCell.length < 40;

    if (looksLikeVowelLabel) {
      buildFromVowelRow(map, vowelFromValues, consonants, row.values.slice(1));
      continue;
    }

    if (row.key) {
      const variants = parseVowelVariants(row.key);
      if (variants.length) buildFromVowelRow(map, variants, consonants, row.values);
    }
  }

  if (langFile === '俄語' || langFile.includes('俄')) {
    for (const [c, chinese] of Object.entries(RU_CONSONANT_ONLY)) {
      if (c && chinese) addToMap(map, c, chinese);
    }
    for (const [syllable, chinese] of RU_EXTRA_SYLLABLES) {
      addToMap(map, syllable, chinese);
    }
    addLatinVariants(map);
  }

  return map;
}

function addLatinVariants(map: Map<string, string>) {
  const entries = [...map.entries()];
  for (const [cyrKey, chinese] of entries) {
    const latin = cyrillicKeyToLatin(cyrKey);
    if (latin) addToMap(map, latin, chinese);
  }
}

function cyrillicKeyToLatin(key: string): string {
  const mapChar: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ы: 'y',
    э: 'e',
    ю: 'yu',
    я: 'ya',
    ь: '',
    ъ: '',
  };
  let out = '';
  for (const ch of key) {
    out += mapChar[ch] ?? ch;
  }
  return out;
}

export function latinToCyrillic(text: string): string {
  let i = 0;
  let out = '';
  const lower = text.toLowerCase();
  while (i < lower.length) {
    let matched = false;
    for (const [lat, cyr] of RU_LATIN_TO_CYR) {
      if (lower.startsWith(lat, i)) {
        out += cyr;
        i += lat.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out += lower[i];
      i++;
    }
  }
  return out;
}

function normalizeForLookup(input: string, langFile: string): string {
  const trimmed = input.trim();
  if (langFile === '俄語' || langFile.includes('俄')) {
    if (/[а-яё]/i.test(trimmed)) return trimmed.toLowerCase();
    return latinToCyrillic(trimmed);
  }
  if (langFile === '德語') {
    // 德语双写辅音=单音、ck=k、ß=s：收一个再查（Müller→müler→米勒、Becker→beker→贝克尔）
    return trimmed
      .toLowerCase()
      .replace(/ß/g, 's')
      .replace(/ck/g, 'k')
      .replace(/([bcdfgklmnprstz])\1/g, '$1');
  }
  return trimmed.toLowerCase();
}

function preserveCaseSlice(original: string, start: number, len: number): string {
  return original.slice(start, start + len);
}

export function transliterate(
  input: string,
  langFile: string,
  type: 'person' | 'place' = 'person'
): TranslitResult {
  const rules = loadRules(langFile);

  if (!rules) {
    return { result: '', segments: [], language: langFile, hasRules: false };
  }

  const table = rules.tables.find(t => t.type === type) ?? rules.tables[0];
  if (!table) {
    return { result: '', segments: [], language: rules.language, hasRules: false };
  }

  const lookupMap = buildLookupMap(table, langFile);
  const text = normalizeForLookup(input, langFile);
  const segments: Segment[] = [];
  let i = 0;
  let colorIdx = 0;

  while (i < text.length) {
    if (text[i] === ' ' || text[i] === '-') {
      segments.push({
        input: preserveCaseSlice(input, i, 1),
        output: text[i] === ' ' ? '·' : '',
        color: -1,
      });
      i++;
      continue;
    }

    let matched = false;
    for (let len = Math.min(6, text.length - i); len >= 1; len--) {
      const candidate = text.slice(i, i + len);
      const chinese = lookupMap.get(candidate);
      if (chinese) {
        segments.push({
          input: preserveCaseSlice(input, i, len),
          output: chinese,
          color: colorIdx % 8,
        });
        colorIdx++;
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const ch = preserveCaseSlice(input, i, 1);
      // 该音该表无对应汉字：标记缺口，不假装拼出了结果
      segments.push({
        input: ch,
        output: '？',
        color: colorIdx % 8,
        missing: true,
      });
      colorIdx++;
      i++;
    }
  }

  // 数据源为繁体，输出统一转简体（仅转汉字，问号/原文字母不受影响）
  const out = segments.map(s =>
    s.missing ? s : { ...s, output: toSimplified(s.output) }
  );
  const result = out.map(s => s.output).join('');
  const hasMissing = out.some(s => s.missing);
  return { result, segments: out, language: rules.language, hasRules: true, hasMissing };
}
