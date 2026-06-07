import fs from 'fs';
import path from 'path';

export type Person = {
  qid: string;
  zh: string;
  ru: string;
  surname: string;
  ruSurname: string;
  gender: string;
  birth: number | null;
  death: number | null;
  bio: string;
  wiki: string;
  sitelinks: number;
};

export type CelebGroup = {
  surname: string;
  ruSurname: string;
  slug: string;
  people: Person[];
  topSitelinks: number;
  count: number;
};

let cache: CelebGroup[] | null = null;
let bySlug: Map<string, CelebGroup> | null = null;

function load(): CelebGroup[] {
  if (cache) return cache;
  const p = path.join(process.cwd(), 'data', 'russian', 'celebrity_groups.json');
  cache = JSON.parse(fs.readFileSync(p, 'utf8')) as CelebGroup[];
  bySlug = new Map(cache.map((g) => [g.slug, g]));
  return cache;
}

export function getAllGroups(): CelebGroup[] {
  return load();
}

export function getAllSlugs(): string[] {
  return load().map((g) => g.slug);
}

export function getGroupBySlug(slug: string): CelebGroup | null {
  load();
  return bySlug!.get(slug) ?? null;
}
