'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';

type CharFreq = { char: string; freq: number };
type Result = {
  input: string;
  surnamePinyin: string;
  givenPinyin: string;
  surnameCandidates: CharFreq[];
  givenCombinations: { chars: string; score: number }[];
  topResults: { name: string; surname: string; given: string; score: number }[];
};

function PinyinPageContent() {
  const [q, setQ] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlQ = searchParams.get('q');
    if (urlQ) {
      setQ(urlQ);
      lookup(urlQ);
    }
  }, []);

  async function lookup(query: string) {
    if (!query.trim()) {
      setResult(null);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    const res = await fetch(`/api/pinyin-lookup?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.error) {
      setError(data.error);
      setResult(null);
    } else setResult(data);
    setLoading(false);
  }

  return (
    <>
      <NavBar />
      <main
      className="min-h-screen px-4 py-16 max-w-2xl mx-auto"
      style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
    >
      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
        拼音反查中文姓名
      </h1>
      <p className="text-center text-gray-500 text-sm mb-2">
        输入中国人名的拼音，自动列出最可能的中文姓名
      </p>
      <p className="text-center text-gray-400 text-xs mb-10">
        姓和名之间用空格分隔，如：zhang wei &nbsp;·&nbsp; wang fang &nbsp;·&nbsp; li jing
        ling
      </p>

      <div className="flex gap-2 mb-8">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && lookup(q)}
          placeholder="zhang wei"
          className="flex-1 text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200"
          style={{
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            fontFamily: 'monospace',
          }}
          autoFocus
        />
        <button
          onClick={() => lookup(q)}
          className="px-6 py-4 rounded-2xl text-white text-sm font-medium"
          style={{ background: '#2C5F8A' }}
        >
          查
        </button>
      </div>

      {error && <p className="text-center text-red-400 text-sm mb-4">{error}</p>}
      {loading && <p className="text-center text-gray-400">分析中…</p>}

      {result && !loading && (
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-400 mb-3 font-medium tracking-wide uppercase">
              最可能的中文姓名（按频率排序）
            </p>
            <div className="grid grid-cols-2 gap-2">
              {result.topResults.slice(0, 12).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    opacity: i < 3 ? 1 : i < 6 ? 0.85 : 0.65,
                  }}
                >
                  <span
                    className="text-xl font-medium"
                    style={{ color: i === 0 ? '#2C5F8A' : '#1A1A1A' }}
                  >
                    {r.name}
                  </span>
                  <span className="text-xs text-gray-300 font-mono ml-auto">
                    {i === 0 ? '最可能' : `#${i + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
              &quot;{result.surnamePinyin}&quot; 对应的姓
            </p>
            <div className="flex flex-wrap gap-2">
              {result.surnameCandidates.map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: '#fff',
                    color: i === 0 ? '#2C5F8A' : '#374151',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    fontWeight: i === 0 ? 600 : 400,
                  }}
                >
                  {c.char}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
              &quot;{result.givenPinyin}&quot; 对应的名
            </p>
            <div className="flex flex-wrap gap-2">
              {result.givenCombinations.slice(0, 12).map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: '#fff',
                    color: i === 0 ? '#2C5F8A' : '#374151',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    fontWeight: i === 0 ? 600 : 400,
                  }}
                >
                  {c.chars}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-300 text-center pt-2">
            频率基于数据库统计，仅供参考，具体以本人文件为准
          </p>
        </div>
      )}
    </main>
    </>
  );
}

export default function PinyinPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 py-16">加载中…</p>}>
      <PinyinPageContent />
    </Suspense>
  );
}
