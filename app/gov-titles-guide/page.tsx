import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';

const SITE = 'https://nametochinese.com';
const ACCENT = '#2C5F8A';

export const metadata: Metadata = {
  title: '机构与职位名称翻译规范：国际组织、政府机构、官员头衔怎么译',
  description:
    '机构名和官职名怎么翻译成中文？本文讲清与人名的根本区别（机构名以意译为主）、先查官方中文名、专名+通名的对应译法、缩写简称处理，以及 President、Secretary、Minister 等头衔按机构和国别定词的规则。翻译工作者参考。',
  keywords: [
    '机构名称翻译',
    '国际组织译名',
    '官职翻译',
    '政府机构翻译',
    '头衔翻译',
    'President 翻译',
    'Secretary 翻译',
    '机构翻译规范',
  ],
  alternates: { canonical: '/gov-titles-guide' },
  openGraph: {
    title: '机构与职位名称翻译规范 | 外文译名词典',
    description:
      '机构名以意译为主、先查官方中文名、专名+通名对应、头衔按机构和国别定词——翻译工作者参考。',
    url: `${SITE}/gov-titles-guide`,
    type: 'article',
  },
};

type Section = { heading: string; body: string[] };

const SECTIONS: Section[] = [
  {
    heading: '一、与人名最大的不同：机构名以意译为主',
    body: [
      '人名靠音译，译的是读音；机构名恰恰相反，译的是含义。World Health Organization 译"世界卫生组织"是逐词意译，而不是把读音音译成一串没有意义的汉字。这是机构翻译的总基调：先看这个名字"说的是什么"，再用对应的中文词把意思搭出来。',
      '只有机构名里的专名部分——通常是地名或人名——才音译。如 Ford Foundation 译"福特基金会"：Ford（人名）音译"福特"，Foundation（通名）意译"基金会"。判断哪部分音译、哪部分意译，是机构翻译的第一道功夫。',
    ],
  },
  {
    heading: '二、第一步永远是查官方中文名',
    body: [
      '联合国系统、各国政府部门、知名国际组织和大型 NGO，绝大多数都有官方认定的中文名称。这些名称是唯一标准，必须直接采用，不能自行重译。',
      '例如：UNESCO 的官方全称是"联合国教育、科学及文化组织"，通行简称"联合国教科文组织"；WHO 是"世界卫生组织"；IMF 是"国际货币基金组织"；WTO 是"世界贸易组织"。这些都不容许译者另起炉灶。动手翻译前，先确认有没有官方名——这一步能避开绝大多数机构错译。',
    ],
  },
  {
    heading: '三、没有官方名怎么译：专名 + 通名',
    body: [
      '遇到没有现成中文名的机构，按"专名 + 通名"拆解。通名（表明机构性质的那部分）有相对固定的中文对应，照搬即可：Organization＝组织，Association＝协会，Federation＝联合会／联盟，Institute＝研究所／学会，Commission＝委员会，Council＝理事会，Authority＝管理局，Bureau＝局，Agency＝署／局，Foundation＝基金会。',
      '专名部分按其性质处理：是地名、人名的音译（或沿用既定译名），是普通词的则意译。组合起来再按中文语序调整通顺。全篇出现的同一机构，译名必须前后一致，最好建立机构译名对照表。',
    ],
  },
  {
    heading: '四、缩写与简称',
    body: [
      '首字母缩略词若有通行中文简称，直接用简称：UNESCO＝教科文组织，NATO＝北约，ASEAN＝东盟，EU＝欧盟。这几个是意译简称。',
      '也有按读音音译的简称：OPEC＝欧佩克（全称"石油输出国组织"），是把缩写当成一个词音译。用意译简称还是音译简称，取决于约定俗成，不能想当然，拿不准就查通行译法。',
    ],
  },
  {
    heading: '五、职位与头衔：对应制，看机构和国别定词',
    body: [
      '同一个英文头衔，中文译法随机构和国别变化，绝不能一词到底。President：国家元首译"总统"，公司译"总裁／董事长"，大学译"校长"，协会译"会长"，法院译"院长"。Director：政府部门译"局长／司长／主任"，公司译"董事"，机构译"主任／所长"。',
      'Secretary 尤其要小心：美国内阁部长是 Secretary（Secretary of State＝国务卿，Secretary of Defense＝国防部长）；政党组织里是"书记"；普通语境是"秘书"。Minister 在多数国家译"部长"，君主制国家常译"大臣"。Chancellor 在德国、奥地利是"总理"，在英国 Chancellor of the Exchequer 是"财政大臣"，在英美大学是名誉"校长"。判断头衔，先判断它属于哪个机构、哪个国家。',
    ],
  },
  {
    heading: '六、易错点与敏感处理',
    body: [
      '① 套错语境：把公司 President 译成"总统"、把大学 Chancellor 译成"总理"，都是没看机构性质的典型错误。',
      '② 漏掉国别差异：同是"部长"，美国用 Secretary、英国用 Minister／Secretary of State、君主制下可能是"大臣"，写法要贴合该国制度。',
      '③ 敏感与争议：涉及政治敏感机构、争议地区的职衔，以官方或权威发布的译名为准，不自行发挥、不擅自简化。',
    ],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: '机构名称是音译还是意译？',
    a: '以意译为主，与人名相反。机构名译的是含义（World Health Organization＝世界卫生组织），只有其中的地名、人名等专名部分才音译。',
  },
  {
    q: 'UNESCO 的中文全称是什么？',
    a: '官方全称是"联合国教育、科学及文化组织"，通行简称"联合国教科文组织"。这是官方名称，直接采用，不另行翻译。',
  },
  {
    q: 'President 都译成"总统"吗？',
    a: '不是。要看机构：国家元首译"总统"，公司译"总裁／董事长"，大学译"校长"，协会译"会长"。同一头衔随机构变化。',
  },
  {
    q: '没有官方中文名的机构怎么译？',
    a: '按"专名＋通名"拆解：通名（Organization＝组织、Commission＝委员会等）有固定对应，专名按性质音译或意译，组合后保持全篇一致。',
  },
];

