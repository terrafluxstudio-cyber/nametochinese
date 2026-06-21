import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

// 版权/出处行：含书名号、ISBN、辞典/词典、出版社、译名室等的行，服务端即剥离，不外发
const CITATION_RE = /《|》|ISBN|大辞典|大辭典|新华|新華|译名室|譯名室|商务|商務|词典|詞典|对外翻译|對外翻譯|译名手册|譯名手冊/;

function stripCitations(note: unknown): string {
  if (typeof note !== 'string') return '';
  return note
    .split('\n')
    .filter((l) => !CITATION_RE.test(l))
    .join('\n');
}

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('lang')?.trim() ?? '';
  if (!lang) return NextResponse.json(null);

  const filePath = path.join(process.cwd(), 'data', 'transliteration', `${lang}.json`);
  if (!existsSync(filePath)) return NextResponse.json(null);

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf8'));
    if (data && typeof data === 'object' && 'raw_note' in data) {
      (data as { raw_note?: unknown }).raw_note = stripCitations(
        (data as { raw_note?: unknown }).raw_note
      );
    }
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    });
  } catch {
    return NextResponse.json(null);
  }
}
