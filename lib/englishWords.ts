import fs from 'fs';
import path from 'path';
import { pinyin } from 'pinyin-pro';

// 英文常用词 → 中文 长尾页（LONGTAIL P2，单个含义词簇）。
// 数据源：自选高搜索词（纹身/取名/艺术）+ 自写厚释义。译文=客观事实，不 dump 词典。
// 红线见 memory/longtail-namepage-copyright-line.md。

export type RawWord = {
  word: string;
  zh: string;
  category: string;
  meaning: string;
  note?: string;
};

export type EnglishWord = RawWord & {
  slug: string; // e.g. "love-in-chinese"
  pinyin: string; // e.g. "Ài"
};

const SUFFIX = '-in-chinese';

function toPinyin(zh: string): string {
  const py = pinyin(zh, { toneType: 'symbol', type: 'array' }) as string[];
  return py
    .map((s, i) => (i === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s))
    .join(' ');
}

function slugify(word: string): string {
  return `${word.toLowerCase().replace(/\s+/g, '-')}${SUFFIX}`;
}

let cache: EnglishWord[] | null = null;
let bySlug: Map<string, EnglishWord> | null = null;

function load(): EnglishWord[] {
  if (cache) return cache;
  const p = path.join(process.cwd(), 'data', 'english_words.json');
  const raw = JSON.parse(fs.readFileSync(p, 'utf8')) as RawWord[];
  cache = raw.map((r) => ({ ...r, slug: slugify(r.word), pinyin: toPinyin(r.zh) }));
  bySlug = new Map(cache.map((w) => [w.slug, w]));
  return cache;
}

export function getAllWords(): EnglishWord[] {
  return [...load()].sort((a, b) => a.word.localeCompare(b.word));
}

export function getAllWordSlugs(): string[] {
  return load().map((w) => w.slug);
}

export function getWordBySlug(slug: string): EnglishWord | null {
  load();
  return bySlug!.get(slug) ?? null;
}

// 同类别（category）的其他词，做内链留存
export function getRelatedWords(w: EnglishWord, limit = 8): EnglishWord[] {
  return load()
    .filter((x) => x.slug !== w.slug && x.category === w.category)
    .sort((a, b) => a.word.localeCompare(b.word))
    .slice(0, limit);
}
