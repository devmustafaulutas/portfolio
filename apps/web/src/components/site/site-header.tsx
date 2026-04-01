"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { siteConfig } from "@/config/site";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} className="nav-link" data-active={active} aria-current={active ? "page" : undefined}>
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          "border-[hsl(var(--border)/0.65)] glass-surface",
          scrolled && "shadow-[0_10px_30px_hsl(200_50%_4%/0.12)]"
        )}
      >
        <div className="container-site flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" aria-label={`${siteConfig.name} ana sayfa`} className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[linear-gradient(135deg,hsl(var(--surface-raised)),hsl(var(--surface-subtle)))] text-sm font-extrabold tracking-[-0.08em] text-[hsl(var(--foreground))] transition-colors duration-200 group-hover:border-[hsl(var(--accent)/0.4)] group-hover:text-[hsl(var(--accent))]">
              MU
            </div>
            <div className="leading-none">
              <div className="text-[0.95rem] font-semibold tracking-[-0.03em] text-[hsl(var(--foreground))]">
                {siteConfig.name}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--foreground-3))]">
                {siteConfig.tagline}
              </div>
            </div>
          </Link>

          <nav aria-label="Ana navigasyon" className="hidden items-center gap-7 md:flex">
            {siteConfig.nav.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 lg:flex">
              <a href={siteConfig.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="btn btn-ghost btn-sm h-9 w-9 rounded-full p-0">
                <Github className="h-4 w-4" />
              </a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="btn btn-ghost btn-sm h-9 w-9 rounded-full p-0">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={`mailto:${siteConfig.author.email}`} aria-label="E-posta" className="btn btn-ghost btn-sm h-9 w-9 rounded-full p-0">
                <Mail className="h-4 w-4" />
              </a>
              <div className="mx-1 h-4 w-px bg-[hsl(var(--border))]" />
            </div>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              className="btn btn-ghost btn-sm h-9 w-9 rounded-full p-0 md:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-[hsl(var(--background)/0.72)] backdrop-blur-md transition-opacity",
            open ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          className={cn(
            "absolute inset-x-4 top-[5.25rem] rounded-[28px] border border-[hsl(var(--border))] bg-[hsl(var(--surface)/0.95)] p-4 shadow-[0_20px_80px_hsl(200_50%_4%/0.22)] backdrop-blur-xl transition-all duration-300",
            open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          )}
        >
          <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--foreground-3))]">
            Navigate
          </div>
          <nav className="space-y-1" aria-label="Mobil navigasyon">
            {siteConfig.nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-[hsl(var(--accent-light))] text-[hsl(var(--accent))]"
                      : "text-[hsl(var(--foreground-2))] hover:bg-[hsl(var(--surface-subtle))] hover:text-[hsl(var(--foreground))]"
                  )}
                >
                  {item.label}
                  <span className="text-[hsl(var(--foreground-3))]">/</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 flex items-center gap-2 border-t border-[hsl(var(--border))] pt-4">
            <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm flex-1 justify-center">
              GitHub
            </a>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm flex-1 justify-center">
              LinkedIn
            </a>
            <a href={`mailto:${siteConfig.author.email}`} className="btn btn-primary btn-sm flex-1 justify-center">
              Mail
            </a>
          </div>
        </div>
      </div>
    </>
  );
}