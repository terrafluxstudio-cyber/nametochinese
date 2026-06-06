@AGENTS.md

# nametochinese — 项目协作准则

> Caveman 模式全程：极简直接，无废话。禁止"当然可以"、"好的"、总结"我做了什么"。
> **代码直接改**：Claude 直接改源码，改完 `npm run build` 验证，`vercel --prod` 部署。不写 Cursor task。
> **进程记录（完成即记）：** `vercel --prod` 成功 → 立刻更新 `memory/progress_log.md`；`git commit` 后 → 划掉 `memory/project_pending_todos.md` 已完成项。
> **思考质量：** 1) 动机不清先停，先问再做；2) 路径非最短直接说并给更好办法；3) 追根因不打补丁；4) 只说改变决策的信息。
> **改首页/导航/搜索前必读 `memory/decisions.md`**（有红线，勿重复踩坑）。
> **已知易错：** 星期几用 cal 或问用户（不自己推算）；看网页视觉用截图工具（WebFetch 只抓文字）。

---

## 一、项目速读

| | |
|------|--------------|
| 项目 | nametochinese.com 翻译工作者人名工具站 |
| Web 路径 | `~/Desktop/nametochinese/` |
| 域名 | nametochinese.com（已上线） |
| 目的 | 外文人名/地名 ↔ 中文，供翻译工作者使用 |
| 阶段 | 🔵 建设中 |
| 目标用户 | 全球非大陆（无 ICP，大陆不可访问） |

---

## 二、平台与服务

| 服务 | 用途 | 备注 |
|------|------|------|
| **Vercel** | 部署托管 | Fluid Compute（Node.js） |
| **Cloudflare** | DNS + 橙云代理 | NS: aitana/earl.ns.cloudflare.com |
| **Turso** | 云端 SQLite | names.db，位于 Tokyo（aws-ap-northeast-1） |
| **cron-job.org** | 每5分钟 ping /api/ping 保活 | 防 Turso free tier 暂停 |

详细服务配置见 `SERVICES.md`（按需调用）。限速：纯内存 Map（60次/分/IP）。GA：G-SX777JZ4D3。

---

## 三、数据概况

| 数据 | 条数 | 表 |
|------|------|------|
| 人名（音译辞典） | 676,671 | persons（《世界人名翻译大辞典》词条，nationality 覆盖各语言） |
| 地名 | 177,286 | places |
| 名人库 | 俄5362/韩7262/日~10448 | russian/korean/japanese_names（zh.wiki BFS） |

---

## 四、当前状态

已上线，核心功能齐：主搜 /en（已剥离地名，纯人名）、/ru /ko /ja /places、/convert 音译引擎、/naming-rules（13 篇）、/gov-titles（机构职位384条）、/pinyin /zh-convert、/name-to-pinyin（中文名转拼音，英文界面）。

🟢 **首页布局 v2 重构已全部完成（2026-06-05，Step0-5 全上线）**：SearchTabs 一框+tab 软跳转(查询/en·俄/ru·韩/ko·日/ja)、首页门户+5卡片、场景3 /name-to-pinyin 中文名转拼音页(pinyin-pro,多音姓+生僻字)、NavBar 对齐、sitemap+内链。待用户手动：GSC 提交 sitemap。

- **首页 v2 重构计划（已完成存档）→ `memory/homepage_v2_plan.md`**
- 进度明细 → `memory/progress_log.md`
- 待做清单 → `memory/project_pending_todos.md`
- 设计决策与红线 → `memory/decisions.md`

---

## 五、DNS 配置

NS（Cloudflare）：aitana.ns.cloudflare.com / earl.ns.cloudflare.com

| 类型 | 主机名 | 值 | 代理 |
|------|--------|-----|------|
| A | @ | 76.76.21.21 | 橙云 ✓ |
| CNAME | www | nametochinese.com | 橙云 ✓ |

---

## 六、自动化（每次 session 启动即执行）

```
CronCreate: cron="17 */5 * * *", prompt="/compact", recurring=true
CronCreate: cron="23 10 * * 1", prompt="/anthropic-skills:consolidate-memory", recurring=true
```

---

## 七、核心原则

| # | 原则 |
|---|------|
| 1 | 数据准确性第一：不盲信脚本，关键结果人工抽查 |
| 2 | 节省 Token：不重读已读文件，结论直接给 |
| 3 | memory 随时更新：进程有变立刻写入对应 memory 文件 |
| 4 | 改动前先读 decisions.md，避免重复推翻已定论 |
