# 待做清单

> git commit 后划掉已完成项。

## 功能（按风险低→高）
- [ ] 【低】各语言页"未找到"内联引导 → /convert?lang=xxx&q=xxx（预填语言+输入）
- [ ] 【低】/convert 接收 URL 参数 lang + q（各页 fallback 直接带入）
- [ ] 【低】/convert 彩色结果下方加「查看完整[语言]音译表」（展开静态表，Wikipedia）
- [x] 【低】/ja 汉字输入检测（2026-06-07）：API 本已搜 japanese+chinese 两字段；补加片假名说明"假名仅支持音译，改用汉字或罗马字查人名记录"
- [x] /en → /search URL 改名 + SEO redirect（2026-06-07）：next.config.ts 308 永久 redirect，app/search/ 新路由，所有内链更新，sitemap 更新
- [ ] 名人库（俄韩日）并入主搜人物区（现有独立页先留）
- [x] 数据噪声：过滤 persons 中 chinese 为空/纯注释的词条（2026-06-06）：调查发现无真空词条（COUNT=0），注释是"译名+括号注释"混合形式。前端 ResultCard.tsx getDisplayChinese() 截断显示，has_note 字段不完整（漏标），改用内容检测（split 括号/中文标点）。Abel"（男子教名…）"→ 截断为"埃布尔"已验证。
- ❌ **中文名→外文罗马化引擎**（粤拼等）→ 用户决定不做。威妥玛已单独成页（/wade-giles），其他系统不做。
- [ ] 【中】首页搜索框实时预览（消除首查跳转延迟，单独测延迟）
- [ ] 接入八字起名站

## UI
- [x] /ru /ko /ja 空查询热门词条（2026-06-07）：各页展示常见名字 chip，点击填入并搜索
- [x] 移动端适配（2026-06-07）：NavBar 汉堡菜单已上线

## 首页布局重构（2026-06-05 拍板，详见 decisions.md「信息架构 v2」。分步、每步可独立部署）
- [x] **Step 0 地名剥离**（2026-06-05 上线）：/en 综合查询 type=all→type=person、去地名区、文案改纯人名。API 保留 type=place 给 /places。线上验证只返回 person ✓
> **完整计划（每步怎么做/SEO/验证）见 memory/homepage_v2_plan.md**。URL 模型=四 tab 平级独立页(查询/en·俄/ru·韩/ko·日/ja)，首页/=门户(搜索+5卡片)，/en 不重定向。
- [x] **Step 1 SearchTabs 统一 tab条+软跳转**（2026-06-05 上线）：components/SearchTabs.tsx，四 tab(查询/en·俄语/ru·韩语/ko·日语/ja)，用 Next `<Link>`(软跳转+可爬内链)，current 渲染 span 不自链。插入 /en /ru /ko /ja。SEO 核对四页 metadata 已差异化(顺手修 /ru 描述 280→5000)。线上验证 /ru /ko 四 tab 互链 href 齐 ✓
- [x] **Step 2 首页重排**（2026-06-05 上线）：app/page.tsx 加 SearchTabs(默认查询,输入跳/en) + 卡片区5张(地名/机构/拼音找名/简繁/姓名转拼音 = 内链) + 保留页脚。首页 SEO 继承 root 强 title/desc
- [x] **Step 3 导航对齐**（2026-06-05 上线）：NavBar「中文名转外文」占位 → 改「中文名转拼音」指向 /name-to-pinyin
- [x] **Step 4 中文名转拼音新页**（2026-06-05 上线）：/name-to-pinyin，装 pinyin-pro@3.28.1，**英文界面**，surname:'all' 模式(单 Shàn/仇 Qiú/解 Xiè/查 Zhā 已验证)+生僻字(龑/曌)，复姓 segmentation(欧阳/司马…硬编码集)，输出 Pinyin(tones)/English form/ALL CAPS/逐字分解+Copy，只汉语拼音(About 区说明不做威妥玛粤拼)。线上验证查良镛→Zhā Liángyōng ✓
- [x] **Step 5 SEO 收尾**（2026-06-05 上线）：sitemap 加 /name-to-pinyin + 顺手补漏的 /en /places；内链=首页卡片+四页 tab 互链
- [x] **Step 5 余项**：GSC 提交更新 sitemap（2026-06-06 用户手动完成）
- 命名已定：默认 tab「查询」；拼音卡 /pinyin「拼音找名」+ 新页「姓名转拼音」(/name-to-pinyin)

