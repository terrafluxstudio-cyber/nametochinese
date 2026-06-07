import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import { getRelatedWords, type EnglishWord } from '@/lib/englishWords';

const SITE = 'https://nametochinese.com';
const ACCENT = '#2C5F8A';

export function wordJsonLd(w: EnglishWord) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do you say "${w.word}" in Chinese?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `"${w.word}" in Chinese is ${w.zh}, pronounced ${w.pinyin} in pinyin. ${w.meaning}`,
        },
      },
      {
        '@type': 'Question',
        name: `What does ${w.zh} mean?`,
        acceptedAnswer: { '@type': 'Answer', text: w.meaning },
      },
    ],
  };
}

export default function WordInChinese({ word: w }: { word: EnglishWord }) {
  const related = getRelatedWords(w);

  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wordJsonLd(w)) }}
      />
      <main
        className="min-h-screen px-4 py-12 max-w-2xl mx-auto"
        style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
      >
        {/* 标题区 */}
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-wide text-gray-400 mb-1">
            {w.word} in Chinese
          </p>
          <h1 className="text-6xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
            {w.zh}
          </h1>
          <p className="text-xl" style={{ color: ACCENT }}>
            {w.pinyin}
          </p>
        </div>

        {/* 释义卡 */}
        <div
          className="rounded-xl px-5 py-4 mb-6"
          style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', color: '#374151' }}
        >
          <p className="text-xs font-medium tracking-wide uppercase mb-2" style={{ color: '#9CA3AF' }}>
            Meaning of {w.zh}
          </p>
          <p className="text-base leading-relaxed">{w.meaning}</p>
          {w.note && (
            <p className="text-sm leading-relaxed mt-3 pt-3 border-t border-gray-100 text-gray-500">
              {w.note}
            </p>
          )}
        </div>

        {/* 念法卡 */}
        <div
          className="rounded-xl px-5 py-4 mb-8"
          style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', color: '#374151' }}
        >
          <p className="text-base leading-relaxed">
            To say <b>{w.word}</b> in Chinese, pronounce <b style={{ color: '#1A1A1A' }}>{w.zh}</b> as{' '}
            <b>{w.pinyin}</b>. The marks over the letters show the tones — the pitch contour that
            distinguishes Mandarin syllables.
          </p>
        </div>

        {/* 相关词内链（同类别） */}
        {related.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-medium tracking-wide uppercase mb-3" style={{ color: '#9CA3AF' }}>
              More words — {w.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{ background: '#fff', color: ACCENT, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  {r.word} · {r.zh}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 索引 + 工具 */}
        <div className="flex flex-wrap gap-2 justify-center text-sm">
          <Link href="/words-in-chinese" className="underline" style={{ color: ACCENT }}>
            Browse all words
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/names-in-chinese" className="underline" style={{ color: ACCENT }}>
            Names in Chinese
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/name-to-pinyin" className="underline" style={{ color: ACCENT }}>
            Chinese name to pinyin
          </Link>
        </div>

        <p className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-300">
          Translations and notes for reference · characters in simplified Chinese
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
