import { NextRequest, NextResponse } from 'next/server';
import { transliterate } from '@/lib/transliterate';
import { readdirSync } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const lang = req.nextUrl.searchParams.get('lang') ?? '';
  const type = (req.nextUrl.searchParams.get('type') ?? 'person') as 'person' | 'place';

  if (!q || !lang) {
    return NextResponse.json({ error: 'missing q or lang' }, { status: 400 });
  }

  const result = transliterate(q, lang, type);
  return NextResponse.json(result);
}

export async function POST() {
  const dir = path.join(process.cwd(), 'data', 'transliteration');
  try {
    const files = readdirSync(dir).filter(f => f.endsWith('.json'));
    const langs = files.map(f => f.replace('.json', ''));
    return NextResponse.json(langs);
  } catch {
    return NextResponse.json([]);
  }
}
