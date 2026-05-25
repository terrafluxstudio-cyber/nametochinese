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
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
