import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chinese Name to Pinyin Converter 中文名转拼音',
  description:
    'Convert any Chinese name to Hanyu Pinyin with correct tone marks. Handles polyphonic surnames (单 Shàn, 仇 Qiú, 解 Xiè, 查 Zhā) and rare characters. 中文姓名转汉语拼音，姓氏多音、生僻字自动处理。',
  keywords: [
    'Chinese name to pinyin',
    'pinyin converter',
    'convert Chinese name to pinyin',
    'Chinese name pronunciation',
    '中文名转拼音',
    '姓名转拼音',
    '中文姓名拼音',
    '姓氏拼音',
  ],
  alternates: { canonical: '/name-to-pinyin' },
  openGraph: {
    title: 'Chinese Name to Pinyin Converter | 外文译名词典',
    description: 'Convert Chinese names to Hanyu Pinyin with tone marks. Handles polyphonic surnames (单 Shàn, 仇 Qiú) and rare characters automatically.',
    url: 'https://nametochinese.com/name-to-pinyin',
    type: 'website',
  },
  twitter: { card: 'summary', title: 'Chinese Name to Pinyin · nametochinese.com', description: 'Convert Chinese names to Pinyin with correct tones. Polyphonic surnames handled automatically.' },
};

export default function NameToPinyinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
