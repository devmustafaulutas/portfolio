"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/cn";
import { Container } from "@/src/components/layout/container";
import { ThemeToggle } from "../theme/theme-toggle";
import { LogoMark } from "./logo-mark";

import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  ArrowUpRight,
} from "lucide-react";

const nav = [
  { href: "/blog", label: "Blog" },
  { href: "/snippets", label: "Snippets" },
  { href: "/projects", label: "Projects" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1 text-sm font-medium transition",
        active ? "text-foreground" : "text-foreground/70 hover:text-foreground"
      )}
    >
      <span className="relative">
        {label}
        <span
          className={cn(
            "pointer-events-none absolute -bottom-2 left-0 h-px w-full scale-x-0 bg-primary transition-transform duration-300",
            active ? "scale-x-100" : "group-hover:scale-x-100"
          )}
        />
      </span>

      <ArrowUpRight
        className={cn(
          "h-4 w-4 transition duration-300",
          "opacity-0 -translate-x-1 translate-y-0.5 -rotate-45",
          "group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0"
        )}
      />
    </Link>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      aria-label={label}
      className={cn(
        "group grid h-9 w-9 place-items-center rounded-2xl border bg-card shadow-sm transition",
        "hover:-translate-y-0.5 hover:bg-muted hover:shadow"
      )}
      data-magnetic
    >
      <span className="text-foreground/70 transition group-hover:text-foreground">
        {children}
      </span>
    </a>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
      <Container className="flex h-16 items-center justify-between">
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-3">
            <LogoMark className="transition group-hover:-translate-y-0.5" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                Mustafa Ulutaş
              </div>
              <div className="text-[11px] text-foreground/60">
                Software Engineer
              </div>
            </div>
          </Link>
        </div>

        {/* Center: nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((x) => (
            <NavLink key={x.href} href={x.href} label={x.label} />
          ))}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-2">

          <div className="hidden items-center gap-2 sm:flex">
            <SocialIcon href="https://github.com/" label="GitHub">
              <Github className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://www.linkedin.com/" label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/" label="Instagram">
              <Instagram className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="mailto:you@example.com" label="Email">
              <Mail className="h-4 w-4" />
            </SocialIcon>
          <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
