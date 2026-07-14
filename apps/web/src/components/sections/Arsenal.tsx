"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { initReveals } from "@/lib/reveal";
import { arsenalSection, arsenalGroups, marqueeWords } from "@/content/arsenal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Teknik cephanelik.
 * - Üstte scroll hızına tepki veren çift yönlü marquee: hızlanır,
 *   yön değiştirir ve hıza bağlı skew alır.
 * - Altta disiplinlere ayrılmış envanter; backend ve mimari
 *   grupları bilinçli olarak daha büyük basılır.
 */
export default function Arsenal() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const rowA = rowARef.current;
      const rowB = rowBRef.current;
      if (!section || !rowA || !rowB) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        initReveals(section);

        const innerA = rowA.querySelector<HTMLElement>("[data-marquee-inner]");
        const innerB = rowB.querySelector<HTMLElement>("[data-marquee-inner]");
        if (!innerA || !innerB) return;

        const tweenA = gsap.fromTo(
          innerA,
          { xPercent: 0 },
          { xPercent: -50, duration: 30, ease: "none", repeat: -1 },
        );
        const tweenB = gsap.fromTo(
          innerB,
          { xPercent: -50 },
          { xPercent: 0, duration: 34, ease: "none", repeat: -1 },
        );

        // Scroll hızı → marquee hız/yön/skew
        const speed = { value: 1 };
        let direction = 1;
        const applySpeed = () => {
          tweenA.timeScale(speed.value);
          tweenB.timeScale(speed.value);
        };

        const velocityWatcher = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            if (velocity !== 0) direction = velocity > 0 ? 1 : -1;
            const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(velocity) / 900);

            gsap.to(speed, {
              value: boost * direction,
              duration: 0.25,
              overwrite: true,
              onUpdate: applySpeed,
              onComplete: () => {
                gsap.to(speed, {
                  value: direction,
                  duration: 1.4,
                  ease: "power2.out",
                  onUpdate: applySpeed,
                });
              },
            });

            const skew = gsap.utils.clamp(-5, 5, velocity / 250);
            gsap.to([rowA, rowB], {
              skewX: skew,
              duration: 0.25,
              overwrite: "auto",
              onComplete: () => {
                gsap.to([rowA, rowB], { skewX: 0, duration: 0.9, ease: "power3.out" });
              },
            });
          },
        });

        return () => {
          velocityWatcher.kill();
          tweenA.kill();
          tweenB.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const strip = marqueeWords.join("  ·  ");

  return (
    <section id="cephanelik" ref={sectionRef} className="relative overflow-hidden bg-ink text-paper">
      {/* Hız marquee'si · dekoratif; gerçek envanter aşağıda listeli */}
      <div aria-hidden className="border-y border-paper/10 py-8 md:py-12">
        <div ref={rowARef} className="overflow-hidden whitespace-nowrap will-change-transform">
          <div data-marquee-inner className="inline-block w-max font-display text-5xl uppercase leading-none md:text-8xl">
            <span className="pr-10">{strip}&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            <span className="pr-10">{strip}&nbsp;&nbsp;·&nbsp;&nbsp;</span>
          </div>
        </div>
        <div ref={rowBRef} className="mt-4 overflow-hidden whitespace-nowrap will-change-transform md:mt-6">
          <div
            data-marquee-inner
            className="text-outline-thin inline-block w-max font-display text-5xl uppercase leading-none md:text-8xl"
          >
            <span className="pr-10">{strip}&nbsp;&nbsp;·&nbsp;&nbsp;</span>
            <span className="pr-10">{strip}&nbsp;&nbsp;·&nbsp;&nbsp;</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
        <SectionHeading
          label={arsenalSection.label}
          title={arsenalSection.title}
          lede={arsenalSection.lede}
        />

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 md:mt-24 md:grid-cols-12">
          {arsenalGroups.map((group) => (
            <div
              key={group.id}
              data-reveal
              className={
                group.weight === "primary"
                  ? "border-t border-paper/20 pt-6 md:col-span-6"
                  : "border-t border-paper/10 pt-6 md:col-span-4"
              }
            >
              <div className="flex items-baseline justify-between font-mono text-[10px] tracking-[0.25em] opacity-50 md:text-[11px]">
                <span>{group.index}</span>
                <span>{String(group.items.length).padStart(2, "0")} KALEM</span>
              </div>
              <h3
                className={`mt-3 font-display uppercase leading-none ${
                  group.weight === "primary" ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
                }`}
              >
                {group.name}
              </h3>
              <ul className="mt-6 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={`border font-mono tracking-[0.12em] transition-colors duration-300 hover:bg-paper hover:text-ink ${
                      group.weight === "primary"
                        ? "border-paper/30 px-3 py-1.5 text-[10px] md:text-xs"
                        : "border-paper/20 px-2.5 py-1 text-[9px] md:text-[10px]"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          data-reveal
          className="mt-16 border-t border-paper/10 pt-6 font-mono text-[10px] leading-relaxed tracking-[0.2em] opacity-55 md:text-[11px]"
        >
          {arsenalSection.extras}
        </p>
      </div>
    </section>
  );
}
