"use client";

import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap, SplitText } from "@/lib/gsap";
import { scrollBus } from "@/lib/scroll-bus";
import { cn } from "@/lib/cn";
import type { ArsenalItem, ArsenalRow } from "@/content/arsenal";

type ArsenalIntro = {
  label: string;
  title: string;
  lede: string;
};

type TechArsenalSectionProps = {
  intro: ArsenalIntro;
  rows: ArsenalRow[];
};

const TIER_CLASS: Record<ArsenalItem["tier"], string> = {
  core: "arsenal-core",
  strong: "arsenal-strong",
  tool: "arsenal-tool",
};

export function TechArsenalSection({ intro, rows }: TechArsenalSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      ensureGsap();
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (titleRef.current) {
          SplitText.create(titleRef.current, {
            type: "chars",
            mask: "chars",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 110,
                duration: 0.9,
                ease: "deepOut",
                stagger: 0.035,
                scrollTrigger: {
                  trigger: titleRef.current,
                  start: "top 82%",
                },
              }),
          });
        }

        // One infinite tween per row; two identical lists inside each
        // track mean xPercent:-50 loops seamlessly.
        const marquees = Array.from(
          section.querySelectorAll<HTMLElement>("[data-marquee-track]"),
        ).map((track) => {
          const direction = Number(track.dataset.direction) as 1 | -1;
          const speed = Number(track.dataset.speed);
          return gsap.fromTo(
            track,
            { xPercent: direction === -1 ? 0 : -50 },
            {
              xPercent: direction === -1 ? -50 : 0,
              duration: speed,
              ease: "none",
              repeat: -1,
            },
          );
        });

        // Scroll velocity feeds the belts: fast flicks make the
        // arsenal roar, idling lets it settle back to cruise speed.
        const onTick = () => {
          const boost = gsap.utils.clamp(
            0,
            3.4,
            Math.abs(scrollBus.velocity) * 0.055,
          );
          marquees.forEach((tween) => {
            tween.timeScale(
              gsap.utils.interpolate(tween.timeScale(), 1 + boost, 0.09),
            );
          });
        };
        gsap.ticker.add(onTick);

        gsap.from("[data-arsenal-row]", {
          opacity: 0,
          y: 46,
          duration: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        });

        return () => {
          gsap.ticker.remove(onTick);
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="arsenal"
      className="relative overflow-hidden py-32 sm:py-44"
    >
      <div className="px-5 sm:px-10">
        <p className="voice-mono-bright mb-6">{intro.label}</p>
        <h2
          ref={titleRef}
          className="voice-display text-ink text-[clamp(3.2rem,11vw,9.5rem)]"
        >
          {intro.title}
        </h2>
        <p className="voice-mono mt-8 max-w-2xl leading-relaxed normal-case tracking-[0.08em]">
          {intro.lede}
        </p>
      </div>

      <div className="mt-20 flex flex-col gap-14 sm:gap-20">
        {rows.map((row) => (
          <div
            key={row.id}
            data-arsenal-row
            className={cn(row.emphasis === "aggressive" && "row-aggressive")}
          >
            <p className="voice-mono mb-4 px-5 sm:px-10">
              <span className="text-ember">/</span> {row.heading}
            </p>
            <div className="marquee-mask">
              <div
                data-marquee-track
                data-direction={row.direction}
                data-speed={row.baseSpeed}
                className="marquee-track"
              >
                {[0, 1].map((copy) => (
                  <ul
                    key={copy}
                    className="marquee-list"
                    aria-hidden={copy === 1}
                  >
                    {row.items.map((item, index) => (
                      <Fragment key={`${item.label}-${index}`}>
                        <li className={TIER_CLASS[item.tier]}>{item.label}</li>
                        <li className="marquee-divider" aria-hidden="true">
                          {"//"}
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
