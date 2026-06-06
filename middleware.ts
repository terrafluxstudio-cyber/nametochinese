import { NextRequest, NextResponse } from "next/server";

// 轻量内存限速（零网络开销）
const counts = new Map<string, { n: number; t: number }>();
const WINDOW = 60_000;
const LIMIT = 60;

export function middleware(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const now = Date.now();
  const entry = counts.get(ip);

  if (!entry || now - entry.t > WINDOW) {
    counts.set(ip, { n: 1, t: now });
  } else if (entry.n >= LIMIT) {
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  } else {
    entry.n++;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
