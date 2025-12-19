"use client";

import React, { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="rounded-lg border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:bg-muted"
      onClick={async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 900);
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
