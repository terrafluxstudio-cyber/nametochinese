# nametochinese 进程日志

> 完成即记。CLAUDE.md 只留当前状态摘要，明细在此。

## 2026-06-24 /gov-titles 台灣政府機構上線
- data.ts: side 類型擴展 'cn'|'foreign' → 'cn'|'foreign'|'tw'，加 TW_SRC 常數
- 新增 65 條臺灣（中華民國）政府條目（全繁體字，來源 gov.tw），分 4 組：
  - 中央政府（總統府・五院）：9 條
  - 行政院各部：14 條（含 2023 改制：交通及建設部/農業部/環境部/數位部）
  - 行政院委員會・獨立機關：17 條（含 CBC/NSTC/金管會/國人委等）
  - 臺灣政府職銜：25 條（職位 + 地方通名）
- GovTitlesClient.tsx: 加「臺灣（中華民國）」tab
- GROUP_ORDER: 4 個台灣分組插入（機構通名對照 之後，聯合國之前）
- vercel --prod 部署成功

## 2026-06-24（二）内容扩充 + SEO 小修
- /tw layout.tsx: 新建，补 SEO metadata（title/desc/OG/Twitter）
- sitemap.ts: 补 /tw 条目（priority 0.8）
- english_names.json: 122 → 247 条（+60 女名 +65 男名，全部含 zh/origin/meaning，SSG 长尾页自动扩量）
- /places 空结果区: 加 /place-names-guide 内链
- /en 空结果区: 加 /naming-rules 内链
- 部署 vercel --prod（commit 219f729）

## 2026-06-24 首页布局调整 + 台灣標準譯名 /tw 上線
- 爬取國家教育研究院《外國學者人名譯名》：8,767 條（9 語系：英/德/法/斯拉夫/義/西/日韓/阿拉伯/土耳其）
- 導入 Turso `naer_names` 表，建 `idx_naer_en_nocase` / `idx_naer_zh_nocase` NOCASE 索引
- 新 API `/api/search-tw`：前綴匹配 + 語種標籤（langDisplay）
- 新頁面 `/tw`：繁體介面，標示國教院來源，空結果引導跳新華社搜索
- 首頁 CARDS 加「臺灣標準譯名」卡片，移除「各國人名規則」卡片（保留 footer 文字連結 + NavBar 入口）
- 卡片區底部加一行小字引導：「各国人名背后，藏着很多有意思的故事 → 各国人名规则」
- 三封冷外聯郵件全發：台師大（giti@deps.ntnu.edu.tw）、中大（tra@cuhk.edu.hk）、NUS（chssec@nus.edu.sg）
- 外鏈 B 剩：維基百科（需養老號）、PTT/FB（PTT 不對口繁體圈，改討論目標社群）

