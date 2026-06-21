import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import { ARTICLES, ARTICLE_SLUGS } from '../content';

const SITE = 'https://nametochinese.com';

// 该语言若有专门人名库，导流钩子直链过去（比通用主搜更相关）
const PEOPLE_LIB: Record<string, { href: string; label: string }> = {
  russian: { href: '/ru', label: '俄语人名专库' },
  japanese: { href: '/ja', label: '日本人名专库' },
  korean: { href: '/ko', label: '韩国人名专库' },
};

// 该语言若有音译表，/convert 预选对应语言（langFile 用繁体键名）
const CONVERT_LANG: Record<string, string> = {
  spanish: '西班牙語', portuguese: '葡萄牙語', russian: '俄語', arabic: '阿拉伯語',
  german: '德語', french: '法語', thai: '泰語', hungarian: '匈牙利語',
  icelandic: '冰島語', burmese: '緬甸語',
  dutch: '荷蘭語', turkish: '土耳其語', swedish: '瑞典語',
};

export const dynamicParams = false; // 只生成已写好的语言，其余 404

export function generateStaticParams() {
  return ARTICLE_SLUGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const a = ARTICLES[lang];
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: `/naming-rules/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.description,
      url: `${SITE}/naming-rules/${a.slug}`,
      type: 'article',
    },
  };
}

export default async function NamingRuleLangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const a = ARTICLES[lang];
  if (!a) notFound();

  // 结构化数据：Article + FAQPage + 面包屑
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: a.h1,
        description: a.description,
        inLanguage: 'zh-CN',
        mainEntityOfPage: `${SITE}/naming-rules/${a.slug}`,
        datePublished: '2026-06-06',
        dateModified: '2026-06-21',
        author: { '@type': 'Organization', name: '外文译名词典', url: SITE },
        publisher: { '@type': 'Organization', name: '外文译名词典', url: SITE },
      },
      {
        '@type': 'FAQPage',
        mainEntity: a.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首页', item: SITE },
          { '@type': 'ListItem', position: 2, name: '各语言人名规则', item: `${SITE}/naming-rules` },
          { '@type': 'ListItem', position: 3, name: a.lang, item: `${SITE}/naming-rules/${a.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        className="min-h-screen px-4 py-12 max-w-3xl mx-auto"
        style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
      >
        {/* 面包屑 */}
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">首页</Link>
          <span className="mx-1.5">/</span>
          <Link href="/naming-rules" className="hover:text-gray-600">各语言人名规则</Link>
          <span className="mx-1.5">/</span>
          <span className="text-gray-500">{a.lang}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
            {a.h1}
          </h1>
          <p className="text-sm text-gray-400">{a.region}</p>
        </header>

        {/* 开篇 */}
        <div className="space-y-4 mb-10">
          {a.intro.map((p, i) => (
            <p key={i} className="text-base leading-relaxed" style={{ color: '#374151' }}>
              {p}
            </p>
          ))}
        </div>

        {/* 正文各段 */}
        <article className="space-y-10">
          {a.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
                {s.heading}
              </h2>
              <div className="space-y-3">
                {s.body.map((p, j) => (
                  <p key={j} className="text-base leading-relaxed" style={{ color: '#374151' }}>
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
            常见问题
          </h2>
          <div className="space-y-4">
            {a.faq.map((f, i) => (
              <div
                key={i}
                className="rounded-xl px-5 py-4"
                style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              >
                <p className="text-sm font-semibold mb-1.5" style={{ color: '#2C5F8A' }}>
                  {f.q}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 导流钩子：把读规则的人引向工具 */}
        <section className="mt-12 rounded-2xl px-6 py-6" style={{ background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#1A1A1A' }}>
            查 {a.lang} 人名的中文译名
          </p>
          <div className="flex flex-wrap gap-3">
            {PEOPLE_LIB[a.slug] && (
              <Link
                href={PEOPLE_LIB[a.slug].href}
                className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ background: '#2C5F8A' }}
              >
                {PEOPLE_LIB[a.slug].label} →
              </Link>
            )}
            <Link
              href="/search"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: PEOPLE_LIB[a.slug] ? '#5B7A99' : '#2C5F8A' }}
            >
              查既定译名（人名·地名）→
            </Link>
            <Link
              href={CONVERT_LANG[a.slug] ? `/convert?lang=${encodeURIComponent(CONVERT_LANG[a.slug])}` : '/convert'}
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#EBF3FA', color: '#2C5F8A' }}
            >
              按{a.lang}规则音译 →
            </Link>
          </div>
        </section>

        {/* 其他语言 */}
        <nav className="mt-10 text-sm">
          <p className="text-gray-400 mb-2">其他语言人名规则：</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {ARTICLE_SLUGS.filter((s) => s !== a.slug).map((s) => (
              <Link key={s} href={`/naming-rules/${s}`} className="hover:underline" style={{ color: '#2C5F8A' }}>
                {ARTICLES[s].lang}
              </Link>
            ))}
            <Link href="/naming-rules" className="hover:underline text-gray-400">
              查看全部 →
            </Link>
          </div>
        </nav>

        {/* 相关工具 */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/gov-titles"
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ background: '#F0F5FA', color: '#2C5F8A' }}>
            机构与官员职位翻译 →
          </Link>
          <Link href="/search"
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ background: '#F0F5FA', color: '#2C5F8A' }}>
            查既定译名（辞典）→
          </Link>
        </div>

        <p className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-300">
          内容依据语言学规律整理，译名标准参照新华社姓名译名手册，仅供翻译参考
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
