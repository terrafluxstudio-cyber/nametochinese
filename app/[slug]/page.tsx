import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import {
  getAllNameSlugs,
  getNameBySlug,
  getRelatedNames,
  isNameSlug,
} from '@/lib/englishNames';

const SITE = 'https://nametochinese.com';
const ACCENT = '#2C5F8A';

export const dynamicParams = false; // 只生成已有数据的 slug，其余 404

export function generateStaticParams() {
  return getAllNameSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const n = isNameSlug(slug) ? getNameBySlug(slug) : null;
  if (!n) return {};
  const title = `${n.name} in Chinese — ${n.zh} (${n.pinyin})`;
  const desc = `How to write and say the name ${n.name} in Chinese: ${n.zh}, pronounced ${n.pinyin}. Origin, meaning, and pronunciation guide.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/${n.slug}` },
    openGraph: {
      title,
      description: desc,
      url: `${SITE}/${n.slug}`,
      type: 'website',
    },
  };
}

export default async function NameInChinesePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isNameSlug(slug)) notFound();
  const n = getNameBySlug(slug);
  if (!n) notFound();

  const related = getRelatedNames(n);
  const genderWord = n.gender === 'f' ? 'female' : 'male';

  // FAQ 结构化数据（rich result）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do you write the name ${n.name} in Chinese?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The name ${n.name} is written as ${n.zh} in Chinese, pronounced ${n.pinyin} in pinyin.`,
        },
      },
      {
        '@type': 'Question',
        name: `What does the name ${n.name} mean?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${n.name} is of ${n.origin} origin. ${n.meaning}`,
        },
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
        className="min-h-screen px-4 py-12 max-w-2xl mx-auto"
        style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
      >
        {/* 标题区 */}
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-wide text-gray-400 mb-1">
            {n.name} in Chinese
          </p>
          <h1 className="text-5xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
            {n.zh}
          </h1>
          <p className="text-xl" style={{ color: ACCENT }}>
            {n.pinyin}
          </p>
        </div>

        {/* 卡片：写法 + 念法 */}
        <div
          className="rounded-xl px-5 py-4 mb-6"
          style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', color: '#374151' }}
        >
          <p className="text-base leading-relaxed">
            The {genderWord} name <b>{n.name}</b> is rendered in Chinese as{' '}
            <b style={{ color: '#1A1A1A' }}>{n.zh}</b>. These characters are chosen for
            their sound, not their meaning — together they approximate how{' '}
            <b>{n.name}</b> is pronounced. In pinyin (the standard romanization of
            Mandarin) this reads <b>{n.pinyin}</b>.
          </p>
        </div>

        {/* 卡片：词源含义 */}
        <div
          className="rounded-xl px-5 py-4 mb-6"
          style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', color: '#374151' }}
        >
          <p className="text-xs font-medium tracking-wide uppercase mb-2" style={{ color: '#9CA3AF' }}>
            Origin &amp; meaning of {n.name}
          </p>
          <p className="text-base leading-relaxed">
            <b>{n.name}</b> is a name of <b>{n.origin}</b> origin. {n.meaning}
          </p>
        </div>

        {/* CTA：用工具翻译你自己的名字 */}
        <div
          className="rounded-xl px-5 py-5 mb-8 text-center"
          style={{ background: '#EEF3F7', border: `1px solid ${ACCENT}22` }}
        >
          <p className="text-base mb-3" style={{ color: '#374151' }}>
            Want the Chinese version of a different name?
          </p>
          <Link
            href={`/convert?lang=${encodeURIComponent('英語')}`}
            className="inline-block px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{ background: ACCENT, color: '#fff' }}
          >
            Translate any name →
          </Link>
        </div>

        {/* 相关名字内链（同源） */}
        {related.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-medium tracking-wide uppercase mb-3" style={{ color: '#9CA3AF' }}>
              More names of {n.origin} origin
            </p>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${r.slug}`}
                  className="px-3 py-1.5 rounded-lg text-sm"
                  style={{ background: '#fff', color: ACCENT, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  {r.name} · {r.zh}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 索引 + 工具 */}
        <div className="flex flex-wrap gap-2 justify-center text-sm">
          <Link href="/names-in-chinese" className="underline" style={{ color: ACCENT }}>
            Browse all names
          </Link>
          <span className="text-gray-300">·</span>
          <Link href={`/convert?lang=${encodeURIComponent('英語')}`} className="underline" style={{ color: ACCENT }}>
            Name transliteration tool
          </Link>
          <span className="text-gray-300">·</span>
          <Link href="/name-to-pinyin" className="underline" style={{ color: ACCENT }}>
            Chinese name to pinyin
          </Link>
        </div>

        <p className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-300">
          Chinese rendering follows standard transliteration conventions · for reference
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
