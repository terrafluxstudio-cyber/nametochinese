// 保守缓存策略：动态内容永远走网络（绝不回旧数据），只缓存带 hash 的静态资源 + 图标，
// 离线时用首页兜底。满足 PWA 可安装性（有 fetch handler），但不冒「看到旧搜索结果」的险。
const CACHE = 'ntc-v1';
const OFFLINE_FALLBACK = '/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.add(OFFLINE_FALLBACK)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return; // 写操作不碰
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // 只管同源
  if (url.pathname.startsWith('/api/')) return; // API 一律走网络，不缓存

  // 带 hash 的构建产物 + 静态图标/字体：cache-first 安全（内容变→URL 变）
  const isHashedStatic =
    url.pathname.startsWith('/_next/static/') ||
    /\.(png|webp|ico|svg|woff2?)$/i.test(url.pathname);

  if (isHashedStatic) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((resp) => {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return resp;
          })
      )
    );
    return;
  }

  // 页面/其它：network-first（在线永远最新），离线时兜底首页
  event.respondWith(
    fetch(request).catch(() =>
      caches.match(request).then((cached) => cached || caches.match(OFFLINE_FALLBACK))
    )
  );
});
