import { NextRequest, NextResponse } from 'next/server';
import { getAllGroups } from '@/lib/ruCelebrities';

// 在俄语名人库（celebrity_groups）里搜，返回匹配的人 + 其所属姓的 slug。
// 用于 /ru 搜索结果下方「叫这个名字的名人」——数据与独立页一致，卡片可点击跳转。

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json([]);
  const ql = q.toLowerCase();

  const results: {
    zh: string; ru: string; gender: string; bio: string; slug: string; surname: string;
  }[] = [];

  for (const g of getAllGroups()) {
    // 组级匹配：俄文姓 / 中文姓 / 拉丁 slug 含 q
    const groupMatch =
      g.ruSurname.toLowerCase().includes(ql) ||
      g.surname.includes(q) ||
      g.slug.includes(ql);
    for (const p of g.people) {
      const personMatch = p.ru.includes(q) || p.zh.includes(q);
      if (groupMatch || personMatch) {
        results.push({
          zh: p.zh, ru: p.ru, gender: p.gender, bio: p.bio,
          slug: g.slug, surname: g.surname,
        });
      }
    }
    if (results.length >= 40) break;
  }

  // 去重（同一人可能多次命中）+ 取前 8
  const seen = new Set<string>();
  const unique = results.filter((r) => {
    const k = r.zh + r.ru;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, 8);

  return NextResponse.json(unique, {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
  });
}
