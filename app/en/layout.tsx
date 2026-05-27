import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '英文／多语言人名翻译查询',
  description:
    '查询英文及多语言人名的中文翻译，收录67万人名、17万地名，专为翻译工作者设计。',
  keywords: [
    '英文人名翻译',
    '外国人名中文',
    '英文名怎么翻译',
    '多语言人名查询',
  ],
  alternates: { canonical: '/en' },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