## 音译引擎重构（2026-06-05 讨论定。引擎已存在 /convert + lib/transliterate，勿重做）
> 关键认知：用户描述的"输名字+选国家+自动拼+字母汉字划线"，/convert 早已实现（彩色分段：上汉字/中横线/下字母，8色循环）。真任务是数据补全+质量修+串动线，不是造引擎。
- [x] **简繁混合修**（2026-06-05 已上线）：transliterate() 输出过 opencc-js `Converter({from:'t',to:'cn'})`，仅转汉字段。"溫→温"已验证
- [x] **缺音回退**（2026-06-05 已上线）：匹配不到改吐全角"？"+ `missing:true`，前端红色渲染 + 底部"标「？」处该语言表无对应汉字，需人工定字"。"安V因"→"安？因"已验证
- [ ] **地名音译分表**：人名/地名规则不同（同字母不同字），按 type=person/place 分开拼（表里 place 表可能缺，需补）
- [~] **wiki 译音表补全/核新**（2026-06-06 调查完结）：57 种已是 Wikipedia 上实际有表的全集。所有"缺漏"语种（越南/朝鲜/乌克兰/格鲁吉亚/哈萨克/克罗地亚/斯洛伐克等）要么没有 Wikipedia 子页面，要么只有 placeholder（引用外部 GB/T 付费标准），要么明确禁止自拟（乌克兰语）。若需补充，须另找官方 GB/T 文件来源，不在 wiki 范围内可自主完成。
- [x] **"选国家"语义引导**（2026-06-07）：NON_LATIN_TABLES 检测，非拉丁字母国家显示黄色警告；混合脚本国家蓝色提示；placeholder 随表类型更新
- 待对齐：缺音"划线"展示——用户提"划线"，现状是上下分段+横线，是否要改成字母↔汉字连线（样式微调，非重做）

## SEO（2026-06-05 盘点。现状：全站仅 ~25 个可收录 URL，85万人名/地名全藏在客户端 API 搜索后，Google 看不见）

### A. 零成本/不依赖 UI（2026-06-05 已清大半）
- [x] gov-titles 升级 DefinedTermSet + 384 条 DefinedTerm 结构化数据（争术语卡富结果）✅已上线
- [x] /places 补 canonical + keywords ✅已上线
- [x] 核查：各页 title/desc/keywords/canonical 早已差异化（仅 places 漏，已补）；/en/ru/ko/ja 长尾词不雷同；robots 正常无误 noindex
- [x] **GSC 提交更新后 sitemap**（2026-06-06 用户手动完成）
- [x] 内链补强（2026-06-07）：naming-rules 索引→/en·/convert·/gov-titles；文章页→/gov-titles·/en；gov-titles→/convert
- [x] 每页 OG/Twitter card 细化（2026-06-07）：9个主要页面加独立 openGraph + twitter 字段

### B. 程序化 SEO（量级杠杆，**必须等 UI 版式定稿再铺**，否则模板返工）
- [x] **英文名→中文长尾页 P1**（2026-06-07 上线）：53 个 /[name]-in-chinese（SSG，英文界面）+ /names-in-chinese 索引 hub。规则音译+精选选词，**不 dump 67万辞典**（版权红线见 memory/longtail-namepage-copyright-line.md + LONGTAIL_SEO_PLAN.md）。sitemap 1980→2034。**等 GSC 收录数据**：有效→加 data/english_names.json 条目扩到~300+推 P2 常用词簇；无效→止损
- [ ] /name/[slug] + /place/[slug] 静态详情页（SSG），进 sitemap → 吃长尾词「<外文名> 中文」「<地名> 中文译名」
- [ ] ⚠️ 不可全量铺 85万：人名辞典是姓氏/教名词条，薄内容会拖垮全站权重。先铺高价值子集（名人库俄韩日 ~2.3万 + 地名有实义部分），每页堆够价值（音标/消歧/来源/相关名内链）才上
- [ ] >5万 URL 必须 sitemap index 分片（每片 5万上限）
- [ ] 决策前先定：铺哪个子集 + 每页放什么内容（单独聊，别顺手开）

## 近期计划（2026-06-06 定稿，按优先级）

