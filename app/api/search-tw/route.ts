import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function isChinese(str: string) {
  return /[一-鿿]/.test(str);
}

const cache = new Map<string, { rows: unknown[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

// 将内部 lang 标签合并为简洁语种标签
const LANG_DISPLAY: Record<string, string> = {
  英語: "英", 英語姓氏: "英", 諾貝爾英語: "英",
  德語: "德", 德語姓氏: "德", 諾貝爾德語: "德",
  法語: "法", 法語姓氏: "法", 諾貝爾法語: "法",
  斯拉夫語: "斯拉夫", 諾貝爾斯拉夫語: "斯拉夫",
  義語: "義(意)", 義語姓氏: "義(意)", 諾貝爾義語: "義(意)",
  西語: "西", 西語姓氏: "西",
  日韓語: "日韓",
  阿拉伯語: "阿拉伯", 阿拉伯語學者: "阿拉伯",
  土耳其語: "土耳其",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 1) return NextResponse.json([]);

  const hit = cache.get(q);
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return NextResponse.json(hit.rows, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    });
  }

  const searchChinese = isChinese(q);
  const col = searchChinese ? "zh" : "en";

  const { rows } = await db.execute({
    sql: `SELECT en, zh, lang FROM naer_names
          WHERE UPPER(${col}) LIKE UPPER(?)
          ORDER BY CASE WHEN UPPER(${col}) = UPPER(?) THEN 0 ELSE 1 END,
                   length(${col})
          LIMIT 40`,
    args: [`${q}%`, q],
  });

  const result = rows.map((r) => ({
    en: r.en,
    zh: r.zh,
    langDisplay: LANG_DISPLAY[(r.lang as string)] ?? (r.lang as string),
  }));

  cache.set(q, { rows: result, ts: Date.now() });
  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
