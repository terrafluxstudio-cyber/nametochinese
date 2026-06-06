# 首页布局 v2 重构 —— 完整计划

> 2026-06-05 讨论拍板。**compact 后接续 = 读本文件 + decisions.md「信息架构 v2」**。改首页/导航/搜索前必读。

## 目标
折回用户使用场景，重新布局首页呈现结构。核心用户 = 翻译工作者（全球非大陆）。

---

## 一、最终方案（已拍板）

### URL 模型 —— 四 tab 平级，各自独立页，点谁都软跳转，行为一致
- **查询**（综合 persons 67万）→ `/en`（保留现有，**不重定向**，SEO 不动）
- **俄** → `/ru`、**韩** → `/ko`、**日** → `/ja`
- 将来扩：阿/越/德/法 各加 1 tab + 1 表 + 1 search API（增量，不动主框架）
- **软跳转** = Next `router.push`，URL 变但不整页刷新（= 保 SEO 独立 URL + 体验顺）
- ⚠️ 易混点（用户问过）：综合查询页 = `/en`，**不是**首页 `/`。点"查询"tab 会软跳转到 `/en`，四 tab 一致，不存在"按查询不跳转"

### 首页 `/` = 门户（不属于任何 tab）
```
首页 / =  [搜索框 + 右侧默认tab「查询」+ 下方语言tab 俄/韩/日]   ← 输入进/en；点语言tab跳对应页
          [卡片区 5张纯链接跳转]
          [页脚]
```
- 卡片区5张：地名`/places` · 机构`/gov-titles` · 拼音找名`/pinyin` · 简繁`/zh-convert` · **姓名转拼音(新页)**

### 搜索区设计细节
- 默认 tab 名「**查询**」（不叫"翻译"，避免和音译混），放搜索框**右侧**、选中态，**无下拉箭头**（不是下拉容器，是默认选中的 tab）
- 语言 tab（俄/韩/日）放搜索框**下方**一排
- 综合查询**限量+精确优先**（防 67万前缀 `${q}%` 刷屏 = 老红线根因）。Step0 已设 type=person limit=16

### 技术实现原则 —— 关键：不强行收口各库内部
- 4 库结果结构差异大：persons(国别/释义注)、俄(**父名 patronymic_ru/zh、昵称 nicknames**)、韩(罗马字 english/谚文 korean)、日(罗马字 romaji/假名 japanese)
- **不合并内部展示**（合并就丢了俄父名、韩日罗马字这些有用信息）
- 做法：新建 `components/SearchTabs.tsx`（只统一 tab条 + 软跳转），插入各页；**各 client 内部逻辑/卡片渲染保留不动**
- 各 search API 不动（search / search-ru / search-ko / search-ja-person，字段见 decisions.md）

---

## 二、红线 / 讨论要点（不要忘）
1. ❌ 统一主搜合并所有库 + 自动识别 = **已两次否决**。德法等拉丁语言字母相同，自动识别必乱。解法是 tab 显式预筛，不是合并
2. ❌ persons 67万前缀 `${q}%` = 刷屏根因。综合 tab 必须限量+精确优先
3. 地名必须从 persons 剥离（Step0 已做）。地名独立走 /places
4. persons 已含法8.2万/德4.6万/西2.9万词条（按 nationality 分）；俄韩日是另抓的 zh.wiki **名人全名**库（persons 覆盖不了真名人全名如普京/文在寅）。→ 将来单独扩库的价值在 persons 覆盖不好的**非拉丁名人**（阿/泰/希伯来），不是德法
5. 场景3 中文→外文：**只做汉语拼音**（国标唯一确定）；**不做威妥玛/粤拼**（无单一标准、人名约定俗成+家族沿袭、自动转必错、做了反害）。价值=生僻字读音+姓氏多音(单/仇/解/查)，面向老外英文界面
6. 软跳转保留各语言独立 URL = SEO 关键（"俄语人名翻译"长尾），不可做成纯 SPA 一个 URL
7. 两张拼音卡命名区分方向：拼音找名(/pinyin,拼音→中文)；姓名转拼音(新页,中文→拼音)

