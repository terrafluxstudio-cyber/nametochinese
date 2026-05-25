# TASK_14：日本人名工具 /ja

## 目标
两个功能，同一页面 Tab 切换：
- **Tab 1**：输入日文（汉字/片假名）→ 输出中文译名
- **Tab 2**：输入罗马字 → 输出候选（日文原字 + 中文译名）

---

## 步骤一：抓取日本姓氏数据

创建 `scripts/scrape_japanese_names.mjs`：

```js
import { writeFileSync } from 'fs';

// 抓取维基百科日本常见姓氏列表（含罗马字和汉字）
async function fetchSurnames() {
  const url = 'https://zh.wikipedia.org/w/api.php?action=parse&page=日本姓氏列表&prop=wikitext&format=json';
  const res = await fetch(url);
  const data = await res.json();
  const wikitext = data.parse.wikitext['*'];

  // 解析表格：罗马字 | 日文汉字 | 汉字中文对应
  const rows = [];
  const lines = wikitext.split('\n');
  
  for (const line of lines) {
    // 匹配表格行，格式：| Romaji || 日文汉字 || ...
    const match = line.match(/^\|\s*([A-Za-z]+)\s*\|\|\s*([一-鿿぀-ヿ]+)/);
    if (match) {
      rows.push({
        romaji: match[1].toLowerCase(),
        ja: match[2],
      });
    }
  }

  return rows;
}

// 用 opencc-js 将日文汉字转简体中文
// 注意：需要在 Node 环境跑，先 npm install opencc-js
import * as OpenCC from 'opencc-js';
const toSimplified = OpenCC.Converter({ from: 'jp', to: 'cn' });

async function main() {
  const surnames = await fetchSurnames();

  // 补充手工核心数据（维基解析可能不全，这里确保最常见200个都有）
  const coreData = [
    { romaji: 'sato', ja: '佐藤' },
    { romaji: 'suzuki', ja: '鈴木' },
    { romaji: 'takahashi', ja: '高橋' },
    { romaji: 'tanaka', ja: '田中' },
    { romaji: 'watanabe', ja: '渡辺' },
    { romaji: 'ito', ja: '伊藤' },
    { romaji: 'yamamoto', ja: '山本' },
    { romaji: 'nakamura', ja: '中村' },
    { romaji: 'kobayashi', ja: '小林' },
    { romaji: 'kato', ja: '加藤' },
    { romaji: 'yoshida', ja: '吉田' },
    { romaji: 'yamada', ja: '山田' },
    { romaji: 'sasaki', ja: '佐々木' },
    { romaji: 'yamaguchi', ja: '山口' },
    { romaji: 'matsumoto', ja: '松本' },
    { romaji: 'inoue', ja: '井上' },
    { romaji: 'kimura', ja: '木村' },
    { romaji: 'hayashi', ja: '林' },
    { romaji: 'shimizu', ja: '清水' },
    { romaji: 'yamazaki', ja: '山崎' },
    { romaji: 'mori', ja: '森' },
    { romaji: 'abe', ja: '阿部' },
    { romaji: 'ikeda', ja: '池田' },
    { romaji: 'hashimoto', ja: '橋本' },
    { romaji: 'yamashita', ja: '山下' },
    { romaji: 'ishikawa', ja: '石川' },
    { romaji: 'nakajima', ja: '中島' },
    { romaji: 'ogawa', ja: '小川' },
    { romaji: 'goto', ja: '後藤' },
    { romaji: 'okamoto', ja: '岡本' },
    { romaji: 'hasegawa', ja: '長谷川' },
    { romaji: 'murakami', ja: '村上' },
    { romaji: 'kondo', ja: '近藤' },
    { romaji: 'ishii', ja: '石井' },
    { romaji: 'saito', ja: '齊藤' },
    { romaji: 'fujita', ja: '藤田' },
    { romaji: 'nishimura', ja: '西村' },
    { romaji: 'fukuda', ja: '福田' },
    { romaji: 'ota', ja: '太田' },
    { romaji: 'miura', ja: '三浦' },
    { romaji: 'fujii', ja: '藤井' },
    { romaji: 'okada', ja: '岡田' },
    { romaji: 'matsuda', ja: '松田' },
    { romaji: 'nakagawa', ja: '中川' },
    { romaji: 'nakano', ja: '中野' },
    { romaji: 'harada', ja: '原田' },
    { romaji: 'ono', ja: '小野' },
    { romaji: 'tamura', ja: '田村' },
    { romaji: 'takeuchi', ja: '竹内' },
    { romaji: 'kaneko', ja: '金子' },
    { romaji: 'wada', ja: '和田' },
    { romaji: 'nakayama', ja: '中山' },
    { romaji: 'ishida', ja: '石田' },
    { romaji: 'ueda', ja: '上田' },
    { romaji: 'morita', ja: '森田' },
    { romaji: 'hara', ja: '原' },
    { romaji: 'shibata', ja: '柴田' },
    { romaji: 'sakai', ja: '酒井' },
    { romaji: 'koyama', ja: '小山' },
    { romaji: 'kuwahara', ja: '桑原' },
    { romaji: 'miyamoto', ja: '宮本' },
    { romaji: 'ueno', ja: '上野' },
    { romaji: 'tsuchiya', ja: '土屋' },
    { romaji: 'endo', ja: '遠藤' },
    { romaji: 'aoki', ja: '青木' },
    { romaji: 'fujiwara', ja: '藤原' },
    { romaji: 'nagai', ja: '永井' },
    { romaji: 'matsui', ja: '松井' },
    { romaji: 'maruyama', ja: '丸山' },
    { romaji: 'okabe', ja: '岡部' },
    { romaji: 'imai', ja: '今井' },
    { romaji: 'kawaguchi', ja: '川口' },
    { romaji: 'tsujimoto', ja: '辻本' },
    { romaji: 'miyazaki', ja: '宮崎' },
    { romaji: 'nagata', ja: '永田' },
    { romaji: 'ohara', ja: '大原' },
    { romaji: 'kubo', ja: '久保' },
    { romaji: 'nishida', ja: '西田' },
    { romaji: 'tanimoto', ja: '谷本' },
    { romaji: 'sakamoto', ja: '坂本' },
    { romaji: 'hirano', ja: '平野' },
    { romaji: 'maeda', ja: '前田' },
    { romaji: 'kawamoto', ja: '川本' },
    { romaji: 'uno', ja: '宇野' },
    { romaji: 'osaka', ja: '大坂' },
    { romaji: 'naomi', ja: '直美' },
    { romaji: 'honda', ja: '本田' },
    { romaji: 'nomo', ja: '野茂' },
    { romaji: 'ichiro', ja: '一郎' },
    { romaji: 'otani', ja: '大谷' },
    { romaji: 'ohtani', ja: '大谷' },
  ];

  // 合并，coreData 优先
  const map = new Map();
  for (const item of [...surnames, ...coreData]) {
    const key = item.romaji;
    if (!map.has(key)) {
      map.set(key, {
        romaji: item.romaji,
        ja: item.ja,
        zh: toSimplified(item.ja),
      });
    }
  }

  const result = Array.from(map.values());
  writeFileSync('./data/ja_surnames.json', JSON.stringify(result, null, 2));
  console.log(`写入 ${result.length} 个姓氏`);

  // 常见名（给名）罗马字→汉字候选
  const givenNames = [
    // 男名
    { romaji: 'ichiro', candidates: [{ ja: '一郎', zh: '一郎' }, { ja: '市郎', zh: '市郎' }], gender: 'M' },
    { romaji: 'jiro', candidates: [{ ja: '二郎', zh: '二郎' }, { ja: '次郎', zh: '次郎' }], gender: 'M' },
    { romaji: 'keizo', candidates: [{ ja: '敬三', zh: '敬三' }, { ja: '惠三', zh: '惠三' }, { ja: '圭三', zh: '圭三' }], gender: 'M' },
    { romaji: 'kenji', candidates: [{ ja: '健二', zh: '健二' }, { ja: '賢二', zh: '贤二' }, { ja: '謙二', zh: '谦二' }], gender: 'M' },
    { romaji: 'kenichi', candidates: [{ ja: '健一', zh: '健一' }, { ja: '賢一', zh: '贤一' }], gender: 'M' },
    { romaji: 'takeshi', candidates: [{ ja: '武', zh: '武' }, { ja: '猛', zh: '猛' }, { ja: '剛', zh: '刚' }], gender: 'M' },
    { romaji: 'hiroshi', candidates: [{ ja: '浩', zh: '浩' }, { ja: '博', zh: '博' }, { ja: '寛', zh: '宽' }], gender: 'M' },
    { romaji: 'masaru', candidates: [{ ja: '勝', zh: '胜' }, { ja: '優', zh: '优' }], gender: 'M' },
    { romaji: 'akira', candidates: [{ ja: '明', zh: '明' }, { ja: '亮', zh: '亮' }, { ja: '昭', zh: '昭' }], gender: 'M' },
    { romaji: 'shinjiro', candidates: [{ ja: '進次郎', zh: '进次郎' }, { ja: '慎二郎', zh: '慎二郎' }], gender: 'M' },
    { romaji: 'shinzo', candidates: [{ ja: '晋三', zh: '晋三' }, { ja: '信三', zh: '信三' }], gender: 'M' },
    { romaji: 'taro', candidates: [{ ja: '太郎', zh: '太郎' }, { ja: '多朗', zh: '多朗' }], gender: 'M' },
    { romaji: 'hideo', candidates: [{ ja: '英夫', zh: '英夫' }, { ja: '秀雄', zh: '秀雄' }, { ja: '英雄', zh: '英雄' }], gender: 'M' },
    { romaji: 'shohei', candidates: [{ ja: '翔平', zh: '翔平' }, { ja: '昇平', zh: '昇平' }], gender: 'M' },
    { romaji: 'ryota', candidates: [{ ja: '良太', zh: '良太' }, { ja: '涼太', zh: '凉太' }], gender: 'M' },
    { romaji: 'yuki', candidates: [{ ja: '勇樹', zh: '勇树' }, { ja: '雪', zh: '雪' }, { ja: '幸', zh: '幸' }], gender: 'U' },
    { romaji: 'kei', candidates: [{ ja: '圭', zh: '圭' }, { ja: '慶', zh: '庆' }, { ja: '恵', zh: '惠' }], gender: 'U' },
    { romaji: 'daiki', candidates: [{ ja: '大輝', zh: '大辉' }, { ja: '大樹', zh: '大树' }], gender: 'M' },
    { romaji: 'sota', candidates: [{ ja: '蒼太', zh: '苍太' }, { ja: '颯太', zh: '飒太' }], gender: 'M' },
    { romaji: 'yuto', candidates: [{ ja: '勇人', zh: '勇人' }, { ja: '優斗', zh: '优斗' }], gender: 'M' },
    // 女名
    { romaji: 'yoko', candidates: [{ ja: '洋子', zh: '洋子' }, { ja: '陽子', zh: '阳子' }, { ja: '曜子', zh: '曜子' }], gender: 'F' },
    { romaji: 'keiko', candidates: [{ ja: '恵子', zh: '惠子' }, { ja: '敬子', zh: '敬子' }, { ja: '佳子', zh: '佳子' }], gender: 'F' },
    { romaji: 'naomi', candidates: [{ ja: '直美', zh: '直美' }, { ja: '奈緒美', zh: '奈绪美' }], gender: 'F' },
    { romaji: 'haruka', candidates: [{ ja: '遥', zh: '遥' }, { ja: '晴香', zh: '晴香' }, { ja: '春花', zh: '春花' }], gender: 'F' },
    { romaji: 'sakura', candidates: [{ ja: '桜', zh: '樱' }, { ja: '咲良', zh: '咲良' }], gender: 'F' },
    { romaji: 'akiko', candidates: [{ ja: '明子', zh: '明子' }, { ja: '秋子', zh: '秋子' }, { ja: '昭子', zh: '昭子' }], gender: 'F' },
    { romaji: 'noriko', candidates: [{ ja: '典子', zh: '典子' }, { ja: '紀子', zh: '纪子' }, { ja: '則子', zh: '则子' }], gender: 'F' },
    { romaji: 'hanako', candidates: [{ ja: '花子', zh: '花子' }], gender: 'F' },
    { romaji: 'misaki', candidates: [{ ja: '美咲', zh: '美咲' }, { ja: '岬', zh: '岬' }], gender: 'F' },
    { romaji: 'ayaka', candidates: [{ ja: '彩花', zh: '彩花' }, { ja: '綾香', zh: '绫香' }], gender: 'F' },
    { romaji: 'yuna', candidates: [{ ja: '結菜', zh: '结菜' }, { ja: '優奈', zh: '优奈' }], gender: 'F' },
    { romaji: 'rina', candidates: [{ ja: '里奈', zh: '里奈' }, { ja: '莉奈', zh: '莉奈' }], gender: 'F' },
    { romaji: 'aoi', candidates: [{ ja: '葵', zh: '葵' }, { ja: '蒼', zh: '苍' }], gender: 'F' },
    { romaji: 'mio', candidates: [{ ja: '澪', zh: '澪' }, { ja: '美緒', zh: '美绪' }], gender: 'F' },
    { romaji: 'mai', candidates: [{ ja: '舞', zh: '舞' }, { ja: '麻衣', zh: '麻衣' }], gender: 'F' },
  ];

  writeFileSync('./data/ja_given.json', JSON.stringify(givenNames, null, 2));
  console.log(`写入 ${givenNames.length} 个名（given names）`);
}

main().catch(console.error);
```

