'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { pinyin } from 'pinyin-pro';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SearchInput from '@/components/SearchInput';
import SiteFooter from '@/components/SiteFooter';

// Common Chinese compound (two-character) surnames — used to segment surname vs given name.
const COMPOUND_SURNAMES = new Set([
  '欧阳', '太史', '端木', '上官', '司马', '东方', '独孤', '南宫', '万俟', '闻人',
  '夏侯', '诸葛', '尉迟', '公羊', '赫连', '澹台', '皇甫', '宗政', '濮阳', '公冶',
  '太叔', '申屠', '公孙', '慕容', '仲孙', '钟离', '长孙', '宇文', '司徒', '鲜于',
  '司空', '闾丘', '子车', '亓官', '司寇', '巫马', '公西', '颛孙', '壤驷', '公良',
  '漆雕', '乐正', '宰父', '谷梁', '拓跋', '夹谷', '轩辕', '令狐', '段干', '百里',
  '呼延', '东郭', '南门', '羊舌', '微生', '梁丘', '左丘', '东门', '西门', '南宫',
  '第五', '夏侯', '完颜', '钟离',
]);

const ACCENT = '#2C5F8A';

function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

type Conv = {
  chars: { ch: string; toned: string; plain: string }[];
  surnameLen: number;
  tonedFull: string; // Zhāng Wěi
  english: string; // Zhang Wei (surname + given joined)
  allCaps: string; // ZHANG WEI (passport style)
};

function convert(input: string): Conv | null {
  const name = input.trim().replace(/\s+/g, '');
  if (!name) return null;
  const hanRe = /[㐀-鿿]/;
  const chars = Array.from(name).filter((c) => hanRe.test(c));
  if (chars.length === 0) return null;

  const clean = chars.join('');
  // surname-aware readings (single source of truth for polyphonic surnames)
  const toned: string[] = pinyin(clean, {
    type: 'array',
    toneType: 'symbol',
    surname: 'all',
  });
  const plain: string[] = pinyin(clean, {
    type: 'array',
    toneType: 'none',
    surname: 'all',
  });

  const perChar = chars.map((ch, i) => ({
    ch,
    toned: toned[i] ?? ch,
    plain: plain[i] ?? ch,
  }));

  const surnameLen =
    chars.length >= 2 && COMPOUND_SURNAMES.has(chars[0] + chars[1]) ? 2 : 1;

  const surnamePlain = cap(plain.slice(0, surnameLen).join(''));
  const givenPlain = cap(plain.slice(surnameLen).join(''));
  const surnameToned = cap(toned.slice(0, surnameLen).join(''));
  const givenToned = cap(toned.slice(surnameLen).join(''));

  return {
    chars: perChar,
    surnameLen,
    tonedFull: [surnameToned, givenToned].filter(Boolean).join(' '),
    english: [surnamePlain, givenPlain].filter(Boolean).join(' '),
    allCaps: [surnamePlain, givenPlain].filter(Boolean).join(' ').toUpperCase(),
  };
}

function Row({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className="flex items-center gap-3 px-5 py-4 rounded-xl"
      style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}
    >
      <div className="min-w-[110px]">
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      <p className="text-xl font-medium flex-1" style={{ color: '#1A1A1A' }}>
        {value}
      </p>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors shrink-0"
      >
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
    </div>
  );
}

function NameToPinyinContent() {
  const [q, setQ] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlQ = searchParams.get('q');
    if (urlQ) setQ(urlQ);
  }, [searchParams]);

  const result = useMemo(() => convert(q), [q]);

  return (
    <>
      <NavBar />
      <main
        className="min-h-screen px-4 py-16 max-w-2xl mx-auto"
        style={{ background: '#F7F5F0' }}
      >
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}
        >
          Chinese Name → Pinyin
        </h1>
        <p className="text-center text-gray-500 text-sm mb-1">
          Type a Chinese name to get its Hanyu Pinyin with tone marks.
        </p>
        <p className="text-center text-gray-400 text-xs mb-2">
          输入中文姓名，自动转汉语拼音 · 支持生僻字与多音姓
        </p>
        <p className="text-center text-xs mb-8">
          Have only the Pinyin?{' '}
          <Link href="/pinyin" className="underline" style={{ color: '#2C5F8A' }}>
            Find the Chinese name →
          </Link>
        </p>

        <div className="mb-8">
          <SearchInput
            value={q}
            onChange={(v) => setQ(v)}
            onSubmit={(v) => setQ(v)}
            placeholder="王小明 · 单雯 · 欧阳娜娜"
            autoFocus
          />
        </div>

        {result && (
          <div className="space-y-3">
            <Row label="Pinyin (tones)" value={result.tonedFull} />
            <Row label="English form" value={result.english} />
            <Row label="ALL CAPS" value={result.allCaps} />

            {/* per-character breakdown */}
            <div
              className="rounded-xl px-5 py-4"
              style={{ background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}
            >
              <p className="text-xs text-gray-400 mb-3">Character breakdown</p>
              <div className="flex flex-wrap gap-3">
                {result.chars.map((c, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="text-2xl mb-1"
                      style={{ color: i < result.surnameLen ? ACCENT : '#1A1A1A' }}
                    >
                      {c.ch}
                    </div>
                    <div className="text-sm text-gray-600">{c.toned}</div>
                    {i < result.surnameLen && (
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        surname
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed pt-1">
              The first {result.surnameLen === 2 ? 'two characters are' : 'character is'}{' '}
              treated as the family name (placed first, as in Chinese order).
              Polyphonic surnames use their dedicated surname reading — e.g.{' '}
              单 <b>Shàn</b>, 仇 <b>Qiú</b>, 解 <b>Xiè</b>, 查 <b>Zhā</b>. For a
              few names multiple readings exist; verify against an official
              document when in doubt.
            </p>
          </div>
        )}

        {!result && q.trim() && (
          <p className="text-center text-gray-400 text-sm">
            No Chinese characters detected. 请输入中文姓名。
          </p>
        )}

        <div
          className="mt-12 rounded-xl px-5 py-4 text-xs text-gray-500 leading-relaxed"
          style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
        >
          <p className="font-medium text-gray-600 mb-1">About Hanyu Pinyin</p>
          <p>
            Hanyu Pinyin is the official romanization standard for Mandarin
            Chinese (ISO 7098). It is the system used on Chinese passports and in
            international contexts. This tool outputs Pinyin only — it does not
            produce Wade-Giles or Cantonese romanization, which have no single
            authoritative standard for personal names.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export default function NameToPinyinPage() {
  return (
    <Suspense
      fallback={<p className="text-center text-gray-400 py-16">Loading…</p>}
    >
      <NameToPinyinContent />
    </Suspense>
  );
}
