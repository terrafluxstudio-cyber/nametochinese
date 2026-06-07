import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import { getAllSlugs, getGroupBySlug, type Person } from '@/lib/ruCelebrities';

const SITE = 'https://nametochinese.com';
const ACCENT = '#2C5F8A';

export const dynamicParams = false; // 只生成已有数据的姓，其余 404

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGroupBySlug(slug);
  if (!g) return {};
  const names = g.people.slice(0, 3).map((p) => p.zh).join('、');
  // 标题含中文+俄文+拉丁，覆盖三种搜索意图
  const title = `${g.surname} ${g.ruSurname}（${g.ruSurname[0] && g.slug}）俄语姓氏中文译名 — 叫这个名字的名人`;
  const desc =
    g.count > 1
      ? `俄语姓氏 ${g.ruSurname}（${g.surname}）的中文译名与 ${g.count} 位同姓名人：${names}等。含中文译名、生卒年、简介与维基百科链接。`
      : `俄语姓氏 ${g.ruSurname}（${g.surname}）的中文译名：${names}。含俄文原名、生卒年、身份简介与维基百科链接。`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/ru/name/${g.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${SITE}/ru/name/${g.slug}`,
      type: 'website',
    },
  };
}

function lifespan(p: Person): string {
  if (p.birth && p.death) return `${p.birth}–${p.death}`;
  if (p.birth) return `${p.birth}— `;
  if (p.death) return `?–${p.death}`;
  return '';
}

export default async function RuNamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = getGroupBySlug(slug);
  if (!g) notFound();

  // ItemList 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `叫「${g.surname}」的俄语名人`,
    numberOfItems: g.count,
    itemListElement: g.people.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: p.zh,
        alternateName: p.ru,
        description: p.bio,
        ...(p.birth ? { birthDate: String(p.birth) } : {}),
        ...(p.death ? { deathDate: String(p.death) } : {}),
        ...(p.wiki ? { sameAs: p.wiki } : {}),
      },
    })),
  };

  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        className="min-h-screen px-4 py-12 max-w-2xl mx-auto"
        style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
      >
        {/* 标题区：中文 / 俄文 / 拉丁 三语（覆盖三种搜索意图） */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
            {g.surname}
          </h1>
          <p className="text-lg" style={{ color: ACCENT }}>
            {g.ruSurname}
            <span className="text-gray-400 text-base ml-2" style={{ fontFamily: 'Georgia, serif' }}>
              {g.slug.replace(/-\d+$/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            俄语姓氏 · {g.count > 1 ? `${g.count} 位同姓名人` : '名人'}
          </p>
        </div>

        {/* 译写说明 */}
        <div
          className="text-sm leading-relaxed rounded-xl px-4 py-3 mb-8"
          style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', color: '#374151' }}
        >
          <b>{g.ruSurname}</b> 按俄语译音规则音译为「<b>{g.surname}</b>」。
          俄罗斯人姓名为「名·父称·姓」三段结构，下列名人的中文全名均依新华社《俄语姓名译名手册》标准译写。
        </div>

        {/* 名人列表 */}
        <p className="text-xs font-medium tracking-wide uppercase mb-3" style={{ color: '#9CA3AF' }}>
          叫「{g.surname}」的名人
        </p>
        <div className="space-y-3">
          {g.people.map((p) => (
            <div
              key={p.qid}
              className="rounded-xl px-5 py-4"
              style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-baseline gap-3 flex-wrap mb-1">
                <span className="text-xl font-medium" style={{ color: '#1A1A1A' }}>{p.zh}</span>
                {lifespan(p) && (
                  <span className="text-sm text-gray-400">{lifespan(p)}</span>
                )}
                {p.gender && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: '#E8EDF2', color: '#6B7280' }}
                  >
                    {p.gender === 'F' ? '女' : '男'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>
                {p.ru}
              </p>
              <p className="text-sm leading-relaxed mb-2" style={{ color: '#374151' }}>
                {p.bio}
              </p>
              {p.wiki && (
                <a
                  href={p.wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:underline"
                  style={{ color: ACCENT }}
                >
                  查看维基百科 →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* 返回索引 + 相关工具 */}
        <div className="mt-10 text-center">
          <Link
            href="/ru/names"
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium mb-4"
            style={{ background: '#fff', color: ACCENT, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            ← 俄语名人索引（按姓氏浏览）
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 justify-center text-sm">
          <Link href="/ru" className="underline" style={{ color: ACCENT }}>俄语人名查询</Link>
          <span className="text-gray-300">·</span>
          <Link href={`/convert?lang=${encodeURIComponent('俄語')}`} className="underline" style={{ color: ACCENT }}>俄语音译引擎</Link>
          <span className="text-gray-300">·</span>
          <Link href="/naming-rules/russian" className="underline" style={{ color: ACCENT }}>俄语人名规则</Link>
        </div>

        <p className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-300">
          人物资料来源：维基百科（Wikidata, CC0）· 译名依新华社规范，仅供参考
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
