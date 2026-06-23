'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import SearchTabs from '@/components/SearchTabs';
import SearchInput from '@/components/SearchInput';
import SiteFooter from '@/components/SiteFooter';

interface TwResult {
  en: string;
  zh: string;
  langDisplay: string;
}

function TwPageContent() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<TwResult[]>([]);
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
        const res = await fetch(
          `/api/search-tw?q=${encodeURIComponent(query)}`,
          { signal: abortRef.current.signal }
        );
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') setResults([]);
      } finally {
        setLoading(false);
      }
    }, 150);
  }

  useEffect(() => {
    const urlQ = searchParams.get('q');
    if (urlQ) { setQ(urlQ); search(urlQ); }
  }, []);

  const empty = results.length === 0 && q.length > 0 && !loading;

  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}
        >
          臺灣標準外文人名譯名
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          依據國家教育研究院《外國學者人名譯名》· 8,767 條 · 9 語系
        </p>

        <SearchTabs current="all" />

        <div className="mb-6">
          <SearchInput
            value={q}
            onChange={(v) => { setQ(v); search(v); }}
            onSubmit={(v) => search(v)}
            placeholder="Smith · Müller · Ampère · 史密斯…"
            mono
            autoFocus
          />
        </div>

        {loading && <p className="text-center text-gray-400 py-4">搜尋中…</p>}

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-4 px-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="font-serif text-xl text-[#1A1A1A]">{r.en}</span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-[#1A1A1A] font-medium">{r.zh}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                    {r.langDisplay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {empty && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-2">「{q}」未收錄於國教院譯名庫</p>
            <p className="text-sm text-gray-400">
              可試試{' '}
              <a href={`/en?q=${encodeURIComponent(q)}`} className="underline" style={{ color: '#2C5F8A' }}>
                新華社標準人名查詢
              </a>
              {' '}或{' '}
              <a href={`/convert?q=${encodeURIComponent(q)}`} className="underline" style={{ color: '#2C5F8A' }}>
                音譯引擎
              </a>
            </p>
          </div>
        )}

        <p className="mt-12 text-xs text-center text-gray-300">
          資料來源：國家教育研究院《外國學者人名譯名》（terms.naer.edu.tw）
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

export default function TwPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 py-16">載入中…</p>}>
      <TwPageContent />
    </Suspense>
  );
}
