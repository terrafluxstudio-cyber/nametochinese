import type { Metadata } from 'next';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';

const SITE = 'https://nametochinese.com';
const ACCENT = '#2C5F8A';

export const metadata: Metadata = {
  title: '外国地名翻译规则：地名译名与人名译名有什么不同',
  description:
    '外国地名怎么翻译成中文？地名译名同样遵循音译为主、名从主人、约定俗成，但有四点和人名不同：专名+通名结构（通名意译）、仿译地名更多、约定俗成的旧译更多、派生国名族名。本文用牛津、剑桥、旧金山、盐湖城等实例讲清。',
  keywords: [
    '外国地名翻译',
    '地名译名规则',
    '地名怎么翻译成中文',
    '地名音译',
    '牛津 剑桥 译名',
    '旧金山 由来',
    '专名 通名',
    '地名翻译规范',
  ],
  alternates: { canonical: '/place-names-guide' },
  openGraph: {
    title: '外国地名翻译规则：与人名译名有什么不同 | 外文译名词典',
    description:
      '地名译名的四个特点：专名+通名（通名意译）、仿译多、旧译多、派生国名——用牛津、剑桥、旧金山等实例讲清。',
    url: `${SITE}/place-names-guide`,
    type: 'article',
  },
};

type Section = { heading: string; body: string[] };

const SECTIONS: Section[] = [
  {
    heading: '一、相同的底层：三大原则地名同样适用',
    body: [
      '地名译名和人名译名共享同一套底层原则：音译为主（按读音配字）、名从主人（按当地语言发音，不按英语想当然）、约定俗成（通行旧译保留）。所以 New York 译"纽约"、Tokyo 译"东京"，逻辑和译人名是一致的。',
      '区别不在原则，而在地名多了几类人名没有的结构和惯例。下面四点，是地名翻译比人名更需要留心的地方。',
    ],
  },
  {
    heading: '二、区别一：专名 + 通名，通名要意译',
    body: [
      '地名常由"专名 + 通名"组成。通名是表示地形或行政类别的那部分，要意译，照固定对应译出：Mount＝山，River＝河，Lake＝湖，City＝城，Island＝岛，Bay＝湾，Cape＝角，New＝新。',
      '所以 Salt Lake City 译"盐湖城"（Salt Lake 意译"盐湖" + City 通名"城"），New Orleans 译"新奥尔良"（New 意译"新" + Orleans 音译"奥尔良"），Long Island 译"长岛"，Cape of Good Hope 译"好望角"。专名音译或意译、通名固定意译，再组合——这是人名里没有的处理。',
    ],
  },
  {
    heading: '三、区别二：仿译（逐词对译）的地名更多',
    body: [
      '有些地名是"仿译"：把构成地名的词逐个按意思译出。最经典的是牛津与剑桥。Oxford 由 ox（牛）+ ford（渡口，雅称"津"）构成，逐词仿译为"牛津"。Cambridge 则是半音译半仿译：Cam 音译"剑"，bridge 意译"桥"，合成"剑桥"（早年也译"康桥"，以"康"音译 Cam）。',
      'Pearl Harbor 译"珍珠港"（Pearl 珍珠 + Harbor 港）也是仿译。这类译名读起来完全不像原文发音，因为它们走的是"译意"而非"译音"的路子——这在人名里极少见，在地名里却很常见。',
    ],
  },
  {
    heading: '四、区别三：约定俗成的旧译特别多',
    body: [
      '地名里沉淀了大量历史旧译，这些约定俗成的名字一律保留，不按现行音译规则改。San Francisco 通称"旧金山"（源于 19 世纪淘金潮的俗称），正式音译本应是"圣弗朗西斯科"，但"旧金山"早已固定。Honolulu 旧称"檀香山"，与音译"火奴鲁鲁"并存。',
      '这类旧译往往比规则音译更通行，译者要认得、要沿用，不能"纠正"成规则译名。判断标准只有一个：哪个更通行用哪个。',
    ],
  },
  {
    heading: '五、区别四：派生的国名、族名、语言名',
    body: [
      '国名常有固定的简译或意译，不照搬全称音译：United States 译"美国"，United Kingdom 译"英国"，而不是全音译。由国名派生的形容词、族名、语言名（如"美国的""英国人""法语"）则随国名走，按既定译名处理。',
      '这一层在人名里不存在，是地名体系特有的——一个地名往往牵出一串相关的派生译名，都要保持与母名一致。',
    ],
  },
  {
    heading: '六、查证顺序',
    body: [
      '① 先查既定地名译名：国家、城市、知名地理实体，多有权威认定的固定中文名，直接采用。',
      '② 没有既定译名再音译：拆出专名和通名，通名照固定对应意译，专名按当地语言发音音译，组合通顺。',
      '③ 全篇保持一致，遇到旧译与规则译名并存时，以更通行的为准。',
    ],
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: '外国地名是音译还是意译？',
    a: '以音译为主，但地名常含"通名"（Mount、River、City 等），通名部分意译；此外地名里仿译和约定俗成的旧译比人名多得多。',
  },
  {
    q: '为什么 Oxford 译"牛津"而不是音译？',
    a: '这是逐词仿译：Oxford 由 ox（牛）和 ford（渡口，雅称"津"）构成，按意思译成"牛津"，而不是按读音音译。',
  },
  {
    q: 'San Francisco 为什么叫"旧金山"？',
    a: '"旧金山"是约定俗成的俗称，与 19 世纪淘金潮有关；正式音译应为"圣弗朗西斯科"，但旧称早已通行，予以保留。',
  },
  {
    q: 'New York 和 New Orleans 译法为什么不一样？',
    a: 'New York 是通行旧译，整体音译为"纽约"；New Orleans 则按"专名＋通名"处理，New 意译"新"、Orleans 音译"奥尔良"，合成"新奥尔良"。',
  },
];

export default function PlaceNamesGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: '外国地名翻译规则：地名译名与人名译名有什么不同',
        description: metadata.description,
        inLanguage: 'zh-CN',
        mainEntityOfPage: `${SITE}/place-names-guide`,
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
            name: '地名译名与人名译名的区别',
            item: `${SITE}/place-names-guide`,
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
          <span className="text-gray-500">地名译名与人名译名的区别</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>
            外国地名翻译规则
          </h1>
          <p className="text-sm text-gray-400">地名译名与人名译名有什么不同</p>
        </header>

        <div className="space-y-4 mb-10">
          <p className="text-base leading-relaxed" style={{ color: '#374151' }}>
            地名和人名都讲音译，但地名多了几样人名没有的东西：通名要意译、仿译的地名更多、
            约定俗成的旧译更多。搞清这几点区别，才不会把"盐湖城"硬音译、把"牛津"当成音译来纠错。
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
            查地名与人名的标准译名
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/places"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: ACCENT }}
            >
              地名译名库 →
            </Link>
            <Link
              href="/search"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#EBF3FA', color: ACCENT }}
            >
              查既定译名（人名·地名）→
            </Link>
            <Link
              href="/convert"
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: '#EBF3FA', color: ACCENT }}
            >
              外文名音译引擎 →
            </Link>
          </div>
        </section>

        <nav className="mt-8 text-sm">
          <p className="text-gray-400 mb-2">相关规则与专题：</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/naming-rules/general" className="hover:underline" style={{ color: ACCENT }}>
              外文人名音译总则
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
          内容依据翻译规范整理，具体译名以权威辞典为准，仅供翻译参考
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
