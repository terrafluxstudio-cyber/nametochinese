import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import { getAllNames } from '@/lib/englishNames';

const SITE = 'https://nametochinese.com';
const ACCENT = '#2C5F8A';

export const metadata: Metadata = {
  title: 'English Names in Chinese — Full List with Pinyin & Meaning',
  description:
    'Browse common English first names written in Chinese, with pinyin pronunciation, origin and meaning. Find how your name is spelled in Mandarin.',
  alternates: { canonical: '/names-in-chinese' },
  openGraph: {
    title: 'English Names in Chinese — Full List',
    description:
      'Common English first names in Chinese, with pinyin, origin and meaning.',
    url: `${SITE}/names-in-chinese`,
    type: 'website',
  },
};

export default function NamesIndexPage() {
  const names = getAllNames();
  const byLetter = new Map<string, typeof names>();
  for (const n of names) {
    const L = n.name[0].toUpperCase();
    if (!byLetter.has(L)) byLetter.set(L, []);
    byLetter.get(L)!.push(n);
  }
  const letters = [...byLetter.keys()].sort();

  return (
    <>
      <NavBar />
      <main
        className="min-h-screen px-4 py-12 max-w-3xl mx-auto"
        style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
            English Names in Chinese
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            How common English first names are written and pronounced in Chinese.
            Tap a name for its characters, pinyin, origin and meaning.
          </p>
        </div>

        {letters.map((L) => (
          <section key={L} className="mb-8">
            <p
              className="text-sm font-bold mb-3 pb-1 border-b"
              style={{ color: ACCENT, borderColor: '#E5E7EB' }}
            >
              {L}
            </p>
            <div className="flex flex-wrap gap-2">
              {byLetter.get(L)!.map((n) => (
                <Link
                  key={n.slug}
                  href={`/${n.slug}`}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{ background: '#fff', color: '#374151', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <span style={{ color: '#1A1A1A' }}>{n.name}</span>
                  <span className="text-gray-400"> · {n.zh}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-10 text-center space-y-3">
          <Link
            href={`/convert?lang=${encodeURIComponent('英語')}`}
            className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: ACCENT, color: '#fff' }}
          >
            Translate a name not listed →
          </Link>
          <p className="text-sm">
            <Link href="/words-in-chinese" className="underline" style={{ color: ACCENT }}>
              Or browse meaningful words in Chinese →
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
