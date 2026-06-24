// 政治机构 / 官员职位 中英双语库。
// 铁律（见 memory/gov_titles_plan.md）：只用官方翻译；机构名以机构官网/中央政府发布为准，
// 职位以政府工作报告英译本/中国关键词为准；冲突取高档；不抓 wiki；敏感/争议一律不入库。
// status: 现行 | 历史。source 必填可溯源。

export type GovTerm = {
  zh: string;
  en: string;
  abbr?: string;
  category: '机构' | '职位' | '通名';
  side: 'cn' | 'foreign' | 'tw';
  group: string;        // 卡片分组名
  level?: string;       // 职位才有
  status: '现行' | '历史';
  source: string;
  note?: string;
};

// 来源：中国政府网英文版 english.www.gov.cn（2023 机构改革后现行设置）
const GOV_SRC = '中国政府网英文版 english.www.gov.cn';
// 来源：china.org.cn（中国官方对外网站）机构英文名页 + 国新办 english.scio.gov.cn
const PARTY_SRC = 'china.org.cn / 国新办 官方英文版';
// 来源：全国人大/政协/最高法/最高检官网英文版 + 中国政府网英文版
const LEG_SRC = '人大·政协·两高官网英文版';
// 来源：外交部官网英文版 fmprc.gov.cn（职务通用译法）
const MOFA_SRC = '外交部官网英文版 fmprc.gov.cn';
// 来源：各机构官网英文版 + 中国政府网英文版（现行名核验）
const DIR_SRC = '机构官网英文版 + 中国政府网英文版';
// 来源：宪法英译本 + 中国政府网英文版行政区划介绍
const CONST_SRC = '宪法英译本 + 中国政府网英文版';
// 来源：官方机构译名归纳（部=Ministry、局=Bureau/Administration 等通名）
const NAMING_SRC = '官方机构译名归纳';
// 来源：联合国官方中文 un.org/zh + 联合国系统文件库 research.un.org/zh
const UN_SRC = '联合国官方中文 + 联合国系统文件库';
// 来源：新华社译名标准 + 各组织官方中文名
const INTL_SRC = '新华社译名标准 + 组织官方中文名';
// 来源：新华社译名标准 + 中国外交部国家概况/驻外使馆
const FGOV_SRC = '新华社译名标准 + 中国外交部';
// 来源：外交部礼宾知识 + 驻外外交人员法（外交衔级）
const DIPL_SRC = '外交部礼宾知识 + 驻外外交人员法';
// 来源：新加坡政府官方中文 + 新华社（新加坡为华语区，机构有官方中文名）
const SG_SRC = '新加坡政府官方中文 + 新华社';
// 來源：中華民國政府官方英文版 gov.tw（臺灣，繁體字）
const TW_SRC = '中華民國政府官方英文版（gov.tw）';

