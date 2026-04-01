"use client";

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { cn } from "@/lib/cn";

export function CopyCodeButton({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Kopyalandı" : "Kodu kopyala"}
      className={cn(
        "btn btn-ghost btn-sm h-7 gap-1.5 px-2.5 text-[11px] font-medium",
        "text-[hsl(var(--foreground-3))] hover:text-[hsl(var(--foreground))]",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-500" />
          <span>Kopyalandı</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>Kopyala</span>
        </>
      )}
    </button>
  );
}

export function CopyLinkButton({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Bağlantı kopyalandı" : "Bağlantıyı kopyala"}
      className={cn(
        "btn btn-ghost btn-sm gap-1.5 text-[11px] font-medium",
        "text-[hsl(var(--foreground-3))] hover:text-[hsl(var(--foreground))]",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-500" />
          <span>Kopyalandı</span>
        </>
      ) : (
        <>
          <Link2 className="h-3 w-3" />
          <span>Bağlantıyı kopyala</span>
        </>
      )}
    </button>
  );
}