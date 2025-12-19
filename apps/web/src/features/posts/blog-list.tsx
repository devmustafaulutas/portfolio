"use client";

import React, { useMemo, useState } from "react";
import { postsIndex } from "@/src/features/posts/posts.index";
import { PostCard } from "@/src/components/content/post-card";

export function BlogList() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string>("");

  const tags = useMemo(() => {
    const s = new Set<string>();
    postsIndex.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return postsIndex.filter((p) => {
      const hitQ =
        !qq ||
        p.title.toLowerCase().includes(qq) ||
        p.excerpt.toLowerCase().includes(qq) ||
        p.tags.some((t) => t.toLowerCase().includes(qq));
      const hitTag = !tag || p.tags.includes(tag);
      return hitQ && hitTag;
    });
  }, [q, tag]);

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="w-full rounded-xl border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Ara: nextjs, dotnet, architecture..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="w-full rounded-xl border bg-card px-3 py-2 text-sm outline-none sm:w-[220px]"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="">Tüm etiketler</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </>
  );
}
