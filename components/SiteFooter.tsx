import Link from 'next/link';

// 全站统一页脚：内链互通 + 回首页 + 音译入口。每页都放，告诉用户站内能做什么。
const ACCENT = '#2C5F8A';

const GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: '人名',
    links: [
      { href: '/search', label: '综合查询' },
      { href: '/ru', label: '俄语人名' },
      { href: '/ko', label: '韩国人名' },
      { href: '/ja', label: '日本人名' },
    ],
  },
  {
    title: '音译 / 地名',
    links: [
      { href: '/convert', label: '外文音译表' },
      { href: '/places', label: '地名查译' },
    ],
  },
  {
    title: '中文工具',
    links: [
      { href: '/name-to-pinyin', label: '姓名转拼音' },
      { href: '/pinyin', label: '拼音找名' },
      { href: '/zh-convert', label: '简繁转换' },
    ],
  },
  {
    title: '参考',
    links: [
      { href: '/naming-rules', label: '各国人名规则' },
      { href: '/gov-titles', label: '机构职位翻译' },
    ],
  },
  {
    title: '关于',
    links: [
      { href: '/about', label: '关于本站' },
      { href: '/privacy', label: '隐私政策' },
      { href: '/terms', label: '服务条款' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-x-10 gap-y-5 text-xs">
          <div>
            <Link href="/" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              ← 回首页
            </Link>
          </div>
          {GROUPS.map((g) => (
            <div key={g.title}>
              <p
                className="text-gray-300 uppercase tracking-widest mb-2"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {g.title}
              </p>
              <div className="flex flex-col gap-1">
                {g.links.map((l) => (
                  <Link key={l.href} href={l.href} className="text-gray-500 hover:underline" style={{ color: ACCENT }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[11px] text-gray-300 leading-relaxed">
          查不到既定译名？试试{' '}
          <Link href="/convert" className="underline" style={{ color: ACCENT }}>
            外文音译表
          </Link>{' '}
          按语言规则音译 · 中文名转外文用{' '}
          <Link href="/name-to-pinyin" className="underline" style={{ color: ACCENT }}>
            姓名转拼音
          </Link>
        </p>
        <p className="mt-3 text-[11px] text-gray-300">© 2026 外文译名词典 · nametochinese.com</p>
      </div>
    </footer>
  );
}
