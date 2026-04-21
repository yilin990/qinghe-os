import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qinghe OS — 数字生命的灵魂主页",
  description: "一个有魂有根的个人主页，面向 AI Agent 的实时状态面板与自我管理系统。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