### 第一优先：内容质量（SEO 基础）
- [x] **naming-rules 各篇扩写 + 扩语种**（2026-06-06 完成）：13 篇全部扩写到 7 sections + 8-9 FAQ；语种 13→33（新增荷/土/波斯/瑞典/印地/意/波兰/印尼/希腊/希伯来/乌克兰/马来/菲律宾/蒙古/塞尔维亚/捷克/罗马尼亚/芬兰/斯瓦希里/哈萨克）。选题清单（第一/二/三档）已全部写完
- [x] **GSC 提交 sitemap**（2026-06-06 用户手动完成）：GSC 添加站点地图 `sitemap.xml`（含 34 个 naming-rules 条目，33 语种全在内）。提交≠收录，新页几天到两周进索引

### 第二优先：数据扩充
- [~] **/convert 音译表补全**（2026-06-06 调查完结，同上条。57种=wiki有表全集）：见"音译引擎重构"区说明。
- [ ] **/gov-titles 扩充**：补国际组织（WTO/IMF/世界银行/北约等）+ 各国条目细化

### 第三优先：新功能讨论
- [x] **威妥玛拼音转换**（2026-06-07）：讨论后聚焦威妥玛（弃新马"乱搞"、弃通用拼音）。新建 /wade-giles，pinyin-pro+音节转换规则全覆盖，姓 名-名格式（毛泽东→Mao Tse-tung 等教科书核验）。首页卡片重排为8张4行。新马方向已弃。

### 第四优先：技术/性能
- [x] **印章 loading 优化**（2026-06-06 完成）：根因=lazy+next/image 双重过度处理，改 base64 内联，随 HTML 立即渲染
- [x] **移动端适配**（2026-06-07 完成）：NavBar 汉堡菜单（md:hidden，动画X，backdrop关闭，路由跳转自动关闭）

### 最后：搜索结果下显示同名名人
- [x] **/ru 搜索结果页下方显示「叫这个名字的名人」**（2026-06-07）：并行查 russian_names，最多6条，名字+父称+性别。/ko·/ja 已是名人库主搜，不适用。

---

## 内容扩展（2026-06-06 新增待办）

- [x] **首页印章 loading 慢**（2026-06-06 完成）：base64 内联，零请求，同上

- [ ] **扩充 /convert 音译表**（2026-06-06 用户要求）：
  - 目标：收录 Wikipedia《外語譯音表》全部语言 https://zh.wikipedia.org/wiki/Wikipedia:%E5%A4%96%E8%AA%9E%E8%AD%AF%E9%9F%B3%E8%A1%A8
  - 现状：已有 57 种语言表（data/transliteration/*.json）
  - 待做：核对 wiki 页面，找出缺漏语种，补全/更新；部分表版本老旧需核新

- [x] **扩充 /gov-titles 库**（2026-06-06 持续完成）：384→555条。G20全国覆盖+解放军军衔+情报机构+宗教机构+欧洲委员会/ECHR/OSCE/CSTO+国家监察委+国家安全委等

- [~] **广告变现基础建设**（2026-06-06，基建部分已完成上线）：
  - [x] About / Privacy（覆盖 GA+AdSense cookie 追踪）/ Terms 三个双语合规页（/about /privacy /terms）
  - [x] Cookie 同意横幅 + Google Consent Mode v2（默认 denied，接受后 granted）
  - [x] AdSense env 条件注入框架（设 NEXT_PUBLIC_ADSENSE_ID 即生效）
  - [ ] **用户手动**：登录 Google AdSense 后台申请（内容已够过审）→ 验证站点 → 拿 ca-pub-xxx
  - [ ] 拿到 pub-id 后：① Vercel 设环境变量 NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxx ② Claude 做广告位组件 <ins class="adsbygoogle"> 放到合适位置（内容页底部/侧栏，避开 Core Web Vitals）

- [x] **/convert UI 大改版**（2026-06-07 完成）：202国atlas（country_tables.json）+ 左洲右国两栏 + 多表并行查询（以色列→希伯来+阿拉伯，瑞士→德+法+意）+ 选国显示Wikipedia音译表+注记（已用opencc t2s统一简体）

- [ ] **扩充 /naming-rules 并深度 SEO 优化**（2026-06-06 用户要求）：
  - 现状：13 篇（西/葡/俄/阿/日/韩/德/法/越/泰/匈/冰岛/缅甸），内容有但不够展开
  - 待做：每篇大幅扩写（更多文化背景、具体例子、常见姓名列表、历史渊源）
  - SEO：各篇加更多长尾关键词、H2 细分、FAQ 加量、内链密度提升、考虑程序化生成相关名词汇表
  - 扩展语种：用户提过可加的语种（荷兰/北欧/土耳其/波斯/印地等，结合 /convert 已有表的语言优先）

