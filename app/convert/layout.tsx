import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "外文名音译引擎",
  description:
    "输入外文人名，自动按Wikipedia标准译音规则转换为中文，支持70余种语言，逐段高亮显示对应汉字。",
  keywords: [
    "外文名音译",
    "外语人名翻译",
    "音译工具",
    "人名音译中文",
    "外国名字怎么翻译",
  ],
  alternates: { canonical: "/convert" },
  openGraph: {
    title: '外文名音译引擎 | 外文译名词典',
    description: '按Wikipedia标准译音规则，将外文人名转换为中文。支持202个国家、57种语言，逐段彩色高亮对应汉字。',
    url: 'https://nametochinese.com/convert',
    type: 'website',
  },
  twitter: { card: 'summary', title: '外文名音译引擎 · 外文译名词典', description: '202国、57种语言音译规则，外文人名转中文，逐段高亮显示。' },
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
