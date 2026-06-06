import NavBar from '@/components/NavBar';
import SearchTabs from '@/components/SearchTabs';
import SiteFooter from '@/components/SiteFooter';
import { Suspense } from 'react';
import KoSearchClient from './KoSearchClient';

export default function KoPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
          韩国人名查询
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          输入韩文名、中文汉字名或英文拼音
        </p>
        <SearchTabs current="ko" />
        <Suspense fallback={null}>
          <KoSearchClient />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
