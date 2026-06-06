import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "日本人名翻译查询",
  description:
    "日文汉字名、片假名名转中文，罗马字人名查日文汉字及中文译名。Tanaka Ohtani等运动员、明星人名快速查询。",
  keywords: [
    "日本人名翻译",
    "日文名字中文",
    "罗马字查日文名",
    "日本姓氏查询",
    "大谷翔平翻译",
  ],
  alternates: { canonical: "/ja" },
  openGraph: {
    title: '日本人名翻译查询 | 外文译名词典',
    description: '日文汉字名、片假名转中文，罗马字查日文汉字及中文译名。大谷翔平、村上春树等人名快速查询。',
    url: 'https://nametochinese.com/ja',
    type: 'website',
  },
  twitter: { card: 'summary', title: '日本人名翻译 · 外文译名词典', description: '日文汉字·片假名·罗马字人名中文翻译，专为翻译工作者设计。' },
};

export default function JaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
