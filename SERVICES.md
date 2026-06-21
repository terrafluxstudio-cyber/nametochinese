# SERVICES.md — 服务与基建配置(技术设置存档)

> 用途:记录**已经做过的技术/基建设置**(平台、DNS、邮箱、第三方服务),避免重复配置或重复指导用户去做已做过的事。
> 规则:**任何基建/服务配置一旦做了,立刻记到这里**(账号、开关、关键值、状态)。改首页/搜索看 decisions.md;这里只放服务配置。
> ⚠️ 不放密钥/token(那些在 .env.local / Vercel env,不入库)。这里只放公开/非敏感的配置事实。

---

## Vercel(部署托管)
- 框架 Next.js 16 App Router,Fluid Compute(Node.js)。
- 部署:`npm run build` 验证 → `vercel --prod`。
- **函数区域钉东京 `hnd1`**(2026-06-21):`vercel.json` `{"regions":["hnd1"]}`,与 Turso 同区,查库往返 815→6ms。Hobby 免费版只认项目级单区(路由级 preferredRegion 被忽略)。
- AdSense env `NEXT_PUBLIC_ADSENSE_ID` 未设(申请中)。

## Cloudflare(DNS + 邮件)
- NS:aitana.ns.cloudflare.com / earl.ns.cloudflare.com
- DNS:A @ → 76.76.21.21(橙云✓);CNAME www → nametochinese.com(橙云✓)
- **Email Routing 已启用(已有,2026-06-21 确认截图)**:
  - Status **Enabled**;DNS records **Locked**(MX/SPF 由 CF 自动管理)
  - 路由规则:**`contact@nametochinese.com` → `terrafluxstudio@gmail.com`(Active)** ✓ 真能收信
  - Catch-all:Drop(Disabled)
  - → /about 和 /contact 页公开的 contact@ 邮箱是**真实可达**的,勿再让用户重配。

## Turso(云端 SQLite)
- names.db,位于**东京 aws-ap-northeast-1**。
- 连接:`@libsql/client/http`,懒加载(lib/db.ts)。仅 /api/* 在请求时查;内容页是构建期静态生成,不查库。
- ⚠️ 本地 dev 需 .env.local 的 TURSO_DATABASE_URL/AUTH_TOKEN;缺则 /api 500(纯本地问题,生产正常)。

## cron-job.org(保活)
- 每 5 分钟 ping `/api/ping`,防 Turso free tier 暂停。

## Google Analytics
- GA4:`G-SX777JZ4D3`(layout.tsx)。Consent Mode v2:默认拒绝 ad/analytics cookie,CookieConsent 横幅同意后才 granted。

## AdSense(2026-06-21 注册完成,待审核)
- **账户已建**(Google 账号 terrafluxstudio@gmail.com / Na Yang)。**Publisher ID:`ca-pub-6366109058219274`**。收款国家=新加坡(终身不可改)。
- **Vercel env `NEXT_PUBLIC_ADSENSE_ID=ca-pub-6366109058219274`(production)已设**;layout.tsx 据此注入 loader 脚本,线上 HTML 已含 `adsbygoogle.js?client=ca-pub-...`(curl 验证 ✓)。
- 验证方式=AdSense 代码段(默认,与脚手架一致)。
- **待用户手动**:① AdSense 后台勾「我已放置代码」→ 验证 → 申请审核;② 填收款信息(姓名/地址/税务,个人账户)。
- 待批准后:放 `<ins>` 广告位(优先编辑型内容页:总则/4专题/naming-rules,别堆 2000+ 薄模板页=low value 风险)。

## 限速 / 其它
- API 限速:纯内存 Map,60 次/分/IP。
