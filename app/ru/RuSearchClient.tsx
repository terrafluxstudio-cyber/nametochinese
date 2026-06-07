'use client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';

type Tok = {
  input: string;
  zh: string;
  source: 'dict' | 'db' | 'none';
};

type RuPerson = {
  zh: string;
  ru: string;
  gender: string;
  bio: string;
  slug: string;
  surname: string;
};

const ACCENT = '#2C5F8A';

export default function RuSearchClient() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState('');
  const [tokens, setTokens] = useState<Tok[]>([]);
  const [celebrities, setCelebrities] = useState<RuPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/ru-translate?q=а').catch(() => {});
    const urlQ = searchParams.get('q') ?? '';
    if (urlQ) {
      setQ(urlQ);
      search(urlQ);
    }
  }, []);

  function search(query: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 1) {
      setTokens([]);
      setCelebrities([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      setLoading(true);
      try {
        const [transRes, celebRes] = await Promise.all([
          fetch(`/api/ru-translate?q=${encodeURIComponent(query)}`, {
            signal: abortRef.current.signal,
          }),
          fetch(`/api/ru-celebrity-search?q=${encodeURIComponent(query)}`),
        ]);
        const data = await transRes.json();
        const celebData = await celebRes.json();
        setTokens(Array.isArray(data.tokens) ? data.tokens : []);
        setCelebrities(Array.isArray(celebData) ? celebData : []);
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') {
          setTokens([]);
          setCelebrities([]);
        }
      } finally {
        setLoading(false);
      }
    }, 150);
  }

  const hasNone = tokens.some((t) => t.source === 'none' && t.input);

  return (
    <>
      <SearchInput
        value={q}
        onChange={(v) => {
          setQ(v);
          search(v);
        }}
        onSubmit={(v) => search(v)}
        placeholder="Владимир Путин / Ксенья / 普京"
        autoFocus
      />
      <p className="text-xs text-gray-400 mb-4 mt-3 pl-1">
        逐词直译 · 多个名字用空格分隔，姓名各词分别查
      </p>

      {/* 空查询时展示常见俄语名 */}
      {!q && !loading && (
        <div className="mb-8">
          <p className="text-xs text-gray-400 mb-2">常见俄语名试试：</p>
          <div className="flex flex-wrap gap-2">
            {['Александр','Наталья','Владимир','Анастасия','Сергей',
              'Екатерина','Дмитрий','Мария','Иван','Елена',
              'Николай','Людмила','Михаил','Ольга','Андрей'].map(name => (
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

      {loading && <p className="text-center text-gray-400">查询中…</p>}

      {!loading && tokens.length > 0 && (
        <div
          className="rounded-2xl px-6 py-6"
          style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
        >
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            {tokens.map((t, i) => (
              <div key={i} className="flex flex-col">
                <span
                  className="text-base"
                  style={{ color: '#374151', fontFamily: 'Georgia, serif' }}
                >
                  {t.input}
                </span>
                {t.zh ? (
                  <span className="text-2xl font-bold" style={{ color: ACCENT }}>
                    {t.zh}
                  </span>
                ) : (
                  <span className="text-2xl text-gray-300">—</span>
                )}
              </div>
            ))}
          </div>

          {/* 整体中文串（便于复制） */}
          {tokens.some((t) => t.zh) && (
            <p className="mt-5 pt-4 border-t border-gray-100 text-lg" style={{ color: '#1A1A1A' }}>
              {tokens.map((t) => t.zh || t.input).join(' ')}
            </p>
          )}
        </div>
      )}

      {!loading && hasNone && (
        <div className="mt-4">
          <p className="text-xs text-gray-400 leading-relaxed mb-2">
            「—」的词未收录，可用音译表按俄语规则转写：
          </p>
          <Link
            href={`/convert?lang=${encodeURIComponent('俄語')}&q=${encodeURIComponent(q)}`}
            className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: '#2C5F8A' }}
          >
            打开俄语音译表 →
          </Link>
        </div>
      )}

      {!loading && celebrities.length > 0 && (
        <div className="mt-8">
          <p className="text-xs font-medium tracking-wide uppercase mb-3" style={{ color: '#9CA3AF' }}>
            叫这个名字的名人
          </p>
          <div className="space-y-2">
            {celebrities.map((p, i) => (
              <Link
                key={i}
                href={`/ru/name/${p.slug}`}
                className="flex items-center justify-between rounded-xl px-4 py-3 transition-shadow hover:shadow-md"
                style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div className="min-w-0">
                  <span className="text-base" style={{ color: '#374151' }}>{p.ru}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-base font-medium" style={{ color: ACCENT }}>{p.zh}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: '#E8EDF2', color: '#6B7280' }}>
                    {p.gender === 'F' ? '女' : '男'}
                  </span>
                  <span style={{ color: '#C7CED6' }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
