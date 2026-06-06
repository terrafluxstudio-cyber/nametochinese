import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('lang')?.trim() ?? '';
  if (!lang) return NextResponse.json(null);

  const filePath = path.join(process.cwd(), 'data', 'transliteration', `${lang}.json`);
  if (!existsSync(filePath)) return NextResponse.json(null);

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf8'));
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    });
  } catch {
    return NextResponse.json(null);
  }
}
