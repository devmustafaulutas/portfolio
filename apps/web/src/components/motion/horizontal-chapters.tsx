"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type Chapter = {
    title: string;
    desc: string;
    bullets: string[];
};

export function HorizontalChapters({ chapters }: { chapters: Chapter[] }) {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const trackRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const wrap = wrapRef.current;
        const track = trackRef.current;
        if (!wrap || !track) return;

        const ctx = gsap.context(() => {
            const refresh = () => {
                const maxX = Math.max(0, track.scrollWidth - wrap.clientWidth);

                gsap.set(track, { x: 0 });
                const headerOffset = 96;

                ScrollTrigger.create({
                    trigger: wrap,
                    start: `top top+=${headerOffset}`,
                    end: () => `+=${maxX + 520}`,
                    pin: true,
                    scrub: 0.7,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    animation: gsap.to(track, { x: -maxX, ease: "none" }),
                });

            };

            refresh();
            ScrollTrigger.refresh();
        }, wrap);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={wrapRef} className="not-prose relative mt-14 overflow-hidden rounded-3xl border bg-card pt-6">
            <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
                <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.35),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.25),transparent_55%)]" />
            </div>

            <div className="relative px-5 py-5 sm:px-7">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs font-semibold tracking-wide text-foreground/60">
                            Chapters
                        </div>
                        <div className="mt-1 text-sm font-semibold tracking-tight">
                            Scroll ile yatay ilerleyen bölüm akışı
                        </div>
                    </div>
                    <div className="text-xs text-foreground/60">GSAP • ScrollTrigger</div>
                </div>
            </div>

            <div className="relative pb-8">
                <div ref={trackRef} className="flex gap-4 px-5 sm:px-7">
                    {chapters.map((c, i) => (
                        <div
                            key={i}
                            className="w-[320px] shrink-0 rounded-2xl border bg-muted/40 p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-muted/60"
                        >
                            <div className="text-sm font-semibold tracking-tight">{c.title}</div>
                            <div className="mt-2 text-sm leading-6 text-foreground/70">{c.desc}</div>

                            <div className="mt-4 space-y-2">
                                {c.bullets.map((b) => (
                                    <div key={b} className="flex gap-2 text-sm text-foreground/70">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/80" />
                                        <span>{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="w-[120px] shrink-0" aria-hidden />
                </div>
            </div>
        </section>
    );
}
