import { NextRequest, NextResponse } from 'next/server';

// 预热端点：同时暖 API 路由 + 页面 SSR 函数
// cron-job.org 每5分钟打这里

export async function GET(req: NextRequest) {
  const base = new URL(req.url).origin;
  const t0 = Date.now();

  const results = await Promise.allSettled([
    // API 路由
    fetch(`${base}/api/search?q=jo&type=person`).then(r => ({ ok: r.ok, route: '/api/search' })),
    fetch(`${base}/api/search-ru?q=%D0%90%D0%BB`).then(r => ({ ok: r.ok, route: '/api/search-ru' })),
    fetch(`${base}/api/search-ko?q=%EC%9D%B4`).then(r => ({ ok: r.ok, route: '/api/search-ko' })),
    // 页面 SSR 函数
    fetch(`${base}/search`).then(r => ({ ok: r.ok, route: '/search' })),
    fetch(`${base}/ru`).then(r => ({ ok: r.ok, route: '/ru' })),
    fetch(`${base}/ko`).then(r => ({ ok: r.ok, route: '/ko' })),
  ]);

  const routes = results.map(r =>
    r.status === 'fulfilled' ? r.value : { ok: false, route: 'unknown' }
  );

  return NextResponse.json({ ok: true, ms: Date.now() - t0, routes });
}
