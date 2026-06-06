# nametochinese 进程日志

> 完成即记。CLAUDE.md 只留当前状态摘要，明细在此。

## 已完成（截至 2026-06-03）

### 基建与上线
- 数据清洗 → names.db（SQLite 含索引，62MB）
- 域名 + DNS：nametochinese.com → 76.76.21.21
- 架构：Next.js 16 + Turso + Vercel，已上线
- 限速：纯内存 Map（60次/分/IP，零网络开销；原 Upstash Redis 已废弃）
- GA：G-SX777JZ4D3
- DNS 迁 Cloudflare（NS aitana/earl，原 cldy.com）；CF 橙云全球 CDN
- Turso 迁 Tokyo（aws-ap-northeast-1），全表迁移
- Edge Runtime → Fluid Compute（Node.js），warm 查询 298ms→155ms
- Vercel CDN s-maxage=86400，命中 ~100ms
- /api/ping + cron-job.org 每5分钟保活（防 Turso free tier 暂停）
- 目标用户：全球非大陆（无 ICP，大陆不可访问）

### 性能 / 修复
- lib/db.ts 懒加载 Proxy（createClient 不在模块初始化执行，fix build error）
- 搜索乱跳修复：AbortController + 150ms debounce（三搜索客户端）
- 并行 DB 查询 persons + places（/api/search）
- 路由内存缓存 Map，5分钟 TTL（search/search-ru/search-ko）
- 页面预热：useEffect 触发对应 search API 暖进程+连接
- search-ja-person 空结果 s-maxage=60（防空查询被 CDN 锁24h）⚠️ search-ru/search-ko 空结果仍 86400，补数据前需注意

### 功能页与数据
- 功能页：/en /ru /ko /ja /convert /pinyin /zh-convert /places /naming-rules(+sinosphere)
- russian_names 5362 条（scripts/fetch_russian_wiki.py，zh.wiki BFS）
- korean_names 7262 条（scripts/fetch_korean_wiki.py）
- japanese_names ~10448 条（fetch_japanese_wiki.py + fetch_japanese_sports_wiki.py，含大谷翔平/铃木一朗等；表结构 japanese/chinese/romaji/romaji_norm/gender）
- 繁→简 opencc，清理 1025 条繁体残留
- search-ru/ko/ja-person：包含匹配 + ORDER BY 精确>前缀>包含
- persons 确认：67万《世界人名翻译大辞典》姓氏/教名词条，nationality 覆盖各语言（法8.2万/意5.8万/日5万/俄4.8万/德4.6万/西2.9万…）。非名人全名库；阿拉伯语存拉丁转写非原文
- /en 统一主搜：type=all 查 persons+places，前端分人物/地名区（限8/5），未收录差异化引导
- **首页减法（2026-06-03）**：删3卡片区 + 去 hero 图，搜索框居中 + 一行文字链接；NavBar 改 4 任务扁平入口（查译名/中文名转外文/外文音译/命名规则），语言退出导航；砍掉的页面移页脚分组
- **政治机构/官员职位中英库（2026-06-03 完成）**：/gov-titles，**384 条 / 35 分组**，纯静态零 DB，客户端模糊搜索 + 卡片折叠 + side 筛选（全部/中国/国际·各国）。NavBar 第 5 项「机构职位」+ 首页页脚入口。每条标来源、标现行/历史。
  - **中国（约121）**：党中央机构 / 中共中央领导职务 / 国务院组成部门26 / 直属机构与国家局30 / 人大政协两高 / 中央地方职务 / 行政区划通名 / 外交衔级 / 机构通名对照
  - **国际·各国（约263）**：联合国系统 + 主要国际组织 + 国际组织首长职务 + 欧盟机构 + 美英法德日俄 + 东盟10国（新加坡最详31条）+ 印度/韩国/朝鲜/以色列/伊朗/乌克兰
  - 铁律（详见 memory/gov_titles_plan.md）：只用官方译法、机构名以机构官网为准/职位以政府工作报告为准、译法冲突取高档、不抓 wiki、敏感与争议机构一律不收（港澳台办/具体自治区/巴以领土争议等）
  - 来源分层：中国政府网英文版 / 各部委官网 / 政府工作报告英译 / 外交部礼宾·驻外人员法 / 宪法英译本 / 联合国官方中文+系统文件库 / 新华社译名标准 / 新加坡政府目录 / 各国官网与外交部国家概况
