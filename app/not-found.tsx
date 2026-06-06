import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import MiniGame from '@/components/games/MiniGame';

export default function NotFound() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-20 max-w-2xl mx-auto text-center" style={{ background: '#F7F5F0' }}>
        <h1 className="text-5xl font-bold mb-3" style={{ color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}>
          404
        </h1>
        <p className="text-gray-500 mb-2">这个页面走丢了。</p>
        <p className="text-sm text-gray-400 mb-6">
          回{' '}
          <Link href="/" className="underline" style={{ color: '#2C5F8A' }}>
            首页
          </Link>{' '}
          查译名，或在这儿等会儿——
        </p>
        <MiniGame />
      </main>
      <SiteFooter />
    </>
  );
}
