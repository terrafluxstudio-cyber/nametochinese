'use client';

import { useState, useMemo } from 'react';
import { TERMS, GROUP_ORDER, type GovTerm } from './data';

function norm(s: string) {
  return s.toLowerCase().trim();
}

function matches(t: GovTerm, q: string) {
  if (!q) return true;
  const n = norm(q);
  return (
    t.zh.toLowerCase().includes(n) ||
    t.en.toLowerCase().includes(n) ||
    (t.abbr?.toLowerCase().includes(n) ?? false) ||
    (t.note?.toLowerCase().includes(n) ?? false)
  );
}

function TermRow({ t }: { t: GovTerm }) {
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-base font-medium" style={{ color: '#1A1A1A' }}>
          {t.zh}
        </span>
        <span className="text-base" style={{ color: '#2C5F8A', fontFamily: 'var(--font-geist-mono)' }}>
          {t.en}
        </span>
        {t.abbr && (
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{ background: '#EBF3FA', color: '#2C5F8A', fontFamily: 'var(--font-geist-mono)' }}
          >
            {t.abbr}
          </span>
        )}
        {t.status === '历史' && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">已撤并</span>
        )}
      </div>
      {(t.note || t.level) && (
        <p className="text-xs text-gray-400 mt-1">
          {t.level && <span className="mr-2">[{t.level}]</span>}
          {t.note}
        </p>
      )}
    </div>
  );
}

const CAT_ORDER: GovTerm['category'][] = ['机构', '职位', '通名'];

export default function GovTitlesClient() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(GROUP_ORDER.map((g) => [g, false]))
  );
  const [side, setSide] = useState<'all' | 'cn' | 'foreign'>('all');
  const [cat, setCat] = useState<'all' | GovTerm['category']>('all');

  const filtered = useMemo(
    () =>
      TERMS.filter(
        (t) =>
          (side === 'all' || t.side === side) &&
          (cat === 'all' || t.category === cat) &&
          matches(t, q)
      ),
    [q, side, cat]
  );

  const groups = useMemo(() => {
    const map = new Map<string, GovTerm[]>();
    for (const t of filtered) {
      if (!map.has(t.group)) map.set(t.group, []);
      map.get(t.group)!.push(t);
    }
    // 按 GROUP_ORDER 排序，未列出的排后面
    const rank = (g: string) => {
      const i = GROUP_ORDER.indexOf(g);
      return i === -1 ? 999 : i;
    };
    return [...map.entries()].sort((a, b) => rank(a[0]) - rank(b[0]));
  }, [filtered]);

  const searching = q.trim().length > 0;

  return (
    <div>
      {/* 顶部模糊搜索 */}
      <div className="sticky top-[72px] z-10 -mx-4 px-4 py-3 mb-6" style={{ background: '#F7F5F0' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜机构或职位，中英文均可：发改委 · NDRC · 部长 · Minister…"
          className="w-full text-base px-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#2C5F8A]/30"
          style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
          autoFocus
        />
        <div className="flex gap-2 mt-3 flex-wrap">
          {([
            ['all', '全部'],
            ['cn', '中国'],
            ['foreign', '国际·各国'],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setSide(val)}
              className="px-3 py-1 rounded-full text-sm transition-colors"
              style={
                side === val
                  ? { background: '#2C5F8A', color: '#fff' }
                  : { background: '#fff', color: '#6b7280', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
              }
            >
              {label}
            </button>
          ))}
          <span className="w-px self-stretch bg-gray-200 mx-1" />
          {([
            ['all', '不限'],
            ['机构', '机构名称'],
            ['职位', '职位'],
            ['通名', '通名'],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setCat(val)}
              className="px-3 py-1 rounded-full text-sm transition-colors"
              style={
                cat === val
                  ? { background: '#8A5A2C', color: '#fff' }
                  : { background: '#fff', color: '#6b7280', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">未收录「{q}」</p>
      )}

      <div className="space-y-5">
        {groups.map(([group, items]) => {
          const isOpen = searching || open[group];
          return (
            <section key={group} className="rounded-2xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}>
              <button
                onClick={() => setOpen((o) => ({ ...o, [group]: !o[group] }))}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                disabled={searching}
              >
                <span className="font-semibold" style={{ color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}>
                  {group}
                  <span className="text-xs text-gray-400 ml-2 font-normal">{items.length}</span>
                </span>
                {!searching && (
                  <span className="text-gray-400 text-sm">{isOpen ? '▾' : '▸'}</span>
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-3">
                  {CAT_ORDER.map((c) => {
                    const sub = items.filter((t) => t.category === c);
                    if (!sub.length) return null;
                    // 单一分类时不必再标小标题
                    const showHead = items.some((t) => t.category !== c);
                    return (
                      <div key={c} className="pt-1">
                        {showHead && (
                          <div
                            className="text-xs font-semibold tracking-wide mt-3 mb-1"
                            style={{ color: c === '机构' ? '#2C5F8A' : c === '职位' ? '#8A5A2C' : '#6b7280' }}
                          >
                            {c === '机构' ? '机构名称' : c === '通名' ? '通名' : '职位'}
                          </div>
                        )}
                        {sub.map((t, i) => (
                          <TermRow key={i} t={t} />
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
