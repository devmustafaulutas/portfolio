import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import BootSequence from "@/components/sections/BootSequence";
import Header from "@/components/layout/Header";
import CustomCursor from "@/components/effects/CustomCursor";
import FilmGrain from "@/components/effects/FilmGrain";

const anton = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-anton",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060606",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${anton.variable} ${grotesk.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="bg-ink text-paper">
        <noscript>
          <style>{".boot-overlay{display:none}"}</style>
        </noscript>
        <SmoothScroll>
          <BootSequence />
          <Header />
          {children}
          <CustomCursor />
          <FilmGrain />
        </SmoothScroll>
      </body>
    </html>
  );
}
