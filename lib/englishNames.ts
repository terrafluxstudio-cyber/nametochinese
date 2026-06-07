import fs from 'fs';
import path from 'path';
import { pinyin } from 'pinyin-pro';

// 英文名 → 中文 长尾页数据。
// 数据源：自选高频教名 + 规则音译/约定俗成标准写法（单条客观读音事实，不复制版权辞典结构）。
// 红线见 memory/decisions.md 版权区：永不 dump persons 67万辞典、永不点名辞典。

export type RawName = {
  name: string;
  gender: 'm' | 'f';
  zh: string;
  origin: string;
  meaning: string;
};

export type EnglishName = RawName & {
  slug: string; // e.g. "emma-in-chinese"
  pinyin: string; // e.g. "Ài mǎ"
};

const SUFFIX = '-in-chinese';

function toPinyin(zh: string): string {
  const py = pinyin(zh, { toneType: 'symbol', type: 'array' }) as string[];
  return py
    .map((s, i) => (i === 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s))
    .join(' ');
}

let cache: EnglishName[] | null = null;
let bySlug: Map<string, EnglishName> | null = null;

function load(): EnglishName[] {
  if (cache) return cache;
  const p = path.join(process.cwd(), 'data', 'english_names.json');
  const raw = JSON.parse(fs.readFileSync(p, 'utf8')) as RawName[];
  cache = raw.map((r) => ({
    ...r,
    slug: `${r.name.toLowerCase()}${SUFFIX}`,
    pinyin: toPinyin(r.zh),
  }));
  bySlug = new Map(cache.map((n) => [n.slug, n]));
  return cache;
}

export function getAllNames(): EnglishName[] {
  return [...load()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getAllNameSlugs(): string[] {
  return load().map((n) => n.slug);
}

export function getNameBySlug(slug: string): EnglishName | null {
  load();
  return bySlug!.get(slug) ?? null;
}

// 同源（origin）的其他名字，最多 n 个，做内链留存
export function getRelatedNames(n: EnglishName, limit = 6): EnglishName[] {
  return load()
    .filter((x) => x.slug !== n.slug && x.origin === n.origin)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function isNameSlug(slug: string): boolean {
  return slug.endsWith(SUFFIX);
}
