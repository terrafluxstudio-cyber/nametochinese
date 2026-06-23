import { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import SearchTabs from '@/components/SearchTabs';
import Link from 'next/link';
import HomeSearch from './HomeSearch';
import { SEAL_DATA_URI } from './seal-data';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const ACCENT = '#2C5F8A';

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:underline" style={{ color: ACCENT }}>
      {children}
    </Link>
  );
}

// 卡片区：5 张纯链接跳转（次级工具/库）。主搜=查人名，音译/命名规则在导航。
const CARDS: { href: string; title: string; desc: string }[] = [
  { href: '/places', title: '地名查译', desc: '17 万地名 · 外文 ↔ 中文' },
  { href: '/tw', title: '臺灣標準譯名', desc: '國教院 8,767 條 · 德法義西斯拉夫等 9 語系' },
  { href: '/convert', title: '外文音译', desc: '外文名按译音表转中文 · 70+ 语言' },
  { href: '/pinyin', title: '拼音找名', desc: '拼音 → 中文姓名（反查）' },
  { href: '/name-to-pinyin', title: '姓名转拼音', desc: '中文名 → 汉语拼音（含多音姓/生僻字）' },
  { href: '/zh-convert', title: '简繁转换', desc: '简体 ↔ 繁体互转' },
  { href: '/wade-giles', title: '威妥玛拼音', desc: '中文名 → 威妥玛式（海外华人·涉外文件）' },
  { href: '/gov-titles', title: '机构职位', desc: '555 条 · 党政机构·官员职位中英对照' },
  { href: '/naming-rules', title: '各国人名规则', desc: '33 种语言 · 姓名结构·文化习俗详解' },
];

function Card({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl px-5 py-4 bg-white transition-all hover:-translate-y-0.5"
      style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}
    >
      <p className="text-base font-semibold mb-1" style={{ color: '#1A1A1A' }}>
        {title}
      </p>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#F7F5F0] flex flex-col">

        <section className="flex-1 max-w-2xl mx-auto w-full px-4 pt-24 pb-16 text-center">

          {/* 标题 + 右上角印章 */}
          <div className="relative inline-block mb-1">
            <h1
              className="text-5xl"
              style={{
                fontFamily: "var(--font-xuanzong), var(--font-serif)",
                color: '#012D6C',
                fontWeight: 400,
                letterSpacing: '0.06em',
                lineHeight: 1.2,
              }}
            >
              <span style={{ fontSize: '1.15em' }}>外</span>文译名词典
            </h1>
            {/* 印章：贯通中外。base64 内联，随 HTML 立即渲染（不走 next/image 优化、不 lazy） */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SEAL_DATA_URI}
              alt=""
              aria-hidden
              width={44}
              height={44}
              style={{
                position: 'absolute',
                top: -16,
                right: -30,
                width: 44,
                height: 44,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </div>

          <p className="text-gray-500 text-sm mb-8">
            收录 67 万人名、17 万地名，专为翻译工作者设计
          </p>

          <HomeSearch />

          <div className="mt-5">
            <SearchTabs current="all" />
          </div>

          {/* 卡片区：5 张次级工具/库，纯链接跳转（=首页内链） */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {CARDS.map((c) => (
              <Card key={c.href} {...c} />
            ))}
          </div>

        </section>

        <footer className="border-t border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8 text-xs text-gray-400 flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="text-gray-300 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>人名</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <TextLink href="/ru">俄文人名</TextLink>
                <TextLink href="/ko">韩国人名</TextLink>
                <TextLink href="/ja">日本人名</TextLink>
              </div>
            </div>
            <div>
              <p className="text-gray-300 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>地名</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <TextLink href="/places">地名查译</TextLink>
              </div>
            </div>
            <div>
              <p className="text-gray-300 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>工具</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <TextLink href="/pinyin">拼音反查</TextLink>
                <TextLink href="/zh-convert">简繁转换</TextLink>
                <TextLink href="/name-to-pinyin">姓名转拼音</TextLink>
              </div>
            </div>
            <div>
              <p className="text-gray-300 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>参考</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <TextLink href="/gov-titles">机构职位翻译</TextLink>
                <TextLink href="/naming-rules">各国人名规则</TextLink>
              </div>
            </div>
            <div>
              <p className="text-gray-300 uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-geist-mono)' }}>关于</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <TextLink href="/about">关于本站</TextLink>
                <TextLink href="/contact">联系我们</TextLink>
                <TextLink href="/privacy">隐私政策</TextLink>
                <TextLink href="/terms">服务条款</TextLink>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-50 py-5 text-center text-xs text-gray-300">
            © 2026 外文译名词典 · nametochinese.com
          </div>
        </footer>
      </main>
    </>
  );
}