- **首页布局 v2 重构（2026-06-05 进行中，详见 decisions.md「信息架构 v2」+ todos「首页布局重构」6步）**：Step0 地名剥离已上线（/en 综合查询 type=person，地名走 /places）。**Step1 上线（2026-06-05）**：components/SearchTabs.tsx 统一 tab 条(查询/en·俄语/ru·韩语/ko·日语/ja)，用 Next `<Link>` 实现软跳转(URL 变不整页刷新)+可爬 `<a href>` 四页互链(SEO)，current 渲染 span 不自链；插入 /en /ru /ko /ja，各 client 内部渲染不动；顺手修 /ru metadata 过时数字(280→5000)。**Step2-5 全部上线（2026-06-05）**：① 首页重排 app/page.tsx：SearchTabs(默认查询,输入跳/en)+卡片区5张(地名/机构/拼音找名/简繁/姓名转拼音=内链)+保留页脚。② NavBar「中文名转外文」占位→「中文名转拼音」指向 /name-to-pinyin。③ 新页 /name-to-pinyin(场景3)：pinyin-pro@3.28.1，英文界面面向老外，surname:'all' 模式(单 Shàn/仇 Qiú/解 Xiè/查 Zhā)+生僻字(龑/曌)，复姓 segmentation 硬编码集(欧阳/司马…)，输出 Pinyin(tones)/English form/ALL CAPS/逐字分解+Copy，只汉语拼音(About 说明不做威妥玛粤拼)。④ SEO 收尾：sitemap 加 /name-to-pinyin + 补漏 /en /places，内链=首页卡片+四页 tab 互链。线上截图验证首页布局好、查良镛→Zhā Liángyōng 准。待用户手动：GSC 提交 sitemap。**首页 v2 重构全部完成**
- **音译引擎修复（2026-06-05）**：① 缺音回退——原"匹配不到吐大写原文字母"（"安V因"误像结果），改为标记缺口（全角"？"+missing 标记，前端红色+底部"需人工定字"提示）。② 简繁——译音表数据源繁体 wiki，输出过 opencc-js t2s（"溫→温"）。lib/transliterate.ts + app/convert/page.tsx。线上验证通过。引擎本体（选国家→自动拼→字母汉字分段）早已存在，未重做
- **SEO 零成本项（2026-06-05）**：gov-titles JSON-LD 升级 WebPage → DefinedTermSet + 384 条 DefinedTerm（争 Google 术语卡富结果）；/places 补 canonical+keywords。核查确认各页 metadata 早已差异化、robots 正常。均已上线。待办：GSC 提交 sitemap（需用户手动）、程序化 SEO（85万人名地名详情页，等 UI 版式定）。详见 project_pending_todos.md「SEO」段
- **人名规则 13 篇深度长文（2026-06-03）**：/naming-rules/[lang] SSG（content.ts + [lang]/page.tsx，dynamicParams=false）。西/葡/俄/阿/日/韩/德/法/越/泰/匈/冰岛/缅甸。每篇全套 SEO：metadata+keywords、H1/H2 长尾词、FAQ、JSON-LD(Article+FAQPage+Breadcrumb)、面包屑、导流钩子(→/en →/convert)、子页互链、sitemap 收录。纯文字未配音译表，内容全原创

