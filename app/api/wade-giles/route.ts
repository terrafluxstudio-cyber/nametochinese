import { NextRequest, NextResponse } from 'next/server';
import { pinyin } from 'pinyin-pro';
import { syllableToWade, nameToWade } from '@/lib/wadeGiles';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!q) return NextResponse.json({ wade: '', chars: [] });

  // 按空格分段（多个姓名），每段独立处理
  const segments = q.split(/\s+/).filter(Boolean);
  const segWades: string[] = [];
  const chars: { char: string; pinyin: string; wade: string }[] = [];

  for (const seg of segments) {
    const cs = [...seg].filter(c => /[一-鿿]/.test(c));
    if (!cs.length) continue;
    // surname:'all' → 正确处理姓氏多音字（单 Shàn、仇 Qiú 等）
    const pys = pinyin(seg, { type: 'array', toneType: 'none', surname: 'all' })
      .filter((_, i) => /[一-鿿]/.test(seg[i] ?? ''));

    cs.forEach((ch, i) => {
      const py = (pys[i] ?? '').toLowerCase();
      chars.push({ char: ch, pinyin: py, wade: py ? syllableToWade(py) : '?' });
    });

    segWades.push(nameToWade(pys));
  }

  const wade = segWades.join(' ').trim();

  return NextResponse.json(
    { wade, chars },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  );
}
