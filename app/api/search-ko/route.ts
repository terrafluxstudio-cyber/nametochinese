import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isChinese(s: string) { return /[一-鿿]/.test(s); }
function isKorean(s: string) { return /[가-힯]/.test(s); }

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

  let col: string;
  if (isKorean(q)) col = 'korean';
  else if (isChinese(q)) col = 'chinese';
  else col = 'english';

  // 罗马音：去连字符+小写规范化（库里存 "Seo-Jun"，用户打 "Seojun"/"seojun" 都要命中）
  const isRomaji = col === 'english';
  const matchCol = isRomaji ? `REPLACE(LOWER(english),'-','')` : col;
  const qn = isRomaji ? q.toLowerCase().replace(/-/g, '') : q;
  // 韩文/中文用前缀匹配；罗马音用包含匹配（搜姓 Moon 命中 Moon Jae-in）
  const pattern = isRomaji ? `%${qn}%` : `${qn}%`;
  let sql = `SELECT korean, chinese, english, gender FROM korean_names WHERE ${matchCol} LIKE ?`;
  const args: (string | number)[] = [pattern];

  if (gender === 'M' || gender === 'F') {
    sql += ' AND gender = ?';
    args.push(gender);
  }

  // 精确=0，前缀=1，其余=2
  sql += ` ORDER BY CASE WHEN ${matchCol} = ? THEN 0 WHEN ${matchCol} LIKE ? THEN 1 ELSE 2 END, length(${col}) LIMIT 30`;
  args.push(qn, `${qn}%`);

  const result = await db.execute({ sql, args });
  cache.set(cacheKey, { rows: result.rows, ts: Date.now() });
  return NextResponse.json(result.rows, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
