'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { ResultCard } from '@/components/ResultCard';
import type { SearchResult } from '@/components/SearchBox';

function detectLanguage(text: string): 'ru' | 'ko' | 'ja' | 'pinyin' | 'en' {
  if (/[а-яёА-ЯЁ]/.test(text)) return 'ru';
  if (/[가-힣]/.test(text)) return 'ko';
  if (/[ぁ-んァ-ヿ一-鿿]/.test(text)) return 'ja';
  if (/^[a-z\s]+$/i.test(text) && text.includes(' ') && text.length < 20) return 'pinyin';
  return 'en';
}

const TOOLS = [
  {
    href: '/ru',
    title: '俄语人名',
    desc: '280余条俄文人名，含父称、昵称对照',
    tag: 'РУ',
  },
  {
    href: '/ko',
    title: '韩国人名',
    desc: '韩文、汉字名、英文三向查询',
    tag: '한',
  },
  {
    href: '/ja',
    title: '日本人名',
    desc: '汉字名转中文，罗马字查汉字',
    tag: '日',
  },
  {
    href: '/convert',
    title: '外文音译引擎',
    desc: '70余种语言，逐段高亮显示译名对应',
    tag: 'A→译',
  },
  {
    href: '/pinyin',
    title: '拼音反查中文名',
    desc: '输入拼音，自动列出最可能的汉字姓名',
    tag: 'pīn',
  },
  {
    href: '/zh-convert',
    title: '简繁转换',
    desc: '台湾正体·香港繁体·大陆简体互转',
    tag: '繁',
  },
  {
    href: '/naming-rules',
    title: '各语言人名规则',
    desc: '16种语言命名习惯，翻译工作者必备',
    tag: '规',
  },
  {
    href: '/naming-rules/sinosphere',
    title: '华人英文名写法',
    desc: '台湾威妥玛·新马方言拼音识别指南',
    tag: '华',
  },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [detectedLang, setDetectedLang] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setDetectedLang('');
      return;
    }

    const lang = detectLanguage(query.trim());
    const langLabels: Record<string, string> = {
      ru: '识别为俄语',
      ko: '识别为韩语',
      ja: '识别为日语',
      pinyin: '识别为拼音',
      en: '英文/多语言查询',
    };
    setDetectedLang(langLabels[lang]);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        let url = '';
        if (lang === 'ru') url = `/api/search-ru?q=${encodeURIComponent(query)}`;
        else if (lang === 'ko') url = `/api/search-ko?q=${encodeURIComponent(query)}`;
        else if (lang === 'ja') url = `/api/search-ja?q=${encodeURIComponent(query)}`;
        else if (lang === 'pinyin') url = `/api/pinyin-lookup?q=${encodeURIComponent(query)}`;
        else url = `/api/search?q=${encodeURIComponent(query)}&type=all`;

        const res = await fetch(url);
        const data = await res.json();

        if (lang === 'pinyin' && data.topResults) {
          setResults(data.topResults.map((r: { name: string }) => ({
            english: query,
            chinese: r.name,
            nationality: '中文姓名',
            type: 'person',
          })));
        } else if (lang === 'ja' && data.combinations) {
          setResults(data.combinations.map((c: { ja: string; zh: string }) => ({
            english: c.ja,
            chinese: c.zh,
            nationality: '日本',
            type: 'person',
          })));
        } else {
          setResults(Array.isArray(data) ? data : data.results ?? []);
        }
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  }, [query]);

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#F7F5F0]">

        <section id="search" className="relative max-w-5xl mx-auto px-4 pt-16 pb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <h1
              className="text-5xl mb-2"
              style={{
                fontFamily: "'XuanZongTi', var(--font-serif)",
                color: '#1A1A1A',
                fontWeight: 400,
                letterSpacing: '0.06em',
                lineHeight: 1.2,
              }}
            >
              <span style={{ fontSize: '1.15em' }}>外</span>文译名词典
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              收录 67 万人名、17 万地名，专为翻译工作者设计
            </p>

            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Adams · Александр · 田中 · zhang wei…"
                className="w-full text-lg px-5 py-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#2C5F8A]/30"
                style={{
                  background: '#fff',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.09)',
                  fontFamily: 'var(--font-geist-mono)',
                }}
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-lg"
                >
                  ×
                </button>
              )}
            </div>

            {detectedLang && (
              <p className="text-xs text-[#2C5F8A] mt-2 ml-1">{detectedLang}</p>
            )}

            {(loading || results.length > 0) && (
              <div className="mt-4 space-y-2">
                {loading && (
                  <p className="text-center text-gray-400 text-sm py-4">搜索中…</p>
                )}
                {!loading && results.slice(0, 8).map((r, i) => (
                  <ResultCard key={i} result={r} />
                ))}
              </div>
            )}

          </div>

          <div className="hidden md:block w-72 shrink-0">
            <Image
              src="/hero-book.png"
              alt="外文译名词典"
              width={288}
              height={432}
              className="w-full h-auto object-contain"
              priority
              style={{
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 22%, black 100%), ' +
                  'linear-gradient(to top, transparent 0%, black 18%, black 100%)',
                maskComposite: 'intersect',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 22%, black 100%), ' +
                  'linear-gradient(to top, transparent 0%, black 18%, black 100%)',
                WebkitMaskComposite: 'source-in',
              }}
            />
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-16">
          <h2
            className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            更多工具
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-xl px-4 py-4 transition-all hover:-translate-y-0.5"
                style={{
                  background: '#fff',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                }}
              >
                <div
                  className="text-xs font-bold mb-2 px-2 py-0.5 rounded inline-block"
                  style={{
                    background: '#EBF3FA',
                    color: '#2C5F8A',
                    fontFamily: 'var(--font-geist-mono)',
                  }}
                >
                  {tool.tag}
                </div>
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}
                >
                  {tool.title}
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <footer className="border-t border-gray-100 py-8 text-center text-xs text-gray-300">
          © {new Date().getFullYear()} 外文译名词典 · nametochinese.com
        </footer>
      </main>
    </>
  );
}
