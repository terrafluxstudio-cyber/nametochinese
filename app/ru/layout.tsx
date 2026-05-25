import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "俄语人名翻译查询",
  description:
    "查询俄语人名的中文翻译，收录280余个俄文常见人名，含父称、昵称对照，专为翻译工作者设计。",
  keywords: [
    "俄语人名翻译",
    "俄文名字中文",
    "俄语名字怎么翻译",
    "俄文人名查询",
  ],
  alternates: { canonical: "/ru" },
};

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
