import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "韩国人名翻译查询",
  description:
    "查询韩国人名的中文翻译，含韩文、汉字、英文对照，专为翻译工作者设计。",
  keywords: [
    "韩国人名翻译",
    "韩文名字中文",
    "韩语人名查询",
    "韩国名字怎么翻译",
  ],
  alternates: { canonical: "/ko" },
};

export default function KoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
