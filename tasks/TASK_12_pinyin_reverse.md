# TASK_12：拼音→中文姓名反查工具 /pinyin

## 目标
输入中国人名的拼音写法（如 "Zhang Wei"、"wang fang"），
自动列出最可能对应的中文姓名，按频率排序。

核心价值：老外文件中只有拼音，翻译者不用逐字猜。

---

## 步骤一：从现有数据库提取姓名字频统计

创建 `scripts/build_pinyin_index.mjs`：

```js
import { createClient } from '@libsql/client';
import { writeFileSync } from 'fs';
import { mkdirSync } from 'fs';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

mkdirSync('./data', { recursive: true });

// ── 1. 提取所有中文人名（仅国籍为中国的记录）
console.log('查询中文人名...');
const result = await db.execute({
  sql: `SELECT chinese FROM persons WHERE nationality LIKE '%中%' AND chinese IS NOT NULL LIMIT 200000`,
  args: [],
});

const names = result.rows.map(r => r.chinese).filter(Boolean);
console.log(`共 ${names.length} 条中文人名`);

// ── 2. 分离姓和名（中文名一般第一个字是姓）
const surnameFreq = new Map();  // 姓汉字 → 出现次数
const givenCharFreq = new Map(); // 名用字 → 出现次数

for (const name of names) {
  if (!name || name.length < 2) continue;
  const surname = name[0];
  const given = name.slice(1);

  surnameFreq.set(surname, (surnameFreq.get(surname) || 0) + 1);
  for (const char of given) {
    givenCharFreq.set(char, (givenCharFreq.get(char) || 0) + 1);
  }
}

// ── 3. 构建拼音→汉字映射（需要 pinyin 库）
// npm install pinyin --save-dev
import pinyin from 'pinyin';

// 姓的拼音映射
const surnamePinyinMap = {}; // 拼音 → [{char, freq}]
for (const [char, freq] of surnameFreq.entries()) {
  const py = pinyin(char, { style: pinyin.STYLE_NORMAL })[0]?.[0];
  if (!py) continue;
  if (!surnamePinyinMap[py]) surnamePinyinMap[py] = [];
  surnamePinyinMap[py].push({ char, freq });
}
// 每个拼音下按频率排序
for (const py of Object.keys(surnamePinyinMap)) {
  surnamePinyinMap[py].sort((a, b) => b.freq - a.freq);
}

// 名字用字的拼音映射
const givenPinyinMap = {}; // 拼音 → [{char, freq}]
for (const [char, freq] of givenCharFreq.entries()) {
  if (freq < 5) continue; // 低频字过滤
  const py = pinyin(char, { style: pinyin.STYLE_NORMAL })[0]?.[0];
  if (!py) continue;
  if (!givenPinyinMap[py]) givenPinyinMap[py] = [];
  givenPinyinMap[py].push({ char, freq });
}
for (const py of Object.keys(givenPinyinMap)) {
  givenPinyinMap[py].sort((a, b) => b.freq - a.freq);
  givenPinyinMap[py] = givenPinyinMap[py].slice(0, 15); // 每个音节保留前15
}

writeFileSync('./data/surname_pinyin.json', JSON.stringify(surnamePinyinMap, null, 2));
writeFileSync('./data/given_pinyin.json', JSON.stringify(givenPinyinMap, null, 2));

console.log(`姓拼音种类：${Object.keys(surnamePinyinMap).length}`);
console.log(`名字拼音种类：${Object.keys(givenPinyinMap).length}`);
console.log('示例 zhang →', surnamePinyinMap['zhang']?.slice(0, 5));
console.log('示例 wei →', givenPinyinMap['wei']?.slice(0, 5));
```

```bash
npm install pinyin --save-dev
node --env-file=.env.local scripts/build_pinyin_index.mjs
```

验收：
- `data/surname_pinyin.json` 生成，`zhang` 对应张/章/樟等
- `data/given_pinyin.json` 生成，`wei` 对应伟/威/微/薇等

---

## 步骤二：创建 API

创建 `app/api/pinyin-lookup/route.ts`：

```ts
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

type CharFreq = { char: string; freq: number };

function loadJSON(filename: string): Record<string, CharFreq[]> {
  const p = path.join(process.cwd(), 'data', filename);
  return JSON.parse(readFileSync(p, 'utf8'));
}

// 服务启动时加载到内存
const surnameMap = loadJSON('surname_pinyin.json');
const givenMap = loadJSON('given_pinyin.json');

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';
  if (!raw) return NextResponse.json({ error: 'missing q' }, { status: 400 });

  // 解析输入：按空格或连字号分割
  const parts = raw.split(/[\s\-]+/).filter(Boolean);
  if (parts.length < 2) {
    return NextResponse.json({ error: '请输入姓和名，用空格分隔，如：zhang wei' }, { status: 400 });
  }

  const surnamePy = parts[0];
  const givenParts = parts.slice(1); // 名可能是一个或两个音节

  // 姓的候选
  const surnameCandidates = (surnameMap[surnamePy] ?? []).slice(0, 8);

  // 名的候选：每个音节独立查，再组合
  const givenCandidatesByPart = givenParts.map(py =>
    (givenMap[py] ?? []).slice(0, 10)
  );

  // 生成组合（笛卡尔积，按频率乘积排序，最多返回20个组合）
  function cartesian(arrays: CharFreq[][]): { chars: string; score: number }[] {
    if (arrays.length === 0) return [];
    return arrays.reduce<{ chars: string; score: number }[]>(
      (acc, arr) => {
        if (acc.length === 0) return arr.map(c => ({ chars: c.char, score: c.freq }));
        return acc.flatMap(prev =>
          arr.map(c => ({ chars: prev.chars + c.char, score: prev.score * c.freq }))
        );
      },
      []
    ).sort((a, b) => b.score - a.score).slice(0, 20);
  }

  const givenCombinations = cartesian(givenCandidatesByPart);

  // 最终组合：姓+名，按姓频率×名频率排序
  const results: { name: string; surname: string; given: string; score: number }[] = [];
  for (const s of surnameCandidates.slice(0, 5)) {
    for (const g of givenCombinations.slice(0, 8)) {
      results.push({
        name: s.char + g.chars,
        surname: s.char,
        given: g.chars,
        score: s.freq * g.score,
      });
    }
  }
  results.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    input: raw,
    surnamePinyin: surnamePy,
    givenPinyin: givenParts.join(' '),
    surnameCandidates,
    givenCombinations: givenCombinations.slice(0, 10),
    topResults: results.slice(0, 20),
  });
}
```