## 2026-06-23 🔥 Turso 配额拆雷：搜索全表扫描 → 建 NOCASE 索引（生产库）
- **症状**：Turso 用户截图配额 77%（行读取 3.82 亿 / 免费版上限 5 亿/月，周期 6/1–7/1）。
- **追因（非补丁）**：`EXPLAIN QUERY PLAN` 实测 persons/places/ru/ko/ja 搜索**全部 `SCAN` 全表**，索引一次没用上。根因=**SQLite 的 `LIKE` 默认大小写不敏感，普通 BINARY 索引不被 LIKE 前缀查询采用，必须 `COLLATE NOCASE` 索引**。每次人名搜索扫 67 万行 persons。
- **算账**：旧速率 ≈1660 万行/天（3.82亿÷23天），剩 8 天 ×1660万=1.33亿 > 余量 1.18亿 → 约 **6/30 撞 100%**（搜索 API 会报错=站搜索挂），差一天爆。
- **修（生产库 nametochinese-tokyo，纯新增索引、不动数据、可逆）**：建 NOCASE 索引共 9 条 — persons(english/chinese)、places(english/chinese)、russian_names(russian/chinese)、korean_names(korean/english/chinese)、japanese_names(chinese/japanese/romaji_norm)。全部 `EXPLAIN` 复验：`SCAN`→`SEARCH ... USING INDEX (col>? AND col<?)`。**读取量砍 100~1000 倍，无需改任何代码**（现有 `LIKE ?` 自动用上）。
- **结论**：这周期已安全（新增读取降到日均几十万，余量纹丝不动），7/1 清零后长期无忧。
- **遗留（低优先）**：① places 英文 `%q%` 模糊匹配（前导通配）SQLite 硬限制无法走索引，小表低频，未动；② `/api/warmup` 每调用打真搜索（cron 实际打的是便宜的 /api/ping `SELECT 1`，故 warmup 非主因），now persons 已索引便宜，暂不改。
- **坑记**：旧 BINARY 索引（idx_persons_english 等）保留未删（无害，read-mostly 库写极少）；查 Turso 凭证时本地 .env.test/.env.local 与 `vercel env pull` 拉的 TURSO_* 全为空（敏感变量加密不下传）→ 改用 `turso auth login` + `turso db shell` 直连。
- **🐛 顺带挖出并修了一个潜伏 bug（与索引无关，验证时发现）**：用户要核对查词效果，实测发现**中文输入的人名搜索全 500**（英文正常）。Vercel 日志真凶：`SQLite input error: 3rd ORDER BY term out of range`。根因 = app/api/search/route.ts 中文分支 `ENGLISH_PREF="0"` 拼进 ORDER BY，**SQLite 把裸整数当列序号**（第0列越界）。这是 SQL 解析期错误，与今天建的索引（执行期）零关系，是早就潜伏的代码 bug（git 历史被 iCloud 事故压扁查不到引入日；6/21 那次"预览验证"测的是英文输入显示中文结果，没真测中文输入）。**修：`"0"`→`"NULL"`**（中文搜索本不需此排序项，NULL 是值不是序号）。build+`vercel --prod` 已部署，7 场景全验 200（中文/英文/type=all/ru/ko/ja），结果正确。
- **数据噪声旁观**：ja `tanaka` 首条 chinese="我念歌词呆呆的"=维基来源的垃圾词条，非功能 bug，待清（低优先）。

## 2026-06-22 SEO 审计补缺口（technical/sitemap 代理未回传，自查补上）+ 第二批代码项
- **technical/sitemap 两代理连续两次不回传最终报告**（做了 20+ 工具调用但 output 只有 agentId）→ 改自己 curl 直查。
- **内链/孤儿页直查结论**：① /ru/names hub 链全部 1927 ru 页（不算孤儿），但 ru 叶子页**0 互链**=单 hub 星形拓扑、链权稀释；② /names-in-chinese hub 仅链 124/172 英文名页，但叶子各互链 7 兄弟有横向网兜底，不算严重。
- **修（已上线）**：ru/name/[slug] 加「其他俄语姓氏」8 个相邻姓氏 chip 内链（星形→网状，putin 在首位故 4 个）。
- **第二批小项（已上线）**：5 编辑页 Article 加 `isBasedOn` 新华社姓名译名手册（权威链，合红线）。
- **故意没做（理由记 decisions）**：/[name] "惯用 vs 音译"语境句（无逐名数据→只会加同款 boilerplate 稀释）；sitemap 真实 lastmod（无逐页编辑日期，构建时戳本是标准）。
- **sitemap 自评**：2100 URL 单文件（<50k 限）技术上 OK；已做的 ru 降权 0.5→0.3 已取得大部分"让爬取预算先吃编辑页"效果，暂不必拆分/移除 ru。CWV：静态页 SSG 应 OK，待 GSC/CrUX 实测。
- **结论**：SEO 审计该做的代码项已全部清完；剩**外链(P0)+ CF 解封 AI 爬虫**两块=用户活，已入 todo。

## 2026-06-21 SEO 审计（claude-seo skill）+ 代码项落地
- 用户装了 claude-seo skill，并行跑 5 个 SEO 子代理（technical/content/sitemap/backlinks/geo），3 个出完整报告。
- **根因三代理一致**：2123"已发现未索引" = **零外链(0 引荐域,28天新域) × 2000+ 薄程序化页**叠加；主闸门=外链。技术面干净(canonical/sitemap OK)。详见 decisions.md。
- **新发现**：域名 2021-2025 曾是 parked/挂广告域(2026 重注册)，带一丝历史薄内容信号；影响小。
- **我做的代码项（已上线）**：① `public/llms.txt`(AI 可读站点索引)；② 5 编辑页 Article schema 补 datePublished/dateModified；③ /[name]-in-chinese 加按字拆解卡(库内 zh+pinyin,字↔音,唯一内容增厚)；④ sitemap ru 大队 priority 0.5→0.3；⑤ 根 layout Organization schema。build+线上验证齐。
- **不做**：ru 页引擎逐音节拆解(近似恐撞官方译名)；ru 剪枝(守 6-18 决策)；naming-rules 标题改问句(编辑语气决定，缓)。
- **待用户手动**：① CF 后台关 "Block AI Scrapers"(解封 GPTBot/ClaudeBot/Google-Extended，留 CCBot/Bytespider)；② **P0 真 dofollow 外链**(台师大/中大/NUS 翻译系资源页 cold email、维基外部链接、PTT/译者社团)——审计给了详细名单，我可拟稿。
- **falsifiable**：首条 dofollow 后 14 天看 GSC"已发现未索引"是否下降。

