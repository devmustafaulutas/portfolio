"use client";

import React, { useEffect, useMemo, useState } from "react";

type TocItem = { id: string; text: string; level: 2 | 3 };

export function Toc({ selector = "article h2, article h3" }: { selector?: string }) {
  const [active, setActive] = useState<string>("");

  const items = useMemo(() => {
    if (typeof document === "undefined") return [] as TocItem[];
    const nodes = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    return nodes
      .map((el) => {
        const level = (el.tagName.toLowerCase() === "h2" ? 2 : 3) as 2 | 3;
        const id = el.id || "";
        const text = (el.textContent || "").trim();
        return id && text ? { id, text, level } : null;
      })
      .filter(Boolean) as TocItem[];
  }, [selector]);

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    if (!headings.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        setActive((top.target as HTMLElement).id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0.2, 0.35, 0.5] }
    );

    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [selector]);

  if (!items.length) return null;

  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="text-xs font-semibold tracking-wide text-foreground/70">İçindekiler</div>
      <div className="mt-3 space-y-2">
        {items.map((x) => (
          <a
            key={x.id}
            href={`#${x.id}`}
            className={[
              "block text-sm leading-6 transition",
              x.level === 3 ? "pl-3 text-foreground/70" : "text-foreground/85",
              active === x.id ? "text-primary font-medium" : "hover:text-foreground",
            ].join(" ")}
          >
            {x.text}
          </a>
        ))}
      </div>
    </div>
  );
}
