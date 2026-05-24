'use client';
import { useState } from 'react';
import Link from 'next/link';

type RuName = {
  russian: string;
  chinese: string;
  gender: string;
  patronymic_ru: string;
  patronymic_zh: string;
  nicknames: string;
};

export default function RuPage() {
  const [q, setQ] = useState('');
  const [gender, setGender] = useState('');
  const [results, setResults] = useState<RuName[]>([]);
  const [loading, setLoading] = useState(false);

  async function search(query: string, g: string) {
    if (query.length < 1) { setResults([]); return; }
    setLoading(true);
    const res = await fetch(`/api/search-ru?q=${encodeURIComponent(query)}&gender=${g}`);
    setResults(await res.json());
    setLoading(false);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQ(v);
    search(v, gender);
  }

  function handleGender(g: string) {
    const next = gender === g ? '' : g;
    setGender(next);
    search(q, next);
  }

  return (
    <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="mb-8 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← 英文名查询</Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
        俄语人名查询
      </h1>
      <p className="text-center text-gray-500 text-sm mb-8">输入俄文名或中文音译</p>

      <input
        value={q}
        onChange={handleInput}
        placeholder="Александр / 亚历山大"
        className="w-full text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200 mb-4"
        style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
        autoFocus
      />

      <div className="flex gap-2 mb-8 justify-center">
        {[['全部', ''], ['女名', 'F'], ['男名', 'M']].map(([label, val]) => (
          <button
            key={val}
            onClick={() => handleGender(val)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${
              gender === val
                ? 'text-white'
                : 'text-gray-500 border border-gray-200 hover:border-gray-400'
            }`}
            style={gender === val ? { background: '#2C5F8A' } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-400">查询中…</p>}

      <div className="space-y-3">
        {results.map((r, i) => (
          <div
            key={i}
            className="rounded-xl px-5 py-4"
            style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-xl font-medium" style={{ color: '#1A1A1A' }}>{r.russian}</span>
              <span className="text-lg" style={{ color: '#2C5F8A' }}>{r.chinese}</span>
              <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ background: '#E8EDF2', color: '#6B7280' }}>
                {r.gender === 'F' ? '女' : '男'}
              </span>
            </div>
            {r.patronymic_ru && (
              <div className="text-sm text-gray-500">
                父名：{r.patronymic_ru}
                {r.patronymic_zh && <span className="ml-1 text-gray-400">({r.patronymic_zh})</span>}
              </div>
            )}
            {r.nicknames && (
              <div className="text-sm text-gray-400 mt-1">
                小名：{r.nicknames.split(',').join('、')}
              </div>
            )}
          </div>
        ))}
      </div>

      {results.length === 0 && q.length > 0 && !loading && (
        <p className="text-center text-gray-400 mt-8">未找到结果</p>
      )}
    </main>
  );
}
