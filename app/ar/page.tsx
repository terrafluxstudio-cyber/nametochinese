import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import { Suspense } from 'react';
import ArSearchClient from './ArSearchClient';

export const metadata: Metadata = {
  title: '阿拉伯语人名查询 — 阿拉伯姓名中文译名 | NameToChinese',
  description: '查询阿拉伯语人名的中文标准译名，涵盖埃及、沙特、伊拉克、叙利亚等阿拉伯国家政治人物、历史人物等。',
  alternates: { canonical: '/ar' },
};

export default function ArPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
          阿拉伯语人名查询
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          阿拉伯语姓名 ↔ 中文译名 · 涵盖埃及、沙特、伊拉克等阿拉伯国家
        </p>

        <div className="flex items-center justify-center gap-3 mb-8 text-xs text-gray-400 flex-wrap">
          <a href="/ru" className="hover:text-gray-600">俄语</a>
          <span>·</span>
          <a href="/ko" className="hover:text-gray-600">韩语</a>
          <span>·</span>
          <a href="/ja" className="hover:text-gray-600">日语</a>
          <span>·</span>
          <a href="/de" className="hover:text-gray-600">德语</a>
          <span>·</span>
          <a href="/fr" className="hover:text-gray-600">法语</a>
          <span>·</span>
          <a href="/vi" className="hover:text-gray-600">越南语</a>
          <span>·</span>
          <span className="text-gray-500 font-medium">阿拉伯语</span>
        </div>

        <Suspense fallback={null}>
          <ArSearchClient />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
