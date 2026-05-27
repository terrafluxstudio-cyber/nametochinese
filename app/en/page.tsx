'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { ResultCard } from '@/components/ResultCard';
import type { SearchResult } from '@/components/SearchBox';

function EnPageContent() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  async function search(query: string) {
    if (query.trim().length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all`);
    const data = await res.json();
    setResults(Array.isArray(data) ? data : data.results ?? []);
    setLoading(false);
  }

  useEffect(() => {
    const urlQ = searchParams.get('q');
    if (urlQ) {
      setQ(urlQ);
      search(urlQ);
    }
  }, []);

  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}
        >
          英文／多语言人名查询
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">收录 67 万词条，含人名、地名</p>

        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            search(e.target.value);
          }}
          placeholder="Adams · Johnson · Williams…"
          className="w-full text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200 mb-6"
          style={{
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            fontFamily: 'var(--font-geist-mono)',
          }}
          autoFocus
        />

        {loading && <p className="text-center text-gray-400 py-4">搜索中…</p>}

        <div className="space-y-2">
          {results.slice(0, 20).map((r, i) => (
            <ResultCard key={i} result={r} />
          ))}
        </div>

        {results.length === 0 && q.length > 0 && !loading && (
          <p className="text-center text-gray-400 mt-8">未找到结果</p>
        )}
      </main>
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
