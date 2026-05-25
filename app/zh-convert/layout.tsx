import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "简繁中文转换",
  description:
    "简体转繁体（台湾正体/香港繁体）、繁体转简体，支持段落级别转换，离线运行不上传文字。",
  keywords: [
    "简繁转换",
    "繁体简体转换",
    "简体转台湾繁体",
    "简体转香港繁体",
    "中文转换",
  ],
  alternates: { canonical: "/zh-convert" },
};

export default function ZhConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
