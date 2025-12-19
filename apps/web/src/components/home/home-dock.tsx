"use client";

import React, { useEffect, useMemo, useState } from "react";

type DockSection = { id: string; title: string; hint?: string };

export function HomeDock({ sections }: { sections: DockSection[] }) {
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // en görünür olanı seç
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: "-20% 0px -55% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const anyWin = window as any;
    const lenis = anyWin.__lenis;

    if (lenis?.scrollTo) {
      lenis.scrollTo(el, { offset: -96, duration: 1.0 });
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="rounded-3xl ocean-panel p-3">
      <div className="px-2 pb-2 text-xs font-semibold text-foreground/70">Contents</div>

      <nav className="toc">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={scrollTo(s.id)}
            className="toc-link"
            data-active={active === s.id ? "true" : "false"}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm">{s.title}</span>
              {s.hint ? (
                <span className="mt-0.5 block truncate text-[11px] text-foreground/55">{s.hint}</span>
              ) : null}
            </span>
          </a>
        ))}
      </nav>

      <div className="mt-3 px-2">
        <div className="rounded-2xl border border-border/60 bg-white/5 px-3 py-2 text-xs text-foreground/65">
          Scroll depth
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="depth-bar h-full w-[calc(var(--scroll)*100%)] rounded-full bg-white/35" />
          </div>
        </div>
      </div>
    </div>
  );
}
