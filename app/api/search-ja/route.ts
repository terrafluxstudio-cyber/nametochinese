import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

type Surname = { romaji: string; ja: string; zh: string };
type GivenName = {
  romaji: string;
  candidates: { ja: string; zh: string }[];
  gender: string;
};

function loadData() {
  const surnamesPath = path.join(process.cwd(), 'data', 'ja_surnames.json');
  const givenPath = path.join(process.cwd(), 'data', 'ja_given.json');
  const surnames: Surname[] = JSON.parse(readFileSync(surnamesPath, 'utf8'));
  const given: GivenName[] = JSON.parse(readFileSync(givenPath, 'utf8'));
  return { surnames, given };
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';
  if (!q) return NextResponse.json({ error: 'missing q' }, { status: 400 });

  const { surnames, given } = loadData();

  const parts = q.split(/\s+/);
  const surnamePart = parts[0];
  const givenPart = parts.slice(1).join(' ');

  const surnameMatches = surnames
    .filter((s) => s.romaji === surnamePart || s.romaji.startsWith(surnamePart))
    .slice(0, 5);

  const givenMatches = givenPart
    ? given
        .filter((g) => g.romaji === givenPart || g.romaji.startsWith(givenPart))
        .slice(0, 5)
    : [];

  const combinations: {
    ja: string;
    zh: string;
    surnameJa: string;
    givenJa: string;
  }[] = [];

  if (surnameMatches.length > 0 && givenMatches.length > 0) {
    for (const s of surnameMatches.slice(0, 3)) {
      for (const g of givenMatches.slice(0, 3)) {
        for (const gc of g.candidates.slice(0, 2)) {
          combinations.push({
            ja: s.ja + gc.ja,
            zh: s.zh + gc.zh,
            surnameJa: s.ja,
            givenJa: gc.ja,
          });
        }
      }
    }
  } else if (surnameMatches.length > 0) {
    for (const s of surnameMatches) {
      combinations.push({
        ja: s.ja,
        zh: s.zh,
        surnameJa: s.ja,
        givenJa: '',
      });
    }
  }

  return NextResponse.json(
    { input: q, surnameMatches, givenMatches, combinations: combinations.slice(0, 10) },
    { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } }
  );
}
