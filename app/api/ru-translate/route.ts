import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ruToZh, zhToRu } from '@/lib/ruDict';
import { latinToCyrillic } from '@/lib/transliterate';

type Tok = {
  input: string;
  zh: string; // 主中文（多读音用 / 连）
  source: 'dict' | 'db' | 'none';
};

const hasHan = (s: string) => /[一-鿿]/.test(s);
const hasCyr = (s: string) => /[А-Яа-яЁёЀ-ӿ]/.test(s);
const isLatin = (s: string) => /^[A-Za-z'’.\-]+$/.test(s);

const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 5 * 60 * 1000;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!q) return NextResponse.json({ tokens: [] });

  const hit = cache.get(q);
  if (hit && Date.now() - hit.ts < TTL) {
    return NextResponse.json(hit.data, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    });
  }

  // 按空白切词，保留原词
  const rawTokens = q.split(/\s+/).filter(Boolean);
  const tokens: (Tok | null)[] = new Array(rawTokens.length).fill(null);
  const dbMissIdx: number[] = []; // 需 DB 兜底的西里尔词下标
  const dbMissTokens: string[] = [];

  rawTokens.forEach((t, i) => {
    const bare = t.replace(/^[「『"'(（]+|[」』"'.)）,，、]+$/g, '') || t;

    if (hasHan(bare)) {
      const ru = zhToRu(bare);
      if (ru) tokens[i] = { input: t, zh: ru.join('/'), source: 'dict' };
      else {
        dbMissIdx.push(i);
        dbMissTokens.push(bare);
        tokens[i] = { input: t, zh: '', source: 'none' };
      }
      return;
    }

    let cyr = bare;
    if (!hasCyr(bare) && isLatin(bare)) cyr = latinToCyrillic(bare); // 拉丁→西里尔再查

    if (hasCyr(cyr)) {
      const zh = ruToZh(cyr);
      if (zh) {
        tokens[i] = { input: t, zh: zh.join('/'), source: 'dict' };
      } else {
        dbMissIdx.push(i);
        dbMissTokens.push(cyr);
        tokens[i] = { input: t, zh: '', source: 'none' };
      }
      return;
    }

    tokens[i] = { input: t, zh: '', source: 'none' };
  });

  // DB 兜底（现有 russian_names 含姓氏/名人，如 Путин→普京）。一次批量查。
  if (dbMissTokens.length) {
    try {
      const lowered = dbMissTokens.map((s) => s.toLowerCase());
      const placeholders = lowered.map(() => '?').join(',');
      // 俄文精确（含 chinese 反查）
      const res = await db.execute({
        sql: `SELECT russian, chinese FROM russian_names
              WHERE lower(russian) IN (${placeholders}) OR chinese IN (${placeholders})`,
        args: [...lowered, ...dbMissTokens],
      });
      const ru2zh = new Map<string, string>();
      const zh2ru = new Map<string, string>();
      for (const row of res.rows as unknown as { russian: string; chinese: string }[]) {
        if (!ru2zh.has(row.russian.toLowerCase())) ru2zh.set(row.russian.toLowerCase(), row.chinese);
        if (!zh2ru.has(row.chinese)) zh2ru.set(row.chinese, row.russian);
      }
      dbMissIdx.forEach((idx, k) => {
        const tk = dbMissTokens[k];
        const tok = tokens[idx]!;
        if (hasHan(tk)) {
          const r = zh2ru.get(tk);
          if (r) { tok.zh = r; tok.source = 'db'; }
        } else {
          const z = ru2zh.get(tk.toLowerCase());
          if (z) { tok.zh = z; tok.source = 'db'; }
        }
      });
    } catch {
      /* DB 不可用则跳过，走音译 */
    }
  }

  // 未命中的词不再内联音译兜底（标"推测"已移除）。前端给"跳音译表"选项。
  const data = { tokens };
  cache.set(q, { data, ts: Date.now() });
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
