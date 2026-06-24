'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SearchTabs from '@/components/SearchTabs';
import SearchInput from '@/components/SearchInput';
import SiteFooter from '@/components/SiteFooter';
import { ResultCard } from '@/components/ResultCard';
import MiniGame from '@/components/games/MiniGame';
import type { SearchResult } from '@/components/SearchBox';

const PERSON_LIMIT = 10;

function EnPageContent() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function search(query: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 1) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        // 综合查询：只查人名（地名已剥离，走 /places）。限量+精确优先防刷屏
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=person&limit=16`,
          { signal: abortRef.current.signal }
        );
        const data = await res.json();
        setResults(Array.isArray(data) ? data : data.results ?? []);
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') setResults([]);
      } finally {
        setLoading(false);
      }
    }, 150);
  }

  useEffect(() => {
    // 预热 search 进程 + Turso 连接
    fetch('/api/search?q=jo&type=person').catch(() => {});
    const urlQ = searchParams.get('q');
    if (urlQ) {
      setQ(urlQ);
      search(urlQ);
    }
  }, []);

  const persons = results.filter((r) => r.type === 'person').slice(0, PERSON_LIMIT);
  const empty = results.length === 0 && q.length > 0 && !loading;

  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}
        >
          人名查译
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">收录 67 万外文人名，外文与中文双向查询 · 地名请用「地名查译」</p>

        <SearchTabs current="all" />

        <div className="mb-6">
          <SearchInput
            value={q}
            onChange={(v) => {
              setQ(v);
              search(v);
            }}
            onSubmit={(v) => search(v)}
            placeholder="Adams · Johnson · Müller · 亚当斯…"
            mono
            autoFocus
          />
        </div>

        {!q && !loading && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-2">常见示例：</p>
            <div className="flex flex-wrap gap-2">
              {['Johnson', 'Williams', 'Smith', 'Brown', 'Anderson', 'Emma', 'Oliver', 'Sophia', 'Lucas', 'Adams'].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => { setQ(name); search(name); }}
                  className="px-3 py-1 rounded-full text-sm border transition-colors hover:border-gray-400"
                  style={{ background: '#fff', color: '#374151', borderColor: '#D1D5DB' }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <p className="text-center text-gray-400 py-4">搜索中…</p>}

        {persons.length > 0 && (
          <section className="mb-6">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-widest" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              人物
            </p>
            <div className="space-y-2">
              {persons.map((r, i) => (
                <ResultCard key={`p${i}`} result={r} />
              ))}
            </div>
          </section>
        )}

        {empty && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">未收录「{q}」</p>
            <div className="inline-block text-left rounded-xl px-5 py-4 bg-white" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
              <p className="text-sm text-gray-600 mb-3">
                <b>普通人名</b>（无通用译名）→ 按语言规则音译：
              </p>
              <Link
                href={`/convert?q=${encodeURIComponent(q)}`}
                className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white mb-3"
                style={{ background: '#2C5F8A' }}
              >
                外文音译引擎 →
              </Link>
              <p className="text-xs text-gray-400 leading-relaxed">
                知名人物没找到？换种拼写，或试试{' '}
                <Link href="/ru" className="underline" style={{ color: '#2C5F8A' }}>俄</Link>
                {' / '}
                <Link href="/ko" className="underline" style={{ color: '#2C5F8A' }}>韩</Link>
                {' / '}
                <Link href="/ja" className="underline" style={{ color: '#2C5F8A' }}>日</Link>
                {' '}专库。
              </p>
              <p className="text-xs text-gray-400 mt-2">
                了解外文人名翻译规则 →{' '}
                <Link href="/naming-rules" className="underline underline-offset-2" style={{ color: '#2C5F8A' }}>各语言命名规则</Link>
              </p>
            </div>
            <MiniGame />
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

export default function EnPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 py-16">加载中…</p>}>
      <EnPageContent />
    </Suspense>
  );
}
