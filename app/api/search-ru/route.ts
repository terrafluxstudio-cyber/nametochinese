import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function isChinese(s: string) {
  return /[一-鿿]/.test(s);
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const gender = req.nextUrl.searchParams.get('gender') ?? '';

  if (q.length < 1) return NextResponse.json([]);

  const col = isChinese(q) ? 'chinese' : 'russian';
  const pattern = `${q}%`;

  let sql = `SELECT russian, chinese, gender, patronymic_ru, patronymic_zh, nicknames
             FROM russian_names WHERE ${col} LIKE ?`;
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
