"use client";

import Link, { LinkProps } from "next/link";
import React from "react";
import { usePageTransition } from "@/src/components/motion/page-transition";

export function TransitionLink({
  href,
  onClick,
  children,
  ...rest
}: LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { go } = usePageTransition();

  return (
    <a
      {...rest}
      href={typeof href === "string" ? href : href.toString()}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        go(typeof href === "string" ? href : href.toString());
      }}
    >
      {children}
    </a>
  );
}