export default function GovTitlesGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: '机构与职位名称翻译规范',
        description: metadata.description,
        inLanguage: 'zh-CN',
        mainEntityOfPage: `${SITE}/gov-titles-guide`,
        datePublished: '2026-06-18',
        dateModified: '2026-06-21',
        author: { '@type': 'Organization', name: '外文译名词典', url: SITE },
        publisher: { '@type': 'Organization', name: '外文译名词典', url: SITE },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '首页', item: SITE },
          {
            '@type': 'ListItem',
            position: 2,
            name: '机构与职位名称翻译规范',
            item: `${SITE}/gov-titles-guide`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main
        className="min-h-screen px-4 py-12 max-w-3xl mx-auto"
        style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}
      >
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-gray-600">
            首页
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-gray-500">机构与职位名称翻译规范</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
            机构与职位名称翻译规范
          </h1>
          <p className="text-sm text-gray-400">国际组织 · 政府机构 · 官员头衔译名</p>
        </header>

        <div className="space-y-4 mb-10">
          <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
            机构名和官员头衔的翻译，规则和人名完全不同：人名靠音译，机构和职位靠意译加对应。
            本文讲清这套规则——先查官方名、专名加通名怎么拆、头衔如何按机构和国别定词，
            以及最容易踩的几个坑。
          </p>
        </div>

        <article className="space-y-10">
          {SECTIONS.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
                {s.heading}
              </h2>
              <div className="space-y-3">
                {s.body.map((p, j) => (
                  <p key={j} className="text-base leading-relaxed" style={{ color: '#374151' }}>
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <section
          className="mt-12 rounded-2xl px-6 py-6"
          style={{ background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: '#1A1A1A' }}>
            查机构与官员职位的标准译名
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gov-titles"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: ACCENT }}
            >
              机构与职位译名库 →
            </Link>
            <Link
              href="/search"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#EBF3FA', color: ACCENT }}
            >
              查既定译名（人名·地名）→
            </Link>
          </div>
        </section>

        <nav className="mt-8 text-sm">
          <p className="text-gray-400 mb-2">相关规则与专题：</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/naming-rules/general" className="hover:underline" style={{ color: ACCENT }}>
              外文人名音译总则
            </Link>
            <Link href="/place-names-guide" className="hover:underline" style={{ color: ACCENT }}>
              地名译名与人名译名的区别
            </Link>
            <Link href="/naming-rules" className="hover:underline text-gray-400">
              各语言人名规则 →
            </Link>
          </div>
        </nav>

        <p className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-300">
          内容依据翻译规范整理，具体译名以官方或权威发布为准，仅供翻译参考
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
