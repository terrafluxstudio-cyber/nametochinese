'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ResultCard } from '@/components/ResultCard';
import SearchInput from '@/components/SearchInput';
import MiniGame from '@/components/games/MiniGame';
import type { SearchResult } from '@/components/SearchBox';

export default function PlacesSearchClient() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function search(query: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=place`,
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
    fetch('/api/search?q=lo&type=place').catch(() => {});
    const urlQ = searchParams.get('q');
    if (urlQ) {
      setQ(urlQ);
      search(urlQ);
    }
  }, []);

  return (
    <>
      <div className="mb-6">
        <SearchInput
          value={q}
          onChange={(v) => { setQ(v); search(v); }}
          onSubmit={(v) => search(v)}
          placeholder="London · 伦敦 · Paris · 北京…"
          mono
          autoFocus
        />
      </div>

      {loading && <p className="text-center text-gray-400 py-4">搜索中…</p>}

      <div className="space-y-2">
        {results.slice(0, 30).map((r, i) => (
          <ResultCard key={i} result={r} />
        ))}
      </div>

      {results.length === 0 && q.length > 0 && !loading && (
        <div className="text-center mt-8">
          <p className="text-gray-400 mb-3">未找到「{q}」</p>
          <Link
            href={`/convert?q=${encodeURIComponent(q)}&type=place`}
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: '#2C5F8A' }}
          >
            按语言规则音译（地名）→
          </Link>
          <p className="mt-3 text-xs text-gray-400">
            <Link href="/place-names-guide" className="underline underline-offset-2" style={{ color: '#2C5F8A' }}>
              了解地名翻译规则 →
            </Link>
          </p>
          <MiniGame />
        </div>
      )}

      <p className="text-center text-sm text-gray-400 mt-12">
        找人名？用{' '}
        <Link href="/search" className="underline" style={{ color: '#2C5F8A' }}>综合查询</Link>
        （人名·地名）
      </p>
      <p className="text-center text-xs text-gray-300 mt-3">
        输入英文或中文均可查询 · 收录 17 万地名词条
      </p>
    </>
  );
}