## 2026-06-21 AdSense 申请启动 + 过审就绪
- **决策**：开始申请 AdSense（用户拍板，虽零流量收入=0，但审核要时间，先跑管线）。账号申请=用户手动（建账号/接受条款/填资料，Claude 不能代做）。
- **接入现状**：layout.tsx 脚手架早就绪——Consent Mode v2（默认拒绝广告 cookie，横幅同意才放开）+ AdSense loader 脚本，门控 `NEXT_PUBLIC_ADSENSE_ID` env（未设→当前不加载）。全站无 `<ins>` 广告位（批准后再放）。
- **过审就绪修复**：补 /contact 联系页（双语，contact@nametochinese.com）——AdSense 小站常见拒因=缺联系方式；footer(SiteFooter+首页)+sitemap 加链。已上线（HTTP 200）。
- **Cloudflare Email Routing：早已配好（2026-06-21 截图确认 Active）**——contact@nametochinese.com → terrafluxstudio@gmail.com 真能收信。曾误让用户重配（基建配置没存档导致）→ 已建 `SERVICES.md` 存所有服务/技术设置。
- **AdSense 账户已建（2026-06-21，浏览器代驾完成注册到拿码）**：Publisher ID `ca-pub-6366109058219274`，收款国家=新加坡（终身）。已设 Vercel env `NEXT_PUBLIC_ADSENSE_ID` + 部署，线上 HTML 已含验证脚本（curl ✓）。详见 SERVICES.md。
- **所有权验证通过 + 已申请审核（2026-06-21，浏览器代驾全程）**：⚠️ code 段验证法秒失败（部署传播时序→Google 缓存 fail+冷却），**改 ads.txt 法一次过**（public/ads.txt）。验证后点「申请审核」已提交，状态「正在准备」，等结果（几天~2周，邮件）。
- **CMP（欧盟同意）暂缓**：点了「稍后再提醒我」——受众非欧盟不急 + 会与自制 CookieConsent 横幅双弹窗冲突，待统一规划。详见 SERVICES.md。
- **收款人信息已填（2026-06-21）**：个人账户 Na Yang + 新加坡地址。⚠️坑：误入 Google 账号通用「钱包和订阅」(花钱页)，正确入口是 AdSense 收款卡→/onboarding/payments「客户信息」(只填姓名地址，非绑卡)。**AdSense 全程不向 Google 付款。**
- **✅ AdSense 申请所有步骤 100% 完成（2026-06-21）**，面板"已完成所有步骤"。等审核邮件（几天~2周）。批准后：放 `<ins>` 广告位（优先编辑型内容页）+ 理顺 CMP/Cookie 横幅。
- **过审风险记着**：2000+ 程序化模板页可能被判 low value/scaled content；广告位优先放编辑型内容页（总则/4专题/naming-rules），别堆薄模板页。

## 2026-06-21 搜索提速：API 函数区域钉东京
- **背景**：用户从大陆回来实测——站能开但加载有时慢。原假设"程序化页每请求 SSR 查库→改 ISR"，**查代码发现错了**：内容页早就是构建期静态生成（本地数据，不查库）。
- **真因 = 函数区域错配**：Turso 在东京，API 函数却跑账号默认区 iad1(美东)，大陆用户搜一次绕太平洋一圈。
- **修复**：新建 `vercel.json` `{"regions":["hnd1"]}` 钉东京（Hobby 免费版只认项目级单区；路由级 preferredRegion 被忽略，弃用）。
- **验证（线上）**：x-vercel-id `sin1::iad1`→`sin1::hnd1`；/api/ping dbMs **815→62(冷)/6-7(暖)**，函数↔库往返降 ~20 倍。已 `vercel --prod`。
- **未解（认了）**：打开页面慢=无 ICP→无大陆 CDN 节点，地理性，非 ICP 不可解。2123 页不被索引≠速度，是域权重+程序化页同质，归外链/差异化。

