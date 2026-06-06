'use client';
import { useEffect, useState } from 'react';

const ACCENT = '#012D6C';
const DISMISS_KEY = 'pwa-install-dismissed';

// beforeinstallprompt 事件类型（标准未完全收录，最小声明）
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function PwaInstall() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 注册 service worker（可安装性 + 离线兜底）
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* 注册失败不影响站点使用 */
      });
    }

    // 已安装（standalone 模式）或已 dismiss → 不显示安装提示
    const installed =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      // iOS Safari
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      /* ignore */
    }
    if (installed || dismissed) return;

    function onPrompt(e: Event) {
      e.preventDefault(); // 阻止浏览器默认 mini-infobar，自己控制时机
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    function onInstalled() {
      setVisible(false);
      setDeferred(null);
    }
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setVisible(false);
    setDeferred(null);
  }

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-white pl-4 pr-2 py-2 border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
    >
      <button
        onClick={install}
        className="text-xs font-medium text-white rounded-full px-3 py-1.5 transition-colors"
        style={{ background: ACCENT }}
      >
        📲 安装到桌面 · 下次直接打开
      </button>
      <button
        onClick={dismiss}
        aria-label="关闭"
        className="text-gray-400 hover:text-gray-600 text-sm leading-none px-1.5"
      >
        ✕
      </button>
    </div>
  );
}
