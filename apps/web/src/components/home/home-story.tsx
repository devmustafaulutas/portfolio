"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotionPreference } from "@/components/motion/motion-provider";

const STORY_LINES = [
  "Merhaba, ben Mustafa. Güzel görünen ama aynı zamanda gerçekten hızlı, anlaşılır ve üretime hazır dijital deneyimler tasarlamayı seviyorum.",
  "Benim için iyi bir arayüz sadece estetik değildir; kullanıcının gözünü yormadan yön buldurmalı, içerikle bağ kurdurmalı ve güçlü bir akış hissi vermelidir.",
  "Frontend tarafında motion, backend tarafında sistem tasarımı ve ürün tarafında kullanıcı hissi arasında dengeli bir köprü kurmaya çalışıyorum.",
] as const;

const SOFT_NOTES = [
  {
    title: "samimiyet",
    body: "Dilin fazla cilalı değil, yaklaşılabilir olmasını seviyorum.",
  },
  {
    title: "ritim",
    body: "Boşluk, tempo ve scroll hissi çoğu zaman animasyondan daha önemli.",
  },
  {
    title: "bakım kalitesi",
    body: "Güzel görünen şeyin kod tarafında da dağılmaması gerekiyor.",
  },
] as const;

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function HomeStory() {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      if (!rootRef.current || !contentRef.current || reducedMotion) return;

      gsap.set("[data-story-label]", {
        opacity: 0,
        y: 14,
      });

      gsap.set("[data-story-note]", {
        opacity: 0,
        y: 16,
      });

      gsap.to("[data-story-label]", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.05,
      });

      gsap.to("[data-story-note]", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.2,
      });
    },
    { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );
  useEffect(() => {
    if (!rootRef.current || reducedMotion) return;

    const root = rootRef.current;
    const content = contentRef.current;

    if (!content) return; // 🔥 KRİTİK SATIR

    const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-line]"));
    const progressEl = root.querySelector<HTMLElement>("[data-story-progress]");

    const wordsPerLine = lines.map((line) =>
      Array.from(line.querySelectorAll<HTMLElement>("[data-word]"))
    );

    const update = () => {
      const rect = content.getBoundingClientRect();
      const viewport = window.innerHeight;

      const startY = viewport * 0.82;
      const endY = viewport * 0.985;

      const total = Math.max(rect.height - (endY - startY), 1);
      const passed = startY - rect.top;
      const sectionProgress = clamp(passed / total);
      if (progressEl) {
        progressEl.style.transform = `scaleY(${sectionProgress})`;
      }

      const lineCount = wordsPerLine.length;

      wordsPerLine.forEach((words, lineIndex) => {
        const lineStart = lineIndex / lineCount;
        const lineEnd = (lineIndex + 1) / lineCount;
        const local = clamp((sectionProgress - lineStart) / (lineEnd - lineStart));

        words.forEach((wordEl, wordIndex) => {
          const wordProgress = clamp(local * words.length - wordIndex + 0.15);
          const opacity = 0.18 + wordProgress * 0.82;

          wordEl.style.opacity = `${opacity}`;
          wordEl.style.color =
            wordProgress > 0.98
              ? "hsl(var(--foreground))"
              : `hsl(var(--foreground-3) / ${0.92 - wordProgress * 0.45})`;
          wordEl.style.filter = `blur(${(1 - wordProgress) * 2.4}px)`;
        });
      });
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      className="container-site pt-20 pb-32 md:pt-28 md:pb-40"
      aria-label="Ben kimim"
    >
      <div className="grid gap-14 lg:grid-cols-[0.84fr_1.16fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div data-story-label className="section-label mb-5">
            Ben kimim?
          </div>

          <h2 className="text-heading max-w-[10ch] text-[clamp(2.2rem,5vw,4.6rem)] text-[hsl(var(--foreground))]">
            Yazılıma biraz da his tarafından bakıyorum.
          </h2>

          <p className="mt-5 max-w-[35ch] text-base leading-8 text-[hsl(var(--foreground-2))]">
            Kod yazmayı seviyorum ama sadece çalışan şeyler değil; daha doğal,
            daha sakin ve daha akılda kalan deneyimler üretmek daha çok ilgimi
            çekiyor.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className="btn btn-primary">
              Hakkımda
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              İletişim
            </Link>
          </div>
        </div>

        <div ref={contentRef} className="relative pl-7 pb-10 md:pb-16">
          <div className="absolute bottom-0 left-0 top-2 w-px bg-[hsl(var(--border))]" />
          <div
            data-story-progress
            className="absolute bottom-0 left-0 top-2 w-px origin-top bg-[linear-gradient(180deg,hsl(var(--accent)),hsl(var(--accent-warm)))]"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--foreground-3))]">
            scroll ederek oku
          </div>

          <div className="space-y-8 md:space-y-10">
            {STORY_LINES.map((line, index) => (
              <p
                key={index}
                data-line={index}
                className="max-w-[26ch] text-[clamp(1.12rem,1.95vw,1.54rem)] leading-[1.95] tracking-[-0.03em]"
              >
                {line.split(" ").map((word, wordIndex) => (
                  <span
                    key={`${index}-${wordIndex}`}
                    data-word
                    className="inline-block transition-[opacity,filter,color] duration-150"
                    style={{
                      marginRight: "0.34em",
                      opacity: 0.18,
                      color: "hsl(var(--foreground-3))",
                      filter: "blur(2.4px)",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <div className="mt-12 grid gap-6 border-t border-[hsl(var(--border))] pt-8 sm:grid-cols-3">
            {SOFT_NOTES.map((item) => (
              <div key={item.title} data-story-note>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--foreground-3))]">
                  {item.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-[hsl(var(--foreground-2))]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}