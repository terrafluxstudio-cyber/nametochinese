'use client';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import SearchTabs from '@/components/SearchTabs';
import SearchInput from '@/components/SearchInput';
import SiteFooter from '@/components/SiteFooter';
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
type Person = { japanese: string; chinese: string; romaji: string; gender: string };

/** 片假名→中文（当 日語.json 未就绪时的兜底） */
const KATAKANA_FALLBACK: Record<string, string> = {
  アレクサンダー: '亚历山大',
  アレクサンドラ: '亚历山德拉',
  トランプ: '特朗普',
  バイデン: '拜登',
  オバマ: '奥巴马',
};

function JaPageContent() {
  const [tab, setTab] = useState<Tab>('japanese');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [romajiInput, setRomajiInput] = useState('');
  const [romajiResult, setRomajiResult] = useState<SearchResult | null>(null);
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const jpToCn = useMemo(() => OpenCC.Converter({ from: 'jp', to: 'cn' }), []);

  async function searchPersons(q: string) {
    if (!q.trim()) {
      setPersons([]);
      return;
    }
    try {
      const res = await fetch(`/api/search-ja-person?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setPersons(Array.isArray(data) ? data : []);
    } catch {
      setPersons([]);
    }
  }

  async function searchRomaji(q: string) {
    if (!q.trim()) {
      setRomajiResult(null);
      setPersons([]);
      return;
    }
    setLoading(true);
    searchPersons(q);
    const res = await fetch(`/api/search-ja?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setRomajiResult(data);
    setLoading(false);
  }

  useEffect(() => {
    const urlQ = searchParams.get('q');
    if (!urlQ) return;
    if (/^[a-zA-Z\s.-]+$/.test(urlQ.trim())) {
      setTab('romaji');
      setRomajiInput(urlQ);
      searchRomaji(urlQ);
    } else {
      setInput(urlQ);
    }
  }, []);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setPersons([]);
      return;
    }

    // 汉字名查名人库（片假名不查）
    if (hasKanji(input) && !hasKatakana(input)) {
      const t = setTimeout(() => searchPersons(input.trim()), 200);
      return () => clearTimeout(t);
    } else {
      setPersons([]);
    }
  }, [input]);

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

  const personBlock = persons.length > 0 && (
    <div className="mt-6">
      <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
        人物记录（维基百科）
      </p>
      <div className="space-y-2">
        {persons.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-3 rounded-xl"
            style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}
          >
            <div className="min-w-[90px]">
              <p className="text-xs text-gray-400 mb-0.5">日文</p>
              <p className="text-lg font-medium" style={{ color: '#374151' }}>{p.japanese}</p>
            </div>
            <div className="text-gray-300">→</div>
            <div className="min-w-[90px]">
              <p className="text-xs text-gray-400 mb-0.5">中文</p>
              <p className="text-lg font-bold" style={{ color: '#2C5F8A' }}>{p.chinese}</p>
            </div>
            {p.romaji && (
              <p className="ml-auto text-xs text-gray-400" style={{ fontFamily: 'monospace' }}>
                {p.romaji}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

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

      <SearchTabs current="ja" />

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
          <div className="mb-4">
            <SearchInput
              value={input}
              onChange={(v) => setInput(v)}
              onSubmit={(v) => setInput(v)}
              placeholder="输入日文人名，如：田中角栄 / アレクサンダー"
              autoFocus={tab === 'japanese'}
            />
          </div>

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

          {/* 片假名说明：只做音译，不查人名库 */}
          {output && hasKatakana(input) && persons.length === 0 && (
            <p className="text-xs text-gray-400 text-center mt-2">
              片假名已按日语译音规则转换。如需查人名记录，请改用汉字或罗马字输入。
            </p>
          )}

          {/* 空查询时展示常见日本名 */}
          {!input && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">常见日本名试试：</p>
              <div className="flex flex-wrap gap-2">
                {['田中角栄','大谷翔平','村上春樹','宮崎駿','黒澤明',
                  'アレクサンダー','イワン','ナターシャ','マリア'].map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setInput(name)}
                    className="px-3 py-1 rounded-full text-sm border transition-colors hover:border-gray-400"
                    style={{ background: '#fff', color: '#374151', borderColor: '#D1D5DB' }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {personBlock}

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
          <div className="mb-4">
            <SearchInput
              value={romajiInput}
              onChange={(v) => setRomajiInput(v)}
              onSubmit={(v) => searchRomaji(v)}
              placeholder="如：Shohei Ohtani / Haruki Murakami"
              mono
              autoFocus={tab === 'romaji'}
            />
          </div>

          <p className="text-xs text-gray-400 text-center mb-4">
            姓在前或名在前均可，用空格分隔
          </p>

          {/* 空查询时展示常见罗马字名 */}
          {!romajiInput && (
            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">试试：</p>
              <div className="flex flex-wrap gap-2">
                {['Shohei Ohtani','Haruki Murakami','Hayao Miyazaki',
                  'Ichiro Suzuki','Naomi Osaka','Yoko Ono',
                  'Tanaka','Sato','Suzuki'].map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => { setRomajiInput(name); searchRomaji(name); }}
                    className="px-3 py-1 rounded-full text-sm border transition-colors hover:border-gray-400 font-mono"
                    style={{ background: '#fff', color: '#374151', borderColor: '#D1D5DB' }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && <p className="text-center text-gray-400">查询中…</p>}

          {personBlock}

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

    </main>
    <SiteFooter />
    </>
  );
}

export default function JaPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 py-16">加载中…</p>}>
      <JaPageContent />
    </Suspense>
  );
}
