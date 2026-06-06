import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: '关于本站 About',
  description:
    '外文译名词典（nametochinese.com）是为翻译工作者打造的外文人名、地名中文译名查询工具。了解我们的数据来源、用途与免责声明。',
  alternates: { canonical: 'https://nametochinese.com/about' },
};

const sections: LegalSection[] = [
  {
    zhHeading: '本站是什么',
    enHeading: 'What this site is',
    zh: [
      '外文译名词典（nametochinese.com）是一个面向翻译工作者、编辑、记者和研究者的免费在线工具，帮助在外文人名、地名与中文译名之间互相查询和转换。',
      '核心功能包括：外文人名查译（英语、俄语、韩语、日语）、地名查译、70 余种语言的音译引擎、中文姓名转拼音、各国人名命名规则参考、机构与职位译名库等。',
    ],
    en: [
      'Name to Chinese (nametochinese.com) is a free online tool for translators, editors, journalists and researchers, helping convert between foreign personal names, place names and their Chinese renderings.',
      'Core features include foreign personal-name lookup (English, Russian, Korean, Japanese), place-name lookup, a transliteration engine for 70+ languages, Chinese-name-to-pinyin conversion, naming-convention guides for many countries, and an institution/title glossary.',
    ],
  },
  {
    zhHeading: '数据来源',
    enHeading: 'Data sources',
    zh: [
      '本站译名整理遵循公开的译名规范与各语言通行的音译规则——例如新华社译名标准、各语言官方或通行的外语译音表——并参照维基百科等公开数据进行核对。译名本身是外文与中文之间的客观读音对应关系。',
      '我们对照多方公开来源进行核对、对齐和结构化处理，但不对每一条译名的绝对准确性作担保（见免责声明）。',
    ],
    en: [
      'Renderings on this site follow publicly available transliteration standards and the conventions of each language — such as Xinhua transliteration standards and official or widely used transliteration tables — cross-checked against public data sources including Wikipedia. A rendering is an objective phonetic correspondence between a foreign name and Chinese.',
      'We cross-check, align and structure data against multiple public sources, but do not guarantee the absolute accuracy of every individual rendering (see Disclaimer).',
    ],
  },
  {
    zhHeading: '免责声明',
    enHeading: 'Disclaimer',
    zh: [
      '本站提供的译名仅供参考。同一外文名在不同语境、不同语言来源下可能有多个合理译法；自动音译结果是基于规则的近似，并非官方定名。',
      '用于正式出版、法律文件或其他重要场合时，请务必核对权威辞书或相关官方来源。本站不对因使用本站内容而产生的任何后果负责。',
    ],
    en: [
      'Renderings provided here are for reference only. The same foreign name may have several reasonable Chinese forms depending on context and source language; automatic transliteration is a rule-based approximation, not an official designation.',
      'For formal publication, legal documents or other important uses, always verify against authoritative dictionaries or relevant official sources. We accept no liability for any consequences arising from use of this site.',
    ],
  },
  {
    zhHeading: '联系我们',
    enHeading: 'Contact',
    zh: [
      '发现译名错误、有数据补充建议或合作意向，欢迎通过邮箱联系：contact@nametochinese.com。',
    ],
    en: [
      'For corrections, data suggestions or collaboration, reach us at: contact@nametochinese.com.',
    ],
  },
];

export default function AboutPage() {
  return (
    <LegalPage
      titleZh="关于本站"
      titleEn="About"
      updated="2026-06-06"
      sections={sections}
    />
  );
}
