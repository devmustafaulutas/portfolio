"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, CornerDownLeft, ArrowUpRight, Hash, FileText, Code2, Rocket } from "lucide-react";

type AnyItem = any;

type Props = {
  posts: AnyItem[];
  snippets: AnyItem[];
  projects: AnyItem[];
};

const quickAnchors = [
  { id: "highlights", label: "Highlights", icon: Hash },
  { id: "snippets", label: "Signature Snippets", icon: Hash },
  { id: "blueprint", label: "Blueprint", icon: Hash },
  { id: "playground", label: "Playground", icon: Hash },
  { id: "posts", label: "Latest Posts", icon: Hash },
  { id: "projects", label: "Featured Projects", icon: Hash },
  { id: "faq", label: "FAQ", icon: Hash },
];

function normalize(s: string) {
  return (s ?? "").toLowerCase().trim();
}

export function HomeSearchPanel({ posts, snippets, projects }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // cmd+k focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const nq = normalize(q);
    if (!nq) return { posts: [], snippets: [], projects: [] };

    const score = (title: string, desc: string) => {
      const t = normalize(title);
      const d = normalize(desc);
      let s = 0;
      if (t.includes(nq)) s += 5;
      if (d.includes(nq)) s += 2;
      if (t.startsWith(nq)) s += 3;
      return s;
    };

    const top = <T extends AnyItem>(
      items: T[],
      getTitle: (x: T) => string,
      getDesc: (x: T) => string
    ) =>
      items
        .map((x) => ({ x, s: score(getTitle(x), getDesc(x)) }))
        .filter((m) => m.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 6)
        .map((m) => m.x);

    return {
      posts: top(posts, (p) => p.title ?? "", (p) => p.excerpt ?? p.description ?? ""),
      snippets: top(snippets, (s) => s.title ?? "", (s) => s.description ?? ""),
      projects: top(projects, (p) => p.name ?? "", (p) => p.description ?? ""),
    };
  }, [q, posts, snippets, projects]);

  const hasResults =
    results.posts.length || results.snippets.length || results.projects.length;

  return (
    <div className="rounded-3xl ocean-panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border/60 bg-white/5">
            <Search className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">Search anything</div>
            <div className="mt-0.5 text-xs text-foreground/60">
              Cmd/Ctrl + K ile aç • Enter ile git
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setOpen((v) => !v);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
          className="rounded-2xl glass-surface px-3 py-2 text-xs text-foreground/70 transition hover:-translate-y-0.5"
          data-magnetic
        >
          {open ? "Kapat" : "Aç"}
        </button>
      </div>

      {open ? (
        <div className="mt-4">
          <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-white/5 px-3 py-2">
            <Search className="h-4 w-4 text-foreground/60" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="post, snippet, project... (örn: cqrs, gsap, upload)"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/45"
            />
            <CornerDownLeft className="h-4 w-4 text-foreground/50" />
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_280px]">
            <div className="rounded-2xl border border-border/60 bg-white/5 p-3">
              <div className="text-xs font-semibold text-foreground/70">Results</div>

              {!q ? (
                <div className="mt-3 text-sm text-foreground/65">
                  Bir şey yazınca sonuçlar burada listelenecek.
                </div>
              ) : !hasResults ? (
                <div className="mt-3 text-sm text-foreground/65">
                  Sonuç yok. Daha genel bir şey dene: <span className="font-semibold">ui</span>, <span className="font-semibold">next</span>, <span className="font-semibold">api</span>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {!!results.posts.length && (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground/70">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        Posts
                      </div>
                      <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60">
                        {results.posts.map((p: AnyItem) => (
                          <Link
                            key={p.slug}
                            href={`/blog/${p.slug}`}
                            className="group block px-3 py-2 text-sm hover:bg-white/5"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="truncate font-semibold">{p.title}</span>
                              <ArrowUpRight className="h-4 w-4 text-foreground/55 transition group-hover:rotate-45 group-hover:text-foreground" />
                            </div>
                            <div className="mt-1 line-clamp-1 text-xs text-foreground/60">
                              {p.excerpt ?? p.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {!!results.snippets.length && (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground/70">
                        <Code2 className="h-3.5 w-3.5 text-primary" />
                        Snippets
                      </div>
                      <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60">
                        {results.snippets.map((s: AnyItem) => (
                          <Link
                            key={s.slug}
                            href={`/snippets/${s.slug}`}
                            className="group block px-3 py-2 text-sm hover:bg-white/5"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="truncate font-semibold">{s.title}</span>
                              <ArrowUpRight className="h-4 w-4 text-foreground/55 transition group-hover:rotate-45 group-hover:text-foreground" />
                            </div>
                            <div className="mt-1 line-clamp-1 text-xs text-foreground/60">
                              {s.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {!!results.projects.length && (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-foreground/70">
                        <Rocket className="h-3.5 w-3.5 text-primary" />
                        Projects
                      </div>
                      <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60">
                        {results.projects.map((p: AnyItem) => (
                          <Link
                            key={p.slug}
                            href={`/projects/${p.slug}`}
                            className="group block px-3 py-2 text-sm hover:bg-white/5"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="truncate font-semibold">{p.name}</span>
                              <ArrowUpRight className="h-4 w-4 text-foreground/55 transition group-hover:rotate-45 group-hover:text-foreground" />
                            </div>
                            <div className="mt-1 line-clamp-1 text-xs text-foreground/60">
                              {p.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-white/5 p-3">
              <div className="text-xs font-semibold text-foreground/70">
                Quick jump
              </div>

              <div className="mt-3 space-y-2">
                {quickAnchors.map((a) => (
                  <a
                    key={a.id}
                    href={`#${a.id}`}
                    className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-foreground/75 transition hover:bg-white/5 hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <a.icon className="h-4 w-4 text-primary" />
                    <span className="truncate">{a.label}</span>
                  </a>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-border/60 bg-white/5 p-3 text-xs text-foreground/65">
                Bu panel tek başına “premium + dolu” algısını güçlendirir.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <a
            href="#snippets"
            className="rounded-2xl border border-border/60 bg-white/5 px-3 py-2 text-sm text-foreground/70 hover:bg-white/10"
          >
            # Signature Snippets
          </a>
          <a
            href="#projects"
            className="rounded-2xl border border-border/60 bg-white/5 px-3 py-2 text-sm text-foreground/70 hover:bg-white/10"
          >
            # Featured Projects
          </a>
        </div>
      )}
    </div>
  );
}
