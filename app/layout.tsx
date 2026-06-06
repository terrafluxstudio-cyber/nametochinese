import type { Metadata } from "next";
import { Noto_Serif_SC, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import CookieConsent from "@/components/CookieConsent";
import PwaInstall from "@/components/PwaInstall";
import "./globals.css";

// AdSense Publisher ID。设置环境变量 NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxx 后自动注入广告脚本。
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 毛笔字标题（玄宗体 subset）。display:block + 自动 preload：字体就绪前不显示，
// 避免先刷 fallback 再换的闪烁(FOUT)。仅首页 H1 使用。
const xuanZong = localFont({
  src: "../public/fonts/XuanZongTi-subset.woff2",
  variable: "--font-xuanzong",
  display: "block",
  weight: "400",
  preload: true,
  adjustFontFallback: false,
});


export const metadata: Metadata = {
  title: {
    default: "外文译名词典 | nametochinese.com",
    template: "%s | 外文译名词典",
  },
  description:
    "收录67万外文人名、17万地名的中文译名，支持英语、俄语、韩语、日语查询，提供70余种语言音译引擎，专为翻译工作者设计。",
  keywords: [
    "外文译名词典",
    "人名翻译",
    "外国人名中文",
    "英文名翻译",
    "译名查询",
    "翻译工具",
  ],
  metadataBase: new URL("https://nametochinese.com"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://nametochinese.com",
    siteName: "外文译名词典",
    title: "外文译名词典 | 67万词条",
    description: "收录67万外文人名、17万地名的中文译名，专为翻译工作者设计。",
  },
  verification: {
    google: "McuSPyuAmkg8XRKnnd1paI0W1VFHDsEsrcN3BrLEVtQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSerifSC.variable} ${geistMono.variable} ${xuanZong.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F5F0]">
        {/* Google Consent Mode v2：默认拒绝分析/广告 Cookie，待用户在横幅同意后再 update 为 granted。
            原生内联脚本，随 SSR HTML 同步执行，早于 afterInteractive 的 GA / AdSense。 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`,
          }}
        />
        {children}
        <CookieConsent />
        <PwaInstall />
      </body>
      <GoogleAnalytics gaId="G-SX777JZ4D3" />
      {ADSENSE_ID && (
        <Script
          id="adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </html>
  );
}
