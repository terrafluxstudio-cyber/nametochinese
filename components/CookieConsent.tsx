'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const ACCENT = '#2C5F8A';
const STORAGE_KEY = 'cookie-consent'; // 'granted' | 'denied'

// 把同意状态推给 Google Consent Mode（gtag）。
// GA 默认以 denied 加载（见 layout 的 default script），这里在用户接受后 update 为 granted。
function updateConsent(granted: boolean) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // 用 arguments 形态 push，与 gtag 一致
  function gtag(..._args: unknown[]) {
    w.dataLayer!.push(arguments);
  }
  const value = granted ? 'granted' : 'denied';
  gtag('consent', 'update', {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage 不可用（隐私模式等）：显示横幅，不阻塞
    }
    if (saved === 'granted') {
      updateConsent(true); // 复访已同意：恢复授权
    } else if (saved === 'denied') {
      // 保持默认 denied，不显示
    } else {
      setVisible(true); // 未做选择：显示横幅
    }
  }, []);

  function choose(granted: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied');
    } catch {
      /* ignore */
    }
    updateConsent(granted);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie 同意 / Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-gray-200 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.08)]"
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-xs text-gray-600 leading-relaxed flex-1">
          本站使用 Cookie 进行匿名访问统计与广告（Google Analytics / AdSense）。你可以选择接受或拒绝。详见{' '}
          <Link href="/privacy" className="underline" style={{ color: ACCENT }}>
            隐私政策
          </Link>
          。
          <br />
          <span className="text-gray-400">
            We use cookies for anonymous analytics and ads. You can accept or decline — see our{' '}
            <Link href="/privacy" className="underline" style={{ color: ACCENT }}>
              Privacy Policy
            </Link>
            .
          </span>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => choose(false)}
            className="px-4 py-1.5 rounded-lg text-xs border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            拒绝 / Decline
          </button>
          <button
            onClick={() => choose(true)}
            className="px-4 py-1.5 rounded-lg text-xs text-white transition-colors"
            style={{ background: ACCENT }}
          >
            接受 / Accept
          </button>
        </div>
      </div>
    </div>
  );
}
