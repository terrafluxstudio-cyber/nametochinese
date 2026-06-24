import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '臺灣標準外文人名譯名查詢 — 外文譯名詞典',
  description: '查詢國家教育研究院《外國學者人名譯名》8,767 條標準譯名，涵蓋德、法、義、西、斯拉夫等 9 語系。',
  alternates: { canonical: '/tw' },
  openGraph: {
    title: '臺灣標準外文人名譯名 | nametochinese.com',
    description: '國教院收錄 8,767 條外國學者人名標準譯名，9 語系外文 ↔ 中文對照。',
  },
  twitter: {
    card: 'summary',
    title: '臺灣標準外文人名譯名查詢',
    description: '國家教育研究院《外國學者人名譯名》8,767 條，9 語系標準對照。',
  },
};

export default function TwLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
