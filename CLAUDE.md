@AGENTS.md

# nametochinese — 项目协作准则

> Caveman 模式全程：极简直接，无废话。禁止"当然可以"、"好的"、总结"我做了什么"。
> 代码改动一律写给 Cursor 跑，不自己执行。
> **思考质量原则：** 1) 动机不清先停，不输出方案先问；2) 路径不是最短时直接说并给更好的办法；3) 追根因不打补丁；4) 只说改变决策的信息，其余砍掉。
> **已知易错行为：** 星期几不自己推算（用cal或问用户）；看网页视觉必须用截图工具，WebFetch只抓文字。

---

## 一、项目速读

| 项目 | nametochinese.com 翻译工作者人名工具站 |
|------|--------------|
| Web路径 | `~/Desktop/nametochinese/` |
| 数据/任务路径 | `~/Desktop/nametochinese/tasks/` |
| 域名 | nametochinese.com |
| 目的 | 英文名↔中文名查询，供翻译工作者使用 |
| 阶段 | 🔵 建设中（Cursor跑任务） |

---

## 二、平台与服务

| 服务 | 用途 | 备注 |
|------|------|------|
| **Vercel** | 部署托管 | 与其他项目同账号 |
| **Cloudflare** | DNS解析 | nametochinese.com 域名 |
| **Turso** | 云端SQLite数据库 | 存放names.db（62MB，85万条） |
| **Upstash** | Rate limiting用Redis | 每IP每分钟60次限制 |

详细服务配置见 `SERVICES.md`（按需调用）

---

## 三、数据概况

| 数据 | 条数 | 文件 |
|------|------|------|
| 人名 | 676,671条 | clean_names.csv → Turso persons表 |
| 地名 | 177,286条 | clean_places.csv → Turso places表 |
| 数据库 | names.db（62MB）| 已建索引，直接import到Turso |

数据来源：人名翻译.xlsx + 地名翻译.xlsx

---

## 四、当前进程

**已完成：**
- [x] 数据清洗 → names.db（SQLite，含索引）
- [x] 域名购买：nametochinese.com
- [x] 技术架构确定：Next.js 15 + Turso + Vercel
- [x] Vercel部署上线：https://nametochinese.vercel.app
- [x] DNS已添加到Vercel（待Cloudflare配置生效）
- [x] API测试通过：/api/search?q=Adams → 亚当斯

**进行中：**
- [ ] TASK_05 Rate limiting（Upstash）

**待做：**
- [ ] DNS生效确认（A记录 76.76.21.21）
- [ ] UI深化（色调、字体、移动端）
- [ ] 接入八字起名站

---

## 五、DNS配置记录

域名注册商NS：dns1.cldy.com / dns2.cldy.com

| 类型 | 主机名 | 值 |
|------|--------|-----|
| A | @ | 76.76.21.21 |
| A | www | 76.76.21.21 |

---

## 六、Cursor任务文件

存放在 `tasks/` 目录：

| 文件 | 状态 | 说明 |
|------|------|------|
| TASK_01_init.md | ✅ 完成 | 项目初始化 |
| TASK_02_db.md | ✅ 完成 | Turso + API |
| TASK_03_ui.md | ✅ 完成 | 首页UI |
| TASK_04_deploy.md | ✅ 完成 | Vercel部署 |
| TASK_05_rate_limit.md | 🔵 待跑 | Upstash限速 |

---

## 七、自动化（每次session启动即执行）

```
CronCreate: cron="17 */5 * * *", prompt="/compact", recurring=true
CronCreate: cron="23 10 * * 1", prompt="/anthropic-skills:consolidate-memory", recurring=true
```

---

## 八、核心原则

| # | 原则 | 执行 |
|---|------|------|
| 1 | 能给Cursor的给Cursor | 所有代码写任务文件让Cursor跑 |
| 2 | 数据准确性第一 | 不盲信脚本，关键结果人工抽查 |
| 3 | 节省Token | 不重读已读文件，结论直接给 |
| 4 | CLAUDE.md随时更新 | 进程有变立刻写入 |
