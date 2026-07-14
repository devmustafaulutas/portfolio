"use client";

import { useEffect, useState } from "react";
import Magnetic from "@/components/ui/Magnetic";
import ScrambleText from "@/components/ui/ScrambleText";

function formatIstanbul(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Istanbul",
  }).format(date);
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
        <a href="#giris" className="pointer-events-auto" data-scramble-host>
          <ScrambleText text="MUSTAFA ULUTAŞ" trigger="parent" />
        </a>
        <span className="hidden opacity-60 md:inline">FULL-STACK SOFTWARE DEVELOPER</span>
        <div className="pointer-events-auto flex items-center gap-6">
          <span className="hidden tabular-nums opacity-60 sm:inline" suppressHydrationWarning>
            KOCAELİ {time ?? "--:--"}
          </span>
          <Magnetic strength={0.3}>
            <a href="#iletisim" className="border border-white px-3 py-1.5" data-scramble-host>
              <ScrambleText text="İLETİŞİM" trigger="parent" />
            </a>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
