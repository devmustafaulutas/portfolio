"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/config/site";

gsap.registerPlugin(ScrollTrigger);

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@_.—";

function scrambleText(el: HTMLElement, finalText: string, duration = 1200) {
  let frame = 0;
  const totalFrames = Math.round(duration / 16);
  const original = finalText.split("");

  const interval = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    el.textContent = original
      .map((char, i) => {
        if (char === " ") return " ";
        if (i / original.length < progress) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join("");
    if (frame >= totalFrames) {
      clearInterval(interval);
      el.textContent = finalText;
    }
  }, 16);
}

export function ContactScene() {
  const sectionRef  = useRef<HTMLElement>(null);
  const emailRef    = useRef<HTMLAnchorElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const line1Ref    = useRef<HTMLDivElement>(null);
  const line2Ref    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Heading clip reveal on scroll
      const lines = [line1Ref.current, line2Ref.current].filter(Boolean);
      lines.forEach((line, i) => {
        if (!line) return;
        const inner = line.querySelector(".line-inner");
        if (!inner) return;
        gsap.set(inner, { y: "100%", opacity: 0 });
        ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(inner, {
              y: "0%",
              opacity: 1,
              duration: 1.1,
              ease: "power4.out",
              delay: i * 0.14,
            });
          },
        });
      });

      // Email scramble on hover
      const emailEl = emailRef.current;
      if (emailEl) {
        const finalEmail = siteConfig.author.email;
        const onEnter = () => scrambleText(emailEl, finalEmail, 600);
        emailEl.addEventListener("mouseenter", onEnter);
        return () => emailEl.removeEventListener("mouseenter", onEnter);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="border-t border-[hsl(var(--border))]"
    >
      <div className="container-site py-28 md:py-40">
        {/* Heading */}
        <div className="mb-16">
          <span className="section-label mb-6 block">İletişim</span>

          <h2 id="contact-heading" aria-label="Bir şey mi inşa ediyorsunuz?">
            {[
              { ref: line1Ref, text: "Bir şey mi" },
              { ref: line2Ref, text: "inşa ediyorsunuz?" },
            ].map(({ ref, text }, i) => (
              <div key={i} ref={ref} className="overflow-hidden">
                <div
                  className="line-inner text-display text-[clamp(2.8rem,8vw,8.5rem)] leading-[1.0] tracking-[-0.04em] text-[hsl(var(--foreground))]"
                  aria-hidden="true"
                >
                  {text}
                </div>
              </div>
            ))}
          </h2>
        </div>

        {/* Email link — hero element */}
        <a
          ref={emailRef}
          href={`mailto:${siteConfig.author.email}`}
          data-cursor="Yaz"
          data-magnetic
          className="group inline-flex items-center gap-4 mb-14
                     text-[clamp(1.25rem,3vw,2rem)] font-semibold
                     text-[hsl(var(--foreground-2))] hover:text-[hsl(var(--accent))]
                     transition-colors duration-300 font-mono tracking-tight"
        >
          {siteConfig.author.email}
          <ArrowUpRight className="h-6 w-6 opacity-60 group-hover:opacity-100
                                   group-hover:rotate-12 transition-all duration-300" />
        </a>

        {/* Body text + CTA grid */}
        <div className="grid md:grid-cols-2 gap-10 items-end">
          <p className="text-base md:text-lg text-[hsl(var(--foreground-2))] leading-relaxed max-w-[44ch]">
            Proje fikriniz, teknik sorunuz veya olası bir iş birliği varsa —
            yazmaktan çekinmeyin. Genellikle 24 saat içinde yanıt veririm.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${siteConfig.author.email}`}
                className="btn btn-primary btn-lg"
                data-magnetic
              >
                <Mail className="h-4 w-4" />
                E-posta Gönder
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
                data-magnetic
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm h-9 w-9 p-0 rounded-xl"
                aria-label="GitHub"
                data-magnetic
              >
                <Github className="h-4 w-4" />
              </a>
              <span className="text-xs text-[hsl(var(--foreground-3))]">
                ya da GitHub'da bulun
              </span>
            </div>
          </div>
        </div>

        {/* Bottom divider + footer mini */}
        <div className="mt-20 pt-8 border-t border-[hsl(var(--border))]
                        flex flex-col sm:flex-row items-start sm:items-center
                        justify-between gap-3">
          <p className="text-xs text-[hsl(var(--foreground-3))]">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <div className="flex items-center gap-4 text-xs text-[hsl(var(--foreground-3))]">
            <Link href="/blog" className="hover:text-[hsl(var(--foreground))] transition-colors">Blog</Link>
            <Link href="/projects" className="hover:text-[hsl(var(--foreground))] transition-colors">Projects</Link>
            <Link href="/snippets" className="hover:text-[hsl(var(--foreground))] transition-colors">Snippets</Link>
            <Link href="/rss" className="hover:text-[hsl(var(--foreground))] transition-colors">RSS</Link>
          </div>
        </div>
      </div>
    </section>
  );
}