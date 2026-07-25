import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "山小屋ファインダー | あなたに合う山小屋を探す",
  description:
    "登山初心者〜中級者向けに、経験・エリア・標高・水場・アクセスの条件からおすすめの山小屋を提案します。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
