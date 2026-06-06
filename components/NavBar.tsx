'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// 按任务划分，不按语言/数据源。语言收进搜索结果做分组标签，永不进导航。
const NAV_ITEMS = [
  { label: '查译名', href: '/' },
  { label: '外文音译', href: '/convert' },
  { label: '中文名转拼音', href: '/name-to-pinyin' },
  { label: '机构职位翻译', href: '/gov-titles' },
  { label: '各国人名规则', href: '/naming-rules' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // 路由切换时关闭菜单
  useEffect(() => { setOpen(false); }, [pathname]);

  // 打开时锁定 body 滚动
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full border-b border-gray-100"
        style={{ background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', borderLeft: '3px solid #B5271A' }}
      >
        <div className="max-w-5xl mx-auto px-4 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 shrink-0">
            <Image
              src="/logo-icon.png"
              alt="外文译名词典"
              width={64}
              height={64}
              style={{ width: '64px', height: '64px', borderRadius: '8px' }}
            />
            <span
              style={{ fontFamily: 'var(--font-serif)', color: '#1A1A1A', fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.01em', marginLeft: '-6px' }}
            >
              外文译名词典
            </span>
          </Link>

          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* 移动端汉堡按钮 */}
          <button
            type="button"
            aria-label={open ? '关闭菜单' : '打开菜单'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg transition-colors hover:bg-gray-50"
          >
            <span
              className="block w-5 h-0.5 bg-gray-600 transition-all duration-200"
              style={{ transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-5 h-0.5 bg-gray-600 my-1 transition-all duration-200"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block w-5 h-0.5 bg-gray-600 transition-all duration-200"
              style={{ transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </nav>

      {/* 移动端菜单 overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40"
          style={{ top: '72px' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.2)' }}
          />
          <div
            className="absolute left-0 right-0 top-0 shadow-lg"
            style={{ background: '#fff' }}
            onClick={e => e.stopPropagation()}
          >
            {NAV_ITEMS.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-6 py-4 text-base border-b border-gray-50 transition-colors"
                  style={{
                    color: active ? '#2C5F8A' : '#374151',
                    background: active ? '#F0F5FA' : 'transparent',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
