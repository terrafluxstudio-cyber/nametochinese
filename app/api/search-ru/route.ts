import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isChinese(s: string) {
  return /[一-鿿]/.test(s);
}

const cache = new Map<string, { rows: unknown[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const gender = req.nextUrl.searchParams.get('gender') ?? '';

  if (q.length < 1) return NextResponse.json([]);

  const cacheKey = `${q}|${gender}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return NextResponse.json(hit.rows, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    });
  }

  const col = isChinese(q) ? 'chinese' : 'russian';
  // 西里尔用包含匹配，支持搜姓（Путин）命中全名（Владимир Путин）
  const pattern = isChinese(q) ? `${q}%` : `%${q}%`;

  let sql = `SELECT russian, chinese, gender, patronymic_ru, patronymic_zh, nicknames
             FROM russian_names WHERE ${col} LIKE ?`;
  const args: (string | number)[] = [pattern];

  if (gender === 'M' || gender === 'F') {
    sql += ' AND gender = ?';
    args.push(gender);
  }

  // 精确全名=0，starts-with=1，其余=2；再按长度升序
  sql += ` ORDER BY CASE WHEN ${col} = ? THEN 0 WHEN ${col} LIKE ? THEN 1 ELSE 2 END, length(${col}) LIMIT 30`;
  args.push(q, `${q}%`);

  const result = await db.execute({ sql, args });
  cache.set(cacheKey, { rows: result.rows, ts: Date.now() });
  return NextResponse.json(result.rows, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
