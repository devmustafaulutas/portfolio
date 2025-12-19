"use client";

import React, { useState } from "react";

export function LiveCounterDemo() {
  const [n, setN] = useState(3);

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold tracking-tight">Live demo</div>
          <div className="mt-1 text-xs text-foreground/60">
            Bu bir “embed”: okurken deneyip hissediyorsun.
          </div>
        </div>

        <div className="rounded-xl border bg-muted px-3 py-2 text-sm font-semibold tabular-nums">
          {n}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-xl border bg-muted px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-muted/70 hover:shadow-sm"
          onClick={() => setN((x) => x + 1)}
          data-magnetic
        >
          Increment
        </button>
        <button
          type="button"
          className="rounded-xl border bg-muted px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-muted/70 hover:shadow-sm"
          onClick={() => setN((x) => Math.max(0, x - 1))}
          data-magnetic
        >
          Decrement
        </button>
        <button
          type="button"
          className="rounded-xl border bg-card px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-muted hover:shadow-sm"
          onClick={() => setN(0)}
          data-magnetic
        >
          Reset
        </button>
      </div>
    </div>
  );
}
