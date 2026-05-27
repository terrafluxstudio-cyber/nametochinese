'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';

type KoName = {
  korean: string;
  chinese: string | null;
  english: string;
  gender: string;
};

function KoPageContent() {
  const [q, setQ] = useState('');
  const [gender, setGender] = useState('');
  const [results, setResults] = useState<KoName[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlQ = searchParams.get('q');
    if (urlQ) {
      setQ(urlQ);
      search(urlQ, '');
    }
  }, []);

  async function search(query: string, g: string) {
    if (query.length < 1) { setResults([]); return; }
    setLoading(true);
    const res = await fetch(`/api/search-ko?q=${encodeURIComponent(query)}&gender=${g}`);
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
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
        韩国人名查询
      </h1>
      <p className="text-center text-gray-500 text-sm mb-8">
        输入韩文名、中文汉字名或英文拼音
      </p>

      <input
        value={q}
        onChange={handleInput}
        placeholder="서준 / 瑞俊 / Seojun"
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
              gender === val ? 'text-white' : 'text-gray-500 border border-gray-200 hover:border-gray-400'
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

      {results.length === 0 && q.length > 0 && !loading && (
        <p className="text-center text-gray-400 mt-8">未找到结果</p>
      )}

      <p className="text-center text-xs text-gray-300 mt-16">
        数据来源：韩国统计厅热门名字（1940–2021），仅含有汉字名的条目
      </p>
    </main>
    </>
  );
}

export default function KoPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 py-16">加载中…</p>}>
      <KoPageContent />
    </Suspense>
  );
}
