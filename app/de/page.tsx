import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import { Suspense } from 'react';
import DeSearchClient from './DeSearchClient';

export const metadata: Metadata = {
  title: '德语人名查询 — 德文姓名中文译名 | NameToChinese',
  description: '查询德语、奥地利、瑞士人名的中文标准译名，涵盖政治人物、科学家、音乐家、运动员等数千条。',
  alternates: { canonical: '/de' },
};

export default function DePage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
          德语人名查询
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          德文姓名 ↔ 中文译名 · 涵盖德国、奥地利、瑞士名人
        </p>

        <div className="flex items-center justify-center gap-3 mb-8 text-xs text-gray-400">
          <a href="/ru" className="hover:text-gray-600">俄语</a>
          <span>·</span>
          <a href="/ko" className="hover:text-gray-600">韩语</a>
          <span>·</span>
          <a href="/ja" className="hover:text-gray-600">日语</a>
          <span>·</span>
          <span className="text-gray-500 font-medium">德语</span>
          <span>·</span>
          <a href="/fr" className="hover:text-gray-600">法语</a>
          <span>·</span>
          <a href="/vi" className="hover:text-gray-600">越南语</a>
          <span>·</span>
          <a href="/ar" className="hover:text-gray-600">阿拉伯语</a>
        </div>

        <Suspense fallback={null}>
          <DeSearchClient />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
