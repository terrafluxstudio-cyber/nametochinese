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
  openGraph: {
    title: '韩国人名翻译查询 | 外文译名词典',
    description: '查询韩国人名的中文翻译，含韩文、汉字、英文对照，专为翻译工作者设计。',
    url: 'https://nametochinese.com/ko',
    type: 'website',
  },
  twitter: { card: 'summary', title: '韩国人名翻译 · 外文译名词典', description: '韩文人名中文查询，含汉字英文对照，专为翻译工作者设计。' },
};

export default function KoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
