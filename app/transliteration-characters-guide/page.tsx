import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';

const SITE = 'https://nametochinese.com';
const ACCENT = '#2C5F8A';

export const metadata: Metadata = {
  title: '音译用字：外国人名的中文汉字是怎么选出来的',
  description:
    '同一个读音有那么多汉字，外国人名音译时到底凭什么选字？本文讲清音译用字的规则：性别用字（女用娜丽莉娅、男用德克夫尔）、固定译音用字表保证一致、避用生僻贬义歧义字，以及音准优先、字义为辅的取舍原则。',
  keywords: [
    '音译用字',
    '译名用字',
    '人名音译选字',
    '译名规范用字',
    '为什么用这个字',
    '安娜 用字',
    '译音表',
    '音译规则',
  ],
  alternates: { canonical: '/transliteration-characters-guide' },
  openGraph: {
    title: '音译用字：外国人名的汉字是怎么选的 | 外文译名词典',
    description:
      '性别用字、固定译音用字表、避用生僻贬义字、音准优先——讲清外国人名音译的选字规则。',
    url: `${SITE}/transliteration-characters-guide`,
    type: 'article',
  },
};

type Section = { heading: string; body: string[] };

const SECTIONS: Section[] = [
  {
    heading: '一、同一个音，为什么有好多字能选',
    body: [
      '汉语同音字极多。一个音节，比如 lì，就对应丽、莉、利、力、立、黎等一大批字；nà 有娜、那、纳。音译人名时，每个音节都面临"这么多同音字，到底用哪个"的问题。选字不是随意的，背后有一套约定俗成的规则，目的是让译名既准确又规范、还能让人一眼看出大概是男是女。',
    ],
  },
  {
    heading: '二、性别用字：让译名"看起来对"',
    body: [
      '译名会用字面气质来暗示性别。女性名偏向柔和、秀气的字：娜、丽、莉、娅、萝、琳、薇、妮、黛、丝。所以 Anna 译"安娜"（不写"安那"）、Emily 译"艾米莉"、Sophia 译"索菲娅"。',
      '男性名偏向中性或刚健的字：德、克、夫、尔、伯、斯、雷、罗。所以 Frederick 译"弗雷德里克"、Robert 译"罗伯特"。读音相同的两个字，按人物性别选用不同的那个——这是译名"看起来对不对"的关键。',
    ],
  },
  {
    heading: '三、固定译音用字表：一致性高于一切',
    body: [
      '专业译名遵循一套"译音用字表"，规定每个音节通常配哪个汉字。这套表的意义不在于某个字多好，而在于统一：只要大家都按同一张表来，同一个名字在不同译者、不同书报里就会写成同样的汉字，读者才认得出是同一个人。',
      '正因为有固定用字表，音译才不是"凭感觉"。遇到拿不准的音节，对照表取规范字，而不是自己另选一个同音字——哪怕你选的那个看上去也说得通。',
    ],
  },
  {
    heading: '四、避讳：不用生僻、贬义、歧义字',
    body: [
      '选字有几条"不用"的底线：不用生僻字（读者不认识，失去记音的意义）；不用带明显贬义或不雅联想的字；不用容易和现成词语、成语混淆而产生歧义的字。',
      '这些限制不影响读音判断，但能避免译名让人读着别扭或产生误会。音近的候选字里，优先挑常见、中性、干净的那个。',
    ],
  },
  {
    heading: '五、位置与专字：词首、词尾、姓氏',
    body: [
      '有些字习惯用在特定位置。某些音在词首、词尾各有惯用字；姓氏用字和名字用字也各有倾向。译音用字表往往会区分这些情形，使整套译名体系更整齐。',
      '这也是为什么有时同一个音在不同名字里写法略有不同——不是规则不统一，而是位置或类别不同，对应了表里不同的规范字。',
    ],
  },
  {
    heading: '六、不追字义，但会择优',
    body: [
      '要强调：人名音译以音准为第一位，汉字只是记音符号，不刻意追求字面意义。但在多个音近候选字之间，会优先挑中性、雅正的那个——这是"择优"，不是"译意"。',
      '商标翻译可以音义兼顾（Coca-Cola 译"可口可乐"，既近音又有好意头），那是品牌的特殊追求。普通人名不走这条路：先把音译准、用字规范，意义是顺带的，不是目标。',
    ],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: '为什么 Anna 译"安娜"而不是"安那"？',
    a: '"娜"是女性译名的惯用字，气质柔和；"那"一般不用于人名音译。同音的两个字，按性别和用字规范选用"娜"。',
  },
  {
    q: '音译用字能自己随便选吗？',
    a: '不能。专业译名遵循固定的译音用字表，目的是保持一致——同一名字在不同地方写法相同。拿不准时对照表取规范字，不自创。',
  },
  {
    q: '同一个读音，为什么有时用不同的字？',
    a: '因为要区分性别，也因为词首、词尾、姓氏等不同位置和类别各有惯用字。译音用字表会区分这些情形，对应不同的规范字。',
  },
  {
    q: '译名讲究字的意思吗？',
    a: '以音准为主，不刻意追求字义；但会在音近的候选字里挑中性、不带贬义的那个。追求音义兼顾的主要是商标，而非普通人名。',
  },
];

export default function TransliterationCharactersGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: '音译用字：外国人名的中文汉字是怎么选出来的',
        description: metadata.description,
        inLanguage: 'zh-CN',
        mainEntityOfPage: `${SITE}/transliteration-characters-guide`,
        datePublished: '2026-06-18',
        dateModified: '2026-06-21',
        author: { '@type': 'Organization', name: '外文译名词典', url: SITE },
        publisher: { '@type': 'Organization', name: '外文译名词典', url: SITE },
        isBasedOn: {
          '@type': 'Book',
          name: '新华社姓名译名手册',
          publisher: { '@type': 'Organization', name: '新华通讯社' },
        },
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
            name: '音译用字：汉字是怎么选的',
            item: `${SITE}/transliteration-characters-guide`,
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
          <span className="text-gray-500">音译用字：汉字是怎么选的</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
            音译用字：外国人名的汉字是怎么选的
          </h1>
          <p className="text-sm text-gray-400">人名音译的选字规则</p>
        </header>

        <div className="space-y-4 mb-10">
          <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
            同一个读音对应一大堆同音字，音译人名时凭什么挑出"安娜"的"娜"而不是"那"？
            选字背后有一套规则：按性别选字、按固定译音表保证一致、避开生僻贬义字。
            这篇把音译选字的门道讲清楚。
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
            按规则音译外文名
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/convert"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: ACCENT }}
            >
              外文名音译引擎 →
            </Link>
            <Link
              href="/naming-rules/general"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#EBF3FA', color: ACCENT }}
            >
              外文人名音译总则 →
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
            <Link href="/gov-titles-guide" className="hover:underline" style={{ color: ACCENT }}>
              机构与职位名称翻译规范
            </Link>
            <Link href="/naming-rules" className="hover:underline text-gray-400">
              各语言人名规则 →
            </Link>
          </div>
        </nav>

        <p className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-300">
          内容依据翻译规范整理，译名标准参照新华社姓名译名手册，仅供翻译参考
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