测试：
```bash
curl "http://localhost:3000/api/pinyin-lookup?q=zhang+wei"
curl "http://localhost:3000/api/pinyin-lookup?q=wang+fang"
curl "http://localhost:3000/api/pinyin-lookup?q=li+jing+ling"
```

---

## 步骤三：创建 /pinyin 页面

创建 `app/pinyin/page.tsx`：

```tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';

type CharFreq = { char: string; freq: number };
type Result = {
  input: string;
  surnamePinyin: string;
  givenPinyin: string;
  surnameCandidates: CharFreq[];
  givenCombinations: { chars: string; score: number }[];
  topResults: { name: string; surname: string; given: string; score: number }[];
};

export default function PinyinPage() {
  const [q, setQ] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function lookup(query: string) {
    if (!query.trim()) { setResult(null); setError(''); return; }
    setLoading(true);
    setError('');
    const res = await fetch(`/api/pinyin-lookup?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.error) { setError(data.error); setResult(null); }
    else setResult(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto" style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}>
      <div className="mb-8 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← 返回查询</Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
        拼音反查中文姓名
      </h1>
      <p className="text-center text-gray-500 text-sm mb-2">
        输入中国人名的拼音，自动列出最可能的中文姓名
      </p>
      <p className="text-center text-gray-400 text-xs mb-10">
        姓和名之间用空格分隔，如：zhang wei &nbsp;·&nbsp; wang fang &nbsp;·&nbsp; li jing ling
      </p>

      {/* 输入框 */}
      <div className="flex gap-2 mb-8">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && lookup(q)}
          placeholder="zhang wei"
          className="flex-1 text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200"
          style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', fontFamily: 'monospace' }}
          autoFocus
        />
        <button
          onClick={() => lookup(q)}
          className="px-6 py-4 rounded-2xl text-white text-sm font-medium"
          style={{ background: '#2C5F8A' }}
        >
          查
        </button>
      </div>

      {error && <p className="text-center text-red-400 text-sm mb-4">{error}</p>}
      {loading && <p className="text-center text-gray-400">分析中…</p>}

      {result && !loading && (
        <div className="space-y-6">
          {/* 最可能的姓名 */}
          <div>
            <p className="text-xs text-gray-400 mb-3 font-medium tracking-wide uppercase">
              最可能的中文姓名（按频率排序）
            </p>
            <div className="grid grid-cols-2 gap-2">
              {result.topResults.slice(0, 12).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    background: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    opacity: i < 3 ? 1 : i < 6 ? 0.85 : 0.65,
                  }}
                >
                  <span
                    className="text-xl font-medium"
                    style={{ color: i === 0 ? '#2C5F8A' : '#1A1A1A' }}
                  >
                    {r.name}
                  </span>
                  <span className="text-xs text-gray-300 font-mono ml-auto">
                    {i === 0 ? '最可能' : `#${i + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 姓的候选 */}
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
              "{result.surnamePinyin}" 对应的姓
            </p>
            <div className="flex flex-wrap gap-2">
              {result.surnameCandidates.map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: '#fff',
                    color: i === 0 ? '#2C5F8A' : '#374151',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    fontWeight: i === 0 ? 600 : 400,
                  }}
                >
                  {c.char}
                </span>
              ))}
            </div>
          </div>

          {/* 名的候选 */}
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
              "{result.givenPinyin}" 对应的名
            </p>
            <div className="flex flex-wrap gap-2">
              {result.givenCombinations.slice(0, 12).map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: '#fff',
                    color: i === 0 ? '#2C5F8A' : '#374151',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    fontWeight: i === 0 ? 600 : 400,
                  }}
                >
                  {c.chars}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-300 text-center pt-2">
            频率基于数据库统计，仅供参考，具体以本人文件为准
          </p>
        </div>
      )}
    </main>
  );
}
```

---

## 步骤四：首页添加入口

在 `app/page.tsx` 链接区域追加：

```tsx
<Link href="/pinyin" className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
  拼音反查中文名 →
</Link>
```

---

## 完成后报告

1. `data/surname_pinyin.json` 中 `zhang`、`wang`、`li` 各有几个候选汉字
2. `data/given_pinyin.json` 中 `wei`、`fang` 各有几个候选
3. `/api/pinyin-lookup?q=zhang+wei` 返回的 topResults 前5个是什么
4. `/pinyin` 页面截图（输入 zhang wei 的结果）
5. 有无报错