## 2026-06-20 外链分发首日（浏览器代操作，明细见 distribution_playbook.md）
- **策略定调**：先外链后 AdSense（零流量下挂广告=赚$0，外链才是解锁流量的唯一杠杆）。社区平台（SE/ProZ/Reddit）新号直接挂链=被当广告，统一走"先纯帮忙养号→有信誉再带链"的 B 路线。GitHub awesome-list 路线**放弃**（本细分无活跃可合目标，且 GitHub 给 README 外链加 nofollow）。
- **Stack Exchange（chinese.SE，账号 Nancy/Google 登录）**：发 2 条优质答案（**无链接，养号**）——Q6339 译音用字集（纠正"无官方表"错误说法）、Q40718 Cambridge 康桥→剑桥（补时间线+日语剣说）。待养号有票后回 Q6339 加 nametochinese.com 链（草稿存 playbook）。
- **ProZ.com（账号 yayuyu/Na Yang，免费）**：建号+配 profile（EN⇄ZH·Linguistics·tagline），**bio 公开提到 nametochinese.com**。KudoZ/论坛带链同走养号节奏。
- **LinkedIn（真实账号 Na Yang，"Bilingual Chinese Language Specialist"）**：定位契合（发译名文章=外链+求职 thought-leadership 双赢）。文章《How Foreign Names Become Chinese》整篇填好+草稿存，链接已自动转蓝，**待用户点 Publish 发布**。
- **AlternativeTo**：周末暂停提交，已 `/schedule` 周一(6/22 09:00)提醒+协助提交（草稿存任务里）。
- **Medium 长文**已整篇写好存 `memory/draft_medium_transliteration.md`，待用户有 Medium 账号再发。
- 全程守红线：对外只提"新华社译名室/译音表"标准，未点名版权辞典。
- **状态**：今天打地基（2 个高权重平台真实账号+内容 presence、1 篇 LinkedIn 待发、1 篇 Medium 备好、周一提醒）。**纯 dofollow 外链尚未正式生成**（B 路线主动延后），非无进展。

## 2026-06-18（续）AdSense 前内容审查 + 红线修复
- **审查结论**：全站 96% 是程序化页（1927 俄名人 + 122 名 + 47 词 = 2096/2179）。俄名人页 1802/1927（93%）只挂 1 个人 = 模板薄页，是 AdSense「scaled/low-value」+ SEO「已发现未编入」的主体。俄页数据源 Wikidata(CC0) 无版权问题。
- **剪枝方案取消（数据否决）**：查 `topSitelinks` 分布，单人页知名度下限 **≥20**（最低桶 20-29，无更低），即每页那人都在 20+ 语言维基有词条 = 建库时已按知名度筛过。**不存在可剪的垃圾尾巴**，剪只会误杀普京(310)/列宁(294)这类合法页。→ 决定不剪。这些页模板薄但是真实知名人物参考资料，AdSense 风险低于先前估计；靠编辑型内容（总则/4专题/36语种/辞典）撑整站质量。
- **红线修复（已部署）**：发现 `data/transliteration/*.json` 的 `raw_note` 点名《世界人名翻译大辞典》/新华社/商务印书馆/ISBN，且**被渲染到 /convert「参考来源」区**（[app/convert/page.tsx]）。修复：① 删掉 refLines 渲染块；② 加 `CITATION_RE` 关键词过滤（含书名号/ISBN/大辞典/新华/译名室/商务/词典等），客户端两个过滤器（extractKeyRules + ruleLines）都剔除；③ **服务端 /api/lang-table 也 stripCitations**，客户端永远收不到辞典名（不只是不显示）。验证：德/俄/阿/意/捷 5 语种 API 响应均无残留 ✓。transliterate API 不返回 raw_note，干净。
- 注：保留「来源：Wikipedia 外语译音表」这一安全署名；naming-rules/ru 页引「新华社规范/手册」属允许的标准引用，未动。

