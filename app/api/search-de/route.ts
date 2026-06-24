import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isChinese(s: string) { return /[一-鿿]/.test(s); }

const cache = new Map<string, { rows: unknown[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 1) return NextResponse.json([]);

  const hit = cache.get(q);
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return NextResponse.json(hit.rows, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    });
  }

  const col = isChinese(q) ? 'chinese' : 'german';
  const pattern = isChinese(q) ? `${q}%` : `%${q}%`;

  const sql = `SELECT german, chinese, gender FROM german_names
               WHERE ${col} LIKE ?
               ORDER BY CASE WHEN ${col} = ? THEN 0 WHEN ${col} LIKE ? THEN 1 ELSE 2 END, length(${col})
               LIMIT 30`;
  const result = await db.execute({ sql, args: [pattern, q, `${q}%`] });
  cache.set(q, { rows: result.rows, ts: Date.now() });
  return NextResponse.json(result.rows, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
