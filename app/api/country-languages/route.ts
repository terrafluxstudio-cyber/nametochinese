import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'country_languages.json');
  try {
    const data = JSON.parse(readFileSync(filePath, 'utf8'));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({});
  }
}
