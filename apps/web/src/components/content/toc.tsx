"use client";

import { useEffect, useRef, useState } from "react";

type TocItem = {
  id: string;
  text: string;
  level: number; // 2 | 3
};

function buildToc(): TocItem[] {
  const headings = document.querySelectorAll<HTMLElement>(
    "article h2[id], article h3[id]"
  );
  return Array.from(headings).map((el) => ({
    id: el.id,
    text: el.textContent?.replace(/\s*#\s*$/, "") ?? "",
    level: el.tagName === "H2" ? 2 : 3,
  }));
}

export function Toc() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const toc = buildToc();
    setItems(toc);
    if (toc.length === 0) return;

    const headingEls = toc
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 }
    );

    headingEls.forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav aria-label="İçindekiler" className="space-y-0.5">
      <div className="text-label mb-3">İçindekiler</div>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          data-active={item.id === activeId ? "true" : undefined}
          className={`toc-item ${item.level === 3 ? "toc-item--h3" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(item.id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              // Update hash without triggering jump
              history.replaceState(null, "", `#${item.id}`);
              setActiveId(item.id);
            }
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
