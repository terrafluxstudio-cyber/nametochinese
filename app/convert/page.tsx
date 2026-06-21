'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import SearchInput from '@/components/SearchInput';
import Link from 'next/link';

type Segment = { input: string; output: string; color: number; missing?: boolean };
type Result = { result: string; segments: Segment[]; language: string; hasRules: boolean; hasMissing?: boolean };
type LangTable = {
  language: string;
  raw_note?: string;
  tables: { type: string; headers: string[]; rows: { key: string; values: string[] }[] }[];
};
type CountryInfo = { emoji: string; continent: string; tables: string[] };

const MISSING_COLOR = '#DC2626';
const COLORS = ['#4A90D9','#E67E5A','#5DBE7A','#D4A843','#8B6DB5','#DB6B8A','#48A8A8','#9B7B5A'];
const CONTINENTS = ['亚洲','欧洲','非洲','美洲','大洋洲'];

// 非拉丁字母表（原文需要特殊字符输入，不适合直接拼英文名）
const NON_LATIN_TABLES = new Set([
  '阿拉伯語','波斯語','俄語','印地語','泰語','緬甸語','高棉語','老撾語',
  '蒙古語','孟加拉語','泰米爾語','僧伽羅語','普什圖語','烏爾都語',
  '阿姆哈拉語','希伯來語','保加利亞語','塞爾維亞語','希臘語',
  '立陶宛語','拉脫維亞語','愛沙尼亞語',
]);

// 纯拉丁字母表（直接输入拉丁字母名字即可）
const LATIN_TABLES = new Set([
  '英語','法語','德語','西班牙語','意大利語','葡萄牙語','波蘭語','荷蘭語',
  '瑞典語','挪威語','芬蘭語','丹麥語','捷克語','匈牙利語','羅馬尼亞語',
  '阿爾巴尼亞語','土耳其語','冰島語','威爾士語','愛爾蘭語','馬爾他語',
  '印尼語','馬來語','他加祿語','斯瓦希里語','豪萨语','沃洛夫語','索馬里語',
  '班圖語','茨瓦納語','南非語','馬達加斯加語','斐濟語','拉丁語',
]);

/** 根据选中国家的表，判断输入语言类型并给出引导文字 */
function getInputHint(tables: string[]): { text: string; warn: boolean } | null {
  if (!tables.length) return null;
  const allNonLatin = tables.every(t => NON_LATIN_TABLES.has(t));
  const hasLatin = tables.some(t => LATIN_TABLES.has(t));
  const hasNonLatin = tables.some(t => NON_LATIN_TABLES.has(t));

  if (allNonLatin) {
    return {
      text: '⚠️ 此表用于原文非拉丁字母名字的音译（如阿拉伯文、西里尔字母、泰文等）。英文名请选「英国」或「美国」。',
      warn: true,
    };
  }
  if (hasNonLatin && hasLatin) {
    return {
      text: '此国家使用多种文字，请根据名字来源选择对应表。英文名对应「英语」表。',
      warn: false,
    };
  }
  return null;
}

/** 语言显示名（繁→简） */
const LANG_DISPLAY: Record<string, string> = {
  '俄語':'俄语','英語':'英语','法語':'法语','德語':'德语','西班牙語':'西班牙语',
  '意大利語':'意大利语','葡萄牙語':'葡萄牙语','波蘭語':'波兰语','荷蘭語':'荷兰语',
  '瑞典語':'瑞典语','挪威語':'挪威语','芬蘭語':'芬兰语','丹麥語':'丹麦语',
  '捷克語':'捷克语','匈牙利語':'匈牙利语','塞爾維亞語':'塞尔维亚语','保加利亞語':'保加利亚语',
  '羅馬尼亞語':'罗马尼亚语','希臘語':'希腊语','阿爾巴尼亞語':'阿尔巴尼亚语','土耳其語':'土耳其语',
  '立陶宛語':'立陶宛语','拉脫維亞語':'拉脱维亚语','愛沙尼亞語':'爱沙尼亚语','冰島語':'冰岛语',
  '威爾士語':'威尔士语','愛爾蘭語':'爱尔兰语','馬爾他語':'马耳他语','阿拉伯語':'阿拉伯语',
  '波斯語':'波斯语','印地語':'印地语','泰語':'泰语','緬甸語':'缅甸语','馬來語':'马来语',
  '印尼語':'印尼语','希伯來語':'希伯来语','孟加拉語':'孟加拉语','泰米爾語':'泰米尔语',
  '烏爾都語':'乌尔都语','普什圖語':'普什图语','僧伽羅語':'僧伽罗语','高棉語':'高棉语',
  '老撾語':'老挝语','蒙古語':'蒙古语','他加祿語':'他加禄语','尼泊爾語':'尼泊尔语',
  '斯瓦希里語':'斯瓦希里语','豪萨语':'豪萨语','阿姆哈拉語':'阿姆哈拉语','索馬里語':'索马里语',
  '沃洛夫語':'沃洛夫语','班圖語':'班图语','茨瓦納語':'茨瓦纳语','馬達加斯加語':'马达加斯加语',
  '南非語':'南非语','拉丁語':'拉丁语','斐濟語':'斐济语',
};
function dn(lang: string) { return LANG_DISPLAY[lang] ?? lang; }

