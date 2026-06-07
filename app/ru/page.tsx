import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SearchTabs from '@/components/SearchTabs';
import SiteFooter from '@/components/SiteFooter';
import { Suspense } from 'react';
import RuSearchClient from './RuSearchClient';

export default function RuPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
          俄语人名查询
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">俄文姓名逐词直译 · 输入即查中文</p>
        <SearchTabs current="ru" />
        <Suspense fallback={null}>
          <RuSearchClient />
        </Suspense>

        {/* 名人索引入口 */}
        <div className="mt-10 text-center">
          <Link
            href="/ru/names"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: '#fff', color: '#2C5F8A', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}
          >
            浏览俄语名人中文译名（普京·托尔斯泰·加加林…）→
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
