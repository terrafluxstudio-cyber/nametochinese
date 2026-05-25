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
};

export default function JaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