---

## 三、分步执行计划（每步怎么做 + SEO + 验证）

### Step 0 ✅ 已完成（2026-06-05 上线）
/en 地名剥离：type=all→type=person、去地名区、文案纯人名。验证只返回 person。

### Step 1：统一 tab 条 + 软跳转（核心）
**做什么**
- 新建 `components/SearchTabs.tsx`：props `current` ('all'|'ru'|'ko'|'ja')；右侧「查询」默认 + 下方 俄/韩/日；点击 `router.push`（查询→/en, 俄→/ru, 韩→/ko, 日→/ja）；current 高亮
- 插入 /en /ru /ko /ja 各页搜索框区
- 统一各页搜索框视觉（一致样式）
- **各 client 内部逻辑/卡片渲染不动**
**SEO（随手做）**
- 核对四页 metadata（/en /ru /ko /ja layout 已有 title/desc/keywords/canonical），确认长尾词不雷同；补页间内链
**验证**：四页 tab 软跳转、高亮对、各库结果正常、不混排

### Step 2：首页重排
**做什么**
- 首页 / = SearchTabs(默认查询,输入跳 /en) + 卡片区5张 + 页脚
- 改造 HomeSearch / 新建首页搜索区（含 SearchTabs）
- 卡片区5张：地名/机构/拼音找名/简繁/姓名转拼音
**SEO**：首页 title/desc 补"人名翻译/译名查询"长尾；卡片=内链
**验证**：首页布局、卡片跳转、搜索框进 /en

### Step 3：导航对齐
**做什么**
- NavBar 跟新结构对齐
- "中文名转外文"占位(naming-rules/sinosphere) → 换成新拼音页链接
**验证**：导航与首页一致

### Step 4：中文名转拼音新页（场景3）
**做什么**
- 装 `pinyin-pro` 依赖
- 新建页（slug 待定，**别和 /pinyin 撞**，建议 /name-to-pinyin 或 /pinyin-of-name）
- 功能：输中文名→出汉语拼音；**姓氏多音走 surname 模式**；生僻字覆盖
- **英文界面**（面向老外）+ 英文使用说明
**SEO**：中英长尾 metadata（"中文名转拼音"/"Chinese name to pinyin"/"name pinyin converter"）
**入口**：首页卡片「姓名转拼音」+ sitemap 收录
**验证**：常见名、生僻字、多音姓(单 Shàn/仇 Qiú/解 Xiè/查 Zhā)

### Step 5：SEO 收尾
- sitemap 加新页；页间内链补强
- ⚠️ GSC 提交更新 sitemap（**用户手动**，Claude 做不了）

### （并行可后做）音译模块剩余
地名音译分表、wiki译音表补全核新、选国家防误用引导 —— 详见 todos「音译引擎重构」段，独立于布局，可后做。

---

## 四、SEO 总盘
- ✅ 已上线：gov-titles DefinedTermSet+384 DefinedTerm；/places canonical+keywords；音译简繁修+缺音标记
- Step1-4 随手带：各 tab 页/首页/新页 metadata + 内链
- ⚠️ 用户手动：GSC 提交更新 sitemap
- **大杠杆待决策**：程序化 SEO（85万人名地名详情页 /name/[slug] /place/[slug]），等布局版式定后单独聊（详见 todos「SEO」B 段）。⚠️ 不可全量铺 persons 薄页，先高价值子集

---

## 五、Cursor 任务考量结论
**不写 Cursor 任务，Claude 自己连续做。** 理由：本次核心是布局重构（Step1-4），强依赖前面冗长讨论的上下文（红线、为何这样设计、各库结构差异、用户踩过的坑），Cursor 拿任务文件缺这些 nuance，易做偏方向。Claude 保上下文连贯做最优。唯一勉强可拆的"wiki译音表补全"也需准确性人工把关、收益小，不值得拆。
