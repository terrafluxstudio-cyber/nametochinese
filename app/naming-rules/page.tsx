import type { Metadata } from "next";
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/SiteFooter';
import { ARTICLE_SLUGS } from './content';

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
  openGraph: {
    title: '各语言人名规则详解 | 外文译名词典',
    description: '33种语言的人名构成规则：姓名顺序、父称惯例、性别变化、宗教习俗等，翻译工作者必备参考。',
    url: 'https://nametochinese.com/naming-rules',
    type: 'website',
  },
  twitter: { card: 'summary', title: '各语言人名规则 · 外文译名词典', description: '33种语言人名规则详解，翻译工作者必备参考。' },
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
  {
    id: 'dutch',
    lang: '荷兰语',
    region: '荷兰、比利时佛兰德斯',
    rules: [
      { title: '小字（Tussenvoegsel）', content: 'van、de、van den、van der 等夹在名和姓之间的前缀称为"小字"，是姓氏的固定组成部分，不可省略。音译时 van=范、de=德、van der=范德。' },
      { title: '大小写规则', content: '前有名字时小字小写（Vincent van Gogh），单独作姓使用时大写（Van Gogh）。中文译名不受影响，统一音译即可。' },
      { title: '关键发音', content: 'g 读喉音 /x/（不是英语 g）；ui 读 /œy/（克鲁伊夫）；ij/ei 读 /ɛi/（"艾"）；oe 读 /u/（"乌"）。' },
      { title: '注意事项', content: '梵高中文通行译名"梵高"已固定，直接使用。荷兰与比利时佛兰德斯语区规则相同。' },
    ],
  },
  {
    id: 'turkish',
    lang: '土耳其语',
    region: '土耳其',
    rules: [
      { title: '现代姓氏制度', content: '1934年《姓氏法》前土耳其人没有世袭姓氏。法令颁布后家庭自行选择姓氏，多为吉祥词（Yılmaz=不屈、Demir=铁、Kaya=岩石）。' },
      { title: 'İ 与 I 的区别', content: '有点的 İ/i 发 /i/（"伊"），无点的 I/ı 发 /ɯ/。如 İstanbul 首字母是有点的 İ。这是土耳其语最易出错的字母区分。' },
      { title: 'ğ、ç、ş 发音', content: 'ğ（软g）不发音，使前一元音延长；ç 读 /tʃ/（"切"）；ş 读 /ʃ/（"什"）；c 读 /dʒ/（"贾"）。' },
      { title: '注意事项', content: '阿拉伯语来源的土耳其名（如 Mehmet=穆罕默德的土语形式）按土耳其语发音音译，不按阿拉伯语处理。' },
    ],
  },
  {
    id: 'persian',
    lang: '波斯语',
    region: '伊朗、阿富汗、塔吉克斯坦',
    rules: [
      { title: '姓氏后缀', content: '-zadeh（后裔）、-pour/-pur（儿子）、-nejad（血统）是常见波斯语姓氏后缀，保留音译，不翻译字面意思。' },
      { title: 'kh 与 gh 发音', content: 'kh（خ）读喉擦音 /x/，近"赫/哈/霍"；gh（غ）是其浊音对应。如 Khomeini = 霍梅尼。不是 k+h 的组合。' },
      { title: '三地差异', content: '伊朗（波斯语）/阿富汗（达利语）语音相近但拼写习惯不同；塔吉克斯坦因苏联影响，许多姓氏有 -ov/-ova 结尾，按俄语规则处理。' },
      { title: '注意事项', content: '同一个名字英文拼写差异极大（Hossein/Husayn/Hussein），以新华社通行译法为准，全篇保持一致。' },
    ],
  },
  {
    id: 'swedish',
    lang: '瑞典语',
    region: '瑞典及北欧（挪威、丹麦）',
    rules: [
      { title: '-son 后缀来源', content: '瑞典姓氏约60%以 -son 结尾（Eriksson、Johansson），来自19世纪父名制世袭化时"冻结"的父名，现在只是姓氏，与当代父亲名字无关。' },
      { title: '特殊字母发音', content: 'å 读 /oː/（"奥"）；ä 读 /ɛː/（"艾"）；ö 读 /øː/（近"厄"）。挪威对应 ø，丹麦对应 ø 和 æ，发音相同。' },
      { title: '挪威/丹麦差异', content: '挪威和丹麦姓氏以 -sen 结尾（而非瑞典的 -son）。丹麦语有"软d"（/ð/）发音特点。三国人名结构和音译规则高度相近。' },
      { title: '注意事项', content: '遇到来自瑞典的非北欧裔人名（如兹拉坦·伊布拉希莫维奇的波斯尼亚语姓氏），按其本身语言来源处理，不套用瑞典语规则。' },
    ],
  },
  {
    id: 'hindi',
    lang: '印地语',
    region: '印度（北部及中部）',
    rules: [
      { title: '北印度基本结构', content: '北印度名 + 种姓/家族姓，如 Narendra Modi（名）+（Modi=种姓姓氏）。姓氏往往揭示种姓背景，但许多现代人选择淡化或更换种姓姓氏。' },
      { title: 'Singh 与 Kaur', content: 'Singh（狮子）是锡克教男性宗教称号，Kaur（公主）是女性对应，由1699年上师哥宾德·辛格规定。两者也是印度教刹帝利族传统种姓姓氏，看到 Singh 不能仅此判断其是否为锡克教徒。' },
      { title: '南印度的不同逻辑', content: '南印度（泰米尔、泰卢固等语区）无世袭姓氏，以父名首字母+个人名为结构。如 V. Anand = Viswanathan Anand，V 是父亲名首字母，Anand 才是本人常用名。' },
      { title: '注意事项', content: '-ji（如 Gandhiji）是尊称后缀，翻译时通常省略。印度人名宗教来源特征明显，可通过词根初步判断：梵语词根=印度教，阿拉伯语来源=伊斯兰教，+Singh/Kaur=锡克教。' },
    ],
  },
  {
    id: 'italian',
    lang: '意大利语',
    region: '意大利',
    rules: [
      { title: '基本结构', content: '名 + 姓，西方顺序。女性姓氏无性别变化——与俄语、波兰语不同，女性用与男性完全相同的姓氏形式。' },
      { title: 'da/di/de 类前缀', content: '达·芬奇的"da Vinci"意为"来自文奇镇"，是地理标注，不是世袭姓氏。文艺复兴前的人名中这类前缀不应视为可单独引用的姓。现代姓氏中含 de/di 的通常整体处理。' },
      { title: 'c 和 g 的软硬音', content: 'c 在 e/i 前读 /tʃ/（"切/奇"），在 a/o/u 前读 /k/；g 在 e/i 前读 /dʒ/（"杰/吉"），在 a/o/u 前读 /g/。Giovanni = 乔瓦尼（gi = /dʒ/）。' },
      { title: 'gn 和 gli', content: 'gn 读 /ɲ/（近"尼"），如 Bologna = 博洛尼亚；gli 读 /ʎ/（近"利"），如 Famiglia = 法米利亚。不要按字母逐个读。' },
    ],
  },
  {
    id: 'polish',
    lang: '波兰语',
    region: '波兰',
    rules: [
      { title: '姓氏性别变化', content: '男性姓氏以 -ski/-cki 结尾，女性对应 -ska/-cka，如 Kowalski（男）/ Kowalska（女）是同一家族的父女。中文译名末尾不同（"斯基"/"斯卡"）。' },
      { title: 'ł 的发音', content: 'ł（带斜杠的L）读 /w/，与英语"w"几乎相同，不是普通 l。如 Wałęsa = 瓦文萨（ł读"w"）。这是波兰语最常见的发音陷阱。' },
      { title: 'cz、sz、szcz', content: 'cz = /tʃ/（"奇"，类似英语 ch）；sz = /ʃ/（"什"，类似英语 sh）；szcz = /ʃtʃ/（"什奇"）；rz = /ʒ/（"日"）。不能按字母逐个读。' },
      { title: '注意事项', content: '遇到波兰女性姓名，-ska/-cka/-dzka 结尾是男性 -ski/-cki/-dzki 的女性形式；ą/ę 是鼻化元音，不同于普通 a/e。' },
    ],
  },
  {
    id: 'indonesian',
    lang: '印度尼西亚语',
    region: '印度尼西亚',
    rules: [
      { title: '单名传统', content: '爪哇族（印尼最大民族）传统只有一个名字，无世袭姓氏，如苏卡诺（Sukarno）、苏哈托（Suharto）。名字不传给子女，不可拆分为名和姓。' },
      { title: '"佐科威"的来源', content: '印尼现任总统官方名 Joko Widodo，"佐科威"（Jokowi）是 Joko-Wi(dodo) 的组合缩写昵称，现已成为通行中文译名。Widodo 不是姓氏。' },
      { title: '巴塔克族有姓氏', content: '并非所有印尼人都无姓氏。北苏门答腊的巴塔克族有 marga（氏族姓氏），如 Sihombing、Simanjuntak，是父系传承的正式姓氏。' },
      { title: '注意事项', content: '印尼语 c 读 /tʃ/（"奇"），j 读 /dʒ/（"贾"），不按英语读音处理。遇到单名人物，不要试图拆分成名和姓。' },
    ],
  },
  {
    id: 'greek',
    lang: '希腊语',
    region: '希腊、塞浦路斯',
    rules: [
      { title: '-opoulos 后缀', content: 'Papadopoulos = papas（神父）+ poulos（小儿子），意为"神父之子的后裔"。-opoulos（男性）/ -opoulou（女性）是父名制的遗留，在伯罗奔尼撒半岛特别常见。' },
      { title: '姓氏性别变化', content: '男性姓氏通常以 -os/-is/-as 结尾，女性转为阴性形式（去掉 -s 或变为 -ou/-a）。如 Papadopoulos（男）/ Papadopoulou（女）。' },
      { title: '命名传统', content: '希腊东正教传统：第一个男孩随爷爷名，第一个女孩随奶奶名，依此类推。名字在隔代循环，同家族重名极多。' },
      { title: '注意事项', content: '古典历史人物（亚里士多德、苏格拉底）使用通行汉语译名，不按现代希腊发音重新音译。θ 译"希/斯"，φ 译"夫/弗"，χ 译"赫/哈"。' },
    ],
  },
  {
    id: 'hebrew',
    lang: '希伯来语',
    region: '以色列',
    rules: [
      { title: 'Ben-/Bar-前缀', content: 'Ben（希伯来语）和 Bar（亚拉姆语）均意为"儿子"。Ben-Gurion = "古里安之子"。这类姓氏带连字号，整体处理，中文译名保留连字号：本-古里安。' },
      { title: '建国改名运动', content: '以色列建国前后许多领袖把欧洲名字改为希伯来名：本-古里安（原名格林）、梅厄（原名马博维奇）、沙龙（原名沙内尔曼）。两个名字指同一人，需能互相识别。' },
      { title: 'ח 的发音', content: 'ח（het）读喉擦音 /x/，类似德语 Bach，中文近"赫/哈"。如 Chaim = 哈伊姆。不要读成英语的 h。' },
      { title: '注意事项', content: '阿拉伯裔以色列人（约占人口20%）使用阿拉伯语命名规则，不按希伯来语处理。同一希伯来名有多种英文拼写，以新华社规范为准。' },
    ],
  },
  {
    id: 'taiwan',
    lang: '台湾',
    region: '台湾地区',
    rules: [
      { title: '威妥玛拼音', content: '台湾姓名英文写法用威妥玛拼音（Wade-Giles），非汉语拼音。蔡=Tsai、谢=Hsieh、蒋=Chiang、张=Chang、许=Hsu。看到 Ts-/Hs-/Ch- 开头基本可判为台湾写法。' },
      { title: '一拼多字', content: 'Hsu 同时对应"许"和"徐"，Chiang 对应"蒋/江"，Chang 对应"张/章/常"。威妥玛只记读音，不能唯一确定汉字，需以本人中文文件为准。' },
      { title: '连字号双字名', content: '名字两字用连字号连接、后字小写：Ing-wen（英文）、Ying-jeou（英九）。连字号两侧合为一个完整的名，不可拆分。' },
      { title: '自取英文名', content: '大量台湾人另取西方英文名（Kevin Chen、Jessica Wang），与中文名无对应关系，翻译时保留英文名，承载中文信息的是姓氏拼写。' },
    ],
  },
  {
    id: 'singapore',
    lang: '新加坡',
    region: '新加坡',
    rules: [
      { title: '方言拼音', content: '新加坡华人姓名按祖籍方言（闽南、粤、潮州）发音拼写，非普通话。Tan=陈、Lim=林、Ong=王、Goh=吴，不能用汉语拼音反推。' },
      { title: '一拼多字', content: 'Ng 可能是黄/吴/伍（粤/潮鼻音），Teo 可能是张/赵。同字也有多写法（吴=Goh 或 Ng）。高频姓 Tan/Lim/Ong 对应稳定，可优先采信。' },
      { title: '英文名前置', content: '多数有西方英文名置于最前：Peter Tan Wei Ming（英文名+姓 Tan+名 Wei Ming）。紧跟英文名的是姓。纯拼音格式（Tan Ah Kow）则姓在前。' },
      { title: '族群区分', content: 'bin/binti 是马来族，s/o /d/o 是印度族，华族无这些标志。看到即判断非华裔，不用方言拼音规则。' },
    ],
  },
  {
    id: 'malaysia',
    lang: '马来西亚',
    region: '马来西亚',
    rules: [
      { title: '方言拼音', content: '与新加坡一脉相承，按闽南、粤、客家方言拼写。Tan=陈、Lim=林、Wong=王/黄、Chong=张/钟（客）。高频姓对应稳定。' },
      { title: '荣誉衔头', content: 'Tun（敦）>Tan Sri（丹斯里）>Datuk Seri（拿督斯里）>Datuk（拿督），冠于姓名前。Tan Sri Lim Guan Eng=丹斯里林冠英，Tan Sri 是衔头不是姓。' },
      { title: '客家拼音', content: '客家籍比例高，拼写有别：张=Chong、叶=Yap、刘=Liew。沙巴、霹雳客家多，是判断线索。' },
      { title: '中文名好查', content: '华文教育与社团保留完好，华文报纸、商会、公司注册普遍用正式中文名，准确中文名往往可考，优于拼音反推。' },
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
      <p className="text-center text-gray-400 text-sm mb-6">
        各国取名方式大不相同——了解背后的规律，才能译得准确
      </p>

      {/* 总则支柱页入口 */}
      <Link
        href="/naming-rules/general"
        className="block rounded-2xl px-6 py-5 mb-8 text-center transition-shadow hover:shadow-md"
        style={{ background: '#2C5F8A', color: '#fff' }}
      >
        <div className="text-base font-bold mb-1">先读：外文人名音译总则</div>
        <div className="text-sm" style={{ color: '#D6E4F0' }}>
          名从主人 · 约定俗成 · 用字与间隔号规范 · 查证流程——所有语言共通的底层规则
        </div>
      </Link>

      {/* 翻译专题 */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {[
          { href: '/transliteration-characters-guide', label: '音译用字怎么选' },
          { href: '/place-names-guide', label: '地名译名规则' },
          { href: '/gov-titles-guide', label: '机构与职位翻译' },
        ].map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="px-3 py-1.5 rounded-lg text-sm"
            style={{ background: '#fff', color: '#2C5F8A', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            {t.label} →
          </Link>
        ))}
      </div>

      {/* 快速跳转 */}
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
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
            <div className="flex items-baseline gap-3 mb-4 flex-wrap">
              <h2 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>
                {section.lang}
              </h2>
              <span className="text-sm text-gray-400">{section.region}</span>
              {ARTICLE_SLUGS.includes(section.id) && (
                <Link
                  href={`/naming-rules/${section.id}`}
                  className="text-sm font-medium ml-auto"
                  style={{ color: '#2C5F8A' }}
                >
                  完整详解 →
                </Link>
              )}
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

      {/* 横向导流：相关工具 */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm"
          style={{ background: '#F0F5FA', color: '#2C5F8A' }}
        >
          查既定译名（辞典）→
        </Link>
        <Link
          href="/convert"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm"
          style={{ background: '#F0F5FA', color: '#2C5F8A' }}
        >
          外文名音译引擎 →
        </Link>
        <Link
          href="/gov-titles"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm"
          style={{ background: '#F0F5FA', color: '#2C5F8A' }}
        >
          机构与官员职位翻译 →
        </Link>
      </div>

      <p className="mt-10 pt-8 border-t border-gray-200 text-center text-xs text-gray-300">
        内容依据语言学规律整理，仅供翻译参考，具体译名以权威辞典为准
      </p>
    </main>
    <SiteFooter />
    </>
  );
}
