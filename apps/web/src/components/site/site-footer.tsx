import Link from "next/link";
import { Github, Linkedin, Mail, Rss } from "lucide-react";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--surface-subtle)/0.6)]">
      <div className="container-site py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div className="max-w-[34rem]">
            <div className="section-label mb-5">Let&apos;s build something memorable</div>
            <h2 className="text-heading text-[clamp(1.8rem,4vw,3.25rem)] text-[hsl(var(--foreground))]">
              Sade arayüz, güçlü his, üretim kalitesi.
            </h2>
            <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-[hsl(var(--foreground-2))]">
              {siteConfig.author.bio} {siteConfig.author.availability}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div className="text-label mb-4">Explore</div>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/about" className="text-[hsl(var(--foreground-2))] transition-colors hover:text-[hsl(var(--foreground))]">About</Link>
                <Link href="/blog" className="text-[hsl(var(--foreground-2))] transition-colors hover:text-[hsl(var(--foreground))]">Blog</Link>
                <Link href="/contact" className="text-[hsl(var(--foreground-2))] transition-colors hover:text-[hsl(var(--foreground))]">Contact</Link>
              </div>
            </div>

            <div>
              <div className="text-label mb-4">Connect</div>
              <div className="flex items-center gap-2">
                <a href={siteConfig.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="btn btn-ghost btn-sm h-10 w-10 rounded-full p-0">
                  <Github className="h-4 w-4" />
                </a>
                <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="btn btn-ghost btn-sm h-10 w-10 rounded-full p-0">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href={`mailto:${siteConfig.author.email}`} aria-label="E-posta" className="btn btn-ghost btn-sm h-10 w-10 rounded-full p-0">
                  <Mail className="h-4 w-4" />
                </a>
                <Link href="/rss" aria-label="RSS" className="btn btn-ghost btn-sm h-10 w-10 rounded-full p-0">
                  <Rss className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[hsl(var(--border))] pt-6 text-xs text-[hsl(var(--foreground-3))] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Next.js, GSAP ve Lenis ile inşa edildi.</p>
          <p>{siteConfig.author.location}</p>
        </div>
      </div>
    </footer>
  );
}