### /ru 逐词直译引擎（2026-06-05 上线，用户定呈现方式）
- 收录 tingroom「俄语男女名字全集」(itemid=105)：scripts/ru_given/parse.js 解析 → data/russian/given_names.json **1231 行/282 教名**（formal281/父名男242/女性父名208/爱称500）。含 SOURCE.md 来源说明。注：现有 russian_names 表当年就抓自同页但残缺(493行,多空)。
- /ru 改**逐词直译**：输入按空格切词，每词查中文行内直给（`Владимир Путин`→`弗拉基米尔 普京`）。**不做联想**(去小名/父名列表+性别筛选)。lib/ruDict.ts 静态字典 + /api/ru-translate(字典→russian_names精确兜底只读→俄语音译兜底标"推测") + RuSearchClient 逐词渲染。旧 /api/search-ru 弃用未删。
- 线上验证：Владимир Путин→弗拉基米尔 普京✓、Ксенья→克先娅/克谢妮娅✓、Иван→伊万✓。Путин 走音译兜底正好=普京(标推测)。

### 全站一致性四修（2026-06-05 已上线）
- **统一搜索框** `components/SearchInput.tsx`（输入+「查」按钮，点按钮/回车都触发）：铺到 /en /ru /ko /ja(两框) /places /name-to-pinyin（/pinyin 本就有；/convert 选国家+disabled 特殊未改；/zh-convert 是转换器；/gov-titles 实时筛选）
- **统一页脚** `components/SiteFooter.tsx`（全站互链四组人名/音译·地名/中文工具/参考 + 「← 回首页」+ 「查不到?试外文音译表」入口）：铺到所有功能页（首页保留原页脚）
- **回首页**：页脚「← 回首页」+ NavBar logo，解决跳转后无回主页入口
- **查不到给音译入口**：/ru 结果区「打开俄语音译表→」/ko「按韩语音译规则转写→」/places「按语言规则音译→」CTA（/en 本就有），+ 页脚全局音译入口
- 顺带：/ja /zh-convert 内联页脚(含 new Date())换 SiteFooter
- 本地 next start 截图验证 /ru：查按钮对齐、逐词结果、CTA、SiteFooter 全 OK

### 产品测试 + 6 硬伤修复（2026-06-05 全上线，详见 memory/product_qa_2026-06-05.md）
按用户场景逐项打线上接口验证。修：① 德语音译乱码(DE_CONSONANTS手工列序+元音行+清-{}-+双辅音收一)→霍夫曼/贝克尔/菲舍尔；② /en同名优先英语读法→Smith=史密斯居首；③ places包含匹配命中ASCII括注+is_crossref殿后→Tokyo=东京居首；④ /en滤释义噪声→Lyon=莱昂居首；⑤ pinyin补106常用字→张伟可查；⑥ ko罗马字去连字符→Seojun命中。剩移动端适配(P2待办)。

