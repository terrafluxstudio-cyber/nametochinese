'use client';
import { useState, useEffect, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import * as OpenCC from 'opencc-js';

type Tab = 'japanese' | 'romaji';

function hasKatakana(s: string) {
  return /[゠-ヿ]/.test(s);
}

function hasKanji(s: string) {
  return /[一-鿿㐀-䶿]/.test(s);
}

type Combination = { ja: string; zh: string; surnameJa: string; givenJa: string };
type SearchResult = {
  input: string;
  surnameMatches: { romaji: string; ja: string; zh: string }[];
  givenMatches: { romaji: string; candidates: { ja: string; zh: string }[]; gender: string }[];
  combinations: Combination[];
};

/** 片假名→中文（当 日語.json 未就绪时的兜底） */
const KATAKANA_FALLBACK: Record<string, string> = {
  アレクサンダー: '亚历山大',
  アレクサンドラ: '亚历山德拉',
  トランプ: '特朗普',
  バイデン: '拜登',
  オバマ: '奥巴马',
};

export default function JaPage() {
  const [tab, setTab] = useState<Tab>('japanese');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [romajiInput, setRomajiInput] = useState('');
  const [romajiResult, setRomajiResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const jpToCn = useMemo(() => OpenCC.Converter({ from: 'jp', to: 'cn' }), []);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (hasKatakana(input)) {
      fetch(`/api/transliterate?q=${encodeURIComponent(input)}&lang=${encodeURIComponent('日語')}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.result) {
            setOutput(data.result);
          } else {
            setOutput(KATAKANA_FALLBACK[input.trim()] ?? '');
          }
        })
        .catch(() => setOutput(KATAKANA_FALLBACK[input.trim()] ?? ''));
    } else if (hasKanji(input)) {
      setOutput(jpToCn(input));
    } else {
      setOutput('');
    }
  }, [input, jpToCn]);

  async function searchRomaji(q: string) {
    if (!q.trim()) {
      setRomajiResult(null);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/search-ja?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setRomajiResult(data);
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
        日本人名翻译
      </h1>
      <p className="text-center text-gray-500 text-sm mb-8">
        汉字·片假名→中文 / 罗马字→汉字+中文
      </p>

      <div className="flex gap-2 justify-center mb-8">
        {[
          { value: 'japanese' as Tab, label: '日文输入' },
          { value: 'romaji' as Tab, label: '罗马字输入' },
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-5 py-2 rounded-full text-sm transition-all border ${
              tab === t.value
                ? 'text-white border-transparent'
                : 'text-gray-600 border-gray-200 hover:border-gray-400 bg-white'
            }`}
            style={tab === t.value ? { background: '#2C5F8A' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'japanese' && (
        <div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入日文人名，如：田中角栄 / アレクサンダー"
            className="w-full text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200 mb-4"
            style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
            autoFocus={tab === 'japanese'}
          />

          {output && (
            <div
              className="rounded-2xl px-6 py-5"
              style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
            >
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">中文译名</p>
              <p
                className="text-3xl font-bold"
                style={{ color: '#1A1A1A', letterSpacing: '0.08em' }}
              >
                {output}
              </p>
              <p className="text-xs text-gray-300 mt-3">
                {hasKatakana(input)
                  ? '片假名按日语译音规则转换'
                  : '汉字按日→中简体对应转换'}
              </p>
            </div>
          )}

          {!output && input && (
            <p className="text-center text-gray-400 text-sm">
              未能识别，请输入日文汉字或片假名
            </p>
          )}

          <div
            className="mt-6 rounded-xl px-5 py-4 text-xs text-gray-400 leading-relaxed"
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <p className="font-medium text-gray-500 mb-1">使用说明</p>
            <p>
              · 日文<b>汉字名</b>（田中角栄）→ 自动转简体中文（田中角荣）
              <br />
              · <b>片假名名</b>（アレクサンダー）→ 按新华社日语译音规则转中文
              <br />· 如需查罗马字写法，请切换到「罗马字输入」
            </p>
          </div>
        </div>
      )}

      {tab === 'romaji' && (
        <div>
          <div className="flex gap-2 mb-4">
            <input
              value={romajiInput}
              onChange={(e) => setRomajiInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchRomaji(romajiInput)}
              placeholder="如：Tanaka Keizo / Ohtani Shohei"
              className="flex-1 text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200"
              style={{
                background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                fontFamily: 'monospace',
              }}
              autoFocus={tab === 'romaji'}
            />
            <button
              onClick={() => searchRomaji(romajiInput)}
              className="px-6 py-4 rounded-2xl text-white text-sm font-medium"
              style={{ background: '#2C5F8A' }}
            >
              查
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mb-6">
            姓在前或名在前均可，用空格分隔
          </p>

          {loading && <p className="text-center text-gray-400">查询中…</p>}

          {romajiResult && !loading && (
            <div className="space-y-4">
              {romajiResult.combinations.length > 0 ? (
                <>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    候选译名（按常见度排序）
                  </p>
                  {romajiResult.combinations.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-4 rounded-xl"
                      style={{
                        background: '#fff',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
                        opacity: i === 0 ? 1 : i < 3 ? 0.85 : 0.65,
                      }}
                    >
                      <div className="text-center min-w-[80px]">
                        <p className="text-xs text-gray-400 mb-1">日文</p>
                        <p className="text-xl font-medium" style={{ color: '#374151' }}>
                          {c.ja}
                        </p>
                      </div>
                      <div className="text-gray-300 text-lg">→</div>
                      <div className="text-center min-w-[80px]">
                        <p className="text-xs text-gray-400 mb-1">中文</p>
                        <p
                          className="text-xl font-bold"
                          style={{ color: i === 0 ? '#2C5F8A' : '#1A1A1A' }}
                        >
                          {c.zh}
                        </p>
                      </div>
                      {i === 0 && (
                        <span
                          className="ml-auto text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#EBF3FA', color: '#2C5F8A' }}
                        >
                          最常见
                        </span>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm mb-2">未找到对应的常见姓名</p>
                  <p className="text-gray-300 text-xs">
                    可能是较罕见的姓氏，建议参考日文资料确认汉字原文
                  </p>
                </div>
              )}

              {romajiResult.surnameMatches.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
                    「{romajiResult.input.split(' ')[0]}」对应的姓
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {romajiResult.surnameMatches.map((s, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-full text-sm flex gap-2 items-center"
                        style={{
                          background: '#fff',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        }}
                      >
                        <span style={{ color: '#374151' }}>{s.ja}</span>
                        <span className="text-gray-300">→</span>
                        <span
                          style={{
                            color: '#2C5F8A',
                            fontWeight: i === 0 ? 600 : 400,
                          }}
                        >
                          {s.zh}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-300 text-center pt-2">
                仅显示常见姓名组合，具体以当事人资料为准
              </p>
            </div>
          )}
        </div>
      )}

      <footer className="mt-16 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} 外文译名词典 · nametochinese.com
      </footer>
    </main>
    </>
  );
}
