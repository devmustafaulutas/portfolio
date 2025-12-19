import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/src/components/theme/theme-provider";
import { MotionProvider } from "@/src/components/motion/motion-provider";
import { SiteHeader } from "@/src/components/site/site-header";
import { SiteFooter } from "@/src/components/site/site-footer";
import { PageTransitionProvider } from "../components/motion/page-transition";
import { SharkMascot } from "../components/fun/shark-mascot";
import { OceanBackdrop } from "../components/layout/ocean-backdrop";

export const metadata: Metadata = {
  title: { default: "Mustafa Ulutaş — Blog & Portfolio", template: "%s — Mustafa Ulutaş" },
  description: "Software engineering blog, code snippets, and portfolio projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen bg-transparent">
        <ThemeProvider>
          <PageTransitionProvider>
            <MotionProvider>
              <OceanBackdrop />
              <div className="scroll-progress" />
              <div className="relative z-10">
                <SiteHeader />
                <SharkMascot />
                {children}
                <SiteFooter />
              </div>
            </MotionProvider>
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
