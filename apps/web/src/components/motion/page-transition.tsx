"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";

type Ctx = { go: (href: string) => void };
const TransitionCtx = createContext<Ctx | null>(null);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<string | null>(null);

  useEffect(() => {
    // route değişince overlay’i kapat
    if (!overlayRef.current) return;
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power2.out" });
    pending.current = null;
  }, [pathname]);

  const value = useMemo<Ctx>(() => ({
    go: (href) => {
      if (!overlayRef.current) return router.push(href);
      if (href === pathname) return;

      pending.current = href;

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.22,
        ease: "power2.inOut",
        onComplete: () => router.push(href),
      });
    },
  }), [router, pathname]);

  return (
    <TransitionCtx.Provider value={value}>
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[60] opacity-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% 20%, rgba(120,119,198,0.20), rgba(0,0,0,0.65))",
        }}
      />
      {children}
    </TransitionCtx.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(TransitionCtx);
  if (!ctx) throw new Error("usePageTransition must be used within PageTransitionProvider");
  return ctx;
}