```bash
node scripts/scrape_japanese_names.mjs
```

验收：
- `data/ja_surnames.json` 生成，Tanaka → 田中 / 田中
- `data/ja_given.json` 生成，keizo → 敬三/惠三/圭三

---

## 步骤二：创建 API

创建 `app/api/search-ja/route.ts`：

```ts
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

type Surname = { romaji: string; ja: string; zh: string };
type GivenName = { romaji: string; candidates: { ja: string; zh: string }[]; gender: string };

function loadData() {
  const surnamesPath = path.join(process.cwd(), 'data', 'ja_surnames.json');
  const givenPath = path.join(process.cwd(), 'data', 'ja_given.json');
  const surnames: Surname[] = JSON.parse(readFileSync(surnamesPath, 'utf8'));
  const given: GivenName[] = JSON.parse(readFileSync(givenPath, 'utf8'));
  return { surnames, given };
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';
  if (!q) return NextResponse.json({ error: 'missing q' }, { status: 400 });

  const { surnames, given } = loadData();

  // 按空格分割：第一段尝试匹配姓，其余尝试匹配名
  const parts = q.split(/\s+/);
  const surnamePart = parts[0];
  const givenPart = parts.slice(1).join(' ');

  // 姓的候选（前缀匹配，最多5个）
  const surnameMatches = surnames
    .filter(s => s.romaji === surnamePart || s.romaji.startsWith(surnamePart))
    .slice(0, 5);

  // 名的候选
  const givenMatches = givenPart
    ? given.filter(g => g.romaji === givenPart || g.romaji.startsWith(givenPart)).slice(0, 5)
    : [];

  // 组合结果
  const combinations: { ja: string; zh: string; surnameJa: string; givenJa: string }[] = [];

  if (surnameMatches.length > 0 && givenMatches.length > 0) {
    for (const s of surnameMatches.slice(0, 3)) {
      for (const g of givenMatches.slice(0, 3)) {
        for (const gc of g.candidates.slice(0, 2)) {
          combinations.push({
            ja: s.ja + gc.ja,
            zh: s.zh + gc.zh,
            surnameJa: s.ja,
            givenJa: gc.ja,
          });
        }
      }
    }
  } else if (surnameMatches.length > 0) {
    // 只有姓
    for (const s of surnameMatches) {
      combinations.push({ ja: s.ja, zh: s.zh, surnameJa: s.ja, givenJa: '' });
    }
  }

  return NextResponse.json({
    input: q,
    surnameMatches,
    givenMatches,
    combinations: combinations.slice(0, 10),
  });
}
```

