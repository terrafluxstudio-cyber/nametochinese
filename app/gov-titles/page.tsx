import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import GovTitlesClient from './GovTitlesClient';
import { TERMS } from './data';

const SITE = 'https://nametochinese.com';

export const metadata: Metadata = {
  title: '机构与官员职位中英对照表（中国·国际·各国）| 外文译名词典',
  description:
    '机构名称与官员职位的官方标准中英对照：中国党政机构、行政区划、官员职位，以及联合国系统、世卫组织、美国国务院等国际与各国主要机构。权威译法，供翻译、外事、MTI/CATTI 备考参考。',
  keywords: [
    '机构名称翻译',
    '官员职位翻译',
    '发改委 英文',
    '国务院 英文',
    '联合国机构 中文',
    '世界卫生组织 英文',
    '美国国务院 翻译',
    '机构中英对照',
  ],
  alternates: { canonical: '/gov-titles' },
  openGraph: {
    title: '机构与官员职位中英对照 | 外文译名词典',
    description: '中国党政机构、联合国系统、各国主要机构与官员职位的官方标准中英对照，555条，供翻译·外事·MTI/CATTI参考。',
    url: 'https://nametochinese.com/gov-titles',
    type: 'website',
  },
  twitter: { card: 'summary', title: '机构与官员职位中英对照 · 外文译名词典', description: '555条官方标准译法：中国党政机构、联合国、各国机构职位。' },
};

export default function GovTitlesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': `${SITE}/gov-titles#termset`,
    name: '机构与官员职位中英对照表',
    description:
      '机构名称与官员职位的官方标准中英对照：中国党政机构、行政区划、官员职位，以及联合国系统与各国主要机构。',
    inLanguage: 'zh-CN',
    url: `${SITE}/gov-titles`,
    hasDefinedTerm: TERMS.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.zh,
      description: t.abbr ? `${t.en}（${t.abbr}）` : t.en,
      ...(t.abbr ? { termCode: t.abbr } : {}),
      inDefinedTermSet: `${SITE}/gov-titles#termset`,
    })),
  };

  return (
    <>
      <NavBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen px-4 py-10 max-w-3xl mx-auto" style={{ background: '#F7F5F0' }}>
        <header className="mb-2">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}>
            机构与官员职位 · 中英对照
          </h1>
          <p className="text-sm text-gray-500">
            官方标准译法：中国党政机构、行政区划、官员职位，以及联合国系统与各国主要机构。
          </p>
        </header>

        <GovTitlesClient />

        <p className="mt-10 text-center text-sm text-gray-400">
          先读：<Link href="/gov-titles-guide" className="underline" style={{ color: '#2C5F8A' }}>机构与职位翻译规范</Link>
          {' · '}
          <Link href="/search" className="underline" style={{ color: '#2C5F8A' }}>人名·地名译名</Link>
          {' · '}
          <Link href="/naming-rules" className="underline" style={{ color: '#2C5F8A' }}>各国人名规则</Link>
          {' · '}
          <Link href="/convert" className="underline" style={{ color: '#2C5F8A' }}>外文名音译引擎</Link>
        </p>
        <footer className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-300">
          译法来源：中国政府网英文版（english.www.gov.cn）等官方发布。持续补充中，以官方最新译法为准。
        </footer>
      </main>
      <SiteFooter />
    </>
  );
}
