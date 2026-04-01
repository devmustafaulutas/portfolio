"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectMeta } from "@/content/projects";

gsap.registerPlugin(ScrollTrigger);

type Props = { projects: ProjectMeta[] };

// Placeholder colours for project cards
const CARD_ACCENTS = [
  "hsl(199 95% 42%)",   // sky
  "hsl(258 90% 66%)",   // violet
  "hsl(35 92% 52%)",    // amber
];

export function PinnedProjects({ projects }: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return; // mobile: normal scroll

    const totalSlide = track.scrollWidth - wrap.offsetWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -totalSlide,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          pin: true,
          anticipatePin: 1,
          start: "top top",
          end: () => `+=${totalSlide + window.innerHeight * 0.5}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Card entrance stagger as they slide into view
      const cards = track.querySelectorAll<HTMLElement>(".project-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0.3, scale: 0.94 },
          {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: wrap,
              start: () => `top top+=${i * (totalSlide / cards.length)}`,
              end: () => `top top+=${(i + 0.6) * (totalSlide / cards.length)}`,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  const statusLabel: Record<string, string> = {
    live: "Canlı", wip: "Geliştiriliyor", archived: "Arşiv",
  };

  return (
    <section aria-labelledby="projects-heading" className="border-t border-[hsl(var(--border))]">
      {/* Section label — always visible */}
      <div className="container-site pt-24 pb-8">
        <div className="flex items-end justify-between">
          <div>
            <span className="section-label">Seçilmiş İşler</span>
            <h2
              id="projects-heading"
              className="mt-3 text-heading text-[clamp(2rem,4vw,3.5rem)] text-[hsl(var(--foreground))]"
            >
              Üretimde çalışan projeler.
            </h2>
          </div>
          <Link
            href="/projects"
            data-cursor="Tümü"
            className="hidden md:inline-flex items-center gap-1.5 text-sm
                       text-[hsl(var(--foreground-2))] hover:text-[hsl(var(--foreground))]
                       transition-colors"
          >
            Tüm projeler <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Pinned horizontal scroller */}
      <div ref={wrapRef} className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-5 px-[clamp(1rem,4vw,2rem)] pb-24 pt-4 w-max"
          style={{ willChange: "transform" }}
        >
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              data-cursor="İncele"
              className="project-card group relative flex-shrink-0
                         w-[min(80vw,520px)] rounded-2xl overflow-hidden
                         border border-[hsl(var(--border))]
                         bg-[hsl(var(--card))] transition-all duration-500
                         hover:border-[hsl(var(--accent)/0.4)]
                         hover:shadow-[0_0_60px_hsl(var(--accent)/0.08)]"
            >
              {/* Card visual */}
              <div
                className="h-56 relative overflow-hidden"
                style={{ background: `${CARD_ACCENTS[i % CARD_ACCENTS.length]}14` }}
              >
                {/* Abstract visual placeholder */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className="text-[9rem] font-black opacity-[0.07] select-none leading-none"
                    style={{ color: CARD_ACCENTS[i % CARD_ACCENTS.length] }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Decorative rings */}
                  <div
                    className="absolute h-48 w-48 rounded-full border opacity-10
                               group-hover:scale-110 transition-transform duration-700"
                    style={{ borderColor: CARD_ACCENTS[i % CARD_ACCENTS.length] }}
                  />
                  <div
                    className="absolute h-32 w-32 rounded-full border opacity-[0.07]"
                    style={{ borderColor: CARD_ACCENTS[i % CARD_ACCENTS.length] }}
                  />
                </div>

                {/* Status badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="badge text-[10px] font-semibold"
                    style={{
                      borderColor: `${CARD_ACCENTS[i % CARD_ACCENTS.length]}50`,
                      color: CARD_ACCENTS[i % CARD_ACCENTS.length],
                      background: `${CARD_ACCENTS[i % CARD_ACCENTS.length]}15`,
                    }}
                  >
                    {statusLabel[project.status] ?? project.status}
                  </span>
                </div>

                {/* Arrow */}
                <div className="absolute top-4 right-4">
                  <div className="h-8 w-8 rounded-full border border-[hsl(var(--border))]
                                 bg-[hsl(var(--surface))] flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                 group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                                 transition-transform">
                    <ArrowUpRight className="h-3.5 w-3.5 text-[hsl(var(--foreground))]" />
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6">
                <div className="text-[11px] font-mono text-[hsl(var(--foreground-3))] mb-2">
                  {project.year}
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))]
                               group-hover:text-[hsl(var(--accent))] transition-colors duration-200 mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-[hsl(var(--foreground-2))] leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="badge text-[10px]">{tech}</span>
                  ))}
                  {project.stack.length > 4 && (
                    <span className="badge text-[10px]">+{project.stack.length - 4}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {/* "See all" card */}
          <Link
            href="/projects"
            data-cursor="Tümü"
            className="project-card group flex-shrink-0
                       w-[min(40vw,280px)] rounded-2xl
                       border border-dashed border-[hsl(var(--border))]
                       flex flex-col items-center justify-center gap-4
                       text-[hsl(var(--foreground-3))] transition-all duration-300
                       hover:border-[hsl(var(--accent)/0.4)] hover:text-[hsl(var(--accent))]"
          >
            <div className="h-12 w-12 rounded-full border border-current
                           flex items-center justify-center
                           group-hover:scale-110 transition-transform duration-300">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">Tüm projeler</span>
          </Link>
        </div>
      </div>
    </section>
  );
}