测试：
```bash
curl "http://localhost:3000/api/search-ja?q=tanaka+keizo"
curl "http://localhost:3000/api/search-ja?q=osaka"
curl "http://localhost:3000/api/search-ja?q=ohtani+shohei"
```

---

## 步骤三：创建 /ja 页面

创建 `app/ja/page.tsx`：

```tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as OpenCC from 'opencc-js';

type Tab = 'japanese' | 'romaji';

// 片假名检测
function hasKatakana(s: string) {
  return /[゠-ヿ]/.test(s);
}
// 汉字检测
function hasKanji(s: string) {
  return /[一-鿿㐀-䶿]/.test(s);
}

type Combination = { ja: string; zh: string; surnameJa: string; givenJa: string };
type SearchResult = {
  input: string;
  surnameMatches: { romaji: string; ja: string; zh: string }[];
  givenMatches: { romaji: string; candidates: { ja: string; zh: string }[]; gender: string }[];
  combinations: Combination[];
};

export default function JaPage() {
  const [tab, setTab] = useState<Tab>('japanese');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [romajiInput, setRomajiInput] = useState('');
  const [romajiResult, setRomajiResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Tab1：日文输入实时转中文
  useEffect(() => {
    if (!input.trim()) { setOutput(''); return; }

    if (hasKatakana(input)) {
      // 片假名：调用已有的音译引擎
      fetch(`/api/transliterate?q=${encodeURIComponent(input)}&lang=日語`)
        .then(r => r.json())
        .then(data => setOutput(data.result || ''));
    } else if (hasKanji(input)) {
      // 汉字：日文繁→简体中文
      const converter = OpenCC.Converter({ from: 'jp', to: 'cn' });
      setOutput(converter(input));
    } else {
      setOutput('');
    }
  }, [input]);

  // Tab2：罗马字查询
  async function searchRomaji(q: string) {
    if (!q.trim()) { setRomajiResult(null); return; }
    setLoading(true);
    const res = await fetch(`/api/search-ja?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setRomajiResult(data);
    setLoading(false);
  }

  return (
    <main
      className="min-h-screen px-4 py-16 max-w-2xl mx-auto"
      style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
    >
      <div className="mb-8 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← 返回查询</Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A' }}>
        日本人名翻译
      </h1>
      <p className="text-center text-gray-500 text-sm mb-8">
        汉字·片假名→中文 / 罗马字→汉字+中文
      </p>

      {/* Tab 切换 */}
      <div className="flex gap-2 justify-center mb-8">
        {[
          { value: 'japanese' as Tab, label: '日文输入' },
          { value: 'romaji' as Tab, label: '罗马字输入' },
        ].map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-5 py-2 rounded-full text-sm transition-all border ${
              tab === t.value
                ? 'text-white border-transparent'
                : 'text-gray-600 border-gray-200 hover:border-gray-400 bg-white'
            }`}
            style={tab === t.value ? { background: '#2C5F8A' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab1：日文输入 */}
      {tab === 'japanese' && (
        <div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入日文人名，如：田中角栄 / アレクサンダー"
            className="w-full text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200 mb-4"
            style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
            autoFocus={tab === 'japanese'}
          />

          {output && (
            <div
              className="rounded-2xl px-6 py-5"
              style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
            >
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">中文译名</p>
              <p className="text-3xl font-bold" style={{ color: '#1A1A1A', letterSpacing: '0.08em' }}>
                {output}
              </p>
              <p className="text-xs text-gray-300 mt-3">
                {hasKatakana(input) ? '片假名按日语译音规则转换' : '汉字按日→中简体对应转换'}
              </p>
            </div>
          )}

          {!output && input && (
            <p className="text-center text-gray-400 text-sm">未能识别，请输入日文汉字或片假名</p>
          )}

          <div className="mt-6 rounded-xl px-5 py-4 text-xs text-gray-400 leading-relaxed"
            style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <p className="font-medium text-gray-500 mb-1">使用说明</p>
            <p>
              · 日文<b>汉字名</b>（田中角栄）→ 自动转简体中文（田中角荣）<br />
              · <b>片假名名</b>（アレクサンダー）→ 按新华社日语译音规则转中文<br />
              · 如需查罗马字写法，请切换到「罗马字输入」
            </p>
          </div>
        </div>
      )}

      {/* Tab2：罗马字输入 */}
      {tab === 'romaji' && (
        <div>
          <div className="flex gap-2 mb-4">
            <input
              value={romajiInput}
              onChange={e => setRomajiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchRomaji(romajiInput)}
              placeholder="如：Tanaka Keizo / Ohtani Shohei"
              className="flex-1 text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200"
              style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', fontFamily: 'monospace' }}
              autoFocus={tab === 'romaji'}
            />
            <button
              onClick={() => searchRomaji(romajiInput)}
              className="px-6 py-4 rounded-2xl text-white text-sm font-medium"
              style={{ background: '#2C5F8A' }}
            >
              查
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mb-6">
            姓在前或名在前均可，用空格分隔
          </p>

          {loading && <p className="text-center text-gray-400">查询中…</p>}

          {romajiResult && !loading && (
            <div className="space-y-4">
              {romajiResult.combinations.length > 0 ? (
                <>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    候选译名（按常见度排序）
                  </p>
                  {romajiResult.combinations.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 px-5 py-4 rounded-xl"
                      style={{
                        background: '#fff',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
                        opacity: i === 0 ? 1 : i < 3 ? 0.85 : 0.65,
                      }}
                    >
                      {/* 日文原字 */}
                      <div className="text-center min-w-[80px]">
                        <p className="text-xs text-gray-400 mb-1">日文</p>
                        <p className="text-xl font-medium" style={{ color: '#374151' }}>{c.ja}</p>
                      </div>
                      {/* 箭头 */}
                      <div className="text-gray-300 text-lg">→</div>
                      {/* 中文译名 */}
                      <div className="text-center min-w-[80px]">
                        <p className="text-xs text-gray-400 mb-1">中文</p>
                        <p className="text-xl font-bold" style={{ color: i === 0 ? '#2C5F8A' : '#1A1A1A' }}>
                          {c.zh}
                        </p>
                      </div>
                      {i === 0 && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#EBF3FA', color: '#2C5F8A' }}>
                          最常见
                        </span>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm mb-2">未找到对应的常见姓名</p>
                  <p className="text-gray-300 text-xs">
                    可能是较罕见的姓氏，建议参考日文资料确认汉字原文
                  </p>
                </div>
              )}

              {/* 分开显示姓的候选 */}
              {romajiResult.surnameMatches.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
                    「{romajiResult.input.split(' ')[0]}」对应的姓
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {romajiResult.surnameMatches.map((s, i) => (
                      <div key={i} className="px-4 py-2 rounded-full text-sm flex gap-2 items-center"
                        style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <span style={{ color: '#374151' }}>{s.ja}</span>
                        <span className="text-gray-300">→</span>
                        <span style={{ color: '#2C5F8A', fontWeight: i === 0 ? 600 : 400 }}>{s.zh}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-300 text-center pt-2">
                仅显示常见姓名组合，具体以当事人资料为准
              </p>
            </div>
          )}
        </div>
      )}

      <footer className="mt-16 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} nametochinese.com
      </footer>
    </main>
  );
}
```

---

## 步骤四：首页添加入口

在 `app/page.tsx` 的链接区域追加：

```tsx
<Link href="/ja" className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
  日本人名查询 →
</Link>
```

---

## 完成后报告

1. `data/ja_surnames.json` 生成，数量多少个
2. `/api/search-ja?q=tanaka+keizo` 返回 combinations 前3条
3. `/api/search-ja?q=ohtani+shohei` 是否返回 大谷翔平
4. Tab1 输入「田中角栄」是否显示「田中角荣」
5. Tab1 输入「アレクサンダー」是否显示中文
6. 有无报错
