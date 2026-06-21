'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/SearchInput';
import type { SearchResult } from '@/components/SearchBox';

const PREVIEW_LIMIT = 5;

// 取括号/中文标点前的译名（与 ResultCard 一致，过滤辞典原始注释）
function displayZh(s: string) {
  return s.split(/[（(，,。；;、]/)[0].trim() || s;
}

export default function HomeSearch() {
  const [q, setQ] = useState('');
  const [preview, setPreview] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 预热 /search 路由 + search 进程/Turso，消首查冷启动延迟
  useEffect(() => {
    router.prefetch('/search');
    fetch('/api/search?q=jo&type=person').catch(() => {});
  }, [router]);

  // 点击预览框外关闭（mousedown 在框内不触发，保证条目 onClick 能先跑）
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function go(v: string) {
    const t = v.trim();
    if (!t) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(t)}`); // 直达 /search，跳过 /en→/search 那跳重定向
  }

  function onChange(v: string) {
    setQ(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const t = v.trim();
    if (!t) {
      setPreview([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      try {
        // 红线：只查人名库（不自动识别·不查所有库·不刷屏），限 5 条小预览
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(t)}&type=person&limit=${PREVIEW_LIMIT}`,
          { signal: abortRef.current.signal },
        );
        const data = await res.json();
        const rows: SearchResult[] = Array.isArray(data) ? data : data.results ?? [];
        setPreview(rows.filter((r) => r.type === 'person').slice(0, PREVIEW_LIMIT));
        setOpen(true);
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') setPreview([]);
      }
    }, 150);
  }

  return (
    <div className="w-full relative" ref={boxRef}>
      <SearchInput
        value={q}
        onChange={onChange}
        onSubmit={go}
        placeholder="Adams · Johnson · 亚当斯 · 约翰逊…"
        autoFocus
        mono
      />
      <p className="text-xs text-gray-400 mt-2 pl-1">英文或中文均可 · 边打边看，回车看全部</p>

      {open && preview.length > 0 && (
        <div
          className="absolute left-0 right-0 mt-2 z-20 rounded-2xl overflow-hidden text-left"
          style={{ background: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.14)' }}
        >
          {preview.map((r, i) => (
            <button
              key={`${r.english}-${i}`}
              type="button"
              onClick={() => go(r.english)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
            >
              <span className="text-base text-[#1A1A1A]" style={{ fontFamily: 'var(--font-serif)' }}>
                {r.english}
              </span>
              <span className="text-lg font-medium text-[#1A1A1A]">{displayZh(r.chinese)}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => go(q)}
            className="w-full text-center px-5 py-2.5 text-xs text-gray-500 hover:bg-gray-100"
            style={{ background: '#FAFAFA' }}
          >
            查看「{q.trim()}」的全部结果 →
          </button>
        </div>
      )}
    </div>
  );
}
