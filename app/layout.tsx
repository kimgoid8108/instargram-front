import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Holystargram",
  description: "Holystargram 클론 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
