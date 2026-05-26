'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    label: '查译名',
    href: '/',
    children: [
      { label: '英文／多语言人名', href: '/#search', desc: '67万词条主库' },
      { label: '俄语人名', href: '/ru', desc: '含父称、昵称' },
      { label: '韩国人名', href: '/ko', desc: '含汉字名对照' },
      { label: '日本人名', href: '/ja', desc: '汉字·片假名·罗马字' },
      { label: '外文音译引擎', href: '/convert', desc: '70余种语言' },
    ],
  },
  {
    label: '翻译工具',
    href: '#',
    children: [
      { label: '拼音反查中文名', href: '/pinyin', desc: '拼音→最可能的汉字名' },
      { label: '简繁转换', href: '/zh-convert', desc: '台湾·香港·大陆' },
    ],
  },
  {
    label: '翻译参考',
    href: '#',
    children: [
      { label: '各语言人名规则', href: '/naming-rules', desc: '16种语言命名习惯' },
      { label: '华人英文名写法', href: '/naming-rules/sinosphere', desc: '台湾·新加坡·马来西亚' },
    ],
  },
];

export default function NavBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-gray-100"
      style={{ background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-icon.png"
            alt="外文译名词典"
            width={56}
            height={56}
            className="rounded-lg"
          />
          <span
            className="text-base font-semibold tracking-tight"
            style={{ fontFamily: 'var(--font-serif)', color: '#1A1A1A' }}
          >
            外文译名词典
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  openMenu === item.label
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
                <span className="ml-1 text-gray-400 text-xs">▾</span>
              </button>

              {openMenu === item.label && (
                <div
                  className="absolute top-full left-0 pt-1 z-50"
                  style={{ minWidth: '200px' }}
                >
                  <div
                    className="rounded-xl py-1.5 overflow-hidden"
                    style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex flex-col px-4 py-2.5 hover:bg-gray-50 transition-colors"
                        onClick={() => setOpenMenu(null)}
                      >
                        <span
                          className="text-sm font-medium"
                          style={{
                            color: pathname === child.href ? '#2C5F8A' : '#1A1A1A',
                          }}
                        >
                          {child.label}
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">{child.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
