import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Condensed } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://var-agent.vercel.app"),
  title: "VAR Agent — Verifiable market anomaly signals",
  description:
    "An autonomous TxODDS monitor that detects probability shocks and score-feed lag, with Solana-verifiable access and an x402 signal endpoint.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "VAR Agent",
    description:
      "Catch the market move before the score catches up. Built with TxODDS, Solana, and x402.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "VAR Agent",
    description:
      "Verifiable World Cup market anomaly signals for autonomous agents.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoCondensed.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
