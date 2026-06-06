import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: '隐私政策 Privacy Policy',
  description:
    '外文译名词典（nametochinese.com）隐私政策：说明我们如何使用 Cookie、Google Analytics 与第三方广告，以及你对个人数据的权利。',
  alternates: { canonical: 'https://nametochinese.com/privacy' },
};

const sections: LegalSection[] = [
  {
    zhHeading: '我们收集的信息',
    enHeading: 'Information we collect',
    zh: [
      '本站不要求注册，也不主动收集你的姓名、邮箱等个人身份信息。你在搜索框输入的查询内容用于即时返回结果，不与你的身份关联。',
      '我们通过 Google Analytics 收集匿名的使用数据，例如页面浏览量、访问来源、设备类型、浏览器和大致地理位置（国家/城市级别），用于了解网站使用情况并改进服务。',
    ],
    en: [
      'This site requires no registration and does not actively collect personally identifiable information such as your name or email. Text you type into search boxes is used only to return results in real time and is not tied to your identity.',
      'We collect anonymous usage data via Google Analytics — such as page views, referral source, device type, browser and approximate location (country/city level) — to understand usage and improve the service.',
    ],
  },
  {
    zhHeading: 'Cookie 的使用',
    enHeading: 'Use of cookies',
    zh: [
      'Cookie 是网站存放在你浏览器中的小型文本文件。本站使用以下类别的 Cookie：① 分析类（Google Analytics），用于统计匿名访问数据；② 广告类（Google AdSense 等第三方，若已启用），用于投放和衡量广告。',
      '对于欧洲经济区（EEA）、英国等地区的访客，我们通过 Cookie 同意横幅征求你的选择，并默认在你同意前不启用分析与广告类 Cookie（Google Consent Mode）。你可随时通过浏览器设置清除或阻止 Cookie。',
    ],
    en: [
      'Cookies are small text files a website stores in your browser. This site uses: (1) analytics cookies (Google Analytics) for anonymous usage statistics; (2) advertising cookies (third parties such as Google AdSense, where enabled) to serve and measure ads.',
      'For visitors in the EEA, UK and similar regions, we ask for your choice via a cookie consent banner and, by default, do not enable analytics or advertising cookies until you consent (Google Consent Mode). You can clear or block cookies anytime via your browser settings.',
    ],
  },
  {
    zhHeading: '第三方服务与广告',
    enHeading: 'Third-party services and advertising',
    zh: [
      '本站使用 Google Analytics（分析）以及可能使用 Google AdSense（广告）。这些第三方厂商（包括 Google）可能使用 Cookie 根据你对本站及其他网站的访问投放广告。',
      'Google 作为第三方厂商使用 Cookie 投放广告。你可通过访问 Google 广告设置（adssettings.google.com）选择停用个性化广告，或访问 aboutads.info 停用部分第三方厂商的 Cookie。Google 隐私政策见 policies.google.com/privacy。',
    ],
    en: [
      'This site uses Google Analytics (analytics) and may use Google AdSense (advertising). These third parties (including Google) may use cookies to serve ads based on your visits to this and other sites.',
      'Google, as a third-party vendor, uses cookies to serve ads. You may opt out of personalized advertising via Google Ads Settings (adssettings.google.com), or opt out of some third-party vendors at aboutads.info. Google’s privacy policy is at policies.google.com/privacy.',
    ],
  },
  {
    zhHeading: '你的权利',
    enHeading: 'Your rights',
    zh: [
      '根据所在地区的法律（如欧盟 GDPR、加州 CCPA），你可能有权访问、更正或删除与你相关的数据、撤回同意，或反对某些数据处理。由于本站不存储可识别个人身份的账户数据，相关数据主要为浏览器端 Cookie，你可自行通过浏览器或同意横幅管理。',
      '我们不出售你的个人数据。',
    ],
    en: [
      'Depending on your jurisdiction (e.g. EU GDPR, California CCPA), you may have the right to access, correct or delete data relating to you, withdraw consent, or object to certain processing. As this site stores no identifiable account data, the relevant data is mainly browser-side cookies, which you can manage via your browser or the consent banner.',
      'We do not sell your personal data.',
    ],
  },
  {
    zhHeading: '政策变更',
    enHeading: 'Changes to this policy',
    zh: [
      '我们可能不时更新本隐私政策。重大变更将在本页更新"最后更新"日期。继续使用本站即表示你接受更新后的政策。',
    ],
    en: [
      'We may update this Privacy Policy from time to time. Material changes will be reflected in the "Last updated" date on this page. Continued use of the site constitutes acceptance of the updated policy.',
    ],
  },
  {
    zhHeading: '联系方式',
    enHeading: 'Contact',
    zh: ['隐私相关问题请联系：contact@nametochinese.com。'],
    en: ['For privacy questions, contact: contact@nametochinese.com.'],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      titleZh="隐私政策"
      titleEn="Privacy Policy"
      updated="2026-06-06"
      intro={{
        zh: '本政策说明外文译名词典（nametochinese.com）如何处理 Cookie 与匿名使用数据，以及你的相关权利。',
        en: 'This policy explains how Name to Chinese (nametochinese.com) handles cookies and anonymous usage data, and your related rights.',
      }}
      sections={sections}
    />
  );
}
