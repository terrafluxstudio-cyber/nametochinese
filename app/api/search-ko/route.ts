import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isChinese(s: string) { return /[一-鿿]/.test(s); }
function isKorean(s: string) { return /[가-힯]/.test(s); }

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const gender = req.nextUrl.searchParams.get('gender') ?? '';
  if (q.length < 1) return NextResponse.json([]);

  let col: string;
  if (isKorean(q)) col = 'korean';
  else if (isChinese(q)) col = 'chinese';
  else col = 'english';

  const pattern = `${q}%`;
  let sql = `SELECT korean, chinese, english, gender FROM korean_names WHERE ${col} LIKE ?`;
  const args: (string | number)[] = [pattern];

  if (gender === 'M' || gender === 'F') {
    sql += ' AND gender = ?';
    args.push(gender);
  }

  sql += ` ORDER BY CASE WHEN ${col} = ? THEN 0 ELSE 1 END, length(${col}) LIMIT 30`;
  args.push(q);

  const result = await db.execute({ sql, args });
  return NextResponse.json(result.rows);
}