## 2026-06-18 诊断零流量 + 英文支柱长文（pillar）
- **零流量诊断**：域名 2026-05-24 注册，仅 ~3-4 周龄。GSC「网页未编入索引」：**已发现未编入 2123 页**（Google 知道但不给爬取预算）、已抓取未编入 1、404 21、备用页 1。结论：**不是技术故障，是新站零权重零外链**——SEO 冷启动。21 个 404 经核查为 v2 重构前历史 URL（当前 sitemap 2151 URL 全 200、内链无指死），返回 404 本身正确，等用户从 GSC 导出清单再判断要不要 301。
- **战略转向**：停「继续铺薄程序化页」（只会让 2123 更大）。改两手——① 外链+分发（明天人工做，清单见 `memory/distribution_playbook.md`）；② 今日：写可链接的英文支柱长文。
- **新建英文支柱页** `/how-to-write-your-name-in-chinese`（~1800 字正文，SSG）：讲外文名如何音译成中文（按音不按义/音节映射/标准化/选字/音译 vs 真中文名/常见误区）+ 5 条 FAQ。含 Article+FAQPage+Breadcrumb JSON-LD。**作用**：① 凭质量自己被收录；② 明天英文渠道(r/translator·Chinese SE·awesome-list)的外链靶子；③ 内链下沉 6 个示例名字页(david/emma/michael/sophia/james/anna，已核对 zh 与数据一致)+names hub+/convert+/name-to-pinyin，给薄长尾簇传权重助抓取。
- **接线**：sitemap 加该页(priority 0.8)；names-in-chinese hub 顶部反链「Read how names are written in Chinese →」。words hub 主题不同未加。build ✓ 静态、`vercel --prod` ✓、线上 200、sitemap 已含。
- **PM 结论留档**：代码侧能做的基本做完，瓶颈在外链/分发（人工），非代码。继续加程序化页边际收益≈0。

### 内容重心改判：英文消费向 → 中文译者向（护城河·好打）
- **用户质疑**："站主要对中文译者，写英文有用吗？" 复盘确认：站其实是两个产品——A中文译者向（核心/护城河：67万辞典+gov-titles+naming-rules，搜中文、竞争低、好排名、变现弱）vs B英文消费向（长尾簇 emma-in-chinese，搜英文、竞争惨烈、能 Printful/AdSense 变现）。今天的英文支柱页服务 B（不撤，成本低且撑已有簇）。**用户拍板：内容重心转 A**。
- **关键发现**：naming-rules **已覆盖 36 语种**（CLAUDE.md 写的"13篇"过期），主流语言全齐 → 再加语种已饱和。真缺口=**无"通用音译总则"**（压在 36 篇之上的中文支柱页）。
- **新建中文支柱** `/naming-rules/general`「外文人名音译总则」(~5800 汉字)：三大原则(名从主人/约定俗成/音似为主)+音译操作+用字规范+间隔号「·」+姓名顺序+头衔前缀+查证流程+5 FAQ。瞄准高频泛查询"外国人名怎么翻译成中文/人名音译规则/译名规范"。
- **实现**：复用 [lang] 模板（content.ts 加 `general` DeepArticle，lang='外文'）→ 自动进 sitemap + **36 语种页底部"其他语言"导航自动反链**(36 条内链，spanish 验证 ✓) + 继承 Article/FAQPage/Breadcrumb 结构化数据。/naming-rules 索引页顶部加醒目「先读：总则」入口卡。build ✓、`vercel --prod` ✓、线上 200、5759 汉字完整。
- 红线遵守：未点名版权辞典，只在教育语境引"新华社译名规范"(与既有文章一致)。

