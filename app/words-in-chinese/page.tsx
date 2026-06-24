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

        <section className="mt-14 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <p className="font-semibold text-gray-800 mb-1">Why are Chinese characters popular for tattoos and art?</p>
              <p>Chinese characters (汉字) are visually striking — each is a compact pictographic unit that can express in one symbol what takes several words in English. A single character like 龙 (dragon) or 福 (blessing) carries centuries of cultural resonance.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Are these simplified or traditional Chinese characters?</p>
              <p>All characters here use <strong>Simplified Chinese</strong> — the standard script used in mainland China and Singapore. Traditional characters (used in Taiwan and Hong Kong) are written differently but share the same pronunciation and meaning. Each word page shows both forms where they differ.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">How do I know which characters to use for a concept?</p>
              <p>Many concepts have multiple Chinese expressions with subtle differences. For example, &quot;love&quot; can be 爱 (general love), 爱情 (romantic love), or 仁 (benevolent love in Confucian ethics). Each entry here uses the most widely recognized, broadly applicable translation.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Can I combine characters to make a phrase?</p>
              <p>Yes — Chinese lends itself to elegant two- and four-character combinations. Common pairings like 龙凤 (dragon-phoenix) or 平安 (peace and safety) carry meanings greater than the sum of their parts. Ask a native speaker before using any combination in permanent art.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
