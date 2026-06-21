import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: '联系我们 Contact',
  description:
    '联系外文译名词典（nametochinese.com）：译名纠错、数据补充建议、合作或业务咨询，请发邮件至 contact@nametochinese.com。',
  alternates: { canonical: 'https://nametochinese.com/contact' },
};

const sections: LegalSection[] = [
  {
    zhHeading: '联系方式',
    enHeading: 'How to reach us',
    zh: [
      '有任何问题、建议或合作意向，欢迎通过电子邮件联系我们：contact@nametochinese.com。',
      '我们会查阅每一封来信，并尽快回复。',
    ],
    en: [
      'For any question, suggestion or collaboration, email us at: contact@nametochinese.com.',
      'We read every message and reply as soon as we can.',
    ],
  },
  {
    zhHeading: '适合联系的事项',
    enHeading: 'What to contact us about',
    zh: [
      '译名纠错：发现某条人名或地名译名有误，请附上正确写法与可靠来源（如官方译名、权威辞书或维基百科条目），便于我们核对。',
      '数据补充：希望增加某种语言、某类译名或某项功能。',
      '合作与业务：内容合作、友情链接、广告或其他商业咨询。',
    ],
    en: [
      'Corrections: if a personal-name or place-name rendering looks wrong, please include the correct form and a reliable source (an official rendering, an authoritative dictionary, or a Wikipedia entry) so we can verify it.',
      'Data suggestions: a language, category of names, or feature you would like us to add.',
      'Partnerships & business: content collaboration, link exchange, advertising or other commercial inquiries.',
    ],
  },
  {
    zhHeading: '关于本站',
    enHeading: 'About the site',
    zh: [
      '外文译名词典（nametochinese.com）是一个面向翻译工作者的免费在线工具，更多介绍见「关于本站」页。',
    ],
    en: [
      'Name to Chinese (nametochinese.com) is a free online tool for translators. See the “About” page for more.',
    ],
  },
];

export default function ContactPage() {
  return (
    <LegalPage
      titleZh="联系我们"
      titleEn="Contact"
      updated="2026-06-21"
      sections={sections}
    />
  );
}