### 中文译者向 3 篇翻译专题（独立支柱页，已部署）
- 为什么独立页不复用 [lang] 模板：模板 CTA 写死"查 X 人名"，机构/地名套不上，且工具落点不同(/gov-titles ÷ /places ÷ /convert)。各页含 Article+FAQPage+Breadcrumb JSON-LD。
- **`/gov-titles-guide`「机构与职位名称翻译规范」**(~3600 汉字)：机构名以意译为主(与人名相反)、先查官方名、专名+通名对应、缩写简称、President/Secretary/Minister/Chancellor 按机构国别定词。事实核实：UNESCO 官方全称「联合国教育、科学及文化组织」(web 核实 ✓)。CTA→/gov-titles。
- **`/place-names-guide`「外国地名翻译规则」**(~3334 汉字)：与人名四点不同——专名+通名(通名意译)、仿译多、旧译多、派生国名。事实核实：牛津=牛(ox)+津(ford渡口雅称津) 逐词仿译、剑桥=剑(Cam音译)+桥(bridge意译) 半音半意(web 核实 ✓)；旧金山=约定俗成俗称(淘金)正式音译圣弗朗西斯科。CTA→/places。
- **`/transliteration-characters-guide`「音译用字怎么选」**(~3450 汉字)：同音字为何要选、性别用字(女娜丽莉娅/男德克夫尔)、固定译音用字表保一致、避生僻贬义字、音准优先字义为辅。CTA→/convert。
- 接线：3 页全进 sitemap(priority 0.7)；/naming-rules 索引页加「翻译专题」入口行；三篇互相 cross-link 且都链回 /naming-rules/general 总则；工具页反链 gov-titles ✓ places ✓ convert(客户端组件,JS 渲染可见)。build ✓ 2179 页、`vercel --prod` ✓、三页线上 200。
- 至此中文译者向支柱内容成体系：总则(general) + 3 专题(gov/place/用字)，压在 36 语种页 + gov-titles 562 条 + /convert 引擎之上。

## 2026-06-07 仓库治理：iCloud 损坏善后 + git filter-repo 清历史
- **背景**：项目已迁出 iCloud → `~/Desktop/nametochinese.nosync/`（`.nosync` 后缀被 iCloud 排除同步；Desktop 软链接 `~/Desktop/nametochinese` 指向它）。早前 iCloud 导致 git object 损坏，已有 `Recover repo state after iCloud object corruption (squash)` 恢复提交。
- **检查结论**：当前 HEAD 36 提交血缘完整（638 对象齐全），损坏只残留在恢复前的悬空提交里；fsck 的 broken link 全是那些悬空对象，不影响主线。**历史无任何密钥**（无 .env/.pem/.key，仅 names.db-shm/-wal 垃圾）。真正臃肿=被跟踪的大文件。
- **执行 filter-repo**：用 `~/Library/Python/3.9/bin/git-filter-repo`（pip --user 装），`--invert-paths --path tasks/ --path Logo/`，从全部历史移除 `tasks/`（task 规格 + 源数据 CSV/XLSX/PDF）与 `Logo/`（源图）。两者加进 .gitignore，本地磁盘副本保留（含 names.db 62MB）。
- **结果**：.git **56M → 11M**；commit 数仍 36（结构保留）；fsck 干净无 broken/missing；force-push origin/main（`9306c06→6ebbfb1`），remote==local。备份在 `~/Desktop/ntc-backup-20260607-000235/`（git-dir.tar.gz + tasks/ + Logo/）。public/、app/favicon 等线上资产未动。

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

## 2026-06-07：程序化 SEO 俄语名人页（MVP 上线，等数据验证）
- **目标**：冲 AdSense 流量。"同名聚合页"——搜俄文名→显示同名名人→点进独立页（用户原始设想 + SEO 资产合一）
- **数据**：scripts/fetch_russian_celebrities.py 从 Wikidata（CC0 无版权）抓俄/苏/帝俄籍名人，筛"有中文维基条目"=知名度+搜索量。被限流中断在 **2159 人**（已是最知名一批，sitelinks 24-310）。data/russian/celebrities.json。后续可等限流恢复补抓低知名度尾部
- **加工**：scripts/build_ru_celebrity_pages.mjs → t2s 统一 + 按中文姓聚合 + 3级简介(中文desc/英文译/生卒兜底，兜底仅4.4%) + 拉丁slug + 皇室过滤。出 data/russian/celebrity_groups.json（**1927 姓页**，125 多人姓）
- **页面**：/ru/name/[slug]（SSG，拉丁 URL 如 /ru/name/putin·tolstoy·lavrov）H1 三语(中/俄/拉) + 同名名人卡片(简介+wiki) + ItemList/Person JSON-LD。lib/ruCelebrities.ts
- **URL 决策**：拉丁转写（非中文非俄文）——搜的人手里是外文名 Lavrov 不是中文。lib/cyrillicToLatin.ts（putin/tolstoy 等约定俗成拼写）
- **入口/内链**（解决孤儿页）：/ru/names 索引 hub（最知名60+按俄文字母分组全列）；/ru 页入口按钮；名人页返回链接；搜索结果卡片可点击→独立页（/api/ru-celebrity-search，数据与独立页一致）
- **坑/教训**：① 拉夫罗夫 ruSurname 被"姓,名 父称"逗号格式污染成父称→slug错(已修，组取最高知名度人的姓) ② -ович/-евич 是波兰/乌克兰/犹太真姓(肖斯塔科维奇/密茨凯维奇)，差点当父称误删，**先check数据救了一命** ③ 皇室无现代姓，ROYAL 正则过滤(含"女皇")
- **GSC**：sitemap.xml 提交成功 1980 URL（含1927名人页）。⚠️ 用户误把催收录URL当sitemap提交导致"是HTML"错误，已澄清(那些不是sitemap，删掉；真sitemap.xml成功)
- **下一步**：等 1 个月 GSC「已编入索引」+「成效→查询」数据验证模板有效性。有效→补抓全量+扩韩日；无效→止损不扩量
- ⚠️ **iCloud 仍在损坏 .git**：.nosync 后缀没生效，每次提交常需重建 blob 抢救。已 filter-repo 清掉 names.db 历史(GitHub 干净)。根因未除，用户在想办法

