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

## AdSense(申请中,2026-06-21 起)
- 脚手架就绪:layout.tsx 按 `NEXT_PUBLIC_ADSENSE_ID` 门控注入 loader 脚本。
- 待:用户申请拿 `ca-pub-xxxx` → 设 Vercel env → 放 `<ins>` 广告位(批准后)。
- 过审就绪:/about /privacy /terms /contact 齐;隐私政已声明广告/cookie。
- 风险:2000+ 程序化模板页可能被判 low value;广告位优先放编辑型内容页。

## 限速 / 其它
- API 限速:纯内存 Map,60 次/分/IP。