### UI 整理 + 俄语姓氏词典 + 内链补充（2026-06-05 全上线，commit ca072f0）
- **标题字体修 FOUT**：玄宗体毛笔字从 globals.css `@font-face`(swap) 改 `next/font/local`(display:block+自动preload)。原先先刷 fallback(Noto Serif SC)再换毛笔字会闪，现字体就绪前不显示、就绪即出，无闪。仅首页 H1 用 `var(--font-xuanzong)`。
- **NavBar 重排改名**：查译名·外文音译·中文名转拼音·机构职位翻译·各国人名规则（后两个由"机构职位"/"命名规则"改名）。
- **首页卡片区**：补"外文音译"卡(6 张满 3×2)，外文音译从文字链升卡片；简繁转换↔姓名转拼音换位。各国人名规则文字链下加文化引言(父名/双姓/子名/家族链)导流。
- **首页底部 sitemap**：工具组加"姓名转拼音"；原"机构"单条组升为"参考"组(机构职位翻译+各国人名规则)。
- **全站查按钮统一**：convert/首页HomeSearch/pinyin 全改用 SearchInput 组件(原各自不同样式)，SearchInput 加 disabled 态(convert 选国家前禁用)。
- **placeholder 例子修正**：/ja 罗马字框 Tanaka Keizo/Ohtani Shohei→空(库存"名 姓"序且 Keizo 错)，改 Shohei Ohtani/Haruki Murakami(已验证)。其余例子实测均可查(韩 Seojun 现可查)。
- **/convert 纯音译引导条**：黄底说明"仅用于无通用译名的普通名"，举 Dupont→迪蓬非杜邦，内链导主搜/俄韩日专库(QA 第 7 项体验改进)。
- **俄语姓氏词典 4908 个**：data/russian/surnames.json 接入 lib/ruDict(教名层优先、姓氏层兜底)。源=Wikidata 知名俄/苏/俄帝籍人物(sitelinks≥6,15975 人)ru+zh 标签，姓氏=末词/末段(·)对齐→繁转简(opencc)→碰撞去错(中文被更高频别姓占用则丢,丢 64)→人工正名/补名人(Смирнов/Ленин/陀思妥耶夫斯基等单段中文被跳过的)。脚本 scripts/ru_surnames/{build.py,finalize.mjs}+SOURCE.md。/ru 逐词直译现"名+姓"全直给(Лев Толстой→列夫 托尔斯泰)，不再掉音译兜底。
- **内链补充**：① naming-rules 文章导流钩子加专库直链(俄→/ru 日→/ja 韩→/ko)+音译按钮用 /convert?lang= 预选(10 种有表语言)；② /pinyin↔/name-to-pinyin 正反互链；③ gov-titles/places 加上下文内链；④ SiteFooter 参考组命名同步。

### UI / 字体（早期）
- 玄宗体标题字体（8KB subset woff2）→ 已改 next/font/local（见上）
- 印章书法风 logo + favicon（app/icon.png）

## Cursor 任务（流程已废弃，现 Claude 直接改码）
TASK_01~17 均完成：初始化/DB/UI/部署/限速、俄韩音译日语命名规则华人英文名、简繁转换、日本人名、SEO、UI重构、首页修复。文件在 tasks/。

## 数据来源备忘（人名抓取，按优先级）
- ✅ 已用：人名翻译大辞典（原始导入）、zh.wikipedia BFS（主力）
- ⏳ 待扩（俄语已够暂不做）：
  1. 新华社《世界人名翻译大辞典》标准译法（最高价值，无 API 需另找源）
  2. 百度百科"外文名"字段（重叠多，质量参差）
  3. 体育媒体懂球帝/虎扑（补冷门球员，反爬难）

## 2026-06-06
- naming-rules 第一批扩写完成并部署：Spanish / Arabic / Russian / Japanese / Portuguese
  - 每篇新增 3 个 section（故事性内容：历史背景、文化故事、地区差异）
  - 每篇新增 4-5 个 FAQ（从原来 4 条扩到 8-9 条）
  - 总计 69 sections、74 FAQ
  - 内容风格：故事穿插实务，不纯学术
  - TypeScript 类型检查通过，Vercel build 成功
  - 顺手发现并修复：next@16.2.7 破坏 route.ts TS 检查，回退至 16.2.6

## 2026-06-06（续）
- naming-rules 第二批部署：Korean/German/French/Vietnamese/Thai
- naming-rules 第三批部署：Hungarian/Icelandic/Burmese
  - 全站 13 篇全部扩写完成：91 sections，101 FAQ
  - 内容风格：故事性段落（文化历史）+ 实务指引，结构各篇不同

## 2026-06-06（续2）
- naming-rules 新增第5批：意大利语/波兰语/印度尼西亚语/希腊语/希伯来语
- 全站累计：23 个语种，161 sections，181 FAQ
- 待做：todo 里的第二优先（/convert 音译表补全）和程序化SEO

