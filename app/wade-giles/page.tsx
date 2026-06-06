'use client';

import { useState, useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';

type CharResult = { char: string; pinyin: string; wade: string; diff: boolean };
type Result = { pinyin: string; wade: string; chars: CharResult[] };

const ACCENT = '#2C5F8A';

const EXAMPLES = ['张伟', '蔡英文', '谢长廷', '郑成功', '蒋介石', '孙中山', '周恩来'];

export default function WadeGilesPage() {
  const [q, setQ] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (!q.trim()) { setResult(null); return; }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/wade-giles?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResult(data);
      } finally { setLoading(false); }
    }, 200);
  }, [q]);

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text).catch(() => {});
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-12 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
          威妥玛拼音转换
        </h1>
        <p className="text-center text-gray-500 text-sm mb-2">
          中文姓名 → 汉语拼音 + 威妥玛式（Wade-Giles）
        </p>
        <p className="text-center text-xs text-gray-400 mb-8">
          涉外文件、海外华人姓名罗马字参考 · 仅含常用姓名用字
        </p>

        {/* 输入框 */}
        <div className="relative mb-6">
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="输入中文姓名，如：张伟"
            autoFocus
            className="w-full px-4 py-3 rounded-xl text-base outline-none transition-shadow"
            style={{
              background: '#fff',
              border: '1.5px solid #D1D5DB',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              fontFamily: 'Georgia, serif',
              color: '#1A1A1A',
            }}
            onFocus={e => (e.target.style.borderColor = ACCENT)}
            onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
          />
          {q && (
            <button
              type="button"
              onClick={() => { setQ(''); setResult(null); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
            >×</button>
          )}
        </div>

        {/* 示例 */}
        {!q && (
          <div className="mb-8">
            <p className="text-xs text-gray-400 mb-2">试试：</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map(ex => (
                <button key={ex} type="button" onClick={() => setQ(ex)}
                  className="px-3 py-1 rounded-full text-sm border transition-colors hover:border-gray-400"
                  style={{ background: '#fff', color: '#374151', borderColor: '#D1D5DB' }}>
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <p className="text-center text-gray-400">转换中…</p>}

        {result && !loading && (
          <div className="rounded-2xl p-6" style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
            {/* 威妥玛行（主输出） */}
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">威妥玛式（Wade-Giles）</p>
              <div className="flex items-center justify-between gap-3">
                <p className="text-3xl font-medium" style={{ color: '#1A1A1A', letterSpacing: '0.05em' }}>
                  {result.wade || '—'}
                </p>
                {result.wade && result.wade !== '?' && (
                  <button onClick={() => copyText(result.wade)}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded border border-gray-200 hover:border-gray-400 transition-colors">
                    复制
                  </button>
                )}
              </div>
            </div>

            {/* 逐字分解 */}
            {result.chars.filter(c => c.char !== ' ').length > 0 && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                {result.chars.filter(c => c.char !== ' ').map((c, i) => (
                  <div key={i} className="flex flex-col items-center rounded-lg px-3 py-2"
                    style={{ background: '#F9FAFB', minWidth: '3.5rem' }}>
                    <span className="text-lg font-medium mb-1" style={{ color: '#1A1A1A' }}>{c.char}</span>
                    {c.wade !== '?' ? (
                      <span className="text-xs font-medium" style={{ color: ACCENT }}>{c.wade}</span>
                    ) : (
                      <span className="text-xs text-gray-300">未收录</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {result.chars.some(c => c.wade === '?') && (
              <p className="text-xs mt-2" style={{ color: '#DC2626' }}>
                「?」表示该字未在常用姓名字库中，仅收录约170个常用字
              </p>
            )}
          </div>
        )}

        {/* 说明 */}
        <div className="mt-8 rounded-xl px-4 py-4 text-xs leading-relaxed text-gray-500"
          style={{ background: '#F9FAFB', border: '1px solid #E5E7EB' }}>
          <p className="font-medium text-gray-600 mb-2">关于威妥玛式拼音</p>
          <p>威妥玛拼音（Wade-Giles Romanization）由英国外交官威妥玛（Thomas Wade）于19世纪创制，长期用于英语世界的中文人名地名拼写。</p>
          <p className="mt-2">主要差异：zh/ch/sh → ch/ch'/sh，x → hs，q → ch'，j → ch，g → k，z/c → ts/ts'。</p>
          <p className="mt-2">许多海外华人及涉台文件仍使用威妥玛式或其变体，如 Chang（张）、Hsieh（谢）、Chiang（蒋）。</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-sm justify-center">
          <Link href="/name-to-pinyin" className="underline" style={{ color: ACCENT }}>姓名转汉语拼音</Link>
          <span className="text-gray-300">·</span>
          <Link href="/search" className="underline" style={{ color: ACCENT }}>查既定译名</Link>
          <span className="text-gray-300">·</span>
          <Link href="/convert" className="underline" style={{ color: ACCENT }}>外文名音译</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
