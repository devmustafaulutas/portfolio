"use client";

import React, { useState } from "react";
import { cn } from "@/src/lib/cn";

export function DemoTabs({
  title,
  subtitle,
  preview,
  code,
  className,
}: {
  title: string;
  subtitle?: string;
  preview: React.ReactNode;
  code: React.ReactNode;
  className?: string;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <div className={cn("not-prose rounded-2xl border bg-card p-4", className)} data-reveal>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight">{title}</div>
          {subtitle ? (
            <div className="mt-1 text-xs text-foreground/60">{subtitle}</div>
          ) : null}
        </div>

        <div className="inline-flex rounded-xl border bg-muted p-1">
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-medium transition",
              tab === "preview" ? "bg-card shadow-sm" : "text-foreground/70 hover:text-foreground"
            )}
            data-magnetic
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setTab("code")}
            className={cn(
              "rounded-lg px-3 py-1 text-xs font-medium transition",
              tab === "code" ? "bg-card shadow-sm" : "text-foreground/70 hover:text-foreground"
            )}
            data-magnetic
          >
            Code
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className={cn(tab === "preview" ? "block" : "hidden")}>{preview}</div>
        <div className={cn(tab === "code" ? "block" : "hidden")}>{code}</div>
      </div>
    </div>
  );
}
