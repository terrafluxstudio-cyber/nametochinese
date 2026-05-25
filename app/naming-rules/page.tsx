import type { Metadata } from "next";
import Link from 'next/link';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: "各语言人名规则",
  description:
    "西班牙语、俄语、阿拉伯语、日语、韩语等16种语言的人名构成规则详解，翻译工作者必备参考。",
  keywords: [
    "外国人名规则",
    "人名翻译规则",
    "西班牙语人名",
    "阿拉伯语人名",
    "俄语人名规则",
  ],
  alternates: { canonical: "/naming-rules" },
};

const sections = [
  {
    id: 'spanish',
    lang: '西班牙语',
    region: '西班牙、拉丁美洲',
    rules: [
      {
        title: '基本结构',
        content: '完整姓名由三部分组成：名（nombre）＋父姓（primer apellido）＋母姓（segundo apellido）。父姓来自父亲的父姓，母姓来自母亲的父姓，两者均可世代传承。',
      },
      {
        title: '缩写习惯',
        content: '日常简称通常只保留父姓。如 José García López，简称为"加西亚"。正式文件中才写全三段。',
      },
      {
        title: '婚姻与姓氏',
        content: '西班牙传统上女性婚后不改姓。正式场合偶尔在本姓后加"de＋夫姓"，但并非义务。',
      },
      {
        title: '复名（nombre compuesto）',
        content: '名字段可由两个词组成，视为整体，如 María José、Juan Pablo。翻译时两字均需译出，不可省略。',
      },
      {
        title: '常见昵称',
        content: 'José→Pepe，Francisco→Paco，Dolores→Lola，Concepción→Concha，Rosario→Charo。昵称与本名差距较大，查询时需知晓对应关系。',
      },
      {
        title: '注意事项',
        content: '拉丁美洲国家规则基本相同，但部分国家（如巴西）使用葡萄牙语，姓氏顺序与西班牙语相反。',
      },
    ],
  },
  {
    id: 'portuguese',
    lang: '葡萄牙语',
    region: '葡萄牙、巴西',
    rules: [
      {
        title: '基本结构',
        content: '同为名＋两个姓，但葡萄牙传统顺序是母姓在前、父姓在后，与西班牙语相反。巴西习惯已逐渐与西班牙语趋同。',
      },
      {
        title: '姓氏传承',
        content: '子女通常继承父亲的父姓作为最后一个姓，这与西班牙语一致。但历史文献中顺序可能不统一，需逐案判断。',
      },
      {
        title: '昵称',
        content: 'Francisco→Chico/Chico，Antônio→Tonho，Maria→Mara/Mariazinha。巴西人非常常用昵称，正式资料中要核实原名。',
      },
    ],
  },
  {
    id: 'russian',
    lang: '俄语',
    region: '俄罗斯及前苏联国家',
    rules: [
      {
        title: '三段式结构',
        content: '俄语姓名由名（имя）＋父称（отчество）＋姓（фамилия）组成。父称由父亲名字派生，是正式场合的礼貌称呼要素。',
      },
      {
        title: '父称构成规则',
        content: '父亲名为Александр，则儿子父称为Александрович（-ович/-евич），女儿父称为Александровна（-овна/-евна）。翻译文件中父称通常保留，不可省略。',
      },
      {
        title: '姓氏的性别变化',
        content: '俄语姓氏有性别形式。男：Иванов；女：Иванова。翻译时需注意，同一家庭父女姓氏拼写不同，但中文音译相同（伊万诺夫/伊万诺娃）。',
      },
      {
        title: '称呼习惯',
        content: '正式或礼貌场合用"名＋父称"，如Александр Николаевич。亲密场合只用名，并常用昵称：Александр→Саша/Шура，Екатерина→Катя，Владимир→Вова/Воля。',
      },
      {
        title: '姓名顺序',
        content: '俄文原文为"名＋父称＋姓"，部分西方文件会调整为"姓，名"格式。翻译时以中文"姓在前名在后"还是"名在前姓在后"需看上下文惯例。',
      },
    ],
  },
  {
    id: 'arabic',
    lang: '阿拉伯语',
    region: '阿拉伯国家、中东、北非',
    rules: [
      {
        title: '传统命名链',
        content: '古典阿拉伯命名采用"本名＋ibn（本）＋父名＋ibn＋祖父名"的链式结构，意为"某之子"。女性用bint（宾特）代替ibn。现代日常文件通常只保留两三段。',
      },
      {
        title: '现代结构',
        content: '当代阿拉伯人姓名多为：个人名＋父名（作为中间名）＋家族姓。各国写法差异较大：埃及、黎巴嫩偏向西化，海湾国家仍保留较长的传统链式结构。',
      },
      {
        title: '库尼亚（Kunya）尊称',
        content: 'Abu（阿布，意为"某某之父"）和Umm（乌姆，意为"某某之母"）是常见尊称，后接长子/长女之名，如Abu Ali（阿里之父）。这是非正式但极常见的称呼方式。',
      },
      {
        title: '宗教名前缀',
        content: '阿卜杜（Abd/Abdul）意为"某神之仆"，后接真主的名号，如Abdul Rahman（仁慈真主之仆）。这类名字整体是一个名，不可拆分翻译。',
      },
      {
        title: '翻译注意',
        content: '同一名字在不同地区有不同拼写（Muhammad/Mohammed/Muhammed），且阿拉伯文无标准罗马转写，译名需参照新华社规范。',
      },
    ],
  },
  {
    id: 'japanese',
    lang: '日语',
    region: '日本',
    rules: [
      {
        title: '姓名顺序',
        content: '日语姓名为"姓在前，名在后"，与中文相同。但日本人在对外交流时常将顺序调换为西方格式（名在前），翻译时需核实原文顺序。',
      },
      {
        title: '汉字与读音',
        content: '日本人名使用汉字书写，但读音与中文差异极大。翻译时以日语读音（罗马字）为准，而非汉字的中文读音。如"田中"读作"Tanaka"，译为"田中"保留汉字，不按中文读音译。',
      },
      {
        title: '平假名/片假名名字',
        content: '部分女性名字用平假名书写（如さくら→樱），外来名字用片假名（如エミリー→艾米莉）。翻译时需根据读音音译。',
      },
      {
        title: '敬称',
        content: '～さん（桑，先生/女士）、～様（样，书面敬称）、～君（君，男性下级/年轻人）、～ちゃん（酱，昵称）。翻译正文通常省略敬称。',
      },
    ],
  },
  {
    id: 'korean',
    lang: '韩语',
    region: '韩国、朝鲜',
    rules: [
      {
        title: '姓名顺序',
        content: '韩语姓名为"姓在前，名在后"，与中文相同。对外交流时部分韩国人调换为西方顺序，翻译时需核实。',
      },
      {
        title: '姓氏集中',
        content: '韩国人口中约45%集中在金（김）、李（이）、朴（박）三大姓。相同姓氏极多，需结合名字区分。',
      },
      {
        title: '汉字名与韩文名',
        content: '传统上韩国人取汉字名，但现代许多人使用纯韩文固有词名字（无对应汉字）。翻译时"金正恩"可直接用汉字，"하늘（天空）"这类固有词名则只能音译。',
      },
      {
        title: '辈字（항렬자）',
        content: '传统家族有辈字制度，名字中某一字为全家族同辈共用。翻译时辈字与其他字一并处理，无需特殊标注。',
      },
    ],
  },
  {
    id: 'icelandic',
    lang: '冰岛语',
    region: '冰岛',
    rules: [
      {
        title: '无世袭姓氏',
        content: '冰岛人没有可世代传承的家族姓氏。姓由父亲（或母亲）名字加后缀构成，每代不同。',
      },
      {
        title: '父称/母称构成',
        content: '父名为Jón，则儿子姓Jónsson，女儿姓Jónsdóttir。若以母称为准，则用母亲名加-son/-dóttir。兄弟姐妹姓氏不同是正常现象。',
      },
      {
        title: '称呼习惯',
        content: '冰岛人相互直呼其名，即使正式场合也如此。冰岛电话簿按名字排序，不按姓。翻译时"姓"实为父称，应理解为描述性词，而非固定姓氏。',
      },
    ],
  },
  {
    id: 'hungarian',
    lang: '匈牙利语',
    region: '匈牙利',
    rules: [
      {
        title: '姓在前，名在后',
        content: '匈牙利语姓名顺序与中文相同：姓（vezetéknév）在前，名（utónév）在后，如Kovács János。但在国际交流和西文文献中，顺序通常已调换，翻译时需注意。',
      },
      {
        title: '常见误区',
        content: '匈牙利人名在西方文件中多以西方顺序呈现。查阅资料时若发现与本人已知信息矛盾，优先以匈牙利文原始顺序为准。',
      },
    ],
  },
  {
    id: 'vietnamese',
    lang: '越南语',
    region: '越南',
    rules: [
      {
        title: '三段式结构',
        content: '越南人名通常为三字：姓（họ）＋中间名（tên đệm）＋名（tên）。如Nguyễn Văn An，阮文安，姓为阮，名为安，文为中间名。',
      },
      {
        title: '姓氏高度集中',
        content: '约40%越南人姓阮（Nguyễn），其他常见姓有陈（Trần）、黎（Lê）、范（Phạm）等。区分个人需依靠全名，不能只看姓氏。',
      },
      {
        title: '称呼习惯',
        content: '越南人日常以名（最后一字）互称，不用姓。正式称谓加尊称于名前，如Ông An（安先生）、Bà An（安女士）。翻译正文中通常保留全名。',
      },
      {
        title: '声调与拼写',
        content: '越南语有六个声调，书写时用附加符号表示。中文译名按发音音译，声调差异不在中文中体现。',
      },
    ],
  },
  {
    id: 'burmese',
    lang: '缅甸语',
    region: '缅甸',
    rules: [
      {
        title: '无姓氏传统',
        content: '缅甸传统上没有世袭姓氏，名字是独立个体，不传给后代。兄弟姐妹、父子之间姓名可以完全不同。',
      },
      {
        title: '尊称系统',
        content: '名字前加尊称表示社会地位：男性Maung（貌，年轻人/平辈）→Ko（哥，成年男性）→U（吴，长辈/官员）；女性Ma（马，年轻女性）→Daw（杜，成年/已婚女性）。翻译时尊称通常保留并音译。',
      },
      {
        title: '名字长度',
        content: '缅甸名字可以只有一个音节，也可以多达四五个音节，没有固定长度限制。',
      },
    ],
  },
  {
    id: 'thai',
    lang: '泰语',
    region: '泰国',
    rules: [
      {
        title: '姓名结构',
        content: '泰国采用西方顺序：名在前，姓在后。姓氏在1913年前并不存在，由拉玛六世推行立法后才出现。',
      },
      {
        title: '昵称文化',
        content: '泰国人几乎人人有一个简短昵称（ชื่อเล่น），日常生活全用昵称，如Nok（鸟）、Lek（小）、Tom等，正式姓名反而很少使用。翻译时需核实正式全名。',
      },
      {
        title: '姓氏极长',
        content: '泰国姓氏往往极长（有时达十几个字母），因为每个家族要取独一无二的姓，导致不断加字。日常称呼几乎从不用姓，只用名或昵称。',
      },
      {
        title: '皇室敬称',
        content: '皇室成员名字前有专用敬称，翻译时需使用固定译名，不可自行音译。',
      },
    ],
  },
  {
    id: 'german',
    lang: '德语',
    region: '德国、奥地利、瑞士',
    rules: [
      {
        title: '基本结构',
        content: '德语姓名为"名（Vorname）＋姓（Nachname/Familienname）"，与英语结构相同。',
      },
      {
        title: '贵族前缀',
        content: 'von、zu、von und zu等前缀表示贵族出身，为姓氏的组成部分，如Otto von Bismarck。翻译时这些前缀通常保留音译（冯、楚等）或省略，需参照惯例译名。',
      },
      {
        title: '复合名字',
        content: '德语中复名较常见，如Karl-Heinz、Hans-Peter，用连字号连接，翻译时两字均需译出。',
      },
      {
        title: '婚姻与姓氏',
        content: '德国法律允许夫妻选择其中一方姓氏作为共同姓，也允许各保留原姓，或组合双方姓氏（用连字号）。',
      },
    ],
  },
  {
    id: 'french',
    lang: '法语',
    region: '法国及法语区',
    rules: [
      {
        title: '基本结构',
        content: '法语姓名为"名（prénom）＋姓（nom de famille）"，与英语相同。正式文件中偶尔名姓倒置。',
      },
      {
        title: '贵族前缀',
        content: 'de、du、de la、des等前缀是贵族或地域来源的标志，如Charles de Gaulle。小写de在姓氏单独使用时通常省略（称"戴高乐"，单独提姓时说"戈乐"）。',
      },
      {
        title: '复名',
        content: '法国人常有多个名字，如Jean-Paul、Marie-Claire，用连字号连接，视为整体。',
      },
      {
        title: '婚后姓氏',
        content: '法国女性法律上保留原姓，婚后可选择使用夫姓或双姓，但身份证件以原姓为准。',
      },
    ],
  },
];

