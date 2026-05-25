import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "拼音反查中文姓名",
  description:
    "输入中国人名的拼音（如zhang wei），自动列出最可能对应的中文姓名，按频率排序，翻译工作者专用工具。",
  keywords: [
    "拼音查中文名",
    "拼音反查姓名",
    "拼音转中文名",
    "zhang wei是谁",
    "中国人名拼音",
  ],
  alternates: { canonical: "/pinyin" },
};

export default function PinyinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