## 2026-06-07（续）：长尾页 P1 上线 + 根目录整理
- **根目录整理**（commit a632261）：删杂物(TASK_14_results/build-*.txt/8 截图/重复 homepage_v2_plan.md/废 .env.local.fresh)；CLAUDE.md Web 路径 ~/Desktop→~/Projects；纳入 LONGTAIL_SEO_PLAN.md
- **长尾页 P1：英文名→中文**（commit 45f5f4e，已部署上线验证）。LONGTAIL programmatic SEO 第一簇。
  - **撞版权红线 → 拍板"规则音译+精选"**（见 memory/longtail-namepage-copyright-line.md + decisions.md）：不 dump persons 67万辞典；中文译名=自选高频教名+规则音译/约定俗成标准写法(单条客观读音事实)；规模封顶几百精选；对外不点名辞典
  - 产出：data/english_names.json(**53 高频教名**) + lib/englishNames.ts(slug+pinyin-pro拼音+同源内链) + app/[slug]/page.tsx(SSG,英文界面,H1+中文+拼音+念法+词源含义+CTA+FAQ JSON-LD) + app/names-in-chinese(索引 hub 防孤儿) + sitemap 接入
  - URL：`/[name]-in-chinese`(如 /emma-in-chinese)，根级 [slug] 动态段 dynamicParams=false，suffix 校验。既有静态路由不受影响
  - 线上验证：3 页 curl 200、内容正常、sitemap 1980→**2034**(+53 名人页+1 hub)
  - **下一步**：等 GSC 收录+点击数据(和俄语名人页并行验证)。有效→扩到 ~300 名(data 加条目即可，机制现成)再考虑 P2 常用词/短语簇；无效→止损
- ⚠️ 本次本地 `npm run build` **居然成功了**（node_modules 15:01 重装后干净？），53 页 + 1927 俄页全 SSG 出，与之前"libsql 坏装"记录不同——环境可能已修复

## 2026-06-07（续2）：长尾 P1 扩量 + gov-titles 补缺 + 长尾 P2 上线
- **P1 英文名扩量**：english_names.json 53→**122**（commit 2017e52），人工核标准译名+词源。sitemap→2103
- **gov-titles 补缺**（555→**562**，commit 16c5a08）：补 ITU/UPU/UNWTO/WCO/ISO/IEA/BIS。⚠️教训：grep 用 `\|`(BRE)配`-E`(ERE)把19个已收录组织误报"缺"，人工抽查发现UNICEF明明在却标缺才揪出，重查锁定真缺只7个（原则1救场）
- **/convert 地名分表核结关闭**：transliterate按type选place表已正确实现(lib/transliterate.ts:556)，9语言place表全接通；但place表与person表内容≈相同（俄语21行仅3行差且只是全半角括号），真差异化需官方《地名译音表》源（wiki外不可得），无可安全补
- **P2 单个含义词→中文上线**（47词，commit c55327e）：用户选"单个含义词"（爱/龙/力量…纹身取名搜索量最大）。data/english_words.json自选高搜索词+自写厚释义，译文=事实不dump词典。复用/[slug]路由派发（撞人名则人名优先去重），新建components/WordInChinese.tsx + /words-in-chinese hub + names↔words互链。本地build 171个-in-chinese页(122名+47词+2hub)全SSG
- 累计长尾资产：122 英文名页 + 47 含义词页 + 1927 俄名人页
