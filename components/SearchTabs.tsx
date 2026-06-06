'use client';

import Link from 'next/link';

// 统一 tab 条 + 软跳转。只切换"查哪个库"，不收口各库内部展示。
// 用 Next <Link>：默认客户端软跳转（URL 变不整页刷新，保体验+SEO 独立 URL），
// 同时输出可爬 <a href>，让四页互为内链。current 高亮（当前页渲染为 span，不自链）。
type TabKey = 'all' | 'ru' | 'ko' | 'ja';

const TABS: { key: TabKey; label: string; href: string }[] = [
  { key: 'all', label: '查询', href: '/search' }, // 综合 persons 67万（默认）
  { key: 'ru', label: '俄语', href: '/ru' },
  { key: 'ko', label: '韩语', href: '/ko' },
  { key: 'ja', label: '日语', href: '/ja' },
];

const baseCls = 'px-4 py-1.5 rounded-full text-sm transition-all border';

export default function SearchTabs({ current }: { current: TabKey }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
      {TABS.map((t) => {
        const active = t.key === current;
        if (active) {
          return (
            <span
              key={t.key}
              aria-current="page"
              className={`${baseCls} text-white border-transparent`}
              style={{ background: '#2C5F8A' }}
            >
              {t.label}
            </span>
          );
        }
        return (
          <Link
            key={t.key}
            href={t.href}
            className={`${baseCls} text-gray-600 border-gray-200 hover:border-gray-400 bg-white`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
