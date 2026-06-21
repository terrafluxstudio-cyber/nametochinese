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
- **所有权验证已通过(2026-06-21,用 ads.txt 法)**。⚠️ code 段验证法当时**秒失败**(部署传播时序→Google 缓存了一次 fail + 冷却,反复点只返回缓存);**改 ads.txt 法一次过**。`public/ads.txt` = `google.com, pub-6366109058219274, DIRECT, f08c47fec0942fa0`。教训:验证卡住别死磕 code 段,换 ads.txt。
- **已申请审核(2026-06-21 提交,状态「正在准备」)**,等 Google 审核结果(几天~2周,邮件)。
- **收款人信息已填(2026-06-21)**:个人账户,Na Yang + 新加坡地址(onboarding/payments「客户信息」表,只填姓名+地址,非绑卡;收款银行账户等赚够 $100 门槛+批准后再加)。
  - ⚠️ **坑**:AdSense 收款人资料 ≠ Google 账号通用「钱包和订阅 / 添加付款方式」(那是花钱的)。正确入口=AdSense 首页「收款」卡→输入信息→`/onboarding/payments`「客户信息」。用户一度误入通用钱包页,警觉"我是收钱不是付钱"才发现。**AdSense 全程不需向 Google 付款。**
- **AdSense 申请所有步骤 100% 完成(2026-06-21)**,面板显示"已完成所有步骤"。等 Google 审核结果(几天~2周,邮件)。
- **CMP(欧盟同意管理)暂缓**:AdSense 让设 Google CMP(EEA/UK/CH 用户 GDPR 同意)。**先点了"稍后再提醒我"**——受众基本非欧盟、不急;且会与站里自制 CookieConsent 横幅冲突(双弹窗),要统一规划(用 Google CMP 就退自制横幅),别随手开。真要服务欧盟广告时再一次理顺。
- 待批准后:放 `<ins>` 广告位(优先编辑型内容页:总则/4专题/naming-rules,别堆 2000+ 薄模板页=low value 风险)。

## 限速 / 其它
- API 限速:纯内存 Map,60 次/分/IP。