- [ ] **台湾·新加坡·马来西亚华人英文姓名**（2026-06-06 提出，明天讨论）：
  - 场景：华人以闽南/粤/客家/普通话拼音写英文名（如 Tan=陈/林, Wong=王/黄, Lee=李/黎）
  - 待讨论：是否做搜索框自动化（输入英文姓→给出可能的中文姓+方言来源）
  - 数据源：姓氏对照表（新加坡政府/马来西亚华人公会/台湾身份证拼音规则）
  - ⚠️ 先讨论产品形态再动手

- [x] **俄语姓氏→中文词典（2026-06-05 完成，待部署）**：data/russian/surnames.json **4908 个姓氏**，已接入 lib/ruDict（教名层优先、姓氏层兜底）。源=Wikidata 知名俄/苏/俄帝籍人物(sitelinks>=6, 15975 人)的 ru+zh 标签，姓氏=ru 末词/zh 末段(·)对齐 → 繁转简(opencc) → 碰撞去错(某中文被更高频别的姓占用则丢弃误配,丢 64) → 人工正名/补名人(Смирнов/Ленин/陀思妥耶夫斯基/柴可夫斯基/勃列日涅夫等单段中文被跳过的)。脚本 scripts/ru_surnames/{build.py,finalize.mjs}，来源 data/russian/surnames.SOURCE.md。验证 Лев Толстой→列夫 托尔斯泰、Фёдор Достоевский→菲奥多尔 陀思妥耶夫斯基、Сергей Смирнов→谢尔盖 斯米尔诺夫 全直给。✅ 2026-06-05 已上线。
- [ ] **扩名人库（用户 2026-06-05 要求记）**：俄/韩/日同级，将来加阿拉伯/越南/德/法等语言名人全名库，zh.wiki BFS 同法抓。tab 式主搜要预留这些 tab 位
- [ ] 人名规则：13 篇已上，视 GSC 收录/排名决定是否再扩其他语言

## UI 留白 + 摸鱼小游戏（2026-06-05 定论）
- 用户真实需求：译者查名字是打断流的苦差，"顺手摸个鱼"是真实情绪，需求成立
- 但摸鱼黄金时机 = **卡壳那一下**（查不到/走错路），不是"查到了"（查到该导流不留客）
- 功能页底部**不加**游戏：伤 Core Web Vitals=伤排名、稀释专业感（用户是 MTI/CATTI 译者）、抢主路径注意力
- [ ] 空白功能页用「有用内容」填：相关译名 / 使用示例 / 命名规则入口 / 导流钩子（一箭三雕：填空+内链SEO+转化）
- [x] 摸鱼彩蛋两处死胡同：**空搜索结果页**(/en /ko /places 的"未找到"块) + **404 页**(新建 app/not-found.tsx)。✅ 2026-06-05 上线(commit 852c02f)
- [x] 3 个纯前端无依赖游戏 components/games/{DinoGame恐龙跑酷,Game2048,MemoryGame翻牌记忆} + MiniGame.tsx 包装(随机出+「换一个」)。next/dynamic+ssr:false 各独立 4KB chunk，**不进主 bundle**(已验证)。/ja 未接(其"未找到"后接姓氏部分匹配,非干净死胡同)
- 商业价值：做出记忆点=免费传播钩子（"那个查名字还能玩恐龙的站"），低成本获客
- 将来可加更多游戏：往 components/games/MiniGame.tsx 的 GAMES 数组加一项(name+dynamic import)即可，新游戏放 components/games/

## 已确认
- [x] persons 含法/德/西名字 → 已确认（nationality 覆盖各语言）
- [x] /pinyin 单拼音查询（2026-06-07）：原 API 强制姓+名两部分，单搜 lei 被 400 拒。改单拼音直接列字+姓；清脏数据（标点key/日文込）；pinyin-pro 补 135 常用名字字
- [x] /convert 人名/地名分表 UI（2026-06-07）：数据本就分表（9语言有place表），补 UI 切换；route-aware 默认（主搜→人名，/places→地名）
- ❌ 名人库并入主搜 → 用户决定不做，不再提