/** 版权/出处行检测：含书名号、ISBN、辞典/词典、出版社、译名室等的行一律不对外显示 */
const CITATION_RE = /《|》|ISBN|大辞典|大辭典|新华|新華|译名室|譯名室|商务|商務|词典|詞典|对外翻译|對外翻譯|译名手册|譯名手冊/;

/** 从 raw_note 提取操作性规则（剔除任何出处/版权行） */
function extractKeyRules(note: string): string[] {
  if (!note) return [];
  return note.split('\n').map(l=>l.trim()).filter(l=>
    l.length>8 && !l.startsWith('请注意') &&
    !l.startsWith('大陆') && !l.startsWith('台湾') &&
    !CITATION_RE.test(l) &&
    /[一-鿿]/.test(l)
  ).slice(0,5);
}

function SegmentRow({ segments }: { segments: Segment[] }) {
  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {segments.filter(s=>s.color>=0).map((seg,i)=>{
        const col = seg.missing ? MISSING_COLOR : COLORS[seg.color%8];
        return (
          <div key={i} className="flex flex-col items-center">
            <div className="text-xl font-medium px-2 py-1 rounded-t"
              style={{color:col,minWidth:'2rem',textAlign:'center'}}>{seg.output}</div>
            <div className="w-full h-0.5" style={{background:col,opacity:seg.missing?.5:1}}/>
            <div className="text-sm px-2 py-1 rounded-b font-mono"
              style={{color:col,minWidth:'2rem',textAlign:'center'}}>{seg.input}</div>
          </div>
        );
      })}
    </div>
  );
}

