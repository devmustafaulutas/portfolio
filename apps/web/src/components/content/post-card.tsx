"use client";

import React from "react";
import { cn } from "@/src/lib/cn";
import type { PostMeta } from "@/src/features/posts/posts.index";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className={cn(
        "group block rounded-2xl border bg-card p-5 transition",
        "hover:-translate-y-0.5 hover:shadow-sm"
      )}
      data-magnetic
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          {post.title}
        </h3>
        <div className="shrink-0 text-right">
          <time className="block text-xs text-foreground/60">
            {new Date(post.date).toLocaleDateString("tr-TR")}
          </time>
          <span className="text-[11px] text-foreground/50">{post.readingTime}</span>
        </div>
      </div>

      <p className="mt-2 text-sm leading-6 text-foreground/70">{post.excerpt}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span key={t} className="rounded-full bg-muted px-2 py-1 text-[11px] text-foreground/70">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 text-xs font-medium text-foreground/70 group-hover:text-foreground">
        Read →
      </div>
    </a>
  );
}
