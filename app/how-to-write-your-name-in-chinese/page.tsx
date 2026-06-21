import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';

const SITE = 'https://nametochinese.com';
const ACCENT = '#2C5F8A';

export const metadata: Metadata = {
  title: 'How to Write Your Name in Chinese — A Complete Guide',
  description:
    'A clear, practical guide to how English and other foreign names are written in Chinese: how sound-based transliteration works, why character choice matters, and the difference between a transliterated name and a real Chinese name.',
  keywords: [
    'how to write your name in chinese',
    'english name in chinese',
    'name in chinese',
    'chinese transliteration',
    'translate name to chinese',
    'what is my name in chinese',
    'foreign name in chinese',
  ],
  alternates: { canonical: '/how-to-write-your-name-in-chinese' },
  openGraph: {
    title: 'How to Write Your Name in Chinese — A Complete Guide',
    description:
      'How foreign names become Chinese: sound-based transliteration, character choice, and the difference between a transliteration and a real Chinese name.',
    url: `${SITE}/how-to-write-your-name-in-chinese`,
    type: 'article',
  },
};

type Section = { heading: string; body: React.ReactNode[] };

const SECTIONS: Section[] = [
  {
    heading: 'The one idea that explains everything: sound, not meaning',
    body: [
      'When a foreign name is written in Chinese, the characters are chosen for how they sound — not for what they mean. This is the single most important thing to understand, and it is where almost every misconception starts.',
      'English speakers often assume their name gets "translated," as if there were a Chinese word that means the same thing. There usually isn’t. Instead, each syllable of the name is matched to a Chinese character whose pronunciation is close to that syllable. The string of characters, read aloud, approximates the original name. This process is called transliteration.',
      'So "David" becomes 大卫 (Dàwèi) because dà-wèi sounds like "Dah-way" — not because 大卫 means anything related to David. The individual characters do have meanings (大 means "big," 卫 means "guard"), but those meanings are incidental. They were picked for sound first.',
    ],
  },
  {
    heading: 'How the syllable matching actually works',
    body: [
      'Mandarin is built from a fixed inventory of syllables — only around 400 distinct ones (a bit over 1,300 once you count tones). Every foreign name has to be squeezed into that inventory, which is why a Chinese version never sounds exactly like the original. It sounds like the closest available approximation.',
      'A name is broken into syllables, and each syllable is mapped to a character. "Catherine" → Kǎi-sè-lín → 凯瑟琳. "Thomas" → Tū-mǎ-sī → 托马斯. Notice "Thomas" gains a syllable: Mandarin has no standalone "s" sound at the end of a word, so the final -s becomes a full syllable 斯 (sī). That padding is normal — it is why short English names often become longer in Chinese.',
      'Sounds that don’t exist in Mandarin get substituted with the nearest match. There is no "v," so it usually becomes "w" or "f" (Victor → 维克多). There are no consonant clusters like "str" or "bl," so each consonant tends to get its own vowel. The "r" and "l" distinction, the "th" sound, and final consonants are all reshaped to fit.',
    ],
  },
  {
    heading: 'Why two people named "Michael" get the same Chinese name',
    body: [
      'Transliteration is not a free-for-all. For well-known names there is a standard, agreed-upon Chinese form, and professional translators are expected to use it rather than invent their own. Michael is 迈克尔 (Màikèʼěr); Mary is 玛丽 (Mǎlì); George is 乔治 (Qiáozhì). These are conventions, not the only phonetically possible spellings.',
      'This standardization exists so that the same foreign person is referred to consistently across newspapers, books, and official documents. If every translator spelled "Obama" differently, readers couldn’t tell they were reading about the same person. News agencies and reference dictionaries maintain official transliteration tables for exactly this reason, and serious translation work follows them.',
      'For ordinary names that have no famous bearer, translators fall back on standard syllable-to-character tables — fixed lists that say "this syllable is normally written with this character." That is what keeps results consistent even for names no dictionary has ever recorded.',
    ],
  },
  {
    heading: 'How "good" characters are chosen',
    body: [
      'Since many different characters share the same or similar pronunciation, there is room to choose. Translators don’t pick at random — they prefer characters that are neutral or pleasant and avoid ones with awkward or negative meanings, even though the meaning is technically irrelevant to the sound.',
      'Character choice is also lightly gendered. Female names often use characters with soft or graceful connotations — 萝 (lǎ, a plant), 娜 (nà, graceful), 丽 (lì, beautiful), 蕾 (lěi, flower bud). Male names lean toward characters suggesting strength or stature — 德 (dé, virtue), 克 (kè, to overcome), 伯 (bó, elder). This is why Anna becomes 安娜 rather than some other equally close-sounding combination.',
      'The same logic explains why brand and place names in Chinese can feel clever: Coca-Cola is 可口可乐 (Kěkǒu kělè, "tasty and joyful") — it sounds right and reads well. With personal names the priority is sound and neutrality first, nice meaning second.',
    ],
  },
  {
    heading: 'A transliteration is not the same as a "real" Chinese name',
    body: [
      'This trips up a lot of people, so it is worth stating plainly. A transliteration like 大卫 (David) is the standard, recognizable way to write the foreign name in Chinese script. It is what a newspaper would use, what shows up in subtitles, and what you’d want on a document that has to match your passport.',
      'A "real" Chinese name is something different: a two- or three-character name built the way Chinese names are actually built — a single-character family name followed by a one- or two-character given name, chosen for meaning and feel rather than to echo your English name. Many foreigners living in China adopt one of these for daily life. It usually sounds nothing like the original name, and that is the point.',
      'Which one you want depends on the purpose. For official, legal, or reference use — anything that has to line up with your real identity — use the standard transliteration. For a personal name to introduce yourself with, a native-style Chinese name is friendlier. The two are not interchangeable, and confusing them is the most common mistake people make.',
    ],
  },
  {
    heading: 'Common misconceptions, cleared up',
    body: [
      'My name has a "meaning," so there should be a Chinese word for it. Meaning-based names (like translating "Grace" to a Chinese word for grace) exist as a stylistic choice, but the standard, recognizable form of a personal name is the sound-based transliteration. Meaning-based versions are not what official sources use.',
      'There must be one correct Chinese spelling. For famous names, yes — there is a conventional form. For ordinary names, there is a standard-preferred form from the syllable tables, but minor variation exists, and that is normal.',
      'The Chinese version should sound just like my name. It can only ever approximate it, because Mandarin’s syllable inventory is limited and its tones and sounds differ from English. "Close enough to be recognizable when read aloud" is the realistic goal, not an exact match.',
    ],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Is my name translated or transliterated into Chinese?',
    a: 'Transliterated. The characters are chosen to approximate how your name sounds, not to match its meaning. Each syllable maps to a character with a similar pronunciation.',
  },
  {
    q: 'Why does my Chinese name sound a bit different from my real name?',
    a: 'Mandarin has only about 400 base syllables and a different sound system, so foreign names are fit to the nearest available syllables. The result is a close approximation, never an exact copy.',
  },
  {
    q: 'Is there one "correct" way to write my name in Chinese?',
    a: 'For famous names there is a standard conventional form used by news agencies and dictionaries. For ordinary names, translators follow standard syllable-to-character tables, which produce a consistent preferred form with only minor variation.',
  },
  {
    q: 'Should I use a transliteration or pick a real Chinese name?',
    a: 'Use the standard transliteration for official, legal, or reference purposes that must match your identity. Choose a native-style Chinese name if you want a personal name for everyday introductions in Chinese-speaking settings.',
  },
  {
    q: 'Why are some characters preferred over others for the same sound?',
    a: 'Many characters share a sound, so translators pick neutral or pleasant ones and avoid awkward meanings. Female and male names also tend toward different sets of characters by convention.',
  },
];

