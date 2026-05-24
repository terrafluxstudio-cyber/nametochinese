# nametochinese.com — 第三方服务档案

> 本文件只在需要查服务配置时调用，不纳入日常上下文。

---

## 域名

| 项目 | 值 |
|------|-----|
| 域名 | nametochinese.com |
| 注册商 | CLDY |
| 注册商NS | dns1.cldy.com / dns2.cldy.com |
| 状态 | 已购买；NS 仍为 cldy（dns1.cldy.com），未指向 Vercel |
| 当前解析 | 公网 A 记录为 127.0.0.1（未配 Vercel）；vercel.app 正常 |

---

## DNS 配置（需在CLDY后台添加）

| 类型 | 主机名 | 值 | 说明 |
|------|--------|-----|------|
| A | @ | 76.76.21.21 | 根域名指向Vercel |
| A | www | 76.76.21.21 | www指向Vercel |

备选方案：将NS改为 `ns1.vercel-dns.com` / `ns2.vercel-dns.com`（由Vercel全权管理DNS）

---

## Vercel

| 项目 | 值 |
|------|-----|
| 项目名 | nametochinese |
| 预览地址 | https://nametochinese.vercel.app |
| 生产地址 | https://nametochinese.com（DNS生效后） |
| 账号 | 与dsalink-web等同一账号 |
| 状态 | ✅ 已部署上线 |

**环境变量（Production scope）：**
| 变量名 | 用途 |
|--------|------|
| TURSO_DATABASE_URL | Turso数据库连接地址 |
| TURSO_AUTH_TOKEN | Turso访问密钥 |
| UPSTASH_REDIS_REST_URL | ✅ Production 已配置 |
| UPSTASH_REDIS_REST_TOKEN | ✅ Production 已配置 |

---

## Turso（数据库）

| 项目 | 值 |
|------|-----|
| 服务 | Turso（libSQL云端SQLite）|
| 数据库名 | nametochinese |
| 数据大小 | 62MB |
| 套餐 | 免费（9GB存储，10亿次读/月）|
| 状态 | ✅ 已导入，API测试通过 |

**数据表：**
| 表名 | 行数 | 说明 |
|------|------|------|
| persons | 676,671 | 人名（english / nationality / chinese / has_note）|
| places | 177,286 | 地名（english / nationality / chinese / is_crossref）|
| russian_names | 494 | 俄语人名（russian / chinese / gender / …）|

**索引：** idx_persons_english / idx_places_english / idx_persons_chinese / idx_places_chinese / idx_ru_russian / idx_ru_chinese

---

## Upstash（Rate Limiting）

| 项目 | 值 |
|------|-----|
| 服务 | Upstash Redis |
| 实例 ID | first-mosquito-102777（Vercel 集成自动创建）|
| 用途 | 每IP每分钟限60次请求（middleware.ts）|
| 套餐 | 免费（10,000请求/天）|
| 状态 | ✅ 已接入 Production；`.env.local` 与 Vercel 均已配置 |

**若实例为临时库（Vercel Marketplace 常见）：** 在浏览器打开 [Upstash Console](https://console.upstash.com/) → 找到 `first-mosquito-102777` → **Claim** 绑定到你的 Upstash 账号，避免过期丢失限速数据。也可自行创建固定库 `nametochinese-ratelimit`（`upstash redis create` 或 Console），把新的 `UPSTASH_REDIS_REST_URL` / `TOKEN` 写入 Vercel 与 `.env.local`。

---

## GitHub

| 项目 | 值 |
|------|-----|
| 仓库 | nametochinese |
| 状态 | ✅ 已推送，Vercel自动部署已连接 |

---

## 性能记录（2026-05-24）

| 指标 | 数值 | 目标 |
|------|------|------|
| 首页加载 | ~70ms | ✅ |
| API 冷启动 | ~57s | ❌ 需优化 |
| API 热请求 | ~1.3–1.7s | ⚠️ 高于500ms目标 |

> API冷启动过慢（57s）原因待查，可能是Turso连接初始化或Vercel函数冷启动。后续优化。

---

## Web应用代码位置

| 项目 | 路径 |
|------|------|
| 原始数据 | ~/Desktop/name-translation/ |
| Web项目 | ~/Desktop/nametochinese/ |
