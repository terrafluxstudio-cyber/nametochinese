import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import { Suspense } from 'react';
import PlacesSearchClient from './PlacesSearchClient';

export const metadata = {
  title: '地名查译',
  description: '收录 17 万地名词条，英文地名与中文译名双向查询。输入英文或中文均可。',
  keywords: ['地名翻译', '英文地名 中文', '外国地名译名', '地名中英对照', '地名查询'],
  alternates: { canonical: '/places' },
  openGraph: {
    title: '外国地名查译 | 外文译名词典',
    description: '收录17万地名词条，英文地名与中文译名双向查询，专为翻译工作者设计。',
    url: 'https://nametochinese.com/places',
    type: 'website',
  },
  twitter: { card: 'summary', title: '外国地名查译 · 外文译名词典', description: '17万地名词条，英文地名↔中文译名双向查询。' },
};

export default function PlacesPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
          地名查译
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          输入英文地名或中文译名，双向查询
        </p>
        <Suspense fallback={null}>
          <PlacesSearchClient />
        </Suspense>
        <p className="mt-10 text-center text-sm text-gray-400">
          先读：<Link href="/place-names-guide" className="underline" style={{ color: '#2C5F8A' }}>外国地名翻译规则</Link>
          {' · '}
          <Link href="/naming-rules/general" className="underline" style={{ color: '#2C5F8A' }}>人名音译总则</Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
