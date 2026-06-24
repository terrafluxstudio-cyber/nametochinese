'use client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchInput from '@/components/SearchInput';

type FrName = { french: string; chinese: string; gender: string };
const ACCENT = '#2C5F8A';

export default function FrSearchClient() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<FrName[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/search-fr?q=a').catch(() => {});
    const urlQ = searchParams.get('q') ?? '';
    if (urlQ) { setQ(urlQ); search(urlQ); }
  }, []);

  function search(query: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 1) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const res = await fetch(`/api/search-fr?q=${encodeURIComponent(query)}`, { signal: abortRef.current.signal });
        setResults(await res.json());
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') setResults([]);
      } finally { setLoading(false); }
    }, 150);
  }

  const CHIPS = ['Macron','Dupont','Rousseau','Hugo','Voltaire','Balzac','Camus','Sartre','Zidane','Mbappé','Curie','Napoléon'];

  return (
    <>
      <SearchInput
        value={q}
        onChange={(v) => { setQ(v); search(v); }}
        onSubmit={(v) => search(v)}
        placeholder="Macron / Hugo / 雨果"
        autoFocus
      />
      <p className="text-xs text-gray-400 mb-4 mt-3 pl-1">输入法文姓名或中文名</p>

      {!q && !loading && (
        <div className="mb-8">
          <p className="text-xs text-gray-400 mb-2">常见法语名试试：</p>
          <div className="flex flex-wrap gap-2">
            {CHIPS.map(name => (
              <button key={name} type="button"
                onClick={() => { setQ(name); search(name); }}
                className="px-3 py-1 rounded-full text-sm border transition-colors hover:border-gray-400"
                style={{ background: '#fff', color: '#374151', borderColor: '#D1D5DB' }}>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-center text-gray-400">查询中…</p>}

      <div className="space-y-3">
        {!loading && results.map((r, i) => (
          <div key={i} className="rounded-xl px-5 py-4"
            style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-medium" style={{ color: '#1A1A1A' }}>{r.french}</span>
              <span className="text-lg" style={{ color: ACCENT }}>{r.chinese}</span>
              {r.gender && (
                <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
                  style={{ background: '#E8EDF2', color: '#6B7280' }}>
                  {r.gender === 'F' ? '女' : '男'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && q.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-400 mb-3">未找到「{q}」的收录名字</p>
          <a href={`/convert?lang=${encodeURIComponent('法語')}&q=${encodeURIComponent(q)}`}
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: ACCENT }}>
            用法语音译表转写 →
          </a>
        </div>
      )}
    </>
  );
}
