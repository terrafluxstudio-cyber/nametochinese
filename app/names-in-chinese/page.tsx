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
          <p className="text-sm mt-4">
            <Link
              href="/how-to-write-your-name-in-chinese"
              className="underline"
              style={{ color: ACCENT }}
            >
              New here? Read how names are written in Chinese →
            </Link>
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

        <section className="mt-14 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#1A1A1A' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <p className="font-semibold text-gray-800 mb-1">How are English names written in Chinese?</p>
              <p>English names are transliterated — mapped sound-by-sound into Chinese characters using standardized tables (the Xinhua standard used by China&apos;s state media). Characters are chosen to approximate the original pronunciation while carrying neutral or positive meanings. Emma becomes 艾玛 (Àimǎ), James becomes 詹姆斯 (Zhānmǔsī).</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Does every English name have an &quot;official&quot; Chinese translation?</p>
              <p>Common names like Emma, James, and Sophia have widely recognized Chinese equivalents that appear consistently in books, news, and media. Less common names typically follow the phonetic rules to create a transliteration — there may be minor regional variations.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">Can I use these translations for official documents?</p>
              <p>For Chinese legal documents, passports, or contracts, the standard Xinhua transliterations are the appropriate forms. Always verify with the relevant authority, as specific contexts (e.g. Hong Kong vs mainland China) may use different conventions.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">What do the Chinese characters mean?</p>
              <p>Transliteration prioritizes <em>sound</em>, not meaning — but chosen characters are generally neutral or auspicious. Each name&apos;s page shows the individual character meanings so you can see exactly what characters were selected and why.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
