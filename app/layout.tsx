import type { Metadata } from "next";
import { Noto_Serif_SC, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    icon: "/favicon.png",
    apple: "/favicon.png",
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
      className={`${notoSerifSC.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F5F0]">{children}</body>
      <GoogleAnalytics gaId="G-SX777JZ4D3" />
    </html>
  );
}