export const TERMS: GovTerm[] = [
  // ── 党中央机构（无争议党务机构；官方英文名）──
  { zh: '中央办公厅', en: 'General Office of the CPC Central Committee', category: '机构', side: 'cn', group: '党中央机构', status: '现行', source: PARTY_SRC, note: '简称"中办"' },
  { zh: '中央组织部', en: 'Organization Department of the CPC Central Committee', category: '机构', side: 'cn', group: '党中央机构', status: '现行', source: PARTY_SRC, note: '简称"中组部"' },
  { zh: '中央宣传部', en: 'Publicity Department of the CPC Central Committee', category: '机构', side: 'cn', group: '党中央机构', status: '现行', source: PARTY_SRC, note: '简称"中宣部"' },
  { zh: '中央对外联络部', en: 'International Department of the CPC Central Committee', category: '机构', side: 'cn', group: '党中央机构', status: '现行', source: PARTY_SRC, note: '简称"中联部"' },
  { zh: '中央统一战线工作部', en: 'United Front Work Department of the CPC Central Committee', category: '机构', side: 'cn', group: '党中央机构', status: '现行', source: PARTY_SRC, note: '简称"中央统战部"' },
  { zh: '中央政策研究室', en: 'Policy Research Office of the CPC Central Committee', category: '机构', side: 'cn', group: '党中央机构', status: '现行', source: PARTY_SRC, note: '简称"中央政研室"' },
  { zh: '中央纪律检查委员会', en: 'Central Commission for Discipline Inspection', abbr: 'CCDI', category: '机构', side: 'cn', group: '党中央机构', status: '现行', source: PARTY_SRC, note: '简称"中央纪委"' },
  { zh: '中央政法委员会', en: 'Commission for Political and Legal Affairs of the CPC Central Committee', category: '机构', side: 'cn', group: '党中央机构', status: '现行', source: PARTY_SRC, note: '简称"中央政法委"' },
  { zh: '中央国家安全委员会', en: 'National Security Commission of the CPC Central Committee', category: '机构', side: 'cn', group: '党中央机构', status: '现行', source: PARTY_SRC, note: '简称"中央国安委"，2013年新设，主席为最高领导人' },

  // ── 国务院组成部门（26，机构名以中央政府官网英文版为准）──
  { zh: '外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '国防部', en: 'Ministry of National Defense', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '国家发展和改革委员会', en: 'National Development and Reform Commission', abbr: 'NDRC', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC, note: '简称"发改委"' },
  { zh: '教育部', en: 'Ministry of Education', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '科学技术部', en: 'Ministry of Science and Technology', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '工业和信息化部', en: 'Ministry of Industry and Information Technology', abbr: 'MIIT', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC, note: '简称"工信部"' },
  { zh: '国家民族事务委员会', en: 'National Ethnic Affairs Commission', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC, note: '简称"国家民委"' },
  { zh: '公安部', en: 'Ministry of Public Security', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '国家安全部', en: 'Ministry of State Security', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '民政部', en: 'Ministry of Civil Affairs', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '司法部', en: 'Ministry of Justice', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '财政部', en: 'Ministry of Finance', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '人力资源和社会保障部', en: 'Ministry of Human Resources and Social Security', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC, note: '简称"人社部"' },
  { zh: '自然资源部', en: 'Ministry of Natural Resources', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '生态环境部', en: 'Ministry of Ecology and Environment', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '住房和城乡建设部', en: 'Ministry of Housing and Urban-Rural Development', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC, note: '简称"住建部"' },
  { zh: '交通运输部', en: 'Ministry of Transport', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '水利部', en: 'Ministry of Water Resources', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '农业农村部', en: 'Ministry of Agriculture and Rural Affairs', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '商务部', en: 'Ministry of Commerce', abbr: 'MOFCOM', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '文化和旅游部', en: 'Ministry of Culture and Tourism', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC, note: '简称"文旅部"' },
  { zh: '国家卫生健康委员会', en: 'National Health Commission', abbr: 'NHC', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC, note: '简称"国家卫健委"，前身卫计委已撤' },
  { zh: '退役军人事务部', en: 'Ministry of Veterans Affairs', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '应急管理部', en: 'Ministry of Emergency Management', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },
  { zh: '中国人民银行', en: "People's Bank of China", abbr: 'PBC', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC, note: '中国央行' },
  { zh: '审计署', en: 'National Audit Office', category: '机构', side: 'cn', group: '国务院组成部门', status: '现行', source: GOV_SRC },

  // ── 国务院直属机构与国家局（现行官方英文名）──
  { zh: '海关总署', en: 'General Administration of Customs', abbr: 'GACC', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家税务总局', en: 'State Taxation Administration', abbr: 'STA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '2018 由 State Administration of Taxation 更名' },
  { zh: '国家市场监督管理总局', en: 'State Administration for Market Regulation', abbr: 'SAMR', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '简称"市场监管总局"' },
  { zh: '国家金融监督管理总局', en: 'National Financial Regulatory Administration', abbr: 'NFRA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '2023 新设，原银保监会职责并入' },
  { zh: '中国证券监督管理委员会', en: 'China Securities Regulatory Commission', abbr: 'CSRC', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '简称"证监会"' },
  { zh: '国务院国有资产监督管理委员会', en: 'State-owned Assets Supervision and Administration Commission', abbr: 'SASAC', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '简称"国资委"' },
  { zh: '国家广播电视总局', en: 'National Radio and Television Administration', abbr: 'NRTA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '简称"广电总局"' },
  { zh: '国家体育总局', en: 'General Administration of Sport', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家统计局', en: 'National Bureau of Statistics', abbr: 'NBS', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家国际发展合作署', en: 'China International Development Cooperation Agency', abbr: 'CIDCA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家医疗保障局', en: 'National Healthcare Security Administration', abbr: 'NHSA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '简称"国家医保局"' },
  { zh: '国家数据局', en: 'National Data Administration', abbr: 'NDA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '2023 新设，发改委管理' },
  { zh: '国家知识产权局', en: 'China National Intellectual Property Administration', abbr: 'CNIPA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家药品监督管理局', en: 'National Medical Products Administration', abbr: 'NMPA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家中医药管理局', en: 'National Administration of Traditional Chinese Medicine', abbr: 'NATCM', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家文物局', en: 'National Cultural Heritage Administration', abbr: 'NCHA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家能源局', en: 'National Energy Administration', abbr: 'NEA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家移民管理局', en: 'National Immigration Administration', abbr: 'NIA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家林业和草原局', en: 'National Forestry and Grassland Administration', abbr: 'NFGA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家铁路局', en: 'National Railway Administration', abbr: 'NRA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '中国民用航空局', en: 'Civil Aviation Administration of China', abbr: 'CAAC', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '简称"民航局"' },
  { zh: '国家邮政局', en: 'State Post Bureau', abbr: 'SPB', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家外汇管理局', en: 'State Administration of Foreign Exchange', abbr: 'SAFE', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '简称"外汇局"' },
  { zh: '国家烟草专卖局', en: 'State Tobacco Monopoly Administration', abbr: 'STMA', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家粮食和物资储备局', en: 'National Food and Strategic Reserves Administration', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家国防科技工业局', en: 'State Administration of Science, Technology and Industry for National Defense', abbr: 'SASTIND', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家信访局', en: 'State Bureau of Letters and Calls', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家矿山安全监察局', en: 'National Mine Safety Administration', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国务院参事室', en: "Counsellors' Office of the State Council", category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC },
  { zh: '国家机关事务管理局', en: 'National Government Offices Administration', category: '机构', side: 'cn', group: '国务院直属机构与国家局', status: '现行', source: DIR_SRC, note: '简称"国管局"' },

  // ── 全国人大与全国政协 ──
  { zh: '全国人民代表大会', en: "National People's Congress", abbr: 'NPC', category: '机构', side: 'cn', group: '全国人大·政协', status: '现行', source: LEG_SRC, note: '最高国家权力机关' },
  { zh: '全国人大常务委员会', en: "Standing Committee of the National People's Congress", category: '机构', side: 'cn', group: '全国人大·政协', status: '现行', source: LEG_SRC, note: '简称"全国人大常委会"' },
  { zh: '中国人民政治协商会议全国委员会', en: "National Committee of the Chinese People's Political Consultative Conference", abbr: 'CPPCC', category: '机构', side: 'cn', group: '全国人大·政协', status: '现行', source: LEG_SRC, note: '简称"全国政协"' },

  // ── 最高法·最高检（两高）──
  { zh: '最高人民法院', en: "Supreme People's Court", abbr: 'SPC', category: '机构', side: 'cn', group: '最高法·最高检', status: '现行', source: LEG_SRC },
  { zh: '最高人民检察院', en: "Supreme People's Procuratorate", abbr: 'SPP', category: '机构', side: 'cn', group: '最高法·最高检', status: '现行', source: LEG_SRC },
  { zh: '国家监察委员会', en: 'National Supervisory Commission', abbr: 'NSC', category: '机构', side: 'cn', group: '最高法·最高检', status: '现行', source: GOV_SRC, note: '2018年新设，与中央纪委合署办公，对国家公职人员行使监察权' },
  { zh: '国家监察委员会主任', en: 'Director of the National Supervisory Commission', category: '职位', side: 'cn', group: '最高法·最高检', status: '现行', source: GOV_SRC, note: '由全国人大选举产生，通常由中央纪委书记兼任' },

  // ── 国家领导职务（gov.cn 官方）──
  { zh: '国家主席', en: "President of the People's Republic of China", category: '职位', side: 'cn', group: '中央国家机关职务', level: '国家级正职', status: '现行', source: GOV_SRC },
  { zh: '国家副主席', en: "Vice-President of the People's Republic of China", category: '职位', side: 'cn', group: '中央国家机关职务', level: '国家级副职', status: '现行', source: GOV_SRC },
  { zh: '国务院总理', en: 'Premier of the State Council', category: '职位', side: 'cn', group: '中央国家机关职务', level: '国家级正职', status: '现行', source: GOV_SRC, note: '简称 Premier' },
  { zh: '国务院副总理', en: 'Vice-Premier of the State Council', category: '职位', side: 'cn', group: '中央国家机关职务', level: '国家级副职', status: '现行', source: GOV_SRC },
  { zh: '国务委员', en: 'State Councillor', category: '职位', side: 'cn', group: '中央国家机关职务', level: '国家级副职', status: '现行', source: GOV_SRC, note: '亦作 State Councilor（政府工作报告英译本用单 l）' },
  { zh: '国务院秘书长', en: 'Secretary-General of the State Council', category: '职位', side: 'cn', group: '中央国家机关职务', level: '正部级', status: '现行', source: GOV_SRC },

  // ── 国务院组成部门正职职务（官方职务译法，同一来源页确认）──
  { zh: '部长', en: 'Minister', category: '职位', side: 'cn', group: '中央国家机关职务', level: '国务院组成部门正职', status: '现行', source: GOV_SRC, note: '各部首长，如"外交部部长"= Minister of Foreign Affairs' },
  { zh: '副部长', en: 'Vice-Minister', category: '职位', side: 'cn', group: '中央国家机关职务', level: '省部级副职', status: '现行', source: MOFA_SRC, note: '外交部作 Vice Foreign Minister' },
  { zh: '部长助理', en: 'Assistant Minister', category: '职位', side: 'cn', group: '中央国家机关职务', level: '副部级', status: '现行', source: MOFA_SRC, note: '外交部作 Assistant Foreign Minister' },
  { zh: '主任（部级委员会）', en: 'Minister in charge of the Commission', category: '职位', side: 'cn', group: '中央国家机关职务', level: '国务院组成部门正职', status: '现行', source: GOV_SRC, note: '发改委、国家民委、卫健委等委员会首长，官网表述为 Minister in charge of the … Commission' },
  { zh: '中国人民银行行长', en: "Governor of the People's Bank of China", category: '职位', side: 'cn', group: '中央国家机关职务', level: '国务院组成部门正职', status: '现行', source: GOV_SRC },
  { zh: '审计长', en: 'Auditor-General of the National Audit Office', category: '职位', side: 'cn', group: '中央国家机关职务', level: '国务院组成部门正职', status: '现行', source: GOV_SRC },
  { zh: '司长（厅长）', en: 'Director-General', category: '职位', side: 'cn', group: '中央国家机关职务', level: '厅局级正职', status: '现行', source: MOFA_SRC, note: '部委内设司/局首长；"司"= Department，首长 = Director-General' },
  { zh: '副司长', en: 'Deputy Director-General', category: '职位', side: 'cn', group: '中央国家机关职务', level: '厅局级副职', status: '现行', source: MOFA_SRC },

  // 人大·政协·两高正职
  { zh: '全国人大常委会委员长', en: "Chairman of the Standing Committee of the National People's Congress", category: '职位', side: 'cn', group: '中央国家机关职务', level: '国家级正职', status: '现行', source: LEG_SRC },
  { zh: '全国政协主席', en: "Chairman of the National Committee of the CPPCC", category: '职位', side: 'cn', group: '中央国家机关职务', level: '国家级正职', status: '现行', source: LEG_SRC },
  { zh: '最高人民法院院长', en: "President of the Supreme People's Court", category: '职位', side: 'cn', group: '中央国家机关职务', level: '国家级正职', status: '现行', source: LEG_SRC },
  { zh: '最高人民检察院检察长', en: "Procurator-General of the Supreme People's Procuratorate", category: '职位', side: 'cn', group: '中央国家机关职务', level: '国家级正职', status: '现行', source: LEG_SRC },

  // ── 地方行政区划通名（宪法英译本）──
  { zh: '省', en: 'Province', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC },
  { zh: '自治区', en: 'Autonomous Region', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC },
  { zh: '直辖市', en: 'Municipality directly under the Central Government', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC, note: '简称 Municipality' },
  { zh: '自治州', en: 'Autonomous Prefecture', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC },
  { zh: '地级市', en: 'Prefecture-level City', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC, note: '通称 City' },
  { zh: '县', en: 'County', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC },
  { zh: '自治县', en: 'Autonomous County', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC },
  { zh: '市辖区', en: 'District', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC },
  { zh: '乡', en: 'Township', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC },
  { zh: '民族乡', en: 'Ethnic Township', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC },
  { zh: '镇', en: 'Town', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC },
  { zh: '行政村', en: 'Village', category: '通名', side: 'cn', group: '地方行政区划', status: '现行', source: CONST_SRC },

  // ── 地方政府职务（宪法英译本）──
  { zh: '省长', en: 'Governor', category: '职位', side: 'cn', group: '地方政府职务', level: '省部级正职', status: '现行', source: CONST_SRC },
  { zh: '副省长', en: 'Deputy Governor', category: '职位', side: 'cn', group: '地方政府职务', level: '省部级副职', status: '现行', source: CONST_SRC },
  { zh: '自治区主席', en: 'Chairman of the Autonomous Region', category: '职位', side: 'cn', group: '地方政府职务', level: '省部级正职', status: '现行', source: CONST_SRC },
  { zh: '市长', en: 'Mayor', category: '职位', side: 'cn', group: '地方政府职务', status: '现行', source: CONST_SRC },
  { zh: '副市长', en: 'Deputy Mayor', category: '职位', side: 'cn', group: '地方政府职务', status: '现行', source: CONST_SRC },
  { zh: '自治州州长', en: 'Prefect', category: '职位', side: 'cn', group: '地方政府职务', status: '现行', source: CONST_SRC },
  { zh: '县长', en: 'County Head', category: '职位', side: 'cn', group: '地方政府职务', status: '现行', source: CONST_SRC, note: '宪法英译作 head of the county' },
  { zh: '区长（市辖区）', en: 'District Head', category: '职位', side: 'cn', group: '地方政府职务', status: '现行', source: CONST_SRC },
  { zh: '乡长', en: 'Township Head', category: '职位', side: 'cn', group: '地方政府职务', status: '现行', source: CONST_SRC },
  { zh: '镇长', en: 'Town Head', category: '职位', side: 'cn', group: '地方政府职务', status: '现行', source: CONST_SRC },
  { zh: '省委书记', en: 'Secretary of the Provincial Party Committee', category: '职位', side: 'cn', group: '地方政府职务', level: '省部级正职', status: '现行', source: DIR_SRC, note: '省级党委首长；亦作 Party Secretary / Party chief' },

  // ── 机构通名对照（官方机构译名归纳）──
  { zh: '部', en: 'Ministry', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC, note: '国务院组成部门，如外交部 = Ministry of Foreign Affairs' },
  { zh: '委员会', en: 'Commission', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC },
  { zh: '总局', en: 'General Administration / State Administration', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC, note: '如海关总署 = General Administration of Customs' },
  { zh: '局', en: 'Bureau / Administration', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC },
  { zh: '署', en: 'Administration', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC, note: '如审计署 = National Audit Office（特例）' },
  { zh: '办公厅', en: 'General Office', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC },
  { zh: '办公室', en: 'Office', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC },
  { zh: '司（部委内设）', en: 'Department', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC, note: '首长为司长 = Director-General' },
  { zh: '厅（省级职能部门）', en: 'Department', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC },
  { zh: '处', en: 'Division', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC },
  { zh: '科', en: 'Section', category: '通名', side: 'cn', group: '机构通名对照', status: '现行', source: NAMING_SRC },

  // ════ 外国机构（外→中，官方中文名/新华社标准）════

  // ── 联合国主要机关 ──
  { zh: '联合国', en: 'United Nations', abbr: 'UN', category: '机构', side: 'foreign', group: '联合国主要机关', status: '现行', source: UN_SRC },
  { zh: '联合国大会', en: 'General Assembly', category: '机构', side: 'foreign', group: '联合国主要机关', status: '现行', source: UN_SRC, note: '简称"联大"' },
  { zh: '联合国安全理事会', en: 'Security Council', category: '机构', side: 'foreign', group: '联合国主要机关', status: '现行', source: UN_SRC, note: '简称"安理会"' },
  { zh: '联合国经济及社会理事会', en: 'Economic and Social Council', abbr: 'ECOSOC', category: '机构', side: 'foreign', group: '联合国主要机关', status: '现行', source: UN_SRC, note: '简称"经社理事会"' },
  { zh: '联合国托管理事会', en: 'Trusteeship Council', category: '机构', side: 'foreign', group: '联合国主要机关', status: '现行', source: UN_SRC, note: '1994 年起暂停运作' },
  { zh: '国际法院', en: 'International Court of Justice', abbr: 'ICJ', category: '机构', side: 'foreign', group: '联合国主要机关', status: '现行', source: UN_SRC, note: '设在荷兰海牙' },
  { zh: '联合国秘书处', en: 'Secretariat', category: '机构', side: 'foreign', group: '联合国主要机关', status: '现行', source: UN_SRC },
  { zh: '联合国秘书长', en: 'Secretary-General of the United Nations', category: '职位', side: 'foreign', group: '联合国主要机关', status: '现行', source: UN_SRC },

  // ── 联合国专门机构与系统 ──
  { zh: '世界卫生组织', en: 'World Health Organization', abbr: 'WHO', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC, note: '简称"世卫组织"' },
  { zh: '联合国教育、科学及文化组织', en: 'UNESCO', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC, note: '简称"教科文组织"' },
  { zh: '联合国儿童基金会', en: "United Nations Children's Fund", abbr: 'UNICEF', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC, note: '简称"儿基会"' },
  { zh: '联合国难民事务高级专员办事处', en: 'UNHCR', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC, note: '简称"联合国难民署"' },
  { zh: '联合国粮食及农业组织', en: 'Food and Agriculture Organization', abbr: 'FAO', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC, note: '简称"粮农组织"' },
  { zh: '国际劳工组织', en: 'International Labour Organization', abbr: 'ILO', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '国际原子能机构', en: 'International Atomic Energy Agency', abbr: 'IAEA', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '世界知识产权组织', en: 'World Intellectual Property Organization', abbr: 'WIPO', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '国际民用航空组织', en: 'International Civil Aviation Organization', abbr: 'ICAO', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC, note: '简称"国际民航组织"' },
  { zh: '国际海事组织', en: 'International Maritime Organization', abbr: 'IMO', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '世界气象组织', en: 'World Meteorological Organization', abbr: 'WMO', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '联合国开发计划署', en: 'United Nations Development Programme', abbr: 'UNDP', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '联合国环境规划署', en: 'United Nations Environment Programme', abbr: 'UNEP', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '世界粮食计划署', en: 'World Food Programme', abbr: 'WFP', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '联合国工业发展组织', en: 'United Nations Industrial Development Organization', abbr: 'UNIDO', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC, note: '简称"工发组织"' },
  { zh: '国际农业发展基金', en: 'International Fund for Agricultural Development', abbr: 'IFAD', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '世界银行', en: 'World Bank', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '国际货币基金组织', en: 'International Monetary Fund', abbr: 'IMF', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC },
  { zh: '国际电信联盟', en: 'International Telecommunication Union', abbr: 'ITU', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC, note: '联合国最早的专门机构（1865年），总部日内瓦' },
  { zh: '万国邮政联盟', en: 'Universal Postal Union', abbr: 'UPU', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC, note: '简称"万国邮联"，总部伯尔尼' },
  { zh: '世界旅游组织', en: 'World Tourism Organization', abbr: 'UNWTO', category: '机构', side: 'foreign', group: '联合国专门机构与系统', status: '现行', source: UN_SRC, note: '联合国专门机构，总部马德里' },

  // ── 其他国际与区域组织 ──
  { zh: '世界贸易组织', en: 'World Trade Organization', abbr: 'WTO', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"世贸组织"' },
  { zh: '二十国集团', en: 'Group of Twenty', abbr: 'G20', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '轮值主席国制，无常设秘书处' },
  { zh: '七国集团', en: 'Group of Seven', abbr: 'G7', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '亚太经济合作组织', en: 'Asia-Pacific Economic Cooperation', abbr: 'APEC', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"亚太经合组织"' },
  { zh: '经济合作与发展组织', en: 'Organisation for Economic Co-operation and Development', abbr: 'OECD', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"经合组织"' },
  { zh: '石油输出国组织', en: 'Organization of the Petroleum Exporting Countries', abbr: 'OPEC', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '音译"欧佩克"' },
  { zh: '金砖国家', en: 'BRICS', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '2024年扩员：原五国+埃及/伊朗/阿联酋/埃塞俄比亚' },
  { zh: '上海合作组织', en: 'Shanghai Cooperation Organisation', abbr: 'SCO', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"上合组织"' },
  { zh: '东南亚国家联盟', en: 'ASEAN', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"东盟"' },
  { zh: '欧洲联盟', en: 'European Union', abbr: 'EU', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"欧盟"' },
  { zh: '非洲联盟', en: 'African Union', abbr: 'AU', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"非盟"，2002年取代非洲统一组织' },
  { zh: '北大西洋公约组织', en: 'NATO', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"北约"' },
  { zh: '红十字国际委员会', en: 'International Committee of the Red Cross', abbr: 'ICRC', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '欧洲委员会', en: 'Council of Europe', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '⚠️ 非欧盟机构！47成员国含非EU国家，总部斯特拉斯堡。勿与"欧盟理事会"混淆' },
  { zh: '欧洲人权法院', en: 'European Court of Human Rights', abbr: 'ECHR', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '欧洲委员会旗下，依据《欧洲人权公约》设立，总部斯特拉斯堡' },
  { zh: '欧洲安全与合作组织', en: 'Organization for Security and Co-operation in Europe', abbr: 'OSCE', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '57个成员国，全球最大区域安全组织，总部维也纳' },
  { zh: '集体安全条约组织', en: 'Collective Security Treaty Organization', abbr: 'CSTO', category: '机构', side: 'foreign', group: '其他国际与区域组织', status: '现行', source: INTL_SRC, note: '俄罗斯主导，原苏联国家为主，简称"集安组织"' },

  // ── 美国主要机构 ──
  { zh: '白宫', en: 'White House', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC, note: '美国总统官邸及办公地' },
  { zh: '美国总统', en: 'President of the United States', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国副总统', en: 'Vice President of the United States', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国国务院', en: 'Department of State', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC, note: '主管外交，首长为国务卿' },
  { zh: '国务卿', en: 'Secretary of State', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC, note: '美国国务院首长' },
  { zh: '美国国防部', en: 'Department of Defense', abbr: 'DOD', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC, note: '总部称"五角大楼"Pentagon' },
  { zh: '美国国防部长', en: 'Secretary of Defense', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国财政部', en: 'Department of the Treasury', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国财政部长', en: 'Secretary of the Treasury', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国司法部', en: 'Department of Justice', abbr: 'DOJ', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国司法部长', en: 'Attorney General', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC, note: '兼总检察长' },
  { zh: '美国国土安全部', en: 'Department of Homeland Security', abbr: 'DHS', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国商务部', en: 'Department of Commerce', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国国会', en: 'Congress', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC, note: '由参议院和众议院组成' },
  { zh: '参议院', en: 'Senate', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '众议院', en: 'House of Representatives', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '众议院议长', en: 'Speaker of the House', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国联邦最高法院', en: 'Supreme Court of the United States', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC, note: '首长为首席大法官 Chief Justice' },
  { zh: '联邦调查局', en: 'Federal Bureau of Investigation', abbr: 'FBI', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '中央情报局', en: 'Central Intelligence Agency', abbr: 'CIA', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国联邦储备委员会', en: 'Federal Reserve', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC, note: '简称"美联储"Fed，美国央行' },
  { zh: '美国贸易代表办公室', en: 'Office of the United States Trade Representative', abbr: 'USTR', category: '机构', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },

  // ── 英国主要机构 ──
  { zh: '英国首相', en: 'Prime Minister', category: '职位', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '唐宁街10号', en: '10 Downing Street', category: '机构', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC, note: '英国首相官邸' },
  { zh: '英国内阁', en: 'Cabinet', category: '机构', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '英国议会', en: 'Parliament', category: '机构', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '上议院', en: 'House of Lords', category: '机构', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '下议院', en: 'House of Commons', category: '机构', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '英国外交部', en: 'Foreign, Commonwealth and Development Office', abbr: 'FCDO', category: '机构', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC, note: '首长为外交大臣 Foreign Secretary；2020 由外交部与国际发展部合并' },
  { zh: '英国财政部', en: 'HM Treasury', category: '机构', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC, note: '首长为财政大臣 Chancellor of the Exchequer' },
  { zh: '英国内政部', en: 'Home Office', category: '机构', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC, note: '首长为内政大臣 Home Secretary' },
  { zh: '英国国防部', en: 'Ministry of Defence', category: '机构', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '英国最高法院', en: 'Supreme Court of the United Kingdom', category: '机构', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },

  // ── 欧盟机构 ──
  { zh: '欧洲理事会', en: 'European Council', category: '机构', side: 'foreign', group: '欧盟机构', status: '现行', source: INTL_SRC, note: '成员国首脑组成，最高决策机构' },
  { zh: '欧盟理事会', en: 'Council of the European Union', category: '机构', side: 'foreign', group: '欧盟机构', status: '现行', source: INTL_SRC, note: '部长理事会，立法与政策协调' },
  { zh: '欧盟委员会', en: 'European Commission', category: '机构', side: 'foreign', group: '欧盟机构', status: '现行', source: INTL_SRC, note: '常设执行机构，简称"欧委会"' },
  { zh: '欧洲议会', en: 'European Parliament', category: '机构', side: 'foreign', group: '欧盟机构', status: '现行', source: INTL_SRC, note: '议员由直选产生' },
  { zh: '欧盟法院', en: 'Court of Justice of the European Union', abbr: 'CJEU', category: '机构', side: 'foreign', group: '欧盟机构', status: '现行', source: INTL_SRC },
  { zh: '欧洲中央银行', en: 'European Central Bank', abbr: 'ECB', category: '机构', side: 'foreign', group: '欧盟机构', status: '现行', source: INTL_SRC, note: '简称"欧洲央行"' },

  // ── 法国主要机构 ──
  { zh: '法国总统', en: 'President of France', category: '职位', side: 'foreign', group: '法国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '法国总理', en: 'Prime Minister of France', category: '职位', side: 'foreign', group: '法国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '爱丽舍宫', en: 'Élysée Palace', category: '机构', side: 'foreign', group: '法国主要机构', status: '现行', source: FGOV_SRC, note: '法国总统府' },
  { zh: '法国国民议会', en: 'National Assembly', category: '机构', side: 'foreign', group: '法国主要机构', status: '现行', source: FGOV_SRC, note: '议会下院' },
  { zh: '法国参议院', en: 'Senate', category: '机构', side: 'foreign', group: '法国主要机构', status: '现行', source: FGOV_SRC, note: '议会上院' },
  { zh: '法国外交部', en: 'Ministry for Europe and Foreign Affairs', category: '机构', side: 'foreign', group: '法国主要机构', status: '现行', source: FGOV_SRC, note: '全称含欧洲事务' },
  { zh: '法国国防部', en: 'Ministry of the Armed Forces', category: '机构', side: 'foreign', group: '法国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '法国宪法委员会', en: 'Constitutional Council', category: '机构', side: 'foreign', group: '法国主要机构', status: '现行', source: FGOV_SRC, note: '法文 Conseil constitutionnel，审查法律违宪性' },
  { zh: '法国最高行政法院', en: "Council of State", category: '机构', side: 'foreign', group: '法国主要机构', status: '现行', source: FGOV_SRC, note: '法文 Conseil d\'État，最高行政法院兼政府法律顾问' },
  { zh: '法国最高司法法院', en: 'Court of Cassation', category: '机构', side: 'foreign', group: '法国主要机构', status: '现行', source: FGOV_SRC, note: '法文 Cour de cassation，又称"破毁院"，民刑事最高法院' },

  // ── 德国主要机构 ──
  { zh: '德国联邦总统', en: 'Federal President', category: '职位', side: 'foreign', group: '德国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '德国联邦总理', en: 'Federal Chancellor', category: '职位', side: 'foreign', group: '德国主要机构', status: '现行', source: FGOV_SRC, note: '政府首脑' },
  { zh: '德国联邦议院', en: 'Bundestag', category: '机构', side: 'foreign', group: '德国主要机构', status: '现行', source: FGOV_SRC, note: '联邦议会下院' },
  { zh: '德国联邦参议院', en: 'Bundesrat', category: '机构', side: 'foreign', group: '德国主要机构', status: '现行', source: FGOV_SRC, note: '联邦议会上院' },
  { zh: '德国联邦政府', en: 'Federal Government', category: '机构', side: 'foreign', group: '德国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '德国联邦外交部', en: 'Federal Foreign Office', category: '机构', side: 'foreign', group: '德国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '德国联邦国防部', en: 'Federal Ministry of Defence', category: '机构', side: 'foreign', group: '德国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '德国联邦宪法法院', en: 'Federal Constitutional Court', category: '机构', side: 'foreign', group: '德国主要机构', status: '现行', source: FGOV_SRC, note: '德文 Bundesverfassungsgericht，德国最高违宪审查机构，总部卡尔斯鲁厄' },
  { zh: '德国联邦最高法院', en: 'Federal Court of Justice', category: '机构', side: 'foreign', group: '德国主要机构', status: '现行', source: FGOV_SRC, note: '德文 Bundesgerichtshof，普通司法最高法院' },

  // ── 日本主要机构 ──
  { zh: '日本首相', en: 'Prime Minister', category: '职位', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC, note: '正式称"内阁总理大臣"' },
  { zh: '日本内阁', en: 'Cabinet', category: '机构', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC },
  { zh: '日本国会', en: 'National Diet', category: '机构', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC, note: '由众议院和参议院组成' },
  { zh: '日本众议院', en: 'House of Representatives', category: '机构', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC },
  { zh: '日本参议院', en: 'House of Councillors', category: '机构', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC, note: '英文为 House of Councillors，非 Senate' },
  { zh: '日本外务省', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC, note: '即外交部' },
  { zh: '日本防卫省', en: 'Ministry of Defense', category: '机构', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC },
  { zh: '日本内阁官房长官', en: 'Chief Cabinet Secretary of Japan', category: '职位', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC, note: '内阁发言人兼协调人，日本新闻发布会最高频官员' },
  { zh: '日本最高裁判所', en: 'Supreme Court of Japan', category: '机构', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC },
  { zh: '日本宫内厅', en: 'Imperial Household Agency', category: '机构', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC, note: '管理皇室事务的政府机构' },
  { zh: '日本财务省', en: 'Ministry of Finance', category: '机构', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC },
  { zh: '日本经济产业省', en: 'Ministry of Economy, Trade and Industry', abbr: 'METI', category: '机构', side: 'foreign', group: '日本主要机构', status: '现行', source: FGOV_SRC, note: '简称"经产省"' },

  // ── 俄罗斯主要机构 ──
  { zh: '俄罗斯总统', en: 'President of Russia', category: '职位', side: 'foreign', group: '俄罗斯主要机构', status: '现行', source: FGOV_SRC },
  { zh: '俄罗斯总理', en: 'Prime Minister of Russia', category: '职位', side: 'foreign', group: '俄罗斯主要机构', status: '现行', source: FGOV_SRC },
  { zh: '克里姆林宫', en: 'Kremlin', category: '机构', side: 'foreign', group: '俄罗斯主要机构', status: '现行', source: FGOV_SRC, note: '俄罗斯总统府代称' },
  { zh: '俄罗斯联邦政府', en: 'Government of the Russian Federation', category: '机构', side: 'foreign', group: '俄罗斯主要机构', status: '现行', source: FGOV_SRC },
  { zh: '俄罗斯国家杜马', en: 'State Duma', category: '机构', side: 'foreign', group: '俄罗斯主要机构', status: '现行', source: FGOV_SRC, note: '联邦议会下院' },
  { zh: '俄罗斯联邦委员会', en: 'Federation Council', category: '机构', side: 'foreign', group: '俄罗斯主要机构', status: '现行', source: FGOV_SRC, note: '联邦议会上院' },
  { zh: '俄罗斯外交部', en: 'Ministry of Foreign Affairs of Russia', category: '机构', side: 'foreign', group: '俄罗斯主要机构', status: '现行', source: FGOV_SRC },
  { zh: '俄罗斯国防部', en: 'Ministry of Defence of Russia', category: '机构', side: 'foreign', group: '俄罗斯主要机构', status: '现行', source: FGOV_SRC },
  { zh: '俄罗斯联邦安全会议', en: 'Security Council of Russia', category: '机构', side: 'foreign', group: '俄罗斯主要机构', status: '现行', source: FGOV_SRC, note: '主席为总统，协调国防与安全政策的关键机构' },

  // ── 中共中央领导职务（gov.cn / 新华社）──
  { zh: '中共中央总书记', en: 'General Secretary of the CPC Central Committee', category: '职位', side: 'cn', group: '中共中央领导职务', level: '党的最高领导职务', status: '现行', source: PARTY_SRC },
  { zh: '中央政治局常委', en: 'Member of the Standing Committee of the Political Bureau of the CPC Central Committee', category: '职位', side: 'cn', group: '中共中央领导职务', status: '现行', source: PARTY_SRC, note: '简称"政治局常委"' },
  { zh: '中央政治局委员', en: 'Member of the Political Bureau of the CPC Central Committee', category: '职位', side: 'cn', group: '中共中央领导职务', status: '现行', source: PARTY_SRC, note: '简称"政治局委员"' },
  { zh: '中央书记处书记', en: 'Member of the Secretariat of the CPC Central Committee', category: '职位', side: 'cn', group: '中共中央领导职务', status: '现行', source: PARTY_SRC },

  // ── 外交衔级（外交部礼宾知识 + 驻外外交人员法）──
  { zh: '特命全权大使', en: 'Ambassador Extraordinary and Plenipotentiary', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC, note: '简称"大使"' },
  { zh: '公使', en: 'Minister', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '公使衔参赞', en: 'Minister-Counselor', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '代办', en: "Chargé d'Affaires", category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '临时代办', en: "Chargé d'Affaires ad Interim", category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '参赞', en: 'Counselor', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '一等秘书', en: 'First Secretary', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '二等秘书', en: 'Second Secretary', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '三等秘书', en: 'Third Secretary', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '随员', en: 'Attaché', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '武官', en: 'Military Attaché', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '总领事', en: 'Consul General', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '副总领事', en: 'Deputy Consul General', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '领事', en: 'Consul', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },
  { zh: '副领事', en: 'Vice Consul', category: '职位', side: 'cn', group: '外交衔级', status: '现行', source: DIPL_SRC },

  // ── 国际组织主要职务 ──
  { zh: '联合国大会主席', en: 'President of the General Assembly', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC },
  { zh: '世界卫生组织总干事', en: 'Director-General of the WHO', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC },
  { zh: '世界贸易组织总干事', en: 'Director-General of the WTO', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC },
  { zh: '国际货币基金组织总裁', en: 'Managing Director of the IMF', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC },
  { zh: '世界银行行长', en: 'President of the World Bank', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC },
  { zh: '欧盟委员会主席', en: 'President of the European Commission', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC },
  { zh: '欧洲理事会主席', en: 'President of the European Council', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC },
  { zh: '北约秘书长', en: 'Secretary General of NATO', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC },
  // ── 国际组织负责人头衔（补充：库中已有组织的负责人，新闻高频）──
  { zh: '国际原子能机构总干事', en: 'Director General of the IAEA', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC, note: '核问题报道高频' },
  { zh: '联合国教育、科学及文化组织总干事', en: 'Director-General of UNESCO', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC, note: '教科文组织总干事' },
  { zh: '国际劳工组织总干事', en: 'Director-General of the ILO', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC },
  { zh: '联合国粮食及农业组织总干事', en: 'Director-General of the FAO', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC, note: '粮农组织总干事' },
  { zh: '世界知识产权组织总干事', en: 'Director General of WIPO', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC },
  { zh: '联合国难民事务高级专员', en: 'United Nations High Commissioner for Refugees', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC, note: '即联合国难民署负责人' },
  { zh: '联合国人权事务高级专员', en: 'United Nations High Commissioner for Human Rights', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC, note: '人权高专办负责人' },
  { zh: '联合国儿童基金会执行主任', en: 'Executive Director of UNICEF', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC },
  { zh: '世界粮食计划署执行主任', en: 'Executive Director of the WFP', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC },
  { zh: '联合国开发计划署署长', en: 'Administrator of the UNDP', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC, note: '开发计划署负责人头衔为 Administrator' },
  { zh: '国际法院院长', en: 'President of the International Court of Justice', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: UN_SRC },
  { zh: '经济合作与发展组织秘书长', en: 'Secretary-General of the OECD', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC },
  { zh: '石油输出国组织秘书长', en: 'Secretary General of OPEC', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC },
  { zh: '上海合作组织秘书长', en: 'Secretary-General of the SCO', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC },
  { zh: '东南亚国家联盟秘书长', en: 'Secretary-General of ASEAN', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC, note: '东盟秘书长' },
  { zh: '非洲联盟委员会主席', en: 'Chairperson of the African Union Commission', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC, note: '非盟行政负责人，区别于轮值的非盟主席' },
  { zh: '欧洲议会议长', en: 'President of the European Parliament', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC },
  { zh: '欧洲中央银行行长', en: 'President of the European Central Bank', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC },
  { zh: '欧盟外交与安全政策高级代表', en: 'High Representative of the Union for Foreign Affairs and Security Policy', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC, note: '简称"欧盟外交高级代表"' },

  // ── 美国主要职务（补充）──
  { zh: '美国首席大法官', en: 'Chief Justice of the United States', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC, note: '联邦最高法院首长' },
  { zh: '美国国家安全顾问', en: 'National Security Advisor', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '白宫办公厅主任', en: 'White House Chief of Staff', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '参议院多数党领袖', en: 'Senate Majority Leader', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美联储主席', en: 'Chair of the Federal Reserve', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国商务部长', en: 'Secretary of Commerce', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国国土安全部长', en: 'Secretary of Homeland Security', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '美国贸易代表', en: 'United States Trade Representative', abbr: 'USTR', category: '职位', side: 'foreign', group: '美国主要机构', status: '现行', source: FGOV_SRC },

  // ── 英国主要职务（补充）──
  { zh: '英国外交大臣', en: 'Foreign Secretary', category: '职位', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC, note: '英国外交部首长' },
  { zh: '英国财政大臣', en: 'Chancellor of the Exchequer', category: '职位', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '英国内政大臣', en: 'Home Secretary', category: '职位', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '英国国防大臣', en: 'Defence Secretary', category: '职位', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '下议院议长', en: 'Speaker of the House of Commons', category: '职位', side: 'foreign', group: '英国主要机构', status: '现行', source: FGOV_SRC },

  // ── 新加坡主要机构（官方中文名）──
  { zh: '新加坡总统', en: 'President of Singapore', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡总理', en: 'Prime Minister of Singapore', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡副总理', en: 'Deputy Prime Minister', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡总理公署', en: "Prime Minister's Office", abbr: 'PMO', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡国会', en: 'Parliament of Singapore', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡外交部', en: 'Ministry of Foreign Affairs', abbr: 'MFA', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡国防部', en: 'Ministry of Defence', abbr: 'MINDEF', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡贸工部', en: 'Ministry of Trade and Industry', abbr: 'MTI', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡财政部', en: 'Ministry of Finance', abbr: 'MOF', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡内政部', en: 'Ministry of Home Affairs', abbr: 'MHA', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡律政部', en: 'Ministry of Law', abbr: 'MINLAW', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡教育部', en: 'Ministry of Education', abbr: 'MOE', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡卫生部', en: 'Ministry of Health', abbr: 'MOH', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡人力部', en: 'Ministry of Manpower', abbr: 'MOM', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡国家发展部', en: 'Ministry of National Development', abbr: 'MND', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡交通部', en: 'Ministry of Transport', abbr: 'MOT', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡文化、社区及青年部', en: 'Ministry of Culture, Community and Youth', abbr: 'MCCY', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡社会及家庭发展部', en: 'Ministry of Social and Family Development', abbr: 'MSF', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡永续发展与环境部', en: 'Ministry of Sustainability and the Environment', abbr: 'MSE', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡数码发展及新闻部', en: 'Ministry of Digital Development and Information', abbr: 'MDDI', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC, note: '2024 由通讯及新闻部 MCI 改组' },
  { zh: '新加坡金融管理局', en: 'Monetary Authority of Singapore', abbr: 'MAS', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC, note: '新加坡央行兼金融监管机构' },
  { zh: '新加坡最高法院', en: 'Supreme Court of Singapore', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡总检察署', en: "Attorney-General's Chambers", abbr: 'AGC', category: '机构', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡国会议长', en: 'Speaker of Parliament', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡国务资政', en: 'Senior Minister', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC, note: '内阁资深职位' },
  { zh: '部长', en: 'Minister', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC, note: '新加坡内阁部长' },
  { zh: '高级政务部长', en: 'Senior Minister of State', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '政务部长', en: 'Minister of State', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '政务次长', en: 'Parliamentary Secretary', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },
  { zh: '新加坡大法官', en: 'Chief Justice', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC, note: '最高法院首长' },
  { zh: '新加坡总检察长', en: 'Attorney-General', category: '职位', side: 'foreign', group: '新加坡主要机构', status: '现行', source: SG_SRC },

  // ── 马来西亚主要机构 ──
  { zh: '马来西亚最高元首', en: 'Yang di-Pertuan Agong', category: '职位', side: 'foreign', group: '马来西亚主要机构', status: '现行', source: FGOV_SRC, note: '国家元首，由九州统治者轮任' },
  { zh: '马来西亚首相', en: 'Prime Minister of Malaysia', category: '职位', side: 'foreign', group: '马来西亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '马来西亚国会', en: 'Parliament of Malaysia', category: '机构', side: 'foreign', group: '马来西亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '马来西亚外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '马来西亚主要机构', status: '现行', source: FGOV_SRC },

  // ── 印度尼西亚主要机构 ──
  { zh: '印度尼西亚总统', en: 'President of Indonesia', category: '职位', side: 'foreign', group: '印度尼西亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '印度尼西亚副总统', en: 'Vice President of Indonesia', category: '职位', side: 'foreign', group: '印度尼西亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '人民协商会议', en: "People's Consultative Assembly", abbr: 'MPR', category: '机构', side: 'foreign', group: '印度尼西亚主要机构', status: '现行', source: FGOV_SRC, note: '印尼最高国家机构' },
  { zh: '人民代表会议', en: "People's Representative Council", abbr: 'DPR', category: '机构', side: 'foreign', group: '印度尼西亚主要机构', status: '现行', source: FGOV_SRC, note: '印尼国会下院' },
  { zh: '印度尼西亚外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '印度尼西亚主要机构', status: '现行', source: FGOV_SRC },

  // ── 泰国主要机构 ──
  { zh: '泰国国王', en: 'King of Thailand', category: '职位', side: 'foreign', group: '泰国主要机构', status: '现行', source: FGOV_SRC, note: '国家元首' },
  { zh: '泰国总理', en: 'Prime Minister of Thailand', category: '职位', side: 'foreign', group: '泰国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '泰国国会', en: 'National Assembly', category: '机构', side: 'foreign', group: '泰国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '泰国外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '泰国主要机构', status: '现行', source: FGOV_SRC },

  // ── 越南主要机构 ──
  { zh: '越南共产党中央委员会总书记', en: 'General Secretary of the Communist Party of Vietnam', category: '职位', side: 'foreign', group: '越南主要机构', status: '现行', source: FGOV_SRC, note: '越南最高领导职务' },
  { zh: '越南国家主席', en: 'President of Vietnam', category: '职位', side: 'foreign', group: '越南主要机构', status: '现行', source: FGOV_SRC },
  { zh: '越南政府总理', en: 'Prime Minister of Vietnam', category: '职位', side: 'foreign', group: '越南主要机构', status: '现行', source: FGOV_SRC },
  { zh: '越南国会', en: 'National Assembly of Vietnam', category: '机构', side: 'foreign', group: '越南主要机构', status: '现行', source: FGOV_SRC },
  { zh: '越南外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '越南主要机构', status: '现行', source: FGOV_SRC },

  // ── 菲律宾主要机构 ──
  { zh: '菲律宾总统', en: 'President of the Philippines', category: '职位', side: 'foreign', group: '菲律宾主要机构', status: '现行', source: FGOV_SRC },
  { zh: '菲律宾副总统', en: 'Vice President of the Philippines', category: '职位', side: 'foreign', group: '菲律宾主要机构', status: '现行', source: FGOV_SRC },
  { zh: '菲律宾参议院', en: 'Senate of the Philippines', category: '机构', side: 'foreign', group: '菲律宾主要机构', status: '现行', source: FGOV_SRC },
  { zh: '菲律宾众议院', en: 'House of Representatives', category: '机构', side: 'foreign', group: '菲律宾主要机构', status: '现行', source: FGOV_SRC },
  { zh: '菲律宾外交部', en: 'Department of Foreign Affairs', category: '机构', side: 'foreign', group: '菲律宾主要机构', status: '现行', source: FGOV_SRC },

  // ── 东盟其他国家（缅甸·柬埔寨·老挝·文莱）──
  { zh: '缅甸总统', en: 'President of Myanmar', category: '职位', side: 'foreign', group: '东盟其他国家', status: '现行', source: FGOV_SRC },
  { zh: '缅甸联邦议会', en: 'Assembly of the Union', category: '机构', side: 'foreign', group: '东盟其他国家', status: '现行', source: FGOV_SRC, note: '缅文 Pyidaungsu Hluttaw' },
  { zh: '柬埔寨国王', en: 'King of Cambodia', category: '职位', side: 'foreign', group: '东盟其他国家', status: '现行', source: FGOV_SRC, note: '国家元首' },
  { zh: '柬埔寨首相', en: 'Prime Minister of Cambodia', category: '职位', side: 'foreign', group: '东盟其他国家', status: '现行', source: FGOV_SRC },
  { zh: '柬埔寨国会', en: 'National Assembly of Cambodia', category: '机构', side: 'foreign', group: '东盟其他国家', status: '现行', source: FGOV_SRC },
  { zh: '老挝人民革命党中央委员会总书记', en: "General Secretary of the Lao People's Revolutionary Party", category: '职位', side: 'foreign', group: '东盟其他国家', status: '现行', source: FGOV_SRC, note: '老挝最高领导职务' },
  { zh: '老挝国家主席', en: 'President of Laos', category: '职位', side: 'foreign', group: '东盟其他国家', status: '现行', source: FGOV_SRC },
  { zh: '老挝政府总理', en: 'Prime Minister of Laos', category: '职位', side: 'foreign', group: '东盟其他国家', status: '现行', source: FGOV_SRC },
  { zh: '文莱苏丹', en: 'Sultan of Brunei', category: '职位', side: 'foreign', group: '东盟其他国家', status: '现行', source: FGOV_SRC, note: '国家元首兼政府首脑' },
  { zh: '文莱外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '东盟其他国家', status: '现行', source: FGOV_SRC },

  // ── 东盟主要国核心部委（补充）──
  // 马来西亚
  { zh: '马来西亚国防部', en: 'Ministry of Defence', category: '机构', side: 'foreign', group: '马来西亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '马来西亚财政部', en: 'Ministry of Finance', category: '机构', side: 'foreign', group: '马来西亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '马来西亚内政部', en: 'Ministry of Home Affairs', category: '机构', side: 'foreign', group: '马来西亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '马来西亚投资、贸易及工业部', en: 'Ministry of Investment, Trade and Industry', abbr: 'MITI', category: '机构', side: 'foreign', group: '马来西亚主要机构', status: '现行', source: FGOV_SRC, note: '2023 由国际贸易及工业部改组' },
  // 印度尼西亚
  { zh: '印度尼西亚国防部', en: 'Ministry of Defence', category: '机构', side: 'foreign', group: '印度尼西亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '印度尼西亚财政部', en: 'Ministry of Finance', category: '机构', side: 'foreign', group: '印度尼西亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '印度尼西亚内政部', en: 'Ministry of Home Affairs', category: '机构', side: 'foreign', group: '印度尼西亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '印度尼西亚贸易部', en: 'Ministry of Trade', category: '机构', side: 'foreign', group: '印度尼西亚主要机构', status: '现行', source: FGOV_SRC },
  // 泰国
  { zh: '泰国国防部', en: 'Ministry of Defence', category: '机构', side: 'foreign', group: '泰国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '泰国财政部', en: 'Ministry of Finance', category: '机构', side: 'foreign', group: '泰国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '泰国内政部', en: 'Ministry of Interior', category: '机构', side: 'foreign', group: '泰国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '泰国商业部', en: 'Ministry of Commerce', category: '机构', side: 'foreign', group: '泰国主要机构', status: '现行', source: FGOV_SRC },
  // 越南
  { zh: '越南国防部', en: 'Ministry of National Defence', category: '机构', side: 'foreign', group: '越南主要机构', status: '现行', source: FGOV_SRC },
  { zh: '越南公安部', en: 'Ministry of Public Security', category: '机构', side: 'foreign', group: '越南主要机构', status: '现行', source: FGOV_SRC },
  { zh: '越南财政部', en: 'Ministry of Finance', category: '机构', side: 'foreign', group: '越南主要机构', status: '现行', source: FGOV_SRC },
  { zh: '越南工贸部', en: 'Ministry of Industry and Trade', category: '机构', side: 'foreign', group: '越南主要机构', status: '现行', source: FGOV_SRC },
  // 菲律宾（用 Department 体系）
  { zh: '菲律宾国防部', en: 'Department of National Defense', abbr: 'DND', category: '机构', side: 'foreign', group: '菲律宾主要机构', status: '现行', source: FGOV_SRC },
  { zh: '菲律宾财政部', en: 'Department of Finance', abbr: 'DOF', category: '机构', side: 'foreign', group: '菲律宾主要机构', status: '现行', source: FGOV_SRC },
  { zh: '菲律宾内政及地方政府部', en: 'Department of the Interior and Local Government', abbr: 'DILG', category: '机构', side: 'foreign', group: '菲律宾主要机构', status: '现行', source: FGOV_SRC },
  { zh: '菲律宾贸工部', en: 'Department of Trade and Industry', abbr: 'DTI', category: '机构', side: 'foreign', group: '菲律宾主要机构', status: '现行', source: FGOV_SRC },

  // ── 印度主要机构 ──
  { zh: '印度总统', en: 'President of India', category: '职位', side: 'foreign', group: '印度主要机构', status: '现行', source: FGOV_SRC },
  { zh: '印度总理', en: 'Prime Minister of India', category: '职位', side: 'foreign', group: '印度主要机构', status: '现行', source: FGOV_SRC },
  { zh: '印度议会', en: 'Parliament of India', category: '机构', side: 'foreign', group: '印度主要机构', status: '现行', source: FGOV_SRC },
  { zh: '人民院', en: 'Lok Sabha', category: '机构', side: 'foreign', group: '印度主要机构', status: '现行', source: FGOV_SRC, note: '印度议会下院' },
  { zh: '联邦院', en: 'Rajya Sabha', category: '机构', side: 'foreign', group: '印度主要机构', status: '现行', source: FGOV_SRC, note: '印度议会上院' },
  { zh: '印度外交部', en: 'Ministry of External Affairs', abbr: 'MEA', category: '机构', side: 'foreign', group: '印度主要机构', status: '现行', source: FGOV_SRC, note: '印度外交主管，英文用 External Affairs' },
  { zh: '印度国防部', en: 'Ministry of Defence', category: '机构', side: 'foreign', group: '印度主要机构', status: '现行', source: FGOV_SRC },
  { zh: '印度内政部', en: 'Ministry of Home Affairs', category: '机构', side: 'foreign', group: '印度主要机构', status: '现行', source: FGOV_SRC },

  // ── 韩国主要机构 ──
  { zh: '韩国总统', en: 'President of the Republic of Korea', category: '职位', side: 'foreign', group: '韩国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '韩国国务总理', en: 'Prime Minister', category: '职位', side: 'foreign', group: '韩国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '韩国国会', en: 'National Assembly', category: '机构', side: 'foreign', group: '韩国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '韩国外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '韩国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '韩国国防部', en: 'Ministry of National Defense', category: '机构', side: 'foreign', group: '韩国主要机构', status: '现行', source: FGOV_SRC },
  { zh: '韩国宪法法院', en: 'Constitutional Court of Korea', category: '机构', side: 'foreign', group: '韩国主要机构', status: '现行', source: FGOV_SRC, note: '违宪审查与总统弹劾裁定机构' },
  { zh: '韩国大法院', en: 'Supreme Court of Korea', category: '机构', side: 'foreign', group: '韩国主要机构', status: '现行', source: FGOV_SRC, note: '韩国最高普通法院' },
  { zh: '韩国龙山总统府', en: 'Yongsan Presidential Office', category: '机构', side: 'foreign', group: '韩国主要机构', status: '现行', source: FGOV_SRC, note: '2022年迁入，原总统府为青瓦台（Cheong Wa Dae）' },

  // ── 朝鲜主要机构 ──
  { zh: '朝鲜劳动党总书记', en: "General Secretary of the Workers' Party of Korea", category: '职位', side: 'foreign', group: '朝鲜主要机构', status: '现行', source: FGOV_SRC, note: '朝鲜最高领导职务' },
  { zh: '朝鲜国务委员长', en: 'Chairman of the State Affairs Commission', category: '职位', side: 'foreign', group: '朝鲜主要机构', status: '现行', source: FGOV_SRC },
  { zh: '最高人民会议', en: "Supreme People's Assembly", category: '机构', side: 'foreign', group: '朝鲜主要机构', status: '现行', source: FGOV_SRC, note: '朝鲜最高国家权力机关' },
  { zh: '朝鲜外务省', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '朝鲜主要机构', status: '现行', source: FGOV_SRC },

  // ── 以色列主要机构 ──
  { zh: '以色列总统', en: 'President of Israel', category: '职位', side: 'foreign', group: '以色列主要机构', status: '现行', source: FGOV_SRC, note: '礼仪性国家元首' },
  { zh: '以色列总理', en: 'Prime Minister of Israel', category: '职位', side: 'foreign', group: '以色列主要机构', status: '现行', source: FGOV_SRC },
  { zh: '以色列议会', en: 'Knesset', category: '机构', side: 'foreign', group: '以色列主要机构', status: '现行', source: FGOV_SRC, note: '一院制议会' },
  { zh: '以色列外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '以色列主要机构', status: '现行', source: FGOV_SRC },
  { zh: '以色列国防部', en: 'Ministry of Defense', category: '机构', side: 'foreign', group: '以色列主要机构', status: '现行', source: FGOV_SRC },
  { zh: '以色列国防军', en: 'Israel Defense Forces', abbr: 'IDF', category: '机构', side: 'foreign', group: '以色列主要机构', status: '现行', source: FGOV_SRC },

  // ── 伊朗主要机构 ──
  { zh: '伊朗最高领袖', en: 'Supreme Leader of Iran', category: '职位', side: 'foreign', group: '伊朗主要机构', status: '现行', source: FGOV_SRC, note: '伊朗最高权力' },
  { zh: '伊朗总统', en: 'President of Iran', category: '职位', side: 'foreign', group: '伊朗主要机构', status: '现行', source: FGOV_SRC },
  { zh: '伊朗伊斯兰议会', en: 'Islamic Consultative Assembly', category: '机构', side: 'foreign', group: '伊朗主要机构', status: '现行', source: FGOV_SRC, note: '又称 Majlis' },
  { zh: '伊朗外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '伊朗主要机构', status: '现行', source: FGOV_SRC },
  { zh: '伊斯兰革命卫队', en: 'Islamic Revolutionary Guard Corps', abbr: 'IRGC', category: '机构', side: 'foreign', group: '伊朗主要机构', status: '现行', source: FGOV_SRC },

  // ── 乌克兰主要机构 ──
  { zh: '乌克兰总统', en: 'President of Ukraine', category: '职位', side: 'foreign', group: '乌克兰主要机构', status: '现行', source: FGOV_SRC },
  { zh: '乌克兰总理', en: 'Prime Minister of Ukraine', category: '职位', side: 'foreign', group: '乌克兰主要机构', status: '现行', source: FGOV_SRC },
  { zh: '乌克兰最高拉达', en: 'Verkhovna Rada', category: '机构', side: 'foreign', group: '乌克兰主要机构', status: '现行', source: FGOV_SRC, note: '乌克兰议会（一院制）' },
  { zh: '乌克兰外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '乌克兰主要机构', status: '现行', source: FGOV_SRC },
  { zh: '乌克兰国防部', en: 'Ministry of Defence', category: '机构', side: 'foreign', group: '乌克兰主要机构', status: '现行', source: FGOV_SRC },

  // ── 澳大利亚主要机构 ──
  { zh: '澳大利亚总督', en: 'Governor-General of Australia', category: '职位', side: 'foreign', group: '澳大利亚主要机构', status: '现行', source: FGOV_SRC, note: '英联邦礼仪性国家元首代表' },
  { zh: '澳大利亚总理', en: 'Prime Minister of Australia', category: '职位', side: 'foreign', group: '澳大利亚主要机构', status: '现行', source: FGOV_SRC, note: '实际政府首脑' },
  { zh: '澳大利亚联邦议会', en: 'Parliament of Australia', category: '机构', side: 'foreign', group: '澳大利亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '澳大利亚参议院', en: 'Senate of Australia', category: '机构', side: 'foreign', group: '澳大利亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '澳大利亚众议院', en: 'House of Representatives', category: '机构', side: 'foreign', group: '澳大利亚主要机构', status: '现行', source: FGOV_SRC },
  { zh: '澳大利亚外交贸易部', en: 'Department of Foreign Affairs and Trade', abbr: 'DFAT', category: '机构', side: 'foreign', group: '澳大利亚主要机构', status: '现行', source: FGOV_SRC },

  // ── 加拿大主要机构 ──
  { zh: '加拿大总督', en: 'Governor General of Canada', category: '职位', side: 'foreign', group: '加拿大主要机构', status: '现行', source: FGOV_SRC, note: '英联邦礼仪性国家元首代表' },
  { zh: '加拿大总理', en: 'Prime Minister of Canada', category: '职位', side: 'foreign', group: '加拿大主要机构', status: '现行', source: FGOV_SRC },
  { zh: '加拿大国会', en: 'Parliament of Canada', category: '机构', side: 'foreign', group: '加拿大主要机构', status: '现行', source: FGOV_SRC },
  { zh: '加拿大参议院', en: 'Senate of Canada', category: '机构', side: 'foreign', group: '加拿大主要机构', status: '现行', source: FGOV_SRC },
  { zh: '加拿大众议院', en: 'House of Commons of Canada', category: '机构', side: 'foreign', group: '加拿大主要机构', status: '现行', source: FGOV_SRC },
  { zh: '加拿大全球事务部', en: 'Global Affairs Canada', category: '机构', side: 'foreign', group: '加拿大主要机构', status: '现行', source: FGOV_SRC, note: '即加拿大外交部' },

  // ── 意大利主要机构 ──
  { zh: '意大利总统', en: 'President of Italy', category: '职位', side: 'foreign', group: '意大利主要机构', status: '现行', source: FGOV_SRC, note: '礼仪性国家元首' },
  { zh: '意大利总理', en: 'President of the Council of Ministers', category: '职位', side: 'foreign', group: '意大利主要机构', status: '现行', source: FGOV_SRC, note: '全称 Presidente del Consiglio，通称 Prime Minister' },
  { zh: '意大利议会', en: 'Parliament of Italy', category: '机构', side: 'foreign', group: '意大利主要机构', status: '现行', source: FGOV_SRC },
  { zh: '意大利参议院', en: 'Senate of the Republic', category: '机构', side: 'foreign', group: '意大利主要机构', status: '现行', source: FGOV_SRC },
  { zh: '意大利众议院', en: 'Chamber of Deputies', category: '机构', side: 'foreign', group: '意大利主要机构', status: '现行', source: FGOV_SRC },
  { zh: '意大利外交部', en: 'Ministry of Foreign Affairs and International Cooperation', category: '机构', side: 'foreign', group: '意大利主要机构', status: '现行', source: FGOV_SRC },

  // ── 巴西主要机构 ──
  { zh: '巴西总统', en: 'President of Brazil', category: '职位', side: 'foreign', group: '巴西主要机构', status: '现行', source: FGOV_SRC, note: '国家元首兼政府首脑' },
  { zh: '巴西全国大会', en: 'National Congress of Brazil', category: '机构', side: 'foreign', group: '巴西主要机构', status: '现行', source: FGOV_SRC },
  { zh: '巴西联邦参议院', en: 'Federal Senate of Brazil', category: '机构', side: 'foreign', group: '巴西主要机构', status: '现行', source: FGOV_SRC },
  { zh: '巴西众议院', en: 'Chamber of Deputies of Brazil', category: '机构', side: 'foreign', group: '巴西主要机构', status: '现行', source: FGOV_SRC },
  { zh: '巴西外交部', en: 'Ministry of Foreign Affairs', category: '机构', side: 'foreign', group: '巴西主要机构', status: '现行', source: FGOV_SRC, note: '又称 Itamaraty（伊塔马拉蒂宫）' },

  // ── 墨西哥主要机构 ──
  { zh: '墨西哥总统', en: 'President of Mexico', category: '职位', side: 'foreign', group: '墨西哥主要机构', status: '现行', source: FGOV_SRC, note: '国家元首兼政府首脑' },
  { zh: '墨西哥国会', en: 'Congress of the Union', category: '机构', side: 'foreign', group: '墨西哥主要机构', status: '现行', source: FGOV_SRC },
  { zh: '墨西哥参议院', en: 'Senate of Mexico', category: '机构', side: 'foreign', group: '墨西哥主要机构', status: '现行', source: FGOV_SRC },
  { zh: '墨西哥众议院', en: 'Chamber of Deputies of Mexico', category: '机构', side: 'foreign', group: '墨西哥主要机构', status: '现行', source: FGOV_SRC },
  { zh: '墨西哥外交部', en: 'Secretariat of Foreign Affairs', category: '机构', side: 'foreign', group: '墨西哥主要机构', status: '现行', source: FGOV_SRC },

  // ── 阿根廷主要机构 ──
  { zh: '阿根廷总统', en: 'President of Argentina', category: '职位', side: 'foreign', group: '阿根廷主要机构', status: '现行', source: FGOV_SRC, note: '国家元首兼政府首脑' },
  { zh: '阿根廷国会', en: 'Argentine National Congress', category: '机构', side: 'foreign', group: '阿根廷主要机构', status: '现行', source: FGOV_SRC },
  { zh: '阿根廷参议院', en: 'Argentine Senate', category: '机构', side: 'foreign', group: '阿根廷主要机构', status: '现行', source: FGOV_SRC },
  { zh: '阿根廷众议院', en: 'Argentine Chamber of Deputies', category: '机构', side: 'foreign', group: '阿根廷主要机构', status: '现行', source: FGOV_SRC },
  { zh: '阿根廷外交部', en: 'Ministry of Foreign Affairs and Worship', category: '机构', side: 'foreign', group: '阿根廷主要机构', status: '现行', source: FGOV_SRC },

  // ── 沙特阿拉伯主要机构 ──
  { zh: '沙特国王', en: 'King of Saudi Arabia', category: '职位', side: 'foreign', group: '沙特阿拉伯主要机构', status: '现行', source: FGOV_SRC, note: '国家元首、政府首脑兼首相' },
  { zh: '沙特王储兼首相', en: 'Crown Prince and Prime Minister of Saudi Arabia', category: '职位', side: 'foreign', group: '沙特阿拉伯主要机构', status: '现行', source: FGOV_SRC, note: '2022年起王储兼任首相' },
  { zh: '沙特协商会议', en: 'Consultative Assembly of Saudi Arabia', category: '机构', side: 'foreign', group: '沙特阿拉伯主要机构', status: '现行', source: FGOV_SRC, note: '又称舒拉委员会（Shura Council），任命制' },
  { zh: '沙特内阁', en: 'Council of Ministers of Saudi Arabia', category: '机构', side: 'foreign', group: '沙特阿拉伯主要机构', status: '现行', source: FGOV_SRC },
  { zh: '沙特外交部', en: 'Ministry of Foreign Affairs of Saudi Arabia', category: '机构', side: 'foreign', group: '沙特阿拉伯主要机构', status: '现行', source: FGOV_SRC },

  // ── 土耳其主要机构 ──
  { zh: '土耳其总统', en: 'President of Turkey', category: '职位', side: 'foreign', group: '土耳其主要机构', status: '现行', source: FGOV_SRC, note: '2018年起集国家元首与政府首脑权于一身' },
  { zh: '土耳其大国民议会', en: 'Grand National Assembly of Turkey', category: '机构', side: 'foreign', group: '土耳其主要机构', status: '现行', source: FGOV_SRC, note: '一院制议会，土文 Türkiye Büyük Millet Meclisi' },
  { zh: '土耳其外交部', en: 'Ministry of Foreign Affairs of Turkey', category: '机构', side: 'foreign', group: '土耳其主要机构', status: '现行', source: FGOV_SRC },
  { zh: '土耳其国防部', en: 'Ministry of National Defence of Turkey', category: '机构', side: 'foreign', group: '土耳其主要机构', status: '现行', source: FGOV_SRC },

  // ── 南非主要机构 ──
  { zh: '南非总统', en: 'President of South Africa', category: '职位', side: 'foreign', group: '南非主要机构', status: '现行', source: FGOV_SRC, note: '国家元首兼政府首脑' },
  { zh: '南非国民议会', en: 'National Assembly of South Africa', category: '机构', side: 'foreign', group: '南非主要机构', status: '现行', source: FGOV_SRC },
  { zh: '南非全国省级委员会', en: 'National Council of Provinces', abbr: 'NCOP', category: '机构', side: 'foreign', group: '南非主要机构', status: '现行', source: FGOV_SRC },
  { zh: '南非国际关系与合作部', en: 'Department of International Relations and Cooperation', abbr: 'DIRCO', category: '机构', side: 'foreign', group: '南非主要机构', status: '现行', source: FGOV_SRC, note: '即南非外交部' },

  // ── 中国人民解放军 ──
  { zh: '中央军事委员会', en: 'Central Military Commission', abbr: 'CMC', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC, note: '简称"中央军委"，党政军最高军事领导机关' },
  { zh: '中央军委主席', en: 'Chairman of the Central Military Commission', category: '职位', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中央军委副主席', en: 'Vice-Chairman of the Central Military Commission', category: '职位', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中央军委联合参谋部', en: 'Joint Staff Department of the CMC', abbr: 'JSD', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中央军委政治工作部', en: 'CMC Political Work Department', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中央军委后勤保障部', en: 'CMC Joint Logistic Support Department', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中央军委装备发展部', en: 'CMC Equipment Development Department', abbr: 'EDD', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中央军委训练管理部', en: 'CMC Training and Administration Department', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中央军委国防动员部', en: 'CMC National Defence Mobilisation Department', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '东部战区', en: 'Eastern Theater Command', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '南部战区', en: 'Southern Theater Command', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '西部战区', en: 'Western Theater Command', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '北部战区', en: 'Northern Theater Command', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中部战区', en: 'Central Theater Command', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中国人民解放军陆军', en: 'PLA Ground Force', abbr: 'PLAGF', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中国人民解放军海军', en: 'PLA Navy', abbr: 'PLAN', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中国人民解放军空军', en: 'PLA Air Force', abbr: 'PLAAF', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中国人民解放军火箭军', en: 'PLA Rocket Force', abbr: 'PLARF', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中国人民解放军信息支援部队', en: 'PLA Information Support Force', abbr: 'PLAISF', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC, note: '2024年新设，原战略支援部队改组' },
  { zh: '中国人民解放军联合勤务保障部队', en: 'PLA Joint Logistic Support Force', abbr: 'PLAJLSF', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC },
  { zh: '中国人民武装警察部队', en: "China's People's Armed Police Force", abbr: 'PAP', category: '机构', side: 'cn', group: '中国人民解放军', status: '现行', source: GOV_SRC, note: '简称"武警"' },
  { zh: '上将', en: 'General (Army/Air Force) / Admiral (Navy)', category: '职位', side: 'cn', group: '中国人民解放军', level: '军级最高军衔', status: '现行', source: GOV_SRC },
  { zh: '中将', en: 'Lieutenant General / Vice Admiral', category: '职位', side: 'cn', group: '中国人民解放军', level: '副大军区级', status: '现行', source: GOV_SRC },
  { zh: '少将', en: 'Major General / Rear Admiral', category: '职位', side: 'cn', group: '中国人民解放军', level: '正军级', status: '现行', source: GOV_SRC },
  { zh: '大校', en: 'Senior Colonel', category: '职位', side: 'cn', group: '中国人民解放军', level: '副军级', status: '现行', source: GOV_SRC },
  { zh: '上校', en: 'Colonel', category: '职位', side: 'cn', group: '中国人民解放军', level: '正师级', status: '现行', source: GOV_SRC },
  { zh: '中校', en: 'Lieutenant Colonel', category: '职位', side: 'cn', group: '中国人民解放军', level: '副师级/正团级', status: '现行', source: GOV_SRC },
  { zh: '少校', en: 'Major', category: '职位', side: 'cn', group: '中国人民解放军', level: '副团级', status: '现行', source: GOV_SRC },
  { zh: '上尉', en: 'Captain (Army/Air Force) / Lieutenant (Navy)', category: '职位', side: 'cn', group: '中国人民解放军', level: '正营级', status: '现行', source: GOV_SRC },
  { zh: '中尉', en: 'First Lieutenant / Lieutenant Junior Grade', category: '职位', side: 'cn', group: '中国人民解放军', level: '副营级', status: '现行', source: GOV_SRC },
  { zh: '少尉', en: 'Second Lieutenant / Ensign', category: '职位', side: 'cn', group: '中国人民解放军', level: '正连级', status: '现行', source: GOV_SRC },

  // ── 更多国际与区域组织 ──
  { zh: '阿拉伯国家联盟', en: 'League of Arab States', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"阿盟"，又称 Arab League' },
  { zh: '阿拉伯国家联盟秘书长', en: 'Secretary-General of the Arab League', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '伊斯兰合作组织', en: 'Organisation of Islamic Cooperation', abbr: 'OIC', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"伊合组织"，57个成员国' },
  { zh: '亚洲开发银行', en: 'Asian Development Bank', abbr: 'ADB', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"亚开行"，总部马尼拉' },
  { zh: '亚洲开发银行行长', en: 'President of the Asian Development Bank', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '国际奥林匹克委员会', en: 'International Olympic Committee', abbr: 'IOC', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"国际奥委会"' },
  { zh: '国际奥委会主席', en: 'President of the International Olympic Committee', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '国际足球联合会', en: 'Fédération Internationale de Football Association', abbr: 'FIFA', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"国际足联"' },
  { zh: '国际足联主席', en: 'President of FIFA', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '国际刑警组织', en: 'International Criminal Police Organization', abbr: 'INTERPOL', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"国际刑警"，总部里昂' },
  { zh: '国际刑警组织秘书长', en: 'Secretary General of INTERPOL', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '国际货币基金组织总裁', en: 'Managing Director of the International Monetary Fund', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC, note: '注意：IMF首席执行官头衔是 Managing Director，非 President' },
  { zh: '世界银行行长', en: 'President of the World Bank', category: '职位', side: 'foreign', group: '国际组织主要职务', status: '现行', source: INTL_SRC },

  // ── 区域组织补充 ──
  { zh: '海湾合作委员会', en: 'Gulf Cooperation Council', abbr: 'GCC', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"海合会"，成员：沙特/阿联酋/卡塔尔/科威特/巴林/阿曼' },
  { zh: '海湾合作委员会秘书长', en: 'Secretary-General of the Gulf Cooperation Council', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '独联体', en: 'Commonwealth of Independent States', abbr: 'CIS', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"独联体"，原苏联加盟共和国组成' },
  { zh: '独联体执行秘书', en: 'Executive Secretary of the CIS', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '英联邦', en: 'Commonwealth of Nations', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '56个成员国，英国国王为元首' },
  { zh: '英联邦秘书长', en: 'Secretary-General of the Commonwealth', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '美洲国家组织', en: 'Organization of American States', abbr: 'OAS', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"美洲国家组织"，35个成员国' },
  { zh: '美洲国家组织秘书长', en: 'Secretary-General of the OAS', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '亚洲基础设施投资银行', en: 'Asian Infrastructure Investment Bank', abbr: 'AIIB', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '简称"亚投行"，中国主导，总部北京' },
  { zh: '亚投行行长', en: 'President of the Asian Infrastructure Investment Bank', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '国际刑事法院', en: 'International Criminal Court', abbr: 'ICC', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '非联合国机构，独立条约组织，总部海牙' },
  { zh: '国际刑事法院院长', en: 'President of the International Criminal Court', category: '职位', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC },
  { zh: '世界海关组织', en: 'World Customs Organization', abbr: 'WCO', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '总部布鲁塞尔，制定海关标准' },
  { zh: '国际标准化组织', en: 'International Organization for Standardization', abbr: 'ISO', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '非政府组织，制定ISO国际标准，总部日内瓦' },
  { zh: '国际能源署', en: 'International Energy Agency', abbr: 'IEA', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '经合组织框架内，总部巴黎' },
  { zh: '国际清算银行', en: 'Bank for International Settlements', abbr: 'BIS', category: '机构', side: 'foreign', group: '更多国际与区域组织', status: '现行', source: INTL_SRC, note: '各国央行的银行，总部巴塞尔' },

  // ── 各国情报与安全机构 ──
  { zh: '美国中央情报局', en: 'Central Intelligence Agency', abbr: 'CIA', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC },
  { zh: '美国联邦调查局', en: 'Federal Bureau of Investigation', abbr: 'FBI', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC },
  { zh: '美国国家安全局', en: 'National Security Agency', abbr: 'NSA', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC },
  { zh: '美国国土安全部', en: 'Department of Homeland Security', abbr: 'DHS', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC },
  { zh: '美国国防情报局', en: 'Defense Intelligence Agency', abbr: 'DIA', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC },
  { zh: '俄罗斯联邦安全局', en: 'Federal Security Service of Russia', abbr: 'FSB', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '俄文缩写 ФСБ，继承苏联 KGB 国内职能' },
  { zh: '俄罗斯联邦对外情报局', en: 'Foreign Intelligence Service of Russia', abbr: 'SVR', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '俄文缩写 СВР，继承苏联 KGB 对外职能' },
  { zh: '俄罗斯联邦武装力量总参谋部情报总局', en: 'Main Intelligence Directorate', abbr: 'GRU', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '俄罗斯军事情报机构，俄文缩写 ГРУ' },
  { zh: '英国安全局（军情五处）', en: 'Security Service (MI5)', abbr: 'MI5', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '负责国内反间谍与反恐' },
  { zh: '英国秘密情报局（军情六处）', en: 'Secret Intelligence Service (SIS / MI6)', abbr: 'MI6', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '负责境外情报收集' },
  { zh: '英国政府通信总部', en: 'Government Communications Headquarters', abbr: 'GCHQ', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '信号情报与网络安全机构' },
  { zh: '法国对外安全总局', en: 'Directorate-General for External Security', abbr: 'DGSE', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '法国对外情报机构' },
  { zh: '法国国内安全总局', en: 'Directorate-General of Internal Security', abbr: 'DGSI', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC },
  { zh: '德国联邦情报局', en: 'Federal Intelligence Service', abbr: 'BND', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '德文 Bundesnachrichtendienst' },
  { zh: '德国联邦宪法保卫局', en: 'Federal Office for the Protection of the Constitution', abbr: 'BfV', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '德国国内反间谍机构' },
  { zh: '以色列摩萨德', en: 'Mossad', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '以色列对外情报机构，全称"情报和特殊使命研究所"' },
  { zh: '以色列辛贝特', en: 'Shin Bet (Israel Security Agency)', abbr: 'ISA', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '又称 Shabak，以色列国内安全机构' },
  { zh: '印度调查分析局', en: 'Research and Analysis Wing', abbr: 'RAW', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC, note: '印度对外情报机构' },
  { zh: '巴基斯坦三军情报局', en: 'Inter-Services Intelligence', abbr: 'ISI', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC },
  { zh: '韩国国家情报院', en: 'National Intelligence Service', abbr: 'NIS', category: '机构', side: 'foreign', group: '各国情报与安全机构', status: '现行', source: FGOV_SRC },

  // ── 宗教机构与领袖 ──
  { zh: '梵蒂冈城国', en: 'Vatican City State', category: '机构', side: 'foreign', group: '宗教机构与领袖', status: '现行', source: FGOV_SRC, note: '世界最小主权国家，教皇为元首' },
  { zh: '罗马教廷', en: 'Holy See', category: '机构', side: 'foreign', group: '宗教机构与领袖', status: '现行', source: FGOV_SRC, note: '天主教会最高权力中心，享有国际法主体地位' },
  { zh: '教皇', en: 'Pope', category: '职位', side: 'foreign', group: '宗教机构与领袖', status: '现行', source: FGOV_SRC, note: '全称 Supreme Pontiff，天主教会最高领袖兼梵蒂冈元首' },
  { zh: '教廷国务卿', en: 'Secretary of State of the Holy See', category: '职位', side: 'foreign', group: '宗教机构与领袖', status: '现行', source: FGOV_SRC, note: '相当于梵蒂冈"总理兼外长"' },
  { zh: '枢机主教团', en: 'College of Cardinals', category: '机构', side: 'foreign', group: '宗教机构与领袖', status: '现行', source: FGOV_SRC, note: '负责选举教皇（秘密会议 Conclave）' },
  { zh: '坎特伯雷大主教', en: 'Archbishop of Canterbury', category: '职位', side: 'foreign', group: '宗教机构与领袖', status: '现行', source: FGOV_SRC, note: '英国国教会（圣公会）精神领袖' },
  { zh: '世界基督教联合会', en: 'World Council of Churches', abbr: 'WCC', category: '机构', side: 'foreign', group: '宗教机构与领袖', status: '现行', source: INTL_SRC, note: '总部日内瓦，代表全球基督教各宗派（天主教未加入）' },
  { zh: '世界基督教联合会总干事', en: 'General Secretary of the World Council of Churches', category: '职位', side: 'foreign', group: '宗教机构与领袖', status: '现行', source: INTL_SRC },

  // ── 臺灣（中華民國）政府機構 ── 全部繁體字；來源：gov.tw 官方英文版 ──

  // ── 中央政府（總統府・五院）──
  { zh: '總統府', en: 'Office of the President', category: '机构', side: 'tw', group: '中央政府（總統府・五院）', status: '现行', source: TW_SRC },
  { zh: '行政院', en: 'Executive Yuan', abbr: 'EY', category: '机构', side: 'tw', group: '中央政府（總統府・五院）', status: '现行', source: TW_SRC, note: '相當於內閣，院長即行政首長（Premier）' },
  { zh: '立法院', en: 'Legislative Yuan', abbr: 'LY', category: '机构', side: 'tw', group: '中央政府（總統府・五院）', status: '现行', source: TW_SRC, note: '單院制國會，113席立法委員' },
  { zh: '司法院', en: 'Judicial Yuan', category: '机构', side: 'tw', group: '中央政府（總統府・五院）', status: '现行', source: TW_SRC },
  { zh: '考試院', en: 'Examination Yuan', category: '机构', side: 'tw', group: '中央政府（總統府・五院）', status: '现行', source: TW_SRC, note: '掌理公務人員考選、銓敘事務' },
  { zh: '監察院', en: 'Control Yuan', category: '机构', side: 'tw', group: '中央政府（總統府・五院）', status: '现行', source: TW_SRC, note: '彈劾、糾舉、審計三職能；2020年起設國家人權委員會' },
  { zh: '憲法法庭', en: 'Constitutional Court', category: '机构', side: 'tw', group: '中央政府（總統府・五院）', status: '现行', source: TW_SRC, note: '2022年改制，原大法官會議更名；隸屬司法院' },
  { zh: '國家安全局', en: 'National Security Bureau', abbr: 'NSB', category: '机构', side: 'tw', group: '中央政府（總統府・五院）', status: '现行', source: TW_SRC, note: '隸屬總統府，主管情報協調與國家安全' },
  { zh: '國家安全會議', en: 'National Security Council', abbr: 'NSC', category: '机构', side: 'tw', group: '中央政府（總統府・五院）', status: '现行', source: TW_SRC, note: '由總統主持，協調國防外交政策' },

  // ── 行政院各部 ──
  { zh: '內政部', en: 'Ministry of the Interior', abbr: 'MOI', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC },
  { zh: '外交部', en: 'Ministry of Foreign Affairs', abbr: 'MOFA', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC },
  { zh: '國防部', en: 'Ministry of National Defense', abbr: 'MND', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC },
  { zh: '財政部', en: 'Ministry of Finance', abbr: 'MOF', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC },
  { zh: '教育部', en: 'Ministry of Education', abbr: 'MOE', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC },
  { zh: '法務部', en: 'Ministry of Justice', abbr: 'MOJ', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC },
  { zh: '經濟部', en: 'Ministry of Economic Affairs', abbr: 'MOEA', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC },
  { zh: '交通及建設部', en: 'Ministry of Transportation and Construction', abbr: 'MOTC', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC, note: '2023年8月改制擴編，原交通部' },
  { zh: '勞動部', en: 'Ministry of Labor', abbr: 'MOL', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC },
  { zh: '衛生福利部', en: 'Ministry of Health and Welfare', abbr: 'MOHW', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC, note: '俗稱「衛福部」' },
  { zh: '環境部', en: 'Ministry of Environment', abbr: 'MOENV', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC, note: '2023年8月改制，原行政院環境保護署升格' },
  { zh: '農業部', en: 'Ministry of Agriculture', abbr: 'MOA', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC, note: '2023年8月改制，原行政院農業委員會升格' },
  { zh: '文化部', en: 'Ministry of Culture', abbr: 'MOC', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC },
  { zh: '數位部', en: 'Ministry of Digital Affairs', abbr: 'MODA', category: '机构', side: 'tw', group: '行政院各部', status: '现行', source: TW_SRC, note: '2022年8月新設，主管數位政府與資通安全' },

  // ── 行政院委員會・獨立機關 ──
  { zh: '國家科學及技術委員會', en: 'National Science and Technology Council', abbr: 'NSTC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '2022年改制，原科技部改制為委員會' },
  { zh: '國家發展委員會', en: 'National Development Council', abbr: 'NDC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '俗稱「國發會」' },
  { zh: '大陸委員會', en: 'Mainland Affairs Council', abbr: 'MAC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '主管兩岸政策事務' },
  { zh: '金融監督管理委員會', en: 'Financial Supervisory Commission', abbr: 'FSC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '俗稱「金管會」，獨立機關' },
  { zh: '國家通訊傳播委員會', en: 'National Communications Commission', abbr: 'NCC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '獨立機關，監管廣電與電信' },
  { zh: '中央選舉委員會', en: 'Central Election Commission', abbr: 'CEC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '獨立機關，主管公職選舉事務' },
  { zh: '公平交易委員會', en: 'Fair Trade Commission', abbr: 'FTC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '獨立機關，主管競爭法與消費者保護' },
  { zh: '原住民族委員會', en: 'Council of Indigenous Peoples', abbr: 'CIP', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC },
  { zh: '客家委員會', en: 'Hakka Affairs Council', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC },
  { zh: '海洋委員會', en: 'Ocean Affairs Council', abbr: 'OAC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC },
  { zh: '僑務委員會', en: 'Overseas Community Affairs Council', abbr: 'OCAC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC },
  { zh: '國軍退除役官兵輔導委員會', en: 'Veterans Affairs Council', abbr: 'VAC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '俗稱「退輔會」' },
  { zh: '中央銀行', en: 'Central Bank of the Republic of China (Taiwan)', abbr: 'CBC', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC },
  { zh: '銓敘部', en: 'Ministry of Civil Service', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '隸屬考試院，掌理文官銓敘事項' },
  { zh: '考選部', en: 'Ministry of Examination', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '隸屬考試院，主辦各類公務人員考試' },
  { zh: '國家審計部', en: 'National Audit Office', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '隸屬監察院，掌審計職能' },
  { zh: '國家人權委員會', en: 'National Human Rights Commission', category: '机构', side: 'tw', group: '行政院委員會・獨立機關', status: '现行', source: TW_SRC, note: '2020年設立，隸屬監察院；符合聯合國巴黎原則' },

  // ── 臺灣政府職銜 ──
  { zh: '總統', en: 'President of the Republic of China', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '民選，任期4年；英文簡稱 President' },
  { zh: '副總統', en: 'Vice President of the Republic of China', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '行政院院長', en: 'Premier', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '全銜 President of the Executive Yuan；俗稱行政院長' },
  { zh: '行政院副院長', en: 'Vice Premier', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '全銜 Vice President of the Executive Yuan' },
  { zh: '部長', en: 'Minister', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '政務次長', en: 'Political Deputy Minister', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '常務次長', en: 'Administrative Deputy Minister', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '主任委員', en: 'Chairperson', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '委員會首長通用頭銜' },
  { zh: '副主任委員', en: 'Vice Chairperson', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '立法院院長', en: 'President of the Legislative Yuan', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '立法院副院長', en: 'Vice President of the Legislative Yuan', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '立法委員', en: 'Legislator', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '官方英文為 Legislator；勿用 MP 或 Congressman' },
  { zh: '大法官', en: 'Justice of the Constitutional Court', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '2022年憲法法庭改制後正式頭銜' },
  { zh: '司法院院長', en: 'President of the Judicial Yuan', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '直轄市市長', en: 'Mayor', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '六都（臺北/新北/桃園/臺中/臺南/高雄）首長頭銜' },
  { zh: '縣長', en: 'County Magistrate', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '市長', en: 'City Mayor', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '省轄市（非直轄市）首長頭銜' },
  { zh: '議長', en: 'Speaker', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '縣市議會/直轄市議會首長' },
  { zh: '議員', en: 'Council Member', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '地方民意代表通用頭銜' },
  { zh: '局長', en: 'Director-General', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '各機關下設局首長；執法機關用 Commissioner' },
  { zh: '處長', en: 'Director-General', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '各部內下設處之首長' },
  { zh: '科長', en: 'Section Chief', category: '职位', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '直轄市', en: 'Special Municipality', category: '通名', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '六都：臺北市/新北市/桃園市/臺中市/臺南市/高雄市' },
  { zh: '縣', en: 'County', category: '通名', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '省轄市', en: 'Provincial City', category: '通名', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC },
  { zh: '鄉鎮市', en: 'Township / Town / City', category: '通名', side: 'tw', group: '臺灣政府職銜', status: '现行', source: TW_SRC, note: '鄉=township，鎮=town，市（縣轄市）=city' },
];

export const GROUP_ORDER = ['党中央机构', '中共中央领导职务', '国务院组成部门', '国务院直属机构与国家局', '中国人民解放军', '全国人大·政协', '最高法·最高检', '中央国家机关职务', '地方行政区划', '地方政府职务', '外交衔级', '机构通名对照', '中央政府（總統府・五院）', '行政院各部', '行政院委員會・獨立機關', '臺灣政府職銜', '联合国主要机关', '联合国专门机构与系统', '其他国际与区域组织', '更多国际与区域组织', '国际组织主要职务', '各国情报与安全机构', '宗教机构与领袖', '欧盟机构', '美国主要机构', '英国主要机构', '法国主要机构', '德国主要机构', '意大利主要机构', '日本主要机构', '俄罗斯主要机构', '韩国主要机构', '印度主要机构', '印度尼西亚主要机构', '澳大利亚主要机构', '加拿大主要机构', '巴西主要机构', '墨西哥主要机构', '阿根廷主要机构', '沙特阿拉伯主要机构', '土耳其主要机构', '南非主要机构', '新加坡主要机构', '马来西亚主要机构', '泰国主要机构', '越南主要机构', '菲律宾主要机构', '东盟其他国家', '朝鲜主要机构', '以色列主要机构', '伊朗主要机构', '乌克兰主要机构'];
