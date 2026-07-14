"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { bootBus } from "@/lib/boot-bus";
import { heroContent } from "@/content/hero";

/**
 * Hero + Z-ekseni tünel geçişi.
 *
 * Choreography:
 * 1. Boot bitince isim, maske altından satır satır yükselir.
 * 2. Scroll'da bölüm pinlenir; dev tipografi kameraya doğru
 *    ölçeklenir · ziyaretçi başlığın "içinden" geçer.
 * 3. Arkadaki çerçeve katmanları kademeli büyüyerek tünel
 *    derinliği hissi verir. Scrub sayesinde geri scroll,
 *    tünelden çıkış gibi kusursuz çalışır.
 *
 * prefers-reduced-motion: pin ve tüm koreografi devre dışı,
 * içerik statik ve tam görünür.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const title = titleRef.current;
      const titleWrap = titleWrapRef.current;
      const frames = framesRef.current;
      if (!section || !title || !titleWrap || !frames) return;

      const lineInners = section.querySelectorAll<HTMLElement>("[data-hero-inner]");
      const fadeUps = section.querySelectorAll<HTMLElement>("[data-hero-fade]");
      const topRow = section.querySelector<HTMLElement>("[data-hero-top]");
      const bottomRow = section.querySelector<HTMLElement>("[data-hero-bottom]");
      const statement = section.querySelector<HTMLElement>("[data-hero-statement]");
      const frameEls = frames.querySelectorAll<HTMLElement>("div");

      const mm = gsap.matchMedia();

      mm.add(
        {
          full: "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
          compact: "(prefers-reduced-motion: no-preference) and (max-width: 767px)",
        },
        (ctx) => {
          const full = Boolean(ctx.conditions?.full);

          // --- Giriş: boot perdesi kalkınca isim maskeden yükselir
          gsap.set(lineInners, { yPercent: 125 });
          gsap.set(fadeUps, { autoAlpha: 0, y: 26 });

          const intro = gsap.timeline({ paused: true });
          intro.to(lineInners, {
            yPercent: 0,
            duration: 1.15,
            ease: "expo.out",
            stagger: 0.1,
          });
          intro.to(
            fadeUps,
            { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07 },
            0.45,
          );

          const offBoot = bootBus.onComplete(() => intro.play());

          // --- Z-ekseni tünel: başlık kameraya doğru büyür
          const scrollTl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: full ? "+=160%" : "+=120%",
              scrub: true,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          scrollTl.to(topRow, { autoAlpha: 0, y: -36, duration: 0.18 }, 0);
          scrollTl.to(bottomRow, { autoAlpha: 0, y: 36, duration: 0.18 }, 0);
          scrollTl.to(statement, { autoAlpha: 0, y: -20, duration: 0.22 }, 0.04);
          scrollTl.to(
            title,
            {
              scale: full ? 7 : 4.2,
              transformOrigin: "50% 46%",
              ease: "power2.in",
              duration: 1,
            },
            0,
          );
          scrollTl.to(title, { autoAlpha: 0, duration: 0.28 }, 0.62);
          scrollTl.to(
            frameEls,
            {
              scale: 2.8,
              autoAlpha: 0,
              ease: "power1.in",
              duration: 0.9,
              stagger: 0.06,
            },
            0.05,
          );

          // --- Fare paralaksı · yalnızca gerçek imleçte.
          // Paralaks, scale alan h1'e değil sarmalayıcıya uygulanır;
          // aynı elemanda quickTo + scale tween'i karışmamalı.
          let removeParallax: (() => void) | undefined;
          if (window.matchMedia("(pointer: fine)").matches) {
            const titleX = gsap.quickTo(titleWrap, "x", { duration: 0.6, ease: "power3.out" });
            const titleY = gsap.quickTo(titleWrap, "y", { duration: 0.6, ease: "power3.out" });
            const framesX = gsap.quickTo(frames, "x", { duration: 0.9, ease: "power3.out" });
            const framesY = gsap.quickTo(frames, "y", { duration: 0.9, ease: "power3.out" });

            const onMove = (e: PointerEvent) => {
              const nx = e.clientX / window.innerWidth - 0.5;
              const ny = e.clientY / window.innerHeight - 0.5;
              titleX(nx * 18);
              titleY(ny * 14);
              framesX(nx * -30);
              framesY(ny * -22);
            };
            section.addEventListener("pointermove", onMove, { passive: true });
            removeParallax = () => section.removeEventListener("pointermove", onMove);
          }

          return () => {
            offBoot();
            removeParallax?.();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="giris"
      ref={sectionRef}
      className="relative h-svh overflow-hidden bg-ink"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={framesRef}
        aria-hidden
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute border border-paper/10"
            style={{ width: `${46 + i * 17}%`, height: `${42 + i * 18}%` }}
          />
        ))}
      </div>

      <div className="relative flex h-full flex-col justify-between px-5 pb-7 pt-20 md:px-10 md:pb-9 md:pt-24">
        <div
          data-hero-top
          className="flex flex-wrap items-start justify-between gap-4 font-mono text-[10px] tracking-[0.22em] md:text-[11px]"
        >
          <p data-hero-fade className="opacity-55">
            {heroContent.kicker}
          </p>
          <dl data-hero-fade className="hidden gap-8 md:flex">
            {heroContent.meta.map((item) => (
              <div key={item.label}>
                <dt className="opacity-40">{item.label}</dt>
                <dd className="mt-1">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div ref={titleWrapRef} className="flex flex-col items-center text-center will-change-transform">
          <h1
            ref={titleRef}
            className="font-display uppercase leading-[0.85] will-change-transform"
          >
            <span className="line-mask">
              <span data-hero-inner className="block text-[clamp(4.2rem,17vw,15rem)]">
                {heroContent.firstName}
              </span>
            </span>
            <span className="line-mask">
              <span
                data-hero-inner
                className="text-outline block text-[clamp(4.2rem,17vw,15rem)]"
              >
                {heroContent.lastName}
              </span>
            </span>
          </h1>
          <p
            data-hero-fade
            className="mt-6 font-mono text-[11px] tracking-[0.4em] opacity-80 md:text-sm"
          >
            {heroContent.role}
          </p>
          <p
            data-hero-statement
            data-hero-fade
            className="mt-5 max-w-md text-sm leading-relaxed opacity-65 md:max-w-lg md:text-base"
          >
            {heroContent.statement}
          </p>
        </div>

        <div
          data-hero-bottom
          className="flex items-end justify-between font-mono text-[10px] tracking-[0.22em] md:text-[11px]"
        >
          <p data-hero-fade className="flex items-center gap-3">
            <span className="pulse-dot" aria-hidden />
            {heroContent.status}
          </p>
          <p data-hero-fade className="opacity-55">
            {heroContent.scrollCue} ↓
          </p>
        </div>
      </div>
    </section>
  );
}
