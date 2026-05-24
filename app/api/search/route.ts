import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function isChinese(str: string) {
  return /[一-鿿]/.test(str);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const type = searchParams.get("type") ?? "all";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const searchChinese = isChinese(q);
  const col = searchChinese ? "chinese" : "english";
  const pattern = `${q}%`;

  const results: unknown[] = [];

  if (type === "all" || type === "person") {
    const rows = await db.execute({
      sql: `SELECT english, nationality, chinese, has_note, 'person' as type
            FROM persons
            WHERE ${col} LIKE ?
            ORDER BY CASE WHEN ${col} = ? THEN 0 ELSE 1 END, length(${col})
            LIMIT ?`,
      args: [pattern, q, type === "all" ? Math.ceil(limit / 2) : limit],
    });
    results.push(...rows.rows);
  }

  if (type === "all" || type === "place") {
    const rows = await db.execute({
      sql: `SELECT english, nationality, chinese, is_crossref, 'place' as type
            FROM places
            WHERE ${col} LIKE ?
            ORDER BY CASE WHEN ${col} = ? THEN 0 ELSE 1 END, length(${col})
            LIMIT ?`,
      args: [pattern, q, type === "all" ? Math.ceil(limit / 2) : limit],
    });
    results.push(...rows.rows);
  }

  return NextResponse.json(results);
}
