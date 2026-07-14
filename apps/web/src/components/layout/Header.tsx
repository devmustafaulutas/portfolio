"use client";

import { useEffect, useState } from "react";
import Magnetic from "@/components/ui/Magnetic";
import ScrambleText from "@/components/ui/ScrambleText";
import { getLenis } from "@/lib/lenis-store";

function formatIstanbul(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(date);
}

function handleHashNavigation(e: React.MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute("href");
  if (!href?.startsWith("#")) return;

  const element = document.getElementById(href.slice(1));
  if (!element) return;

  e.preventDefault();
  window.history.pushState(null, "", href);

  // ScrollTrigger ile pinlenen bölümlerde elemanın kendisi, pin
  // mesafesi kadar aşağı transform edilmiş olabilir; gerçek belge
  // konumu sarmalayıcı pin-spacer'dadır. Hero için bu fark ~%160
  // viewport'tur ve "en başa atmıyor" bug'ının sebebiydi.
  const anchor = element.closest<HTMLElement>(".pin-spacer") ?? element;
  const headerHeight =
    document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  const top = Math.max(
    0,
    anchor.getBoundingClientRect().top + window.scrollY - headerHeight,
  );

  // Scroll, Lenis üzerinden akmalı; native smooth scroll Lenis'in
  // rAF döngüsüyle yarışıp takılmaya yol açar.
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.4 });
  } else {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }
}

/**
 * Sabit üst şerit. mix-blend-difference sayesinde beyaz metin,
 * kâğıt-beyaz bölümlerin üzerinde otomatik siyaha döner.
 */
export default function Header() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(formatIstanbul(new Date()));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] mix-blend-difference">
      <div className="flex items-center justify-between px-5 py-5 font-mono text-[10px] tracking-[0.25em] text-white md:px-10 md:text-[11px]">
        <a href="#giris" onClick={handleHashNavigation} className="pointer-events-auto" data-scramble-host>
          <ScrambleText text="MUSTAFA ULUTAŞ" trigger="parent" />
        </a>
        <span className="hidden opacity-60 md:inline">FULL-STACK SOFTWARE DEVELOPER</span>
        <div className="pointer-events-auto flex items-center gap-6">
          <span className="hidden tabular-nums opacity-60 sm:inline" suppressHydrationWarning>
            KOCAELİ {time ?? "--:--"}
          </span>
          <Magnetic strength={0.3}>
            <a href="#iletisim" onClick={handleHashNavigation} className="border border-white px-3 py-1.5" data-scramble-host>
              <ScrambleText text="İLETİŞİM" trigger="parent" />
            </a>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
