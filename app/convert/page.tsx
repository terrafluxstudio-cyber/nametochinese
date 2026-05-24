'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Segment = { input: string; output: string; color: number };
type Result = { result: string; segments: Segment[]; language: string; hasRules: boolean };

type CountryInfo = { emoji: string; languages: string[] };

const COLORS = [
  '#4A90D9',
  '#E67E5A',
  '#5DBE7A',
  '#D4A843',
  '#8B6DB5',
  '#DB6B8A',
  '#48A8A8',
  '#9B7B5A',
];

export default function ConvertPage() {
  const [countries, setCountries] = useState<Record<string, CountryInfo>>({});
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLang, setSelectedLang] = useState('');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/country-languages')
      .then(r => r.json())
      .then(setCountries);
  }, []);

  async function convert(text: string, lang: string) {
    if (!text.trim() || !lang) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/transliterate?q=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`
      );
      const data = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setInput(v);
    if (selectedLang) convert(v, selectedLang);
  }

  function handleCountry(country: string) {
    setSelectedCountry(country);
    const langs = countries[country]?.languages ?? [];
    const firstLang = langs[0] ?? '';
    setSelectedLang(firstLang);
    if (input && firstLang) convert(input, firstLang);
  }

  function handleLang(lang: string) {
    setSelectedLang(lang);
    if (input) convert(input, lang);
  }

  const currentLangs = countries[selectedCountry]?.languages ?? [];

  return (
    <main
      className="min-h-screen px-4 py-16 max-w-3xl mx-auto"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      <div className="mb-8 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">
          ← 英文名查询
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
        外文名音译引擎
      </h1>
      <p className="text-center text-gray-500 text-sm mb-10">
        按 Wikipedia 标准译音规则，显示每段字母对应的汉字
      </p>

      <div className="mb-6">
        <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">选国家</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(countries).map(([country, info]) => (
            <button
              key={country}
              type="button"
              onClick={() => handleCountry(country)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                selectedCountry === country
                  ? 'text-white border-transparent'
                  : 'text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
              style={selectedCountry === country ? { background: '#2C5F8A' } : {}}
            >
              {info.emoji} {country}
            </button>
          ))}
        </div>
      </div>

      {currentLangs.length > 1 && (
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">选语言</p>
          <div className="flex gap-2 flex-wrap">
            {currentLangs.map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLang(lang)}
                className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
                  selectedLang === lang
                    ? 'text-white border-transparent'
                    : 'text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
                style={selectedLang === lang ? { background: '#2C5F8A' } : {}}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      <input
        value={input}
        onChange={handleInput}
        placeholder={selectedCountry ? '输入人名…' : '先选国家，再输入人名'}
        disabled={!selectedCountry}
        className="w-full text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200 mb-8 disabled:opacity-40"
        style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
      />

      {loading && <p className="text-center text-gray-400">转换中…</p>}

      {result && !loading && (
        <div
          className="rounded-2xl p-8"
          style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
        >
          <div
            className="text-4xl font-bold text-center mb-8"
            style={{ color: '#1A1A1A', letterSpacing: '0.1em' }}
          >
            {result.result}
          </div>

          <div className="flex flex-wrap gap-1 justify-center">
            {result.segments
              .filter(s => s.color >= 0)
              .map((seg, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="text-xl font-medium px-2 py-1 rounded-t"
                    style={{
                      color: COLORS[seg.color % 8],
                      minWidth: '2rem',
                      textAlign: 'center',
                    }}
                  >
                    {seg.output}
                  </div>
                  <div className="w-full h-0.5" style={{ background: COLORS[seg.color % 8] }} />
                  <div
                    className="text-sm px-2 py-1 rounded-b font-mono"
                    style={{
                      color: COLORS[seg.color % 8],
                      minWidth: '2rem',
                      textAlign: 'center',
                    }}
                  >
                    {seg.input}
                  </div>
                </div>
              ))}
          </div>

          {!result.hasRules && (
            <p className="text-center text-gray-400 text-sm mt-4">该语言规则表暂未收录</p>
          )}

          <p className="text-center text-xs text-gray-300 mt-6">
            基于 Wikipedia 外语译音表 · 仅供参考，请以权威译名为准
          </p>
        </div>
      )}

      {!result && !loading && selectedCountry && input && (
        <p className="text-center text-gray-400">未能转换，该语言规则可能未收录</p>
      )}
    </main>
  );
}