function TableView({ langTable }: { langTable: LangTable }) {
  const table = langTable.tables.find(t=>t.type==='person') ?? langTable.tables[0];
  if (!table) return null;
  const ruleLines = (langTable.raw_note??'').split('\n').map(l=>l.trim()).filter(l=>
    l.length>8 && !l.startsWith('请注意') && !l.startsWith('大陆') && !l.startsWith('台湾') &&
    !CITATION_RE.test(l)
  );
  return (
    <div className="mt-4">
      <div className="overflow-x-auto rounded-xl" style={{border:'1px solid #E5E7EB'}}>
        <table className="text-xs border-collapse w-full" style={{minWidth:'400px'}}>
          <tbody>
            {table.rows.map((row,ri)=>(
              <tr key={ri} style={{borderBottom:'1px solid #F3F4F6'}}>
                <td className="px-2 py-1.5 font-medium text-right whitespace-nowrap sticky left-0"
                  style={{background:'#F9FAFB',color:'#6B7280',minWidth:'3rem',borderRight:'1px solid #E5E7EB'}}>
                  {row.key||'—'}
                </td>
                {row.values.map((cell,ci)=>(
                  <td key={ci} className="px-2 py-1.5 text-center"
                    style={{color:cell?'#1A1A1A':'#E5E7EB',background:ri%2===0?'#fff':'#FAFAFA'}}>
                    {cell||'·'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {ruleLines.length>0 && (
        <div className="mt-3 rounded-xl overflow-hidden" style={{border:'1px solid #E5E7EB'}}>
          <div className="px-4 py-3" style={{background:'#FAFAFA'}}>
            <p className="text-xs font-semibold mb-2" style={{color:'#6B7280'}}>注记</p>
            <ul className="space-y-1">
              {ruleLines.map((l,i)=>(
                <li key={i} className="text-xs leading-relaxed" style={{color:'#374151'}}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-300 mt-2 text-right">来源：Wikipedia 外语译音表</p>
    </div>
  );
}

// 有独立地名表的语言（JSON 里存在 type=place 的 table）
const HAS_PLACE_TABLE = new Set([
  '俄語','德語','法語','西班牙語','葡萄牙語','荷蘭語','芬蘭語','老撾語','阿拉伯語',
]);

function ConvertContent() {
  const searchParams = useSearchParams();
  const [allCountries, setAllCountries] = useState<Record<string, CountryInfo>>({});
  const [selectedContinent, setSelectedContinent] = useState('亚洲');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [nameType, setNameType] = useState<'person' | 'place'>('person');
  const [input, setInput] = useState('');
  // 多张表的结果：{ lang: Result }
  const [results, setResults] = useState<Record<string, Result>>({});
  const [langTables, setLangTables] = useState<Record<string, LangTable>>({});
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    fetch('/api/country-tables').then(r=>r.json()).then(setAllCountries);
    // 从 URL 参数初始化人名/地名类型（挂载时立即读，不等国家数据）
    const t = searchParams.get('type');
    if (t === 'place') setNameType('place');
  },[]);

  // URL 参数预选（兼容旧 ?lang=xxx&q=xxx）
  useEffect(()=>{
    if (!Object.keys(allCountries).length) return;
    const lang = searchParams.get('lang');
    const q = searchParams.get('q')??'';
    if (lang) {
      // 找到使用该 lang 的第一个国家
      const country = Object.keys(allCountries).find(k=>allCountries[k].tables.includes(lang));
      if (country) {
        setSelectedContinent(allCountries[country].continent);
        setSelectedCountry(country);
        fetchLangTables(allCountries[country].tables);
        if (q) { setInput(q); convertAll(q, allCountries[country].tables); }
      }
    } else if (q) setInput(q);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[allCountries]);

  function fetchLangTables(tables: string[]) {
    tables.forEach(lang=>{
      fetch(`/api/lang-table?lang=${encodeURIComponent(lang)}`)
        .then(r=>r.json())
        .then(data=>{ if(data) setLangTables(prev=>({...prev,[lang]:data})); })
        .catch(()=>{});
    });
  }

  async function convertAll(text: string, tables: string[], type?: 'person' | 'place') {
    if (!text.trim() || !tables.length) return;
    const t = type ?? nameType;
    setLoading(true);
    try {
      const fetches = tables.map(lang=>{
        // 若选地名但该语言无地名表，回退到人名表
        const useType = (t === 'place' && HAS_PLACE_TABLE.has(lang)) ? 'place' : 'person';
        return fetch(`/api/transliterate?q=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}&type=${useType}`)
          .then(r=>r.json())
          .then((data:Result)=>({ lang, data, usedType: useType }));
      });
      const all = await Promise.all(fetches);
      const map: Record<string, Result> = {};
      all.forEach(({lang,data})=>{ map[lang]=data; });
      setResults(map);
    } finally { setLoading(false); }
  }

  function handleCountry(country: string) {
    setSelectedCountry(country);
    setResults({});
    const tables = allCountries[country]?.tables ?? [];
    fetchLangTables(tables);
    if (input) convertAll(input, tables);
  }

  function handleContinent(cont: string) {
    setSelectedContinent(cont);
    setSelectedCountry('');
    setResults({});
    setLangTables({});
  }

  const countryTables = selectedCountry ? (allCountries[selectedCountry]?.tables ?? []) : [];
  const countriesInContinent = Object.entries(allCountries)
    .filter(([,v])=>v.continent===selectedContinent);

  // 规则摘要（从所有选中表中提取）
  const allRules = countryTables.flatMap(lang=>{
    const t = langTables[lang];
    return t ? extractKeyRules(t.raw_note??'') : [];
  });
  const uniqueRules = [...new Set(allRules)].slice(0, 5);

  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-12 max-w-4xl mx-auto" style={{fontFamily:'Georgia, serif'}}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{color:'#1A1A1A'}}>外文名音译引擎</h1>
        <p className="text-center text-gray-500 text-sm mb-4">
          按 Wikipedia 标准译音规则，显示每段字母对应的汉字
        </p>

        <div className="text-sm leading-relaxed rounded-xl px-4 py-3 mb-8 max-w-2xl mx-auto"
          style={{background:'#FFF8E6',border:'1px solid #F0E0B0',color:'#7A5A1A'}}>
          <strong>仅用于没有通用译名的普通名字。</strong>
          音译是「字母→汉字」的逐段拼写——如 Dupont 会拼成「迪蓬」而非「杜邦」。
          知名人物请先用{' '}
          <a href="/search" style={{color:'#2C5F8A',textDecoration:'underline'}}>综合主搜</a>
          {' '}或{' '}
          <a href="/ru" style={{color:'#2C5F8A',textDecoration:'underline'}}>俄</a>
          {' / '}<a href="/ko" style={{color:'#2C5F8A',textDecoration:'underline'}}>韩</a>
          {' / '}<a href="/ja" style={{color:'#2C5F8A',textDecoration:'underline'}}>日</a>
          {' '}专库查既定译名。
        </div>

        {/* 两栏：左洲 + 右国家 */}
        <div className="flex gap-4 mb-6 items-start">
          {/* 左：洲 */}
          <div className="flex flex-col gap-1 shrink-0" style={{minWidth:'4.5rem'}}>
            {CONTINENTS.map(cont=>(
              <button key={cont} type="button" onClick={()=>handleContinent(cont)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-left transition-all"
                style={selectedContinent===cont
                  ? {background:'#2C5F8A',color:'#fff'}
                  : {background:'#F3F4F6',color:'#374151'}}>
                {cont}
              </button>
            ))}
          </div>

          {/* 右：国家按钮 */}
          <div className="flex-1 rounded-xl p-3" style={{background:'#F9FAFB',border:'1px solid #E5E7EB'}}>
            <div className="flex flex-wrap gap-1.5">
              {countriesInContinent.map(([name,info])=>(
                <button key={name} type="button" onClick={()=>handleCountry(name)}
                  className="px-2.5 py-1 rounded-full text-sm transition-all border whitespace-nowrap"
                  style={selectedCountry===name
                    ? {background:'#2C5F8A',color:'#fff',borderColor:'transparent'}
                    : {background:'#fff',color:'#374151',borderColor:'#D1D5DB'}}>
                  {info.emoji} {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 选国家后：显示用哪几张表 + 语义引导 */}
        {selectedCountry && countryTables.length > 0 && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">使用译音表：</span>
              {countryTables.map(lang=>(
                <span key={lang} className="text-xs px-2 py-0.5 rounded-full"
                  style={{background:'#E8EDF2',color:'#2C5F8A'}}>
                  {dn(lang)}
                </span>
              ))}
              {countryTables.length > 1 && (
                <span className="text-xs text-gray-400">· 将同时显示所有表的结果</span>
              )}
            </div>
            {(() => {
              const hint = getInputHint(countryTables);
              if (!hint) return null;
              return (
                <p className="text-xs leading-relaxed px-3 py-2 rounded-lg"
                  style={{
                    background: hint.warn ? '#FFF8E6' : '#F0F5FA',
                    color: hint.warn ? '#7A5A1A' : '#2C5F8A',
                    border: `1px solid ${hint.warn ? '#F0E0B0' : '#D0E0EE'}`,
                  }}>
                  {hint.text}
                </p>
              );
            })()}
          </div>
        )}

        {/* 人名 / 地名 切换（选了国家后才显示） */}
        {selectedCountry && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-400">音译类型：</span>
            {(['person','place'] as const).map(t => {
              const label = t === 'person' ? '人名' : '地名';
              const active = nameType === t;
              // 地名：仅提示无独立表，不禁用（回退人名表）
              const noPlaceTable = t === 'place' && countryTables.every(l => !HAS_PLACE_TABLE.has(l));
              return (
                <button key={t} type="button"
                  onClick={() => {
                    setNameType(t);
                    setResults({});
                    if (input) convertAll(input, countryTables, t);
                  }}
                  className="px-3 py-1 rounded-full text-xs transition-all border"
                  style={active
                    ? {background:'#2C5F8A',color:'#fff',borderColor:'transparent'}
                    : {background:'#fff',color:'#374151',borderColor:'#D1D5DB'}}>
                  {label}
                  {noPlaceTable && t === 'place' && !active && (
                    <span className="ml-1 opacity-50">（无专表）</span>
                  )}
                </button>
              );
            })}
            {nameType === 'place' && countryTables.every(l => !HAS_PLACE_TABLE.has(l)) && (
              <span className="text-xs text-gray-400">该语言无独立地名表，将按人名规则处理</span>
            )}
            {nameType === 'place' && countryTables.some(l => HAS_PLACE_TABLE.has(l)) && (
              <span className="text-xs text-gray-400">
                使用地名专表：{countryTables.filter(l => HAS_PLACE_TABLE.has(l)).map(l => dn(l)).join('、')}
              </span>
            )}
          </div>
        )}

        {/* 规则摘要 */}
        {uniqueRules.length > 0 && (
          <div className="rounded-xl px-4 py-3 mb-4 text-xs leading-relaxed"
            style={{background:'#F0F5FA',border:'1px solid #D0E0EE',color:'#2C5F8A'}}>
            <span className="font-semibold mr-2">规则摘要</span>
            {uniqueRules.map((r,i)=>(
              <span key={i}>{i>0&&<span className="mx-1.5 text-blue-300">·</span>}{r}</span>
            ))}
          </div>
        )}

        {/* 搜索框 */}
        <SearchInput
          value={input}
          onChange={(v)=>{
            setInput(v);
            if (selectedCountry) convertAll(v, countryTables);
          }}
          onSubmit={(v)=>convertAll(v, countryTables)}
          placeholder={
            !selectedCountry ? '先选国家，再输入人名' :
            countryTables.every(t => NON_LATIN_TABLES.has(t))
              ? `输入${dn(countryTables[0])}原文人名…`
              : `输入人名…`
          }
          className="mb-8"
        />

        {loading && <p className="text-center text-gray-400">转换中…</p>}

        {/* 结果区：多张表时并排显示 */}
        {!loading && Object.keys(results).length > 0 && (
          <div className={countryTables.length > 1 ? 'space-y-6' : ''}>
            {countryTables.map(lang=>{
              const res = results[lang];
              if (!res) return null;
              return (
                <div key={lang} className="rounded-2xl p-6"
                  style={{background:'#fff',boxShadow:'0 2px 16px rgba(0,0,0,0.08)'}}>
                  {countryTables.length > 1 && (
                    <p className="text-xs font-semibold mb-4 text-center"
                      style={{color:'#6B7280',letterSpacing:'0.05em'}}>
                      {dn(lang)} 译音表
                    </p>
                  )}
                  <div className="text-4xl font-bold text-center mb-6"
                    style={{color:'#1A1A1A',letterSpacing:'0.1em'}}>
                    {res.result}
                  </div>
                  <SegmentRow segments={res.segments} />
                  {res.hasMissing && (
                    <p className="text-center text-sm mt-4" style={{color:MISSING_COLOR}}>
                      标「？」处该语言表无对应汉字，需人工定字
                    </p>
                  )}
                  {!res.hasRules && (
                    <p className="text-center text-gray-400 text-sm mt-4">该语言规则表暂未收录</p>
                  )}
                  <p className="text-center text-xs text-gray-300 mt-4">
                    基于 Wikipedia 外语译音表 · 仅供参考，请以权威译名为准
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !Object.keys(results).length && selectedCountry && input && (
          <p className="text-center text-gray-400">未能转换，该语言规则可能未收录</p>
        )}

        {/* 音译表（选国家后展示，多表时逐一展示） */}
        {Object.keys(langTables).length > 0 && (
          <div className="mt-10 space-y-8">
            {countryTables.map(lang=>{
              const lt = langTables[lang];
              if (!lt) return null;
              return (
                <div key={lang}>
                  <p className="text-xs font-medium tracking-wide uppercase mb-3"
                    style={{color:'#9CA3AF'}}>
                    {dn(lang)} · Wikipedia 标准音译表
                  </p>
                  <TableView langTable={lt} />
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-10 text-center text-sm text-gray-400">
          先读：<Link href="/transliteration-characters-guide" className="underline" style={{ color: '#2C5F8A' }}>音译用字怎么选</Link>
          {' · '}
          <Link href="/naming-rules/general" className="underline" style={{ color: '#2C5F8A' }}>人名音译总则</Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

export default function ConvertPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 py-16">加载中…</p>}>
      <ConvertContent />
    </Suspense>
  );
}
