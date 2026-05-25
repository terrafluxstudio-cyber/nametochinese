"use client";

import Link from "next/link";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchBox, type SearchResult } from "@/components/SearchBox";
import { ResultCard } from "@/components/ResultCard";

export default function Home() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("all");

  return (
    <main className="min-h-screen bg-[#F7F5F0] flex flex-col items-center px-4 pt-24 pb-16">
      {/* 标题 */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-semibold text-[#1A1A1A] tracking-tight mb-2">
          英文人名翻译词典
        </h1>
        <p className="text-gray-500 text-base">
          收录 67 万人名、17 万地名，专为翻译工作者设计
        </p>
      </div>

      {/* 搜索框 */}
      <SearchBox onResults={setResults} onLoading={setLoading} type={type} />

      {/* Tab */}
      <div className="mt-6 mb-4">
        <Tabs value={type} onValueChange={setType}>
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="person">人名</TabsTrigger>
            <TabsTrigger value="place">地名</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 结果 */}
      <div className="w-full max-w-2xl space-y-2 mt-2">
        {loading && (
          <p className="text-center text-gray-400 text-sm py-4">搜索中…</p>
        )}
        {!loading && results.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">
            输入至少 2 个字符开始搜索
          </p>
        )}
        {results.map((r, i) => (
          <ResultCard key={`${r.english}-${r.nationality}-${i}`} result={r} />
        ))}
      </div>

      <div className="text-center mt-12 mb-4 flex flex-wrap gap-6 justify-center">
        <Link href="/ru" className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
          俄语人名查询 →
        </Link>
        <Link href="/ko" className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
          韩国人名查询 →
        </Link>
        <Link href="/naming-rules" className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
          各语言人名规则 →
        </Link>
        <Link href="/naming-rules/sinosphere" className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
          华人英文名写法 →
        </Link>
        <Link href="/pinyin" className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
          拼音反查中文名 →
        </Link>
        <Link href="/convert" className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
          外文名音译引擎 →
        </Link>
        <Link href="/zh-convert" className="text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
          简繁转换 →
        </Link>
      </div>

      {/* 底部 */}
      <footer className="mt-auto pt-16 text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} nametochinese.com
      </footer>
    </main>
  );
}
