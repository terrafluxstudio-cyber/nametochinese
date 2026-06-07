import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import { getAllGroups } from '@/lib/ruCelebrities';

const ACCENT = '#2C5F8A';

export const metadata: Metadata = {
  title: '俄语名人中文译名索引 — 按姓氏查',
  description:
    '收录近 2000 个俄语姓氏的中文译名与同名名人，从普京、托尔斯泰、陀思妥耶夫斯基到加加林、柴可夫斯基。点击姓氏查看叫这个名字的所有俄罗斯／苏联名人、生卒年、简介与维基百科链接。',
  keywords: ['俄语名人', '俄罗斯名人 中文译名', '俄语姓氏', '俄罗斯人名', '苏联名人'],
  alternates: { canonical: '/ru/names' },
  openGraph: {
    title: '俄语名人中文译名索引 | 外文译名词典',
    description: '近 2000 个俄语姓氏 + 同名名人详情。普京、托尔斯泰、加加林等。',
    url: 'https://nametochinese.com/ru/names',
    type: 'website',
  },
};

export default function RuNamesIndexPage() {
  const groups = getAllGroups();
  const famous = groups.slice(0, 60); // 最知名（已按 topSitelinks 降序）

  // 按俄文姓首字母分组
  const byLetter: Record<string, typeof groups> = {};
  for (const g of groups) {
    const c = (g.ruSurname[0] || '#').toUpperCase();
    (byLetter[c] ||= []).push(g);
  }
  const letters = Object.keys(byLetter).sort((a, b) => a.localeCompare(b, 'ru'));

  const total = groups.length;
  const multiCount = groups.filter((g) => g.count >= 2).length;

  return (
    <>
      <NavBar />
      <main
        className="min-h-screen px-4 py-12 max-w-3xl mx-auto"
        style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
      >
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
          俄语名人中文译名索引
        </h1>
        <p className="text-center text-gray-500 text-sm mb-2">
          {total} 个俄语姓氏 · {multiCount} 个含多位同名名人
        </p>
        <p className="text-center text-xs text-gray-400 mb-8">
          点击姓氏，查看叫这个名字的俄罗斯／苏联名人、生卒、简介与维基百科链接
        </p>

        {/* 最知名 */}
        <section className="mb-10">
          <p className="text-xs font-medium tracking-wide uppercase mb-3" style={{ color: '#9CA3AF' }}>
            最知名
          </p>
          <div className="flex flex-wrap gap-2">
            {famous.map((g) => (
              <Link
                key={g.surname}
                href={`/ru/name/${g.slug}`}
                className="px-3 py-1.5 rounded-full text-sm transition-colors"
                style={{ background: '#fff', color: ACCENT, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                {g.surname}
                {g.count > 1 && <span className="text-gray-300 ml-1">·{g.count}</span>}
              </Link>
            ))}
          </div>
        </section>

        {/* 按俄文字母分组 */}
        <section>
          <p className="text-xs font-medium tracking-wide uppercase mb-4" style={{ color: '#9CA3AF' }}>
            按俄文姓氏字母
          </p>
          <div className="space-y-6">
            {letters.map((letter) => (
              <div key={letter}>
                <h2
                  className="text-lg font-bold mb-2 sticky top-[72px] py-1"
                  style={{ color: '#1A1A1A', background: '#F7F5F0' }}
                >
                  {letter}
                </h2>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
                  {byLetter[letter].map((g) => (
                    <Link
                      key={g.surname}
                      href={`/ru/name/${g.slug}`}
                      className="hover:underline"
                      style={{ color: '#374151' }}
                      title={g.ruSurname}
                    >
                      {g.surname}
                      {g.count > 1 && <span className="text-gray-300">·{g.count}</span>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 相关 */}
        <div className="mt-12 flex flex-wrap gap-2 justify-center text-sm">
          <Link href="/ru" className="underline" style={{ color: ACCENT }}>俄语人名查询</Link>
          <span className="text-gray-300">·</span>
          <Link href="/naming-rules/russian" className="underline" style={{ color: ACCENT }}>俄语人名规则</Link>
        </div>
        <p className="mt-8 pt-6 border-t border-gray-200 text-center text-xs text-gray-300">
          人物资料来源：维基百科（Wikidata, CC0）· 译名依新华社规范
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
