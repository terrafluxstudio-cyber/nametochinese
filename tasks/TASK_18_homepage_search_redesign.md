# TASK_18：首页搜索重设计 + 新建 /en 页面

## 目标

1. 首页搜索框改为：输入框 + 5个语言 tabs → 按 Enter 跳转到对应子页面
2. 首页**不显示任何搜索结果**，纯粹作为入口门户
3. 新建 `app/en/page.tsx`，处理英文/多语言人名查询
4. 所有子页面接收 `?q=` URL 参数并自动执行搜索
5. 更新导航栏 NavBar 中"查译名"下拉的第一项指向 `/en`

---

## 改动一：`app/page.tsx` 重写搜索区域

### 删除以下内容
- `detectLanguage` 函数
- `useEffect` 里的自动搜索逻辑
- 所有 results / loading / detectedLang state
- 结果展示区域（ResultCard 列表）
- `ResultCard` import、`SearchResult` type import、`useRef` import

### 新增 import
```tsx
import { useRouter } from 'next/navigation';
```

### State 简化为
```tsx
const [query, setQuery] = useState('');
const [activeLang, setActiveLang] = useState<'en' | 'ru' | 'ko' | 'ja' | 'pinyin'>('en');
const router = useRouter();
```

### 语言 tabs 配置
```tsx
const LANG_TABS = [
  { key: 'en',     label: '英→中',    placeholder: 'Adams · Johnson · Williams…',  path: '/en' },
  { key: 'ru',     label: '俄→中',    placeholder: 'Александр · Иванов…',          path: '/ru' },
  { key: 'ko',     label: '韩→中',    placeholder: '김민준 · 이지은…',              path: '/ko' },
  { key: 'ja',     label: '日→中',    placeholder: '田中 · 鈴木 · Tanaka…',         path: '/ja' },
  { key: 'pinyin', label: '拼音→汉字', placeholder: 'zhang wei · li ming…',         path: '/pinyin' },
] as const;
```

### 搜索提交函数
```tsx
function handleSearch(e: React.FormEvent) {
  e.preventDefault();
  const q = query.trim();
  if (!q) return;
  const tab = LANG_TABS.find(t => t.key === activeLang)!;
  router.push(`${tab.path}?q=${encodeURIComponent(q)}`);
}
```

### 搜索区域 JSX（替换原来的搜索框 + detectedLang + results 整块）

```tsx
<form onSubmit={handleSearch} className="w-full">
  <div className="relative">
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={LANG_TABS.find(t => t.key === activeLang)?.placeholder}
      className="w-full text-lg px-5 py-4 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-[#2C5F8A]/30"
      style={{
        background: '#fff',
        boxShadow: '0 2px 16px rgba(0,0,0,0.09)',
        fontFamily: 'var(--font-geist-mono)',
      }}
      autoFocus
    />
    {query && (
      <button
        type="button"
        onClick={() => setQuery('')}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-lg"
      >
        ×
      </button>
    )}
  </div>

  <div className="flex gap-2 mt-3 flex-wrap">
    {LANG_TABS.map((tab) => (
      <button
        key={tab.key}
        type="button"
        onClick={() => { setActiveLang(tab.key); setQuery(''); }}
        className="px-3 py-1.5 rounded-lg text-sm transition-all"
        style={{
          background: activeLang === tab.key ? '#2C5F8A' : '#fff',
          color: activeLang === tab.key ? '#fff' : '#555',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          fontFamily: 'var(--font-geist-mono)',
          fontWeight: activeLang === tab.key ? 600 : 400,
        }}
      >
        {tab.label}
      </button>
    ))}
  </div>
</form>
```

---

## 改动二：新建 `app/en/page.tsx`

参考 `/ru/page.tsx` 结构，调用 `/api/search` 接口：

```tsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { ResultCard } from '@/components/ResultCard';
import type { SearchResult } from '@/components/SearchBox';

export default function EnPage() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  async function search(query: string) {
    if (query.trim().length < 1) { setResults([]); return; }
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all`);
    const data = await res.json();
    setResults(Array.isArray(data) ? data : data.results ?? []);
    setLoading(false);
  }

  useEffect(() => {
    const urlQ = searchParams.get('q');
    if (urlQ) { setQ(urlQ); search(urlQ); }
  }, []);

  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#1A1A1A', fontFamily: 'var(--font-serif)' }}>
          英文／多语言人名查询
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">收录 67 万词条，含人名、地名</p>

        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); search(e.target.value); }}
          placeholder="Adams · Johnson · Williams…"
          className="w-full text-xl px-6 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200 mb-6"
          style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', fontFamily: 'var(--font-geist-mono)' }}
          autoFocus
        />

        {loading && <p className="text-center text-gray-400 py-4">搜索中…</p>}

        <div className="space-y-2">
          {results.slice(0, 20).map((r, i) => (
            <ResultCard key={i} result={r} />
          ))}
        </div>

        {results.length === 0 && q.length > 0 && !loading && (
          <p className="text-center text-gray-400 mt-8">未找到结果</p>
        )}
      </main>
    </>
  );
}
```

---

## 改动三：子页面接收 `?q=` 参数

以下四个页面各加两行（import + useEffect）：

### `app/ru/page.tsx`
加 import：
```tsx
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
```
在组件内 state 后加：
```tsx
const searchParams = useSearchParams();
useEffect(() => {
  const urlQ = searchParams.get('q');
  if (urlQ) { setQ(urlQ); search(urlQ, ''); }
}, []);
```

### `app/ko/page.tsx`
同上，useEffect 内调用该页面的 search 函数。

### `app/ja/page.tsx`
同上。

### `app/pinyin/page.tsx`
同上，调用该页面的 lookup 或 search 函数。

---

## 改动四：更新 `components/NavBar.tsx`

将"查译名"下拉第一项从 `/#search` 改为 `/en`：

```tsx
{ label: '英文／多语言人名', href: '/en', desc: '67万词条主库' },
```

---

## 完成后检查

1. 首页空状态：搜索框 + 5个 tabs + hero 图 + 工具卡片，无结果区域
2. 选 [英→中]，输入 `Adams`，按 Enter → 跳转 `/en?q=Adams`，显示结果
3. 选 [俄→中]，输入 `Александр`，按 Enter → 跳转 `/ru?q=Александр`，自动搜索
4. 选 [拼音→汉字]，输入 `zhang wei`，按 Enter → 跳转 `/pinyin?q=zhang+wei`，自动搜索
5. 点击 tab 时输入框清空，placeholder 切换为对应语言示例
6. 导航栏"查译名"→"英文／多语言人名"→ 跳 `/en`
7. `/en` 页面可独立使用搜索框（不依赖首页）
