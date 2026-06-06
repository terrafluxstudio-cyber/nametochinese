import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const t0 = Date.now();
  try {
    await db.execute('SELECT 1');
    const dbMs = Date.now() - t0;
    return NextResponse.json({ ok: true, dbMs });
  } catch (e) {
    const dbMs = Date.now() - t0;
    return NextResponse.json({ ok: false, dbMs, error: String(e) }, { status: 500 });
  }
}
