import React from "react";
import { cn } from "@/src/lib/cn";
import SharkLogo from "@/src/assets/svg/shark-logo.svg";


export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid h-9 w-9 place-items-center rounded-2xl border bg-card shadow-sm",
        className
      )}
    >
     <SharkLogo className="h-5 w-5" />

    </div>
  );
}