## 2026-06-06（续3）
- naming-rules 第6批（第一档高频）：乌克兰语/马来语/菲律宾语/蒙古语
- 全站累计：27 个语种。4 篇均 7 sections + 8 FAQ，已部署上线（4 页 curl 200）
- 内容要点：乌克兰 г=/h/与-enko后缀；马来 bin/binti父名制+三族群；菲律宾1849法令+中间名=母姓；蒙古 ovog+属格-ийн
- 修复：next.config.ts 加 turbopack.root 钉死项目目录（家目录有 root 所有的游离 package-lock.json/node_modules 污染 workspace root 判定，导致本地 postcss/enhanced-resolve 解析错乱）
- 已知：本地 npm run build 仍因 @libsql/hrana-client lib-esm 损坏失败（node_modules 坏装，与内容无关）；Vercel 云端干净构建正常（25s）

## 2026-06-06（续4）
- naming-rules 第7批（第二档+第三档，一起部署）：塞尔维亚语/捷克语/罗马尼亚语/芬兰语 + 斯瓦希里语/哈萨克语
- 全站累计：33 个语种。6 篇均 7 sections + 8 FAQ，已部署上线（6 页 curl 200）
- 内容要点：塞 -ić+双文字+变音脱落；捷 女姓-ová+ř音+卡夫卡=寒鸦；罗 -escu拉丁孤岛+ș/ț；芬 -nen非印欧+ä/ö+托瓦兹芬兰瑞典人；斯瓦希里 阿拉伯底色+名+父名+Uhuru=自由；哈萨克 突厥+苏联双层-ov/-ev vs -uly/-qyzy去俄化+西里尔转拉丁
- 原"剩余有价值语种"清单（第一/二/三档）已全部写完，naming-rules 选题告一段落

## 2026-06-06（续5）：广告变现基建（合规页 + Cookie + Consent Mode）
- GSC sitemap：用户手动提交完成 ✓
- 新建 3 个双语合规页：/about /privacy /terms（components/LegalPage.tsx 统一双语排版 server 组件，sections 数据驱动）
- Cookie 同意横幅：components/CookieConsent.tsx（client，localStorage 记忆，接受/拒绝）
- **Google Consent Mode v2**：layout 原生内联脚本默认 denied（ad_storage/ad_user_data/ad_personalization/analytics_storage），横幅接受后 gtag update granted；早于 afterInteractive 的 GA
- **AdSense env 条件注入**：layout 读 NEXT_PUBLIC_ADSENSE_ID，设了才注入 adsbygoogle.js（拿到 pub-id 只需设环境变量，无需改码）
- SiteFooter 加「关于」组（about/privacy/terms）；sitemap 加 3 页
- 已部署上线验证：3 合规页 200、consent 脚本进 HTML、footer 链接全站可达、既有页未受影响
- **待用户手动**：去 AdSense 后台申请（站内容已够过审），拿到 ca-pub-xxx 后设 Vercel 环境变量 NEXT_PUBLIC_ADSENSE_ID 即自动接入。届时再做广告位组件 <ins class="adsbygoogle">
- 本地构建/tsc 仍受环境污染（node_modules 坏装 + iCloud " 2" 重复文件）；新代码 tsc 零报错，Vercel 云端正常

## 2026-06-06（续6）：合规入口补全 + 版权止血 + 联系邮箱
- 合规页入口补全：首页内联 footer 加「关于」组；naming-rules 索引/[lang]/sinosphere 三页挂 SiteFooter（之前只改了 SiteFooter 组件，但这些页用各自内联 footer 没走 SiteFooter→入口缺失，已修，commit 51433b1）。顺带给 33 篇文章页加了全站内链
- 版权止血：about 页删掉点名《世界人名翻译大辞典》词条，改"遵循公开译名规范"（commit 083357e）。红线记入 decisions.md：对外永不点名版权辞典 + 永不加批量导出入口
- 联系邮箱：terrafluxstudio@gmail.com 全站换成 contact@nametochinese.com（commit 731d45d）；Cloudflare Email Routing 转发到私人 gmail，已验证可收。配置详见 decisions.md 服务配置区
