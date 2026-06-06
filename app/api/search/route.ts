import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function isChinese(str: string) {
  return /[一-鿿]/.test(str);
}

// 内存缓存：同一 function 实例内命中直接返回
const cache = new Map<string, { rows: unknown[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const type = searchParams.get("type") ?? "all";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const cacheKey = `${q}|${type}|${limit}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return NextResponse.json(hit.rows, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  }

  const searchChinese = isChinese(q);
  const col = searchChinese ? "chinese" : "english";
  // persons 用前缀（67万，防全表扫）；places 英文用包含（命中"Tōkyō(Tokyo)"括注里的 ASCII 形）
  const personPattern = `${q}%`;
  const placePattern = searchChinese ? `${q}%` : `%${q}%`;

  // chinese 含标点 = 释义注（如"男子教名,亦作姓用"），排到最后
  const NOTE_PENALTY = `CASE WHEN chinese LIKE '%,%' OR chinese LIKE '%，%' OR chinese LIKE '%、%' OR chinese LIKE '%;%' OR chinese LIKE '%；%' OR chinese LIKE '%。%' THEN 1 ELSE 0 END`;
  // 拉丁名优先"英语读法"（nationality 含 英），如 Smith 优先 史密斯 而非 斯米特
  const ENGLISH_PREF = searchChinese ? "0" : `CASE WHEN nationality LIKE '%英%' THEN 0 ELSE 1 END`;

  const halfLimit = Math.ceil(limit / 2);

  const [personRows, placeRows] = await Promise.all([
    type === "all" || type === "person"
      ? db.execute({
          sql: `SELECT english, nationality, chinese, has_note, 'person' as type
                FROM persons
                WHERE ${col} LIKE ?
                ORDER BY CASE WHEN ${col} = ? THEN 0 ELSE 1 END,
                         ${NOTE_PENALTY},
                         ${ENGLISH_PREF},
                         length(${col})
                LIMIT ?`,
          args: [personPattern, q, type === "all" ? halfLimit : limit],
        })
      : Promise.resolve({ rows: [] }),
    type === "all" || type === "place"
      ? db.execute({
          sql: `SELECT english, nationality, chinese, is_crossref, 'place' as type
                FROM places
                WHERE ${col} LIKE ?
                ORDER BY is_crossref,
                         CASE WHEN ${col} = ? THEN 0 ELSE 1 END,
                         ${NOTE_PENALTY},
                         length(${col})
                LIMIT ?`,
          args: [placePattern, q, type === "all" ? halfLimit : limit],
        })
      : Promise.resolve({ rows: [] }),
  ]);

  const results = [...personRows.rows, ...placeRows.rows];
  cache.set(cacheKey, { rows: results, ts: Date.now() });

  return NextResponse.json(results, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