export default function HowToWriteNamePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'How to Write Your Name in Chinese — A Complete Guide',
        description: metadata.description,
        inLanguage: 'en',
        mainEntityOfPage: `${SITE}/how-to-write-your-name-in-chinese`,
        datePublished: '2026-06-18',
        dateModified: '2026-06-21',
        author: { '@type': 'Organization', name: 'nametochinese.com', url: SITE },
        publisher: { '@type': 'Organization', name: 'nametochinese.com', url: SITE },
        isBasedOn: {
          '@type': 'Book',
          name: '新华社姓名译名手册',
          publisher: { '@type': 'Organization', name: '新华通讯社' },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'How to Write Your Name in Chinese',
            item: `${SITE}/how-to-write-your-name-in-chinese`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        className="min-h-screen px-4 py-12 max-w-3xl mx-auto"
        style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
      >
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-gray-500">How to write your name in Chinese</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
            How to Write Your Name in Chinese
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            A plain-English guide to how foreign names actually become Chinese —
            what transliteration is, why the result never sounds exactly like the
            original, and how translators choose the characters.
          </p>
        </header>

        <article className="space-y-10">
          {SECTIONS.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
                {s.heading}
              </h2>
              <div className="space-y-3">
                {s.body.map((p, j) => (
                  <p
                    key={j}
                    className="text-base leading-relaxed"
                    style={{ color: '#374151' }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        {/* CTA：把读者引向工具 + 长尾簇 */}
        <section
          className="mt-12 rounded-2xl px-6 py-6"
          style={{ background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: '#1A1A1A' }}>
            See your own name in Chinese
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/convert?lang=${encodeURIComponent('英語')}`}
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: ACCENT }}
            >
              Transliterate any name →
            </Link>
            <Link
              href="/names-in-chinese"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#EBF3FA', color: ACCENT }}
            >
              Browse common names →
            </Link>
            <Link
              href="/name-to-pinyin"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#EBF3FA', color: ACCENT }}
            >
              Chinese name → pinyin →
            </Link>
          </div>
        </section>

        {/* 示例名字页内链：给薄长尾页传权重 + 帮抓取 */}
        <section className="mt-8">
          <p className="text-xs font-medium tracking-wide uppercase mb-3" style={{ color: '#9CA3AF' }}>
            Examples
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { slug: 'david-in-chinese', label: 'David · 大卫' },
              { slug: 'emma-in-chinese', label: 'Emma · 艾玛' },
              { slug: 'michael-in-chinese', label: 'Michael · 迈克尔' },
              { slug: 'sophia-in-chinese', label: 'Sophia · 索菲娅' },
              { slug: 'james-in-chinese', label: 'James · 詹姆斯' },
              { slug: 'anna-in-chinese', label: 'Anna · 安娜' },
            ].map((e) => (
              <Link
                key={e.slug}
                href={`/${e.slug}`}
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{ background: '#fff', color: ACCENT, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                {e.label}
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {FAQ.map((f, i) => (
              <div
                key={i}
                className="rounded-xl px-5 py-4"
                style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              >
                <p className="text-sm font-semibold mb-1.5" style={{ color: ACCENT }}>
                  {f.q}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-300">
          Chinese renderings follow standard transliteration conventions · for reference
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
