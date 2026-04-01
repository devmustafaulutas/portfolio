"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import type { PostMeta } from "@/content/posts";
import { formatDateShort } from "@/lib/format";
import { cn } from "@/lib/cn";

type Props = {
  posts: PostMeta[];
  tags: string[];
};

export function BlogSearch({ posts, tags }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = posts;

    if (activeTag) {
      result = result.filter((post) => post.tags.includes(activeTag));
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, query, activeTag]);

  const hasFilters = Boolean(query || activeTag);

  const clearFilters = () => {
    setQuery("");
    setActiveTag(null);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--foreground-3))]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Yazılarda ara..."
            aria-label="Yazılarda ara"
            className={cn(
              "h-12 w-full rounded-full border border-[hsl(var(--border))]",
              "bg-[hsl(var(--surface)/0.78)] pl-11 pr-12 text-sm text-[hsl(var(--foreground))]",
              "placeholder:text-[hsl(var(--foreground-3))]",
              "outline-none transition focus:border-[hsl(var(--accent)/0.5)] focus:ring-2 focus:ring-[hsl(var(--accent)/0.14)]"
            )}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Aramayı temizle"
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[hsl(var(--foreground-3))] transition hover:bg-[hsl(var(--surface-subtle))] hover:text-[hsl(var(--foreground))]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Etiket filtresi">
          {tags.map((tag) => {
            const active = activeTag === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
                aria-pressed={active}
                className={cn(
                  "badge cursor-pointer transition-all",
                  active ? "badge-accent" : "hover:border-[hsl(var(--accent)/0.34)]"
                )}
              >
                {tag}
              </button>
            );
          })}

          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="badge cursor-pointer transition-colors hover:border-[hsl(var(--accent-warm)/0.35)] hover:text-[hsl(var(--accent-warm))]"
            >
              <X className="h-2.5 w-2.5" />
              Temizle
            </button>
          ) : null}
        </div>
      </div>

      <div className="mb-5 text-label">
        {hasFilters ? `${filtered.length} sonuç` : `${posts.length} yazı`}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="post-card group"
            >
              <div className="flex items-center justify-between gap-3">
                <time dateTime={post.date} className="text-label">
                  {formatDateShort(post.date)}
                </time>
                <span className="text-xs text-[hsl(var(--foreground-3))]">
                  {post.readingTime}
                </span>
              </div>

              <h2 className="text-heading text-[1rem] leading-snug text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))]">
                {post.title}
              </h2>

              <p className="line-clamp-2 text-sm leading-7 text-[hsl(var(--foreground-2))]">
                {post.excerpt}
              </p>

              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={cn("badge text-[10px]", activeTag === tag && "badge-accent")}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--foreground-3))] transition-colors group-hover:text-[hsl(var(--accent))]" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="mb-3 text-3xl">⌕</div>
          <p className="mb-4 text-sm text-[hsl(var(--foreground-2))]">
            Aramana uygun sonuç bulunamadı.
          </p>
          <button type="button" onClick={clearFilters} className="btn btn-secondary btn-sm">
            Filtreleri temizle
          </button>
        </div>
      )}
    </div>
  );
}