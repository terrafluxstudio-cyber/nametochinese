import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: '服务条款 Terms of Service',
  description:
    '外文译名词典（nametochinese.com）服务条款：使用本站即表示你接受以下条款，包括内容仅供参考、知识产权、禁止滥用与责任限制等。',
  alternates: { canonical: 'https://nametochinese.com/terms' },
};

const sections: LegalSection[] = [
  {
    zhHeading: '接受条款',
    enHeading: 'Acceptance of terms',
    zh: [
      '访问或使用外文译名词典（nametochinese.com，下称"本站"）即表示你已阅读、理解并同意受本服务条款约束。若你不同意，请勿使用本站。',
    ],
    en: [
      'By accessing or using Name to Chinese (nametochinese.com, the "Site"), you acknowledge that you have read, understood and agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.',
    ],
  },
  {
    zhHeading: '服务性质与内容免责',
    enHeading: 'Nature of service and content disclaimer',
    zh: [
      '本站以"现状"和"现有"基础提供，是一个供参考的译名查询与转换工具。译名与音译结果基于公开资料和规则算法，可能存在错误、遗漏或多种合理译法。',
      '我们不保证内容的准确性、完整性或适用于特定用途。用于正式、法律或商业场合前，请自行核对权威来源。你对本站内容的使用及由此产生的后果自行负责。',
    ],
    en: [
      'The Site is provided on an "as is" and "as available" basis as a reference tool for looking up and converting names. Renderings and transliterations are based on public data and rule-based algorithms, and may contain errors, omissions, or multiple valid alternatives.',
      'We make no warranty as to the accuracy, completeness or fitness for any particular purpose. Verify against authoritative sources before any formal, legal or commercial use. You are solely responsible for your use of the content and any resulting consequences.',
    ],
  },
  {
    zhHeading: '知识产权',
    enHeading: 'Intellectual property',
    zh: [
      '本站的界面设计、原创文章（如各国人名规则）、数据整理与编排受相关法律保护。底层译名数据源自公开参考资料，其原始权利归各自来源所有。',
      '你可为个人或工作中的翻译用途合理使用本站查询结果，但不得未经许可批量抓取、复制或转售本站数据或内容。',
    ],
    en: [
      'The Site’s interface design, original articles (such as the naming-convention guides), and the compilation and arrangement of data are protected by applicable law. Underlying name data derives from public references, with original rights belonging to their respective sources.',
      'You may make reasonable use of lookup results for personal or professional translation work, but may not scrape, copy or resell the Site’s data or content in bulk without permission.',
    ],
  },
  {
    zhHeading: '可接受使用',
    enHeading: 'Acceptable use',
    zh: [
      '你同意不以任何方式干扰或破坏本站运行，包括但不限于：自动化高频请求/爬虫、试图绕过访问限制、注入恶意代码、或进行任何危害网站安全与可用性的行为。',
    ],
    en: [
      'You agree not to interfere with or disrupt the Site, including but not limited to: automated high-frequency requests/scraping, attempting to bypass access limits, injecting malicious code, or any action that harms the Site’s security or availability.',
    ],
  },
  {
    zhHeading: '责任限制',
    enHeading: 'Limitation of liability',
    zh: [
      '在适用法律允许的最大范围内，本站及其运营者不对因使用或无法使用本站而产生的任何直接、间接、偶然或后果性损失承担责任。',
    ],
    en: [
      'To the maximum extent permitted by applicable law, the Site and its operators shall not be liable for any direct, indirect, incidental or consequential damages arising from the use of, or inability to use, the Site.',
    ],
  },
  {
    zhHeading: '条款变更',
    enHeading: 'Changes to terms',
    zh: [
      '我们可能随时修订本条款，更新后的版本将在本页发布并更新"最后更新"日期。继续使用本站即视为接受修订后的条款。',
    ],
    en: [
      'We may revise these Terms at any time; the updated version will be posted on this page with a revised "Last updated" date. Continued use of the Site constitutes acceptance of the revised Terms.',
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      titleZh="服务条款"
      titleEn="Terms of Service"
      updated="2026-06-06"
      sections={sections}
    />
  );
}
