'use client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';
import MiniGame from '@/components/games/MiniGame';

type KoName = {
  korean: string;
  chinese: string | null;
  english: string;
  gender: string;
};

export default function KoSearchClient() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState('');
  const [gender, setGender] = useState('');
  const [results, setResults] = useState<KoName[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 预热 search-ko 进程 + Turso 连接
    fetch('/api/search-ko?q=이').catch(() => {});
    // 处理直链 ?q=
    const urlQ = searchParams.get('q') ?? '';
    if (urlQ) {
      setQ(urlQ);
      search(urlQ, '');
    }
  }, []);

  function search(query: string, g: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 1) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search-ko?q=${encodeURIComponent(query)}&gender=${g}`,
          { signal: abortRef.current.signal }
        );
        setResults(await res.json());
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') setResults([]);
      } finally {
        setLoading(false);
      }
    }, 150);
  }

  function handleGender(g: string) {
    const next = gender === g ? '' : g;
    setGender(next);
    search(q, next);
  }

  return (
    <>
      <div className="mb-4">
        <SearchInput
          value={q}
          onChange={(v) => {
            setQ(v);
            search(v, gender);
          }}
          onSubmit={(v) => search(v, gender)}
          placeholder="서준 / 瑞俊 / Seojun"
          autoFocus
        />
      </div>

      <div className="flex gap-2 mb-4 justify-center">
        {[['全部', ''], ['女名', 'F'], ['男名', 'M']].map(([label, val]) => (
          <button
            key={val}
            onClick={() => handleGender(val)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${
              gender === val ? 'text-white' : 'text-gray-500 border border-gray-200 hover:border-gray-400'
            }`}
            style={gender === val ? { background: '#2C5F8A' } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 空查询时展示常见韩语名 */}
      {!q && !loading && (
        <div className="mb-8">
          <p className="text-xs text-gray-400 mb-2">常见韩语名试试：</p>
          <div className="flex flex-wrap gap-2">
            {['서준','민준','지우','서윤','지아','수아','하은','이준',
              'Seojun','Minjun','Jiwoo','아이유','김수현','이민호'].map(name => (
              <button
                key={name}
                type="button"
                onClick={() => { setQ(name); search(name, gender); }}
                className="px-3 py-1 rounded-full text-sm border transition-colors hover:border-gray-400"
                style={{ background: '#fff', color: '#374151', borderColor: '#D1D5DB' }}
              >
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
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-xl font-medium" style={{ color: '#1A1A1A' }}>{r.korean}</span>
              {r.chinese
                ? <span className="text-lg" style={{ color: '#2C5F8A' }}>{r.chinese}</span>
                : <span className="text-sm text-gray-300">（无汉字名）</span>
              }
              <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
                style={{ background: '#E8EDF2', color: '#6B7280' }}>
                {r.gender === 'F' ? '女' : '男'}
              </span>
            </div>
            {r.english && (
              <div className="text-sm text-gray-400">{r.english}</div>
            )}
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && q.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-400 mb-1">未找到「{q}」的收录名字</p>
          <p className="text-gray-400 text-xs mb-3">
            韩国人名多依汉字（한자）定译，无对应汉字时按读音处理
          </p>
          <Link
            href="/naming-rules/korean"
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: '#2C5F8A' }}
          >
            了解韩语人名翻译规则 →
          </Link>
          <MiniGame />
        </div>
      )}

      <p className="text-center text-xs text-gray-300 mt-16">
        数据来源：韩国统计厅热门名字（1940–2021），仅含有汉字名的条目
      </p>
    </>
  );
}
