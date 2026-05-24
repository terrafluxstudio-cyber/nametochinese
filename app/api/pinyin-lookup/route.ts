import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

type CharFreq = { char: string; freq: number };

function loadJSON(filename: string): Record<string, CharFreq[]> {
  const p = path.join(process.cwd(), 'data', filename);
  return JSON.parse(readFileSync(p, 'utf8'));
}

const surnameMap = loadJSON('surname_pinyin.json');
const givenMap = loadJSON('given_pinyin.json');

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';
  if (!raw) return NextResponse.json({ error: 'missing q' }, { status: 400 });

  const parts = raw.split(/[\s\-]+/).filter(Boolean);
  if (parts.length < 2) {
    return NextResponse.json(
      { error: '请输入姓和名，用空格分隔，如：zhang wei' },
      { status: 400 }
    );
  }

  const surnamePy = parts[0];
  const givenParts = parts.slice(1);

  const surnameCandidates = (surnameMap[surnamePy] ?? []).slice(0, 8);

  const givenCandidatesByPart = givenParts.map((py) =>
    (givenMap[py] ?? []).slice(0, 10)
  );

  function cartesian(arrays: CharFreq[][]): { chars: string; score: number }[] {
    if (arrays.length === 0) return [];
    return arrays
      .reduce<{ chars: string; score: number }[]>(
        (acc, arr) => {
          if (acc.length === 0) return arr.map((c) => ({ chars: c.char, score: c.freq }));
          return acc.flatMap((prev) =>
            arr.map((c) => ({ chars: prev.chars + c.char, score: prev.score * c.freq }))
          );
        },
        []
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }

  const givenCombinations = cartesian(givenCandidatesByPart);

  const results: { name: string; surname: string; given: string; score: number }[] = [];
  for (const s of surnameCandidates.slice(0, 5)) {
    for (const g of givenCombinations.slice(0, 8)) {
      results.push({
        name: s.char + g.chars,
        surname: s.char,
        given: g.chars,
        score: s.freq * g.score,
      });
    }
  }
  results.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    input: raw,
    surnamePinyin: surnamePy,
    givenPinyin: givenParts.join(' '),
    surnameCandidates,
    givenCombinations: givenCombinations.slice(0, 10),
    topResults: results.slice(0, 20),
  });
}
