import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '威妥玛拼音转换 | 外文译名词典',
  description:
    '中文姓名转威妥玛式拼音（Wade-Giles），涵盖常用姓氏与人名用字。涉外文件、海外华人姓名罗马字参考。',
  keywords: [
    '威妥玛拼音', 'Wade-Giles', '中文名罗马字', '威氏拼音', '姓名罗马化',
    '海外华人姓名', '涉台文件姓名',
  ],
  alternates: { canonical: '/wade-giles' },
  openGraph: {
    title: '威妥玛拼音转换 | 外文译名词典',
    description: '中文姓名转威妥玛式拼音，涉外文件与海外华人姓名罗马字参考。',
    url: 'https://nametochinese.com/wade-giles',
    type: 'website',
  },
};

export default function WadeGilesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
