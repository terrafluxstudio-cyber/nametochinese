import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import { getAllWords } from '@/lib/englishWords';

const SITE = 'https://nametochinese.com';
const ACCENT = '#2C5F8A';

export const metadata: Metadata = {
  title: 'English Words in Chinese — Meanings, Characters & Pinyin',
  description:
    'Common English words written in Chinese, with characters, pinyin pronunciation and meaning. Popular words for tattoos, art and names — love, dragon, strength, peace and more.',
  alternates: { canonical: '/words-in-chinese' },
  openGraph: {
    title: 'English Words in Chinese',
    description:
      'Common English words in Chinese — characters, pinyin and meaning. Love, dragon, strength, peace and more.',
    url: `${SITE}/words-in-chinese`,
    type: 'website',
  },
};

export default function WordsIndexPage() {
  const words = getAllWords();
  const byCat = new Map<string, typeof words>();
  for (const w of words) {
    if (!byCat.has(w.category)) byCat.set(w.category, []);
    byCat.get(w.category)!.push(w);
  }
  const cats = [...byCat.keys()];

  return (
    <>
      <NavBar />
      <main
        className="min-h-screen px-4 py-12 max-w-3xl mx-auto"
        style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
            English Words in Chinese
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Meaningful words written in Chinese — popular for tattoos, art and names.
            Tap a word for its character, pinyin and meaning.
          </p>
        </div>

        {cats.map((cat) => (
          <section key={cat} className="mb-8">
            <p
              className="text-sm font-bold mb-3 pb-1 border-b"
              style={{ color: ACCENT, borderColor: '#E5E7EB' }}
            >
              {cat}
            </p>
            <div className="flex flex-wrap gap-2">
              {byCat.get(cat)!.map((w) => (
                <Link
                  key={w.slug}
                  href={`/${w.slug}`}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{ background: '#fff', color: '#374151', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <span style={{ color: '#1A1A1A' }}>{w.word}</span>
                  <span className="text-gray-400"> · {w.zh}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-10 text-center">
          <Link
            href="/names-in-chinese"
            className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: ACCENT, color: '#fff' }}
          >
            Looking for a name instead? →
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