export default function NamingRulesPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen px-4 py-16 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif', background: '#F7F5F0' }}>
      <h1 className="text-3xl font-bold text-center mb-3" style={{ color: '#1A1A1A' }}>
        各语言人名规则
      </h1>
      <p className="text-center text-gray-500 text-sm mb-12">
        供翻译工作者参考，涵盖姓名结构、称呼习惯与常见注意事项
      </p>

      {/* 快速跳转 */}
      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        {sections.map(s => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="px-3 py-1 rounded-full text-sm border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-all"
            style={{ background: '#fff' }}
          >
            {s.lang}
          </a>
        ))}
      </div>

      {/* 各语言板块 */}
      <div className="space-y-12">
        {sections.map(section => (
          <section key={section.id} id={section.id} className="scroll-mt-8">
            <div className="flex items-baseline gap-3 mb-4">
              <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>
                {section.lang}
              </h2>
              <span className="text-sm text-gray-400">{section.region}</span>
            </div>

            <div className="space-y-4">
              {section.rules.map((rule, i) => (
                <div
                  key={i}
                  className="rounded-xl px-5 py-4"
                  style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
                >
                  <div className="text-sm font-semibold mb-1.5" style={{ color: '#2C5F8A' }}>
                    {rule.title}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                    {rule.content}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/naming-rules/sinosphere"
          className="inline-block px-6 py-3 rounded-xl text-sm"
          style={{ background: '#fff', color: '#2C5F8A', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}
        >
          台湾·新加坡·马来西亚华人英文名写法 →
        </Link>
      </div>

      <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-300">
        内容依据语言学规律整理，仅供翻译参考，具体译名以权威辞典为准
      </footer>
    </main>
    </>
  );
}
