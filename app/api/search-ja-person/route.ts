import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isLatin(s: string) { return /[a-zA-Z]/.test(s); }

// 罗马字归一化：去音标符 + 小写（Shinzō → shinzo）
function normRomaji(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

const cache = new Map<string, { rows: unknown[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 1) return NextResponse.json([]);

  const hit = cache.get(q);
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    const cc = hit.rows.length > 0
      ? 'public, s-maxage=86400, stale-while-revalidate=604800'
      : 'public, s-maxage=60';
    return NextResponse.json(hit.rows, { headers: { 'Cache-Control': cc } });
  }

  let sql: string;
  let args: (string | number)[];

  if (isLatin(q)) {
    // 罗马字：归一化后包含匹配（搜 Abe 命中 Shinzo Abe）
    const nq = normRomaji(q);
    sql = `SELECT japanese, chinese, romaji, gender FROM japanese_names
           WHERE romaji_norm LIKE ?
           ORDER BY CASE WHEN romaji_norm = ? THEN 0 WHEN romaji_norm LIKE ? THEN 1 ELSE 2 END,
                    length(romaji_norm) LIMIT 30`;
    args = [`%${nq}%`, nq, `${nq}%`];
  } else {
    // 汉字/中文：chinese 或 japanese 前缀匹配
    sql = `SELECT japanese, chinese, romaji, gender FROM japanese_names
           WHERE chinese LIKE ? OR japanese LIKE ?
           ORDER BY CASE WHEN chinese = ? OR japanese = ? THEN 0
                         WHEN chinese LIKE ? OR japanese LIKE ? THEN 1 ELSE 2 END,
                    length(chinese) LIMIT 30`;
    args = [`${q}%`, `${q}%`, q, q, `${q}%`, `${q}%`];
  }

  const result = await db.execute({ sql, args });
  cache.set(q, { rows: result.rows, ts: Date.now() });
  // 空结果只短缓存（数据后续会补，避免旧空结果被 CDN 锁 24h）
  const cc = result.rows.length > 0
    ? 'public, s-maxage=86400, stale-while-revalidate=604800'
    : 'public, s-maxage=60';
  return NextResponse.json(result.rows, { headers: { 'Cache-Control': cc } });
}
