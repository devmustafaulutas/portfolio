"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { decryptOnScroll } from "@/lib/kinetic";
import type { ShowcaseProject } from "@/content/showcase";

type ShowcaseSectionMeta = {
  label: string;
  title: string;
  lede: string;
};

type MagneticProjectShowcaseProps = {
  section: ShowcaseSectionMeta;
  projects: ShowcaseProject[];
};

/**
 * Act IV. The classic Awwwards move, monochrome edition: giant
 * outlined project names stacked like a type specimen. Hovering a
 * row wakes a cursor-chasing abstract block — each project carries
 * its own procedural black-and-white texture, no images needed.
 */
export function MagneticProjectShowcase({
  section,
  projects,
}: MagneticProjectShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const followerLabelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      ensureGsap();
      const root = sectionRef.current;
      const follower = followerRef.current;
      const followerLabel = followerLabelRef.current;
      if (!root || !follower || !followerLabel) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (titleRef.current) {
          decryptOnScroll(titleRef.current);
        }

        gsap.from("[data-show-row]", {
          opacity: 0,
          y: 44,
          duration: 0.9,
          ease: "monoOut",
          stagger: 0.09,
          scrollTrigger: {
            trigger: root.querySelector("[data-show-list]"),
            start: "top 80%",
          },
        });
      });

      // Follower needs a real pointer — touch devices keep the list
      // as a plain, honest link stack.
      mm.add(
        "(prefers-reduced-motion: no-preference) and (pointer: fine)",
        () => {
          gsap.set(follower, { xPercent: -50, yPercent: -110 });

          const xTo = gsap.quickTo(follower, "x", {
            duration: 0.55,
            ease: "power3",
          });
          const yTo = gsap.quickTo(follower, "y", {
            duration: 0.55,
            ease: "power3",
          });

          const onSectionMove = (event: PointerEvent) => {
            xTo(event.clientX);
            yTo(event.clientY);
          };

          const showFollower = (project: ShowcaseProject) => {
            follower.dataset.pattern = project.pattern;
            followerLabel.textContent = `${project.domain} — ${project.year}`;
            gsap.to(follower, {
              autoAlpha: 1,
              scale: 1,
              duration: 0.45,
              ease: "monoOut",
            });
          };

          const hideFollower = () => {
            gsap.to(follower, {
              autoAlpha: 0,
              scale: 0.85,
              duration: 0.4,
              ease: "monoOut",
            });
          };

          const disposers: (() => void)[] = [];

          root.addEventListener("pointermove", onSectionMove, {
            passive: true,
          });
          root.addEventListener("pointerleave", hideFollower);
          disposers.push(() => {
            root.removeEventListener("pointermove", onSectionMove);
            root.removeEventListener("pointerleave", hideFollower);
          });

          root
            .querySelectorAll<HTMLElement>("[data-show-row]")
            .forEach((row, index) => {
              const project = projects[index];
              if (!project) return;

              const name = row.querySelector<HTMLElement>(".show-name");
              const onEnter = () => {
                showFollower(project);
                if (name) {
                  gsap.to(name, {
                    x: 28,
                    duration: 0.5,
                    ease: "monoOut",
                  });
                }
              };
              const onLeave = () => {
                if (name) {
                  gsap.to(name, { x: 0, duration: 0.6, ease: "monoOut" });
                }
              };

              row.addEventListener("pointerenter", onEnter);
              row.addEventListener("pointerleave", onLeave);
              disposers.push(() => {
                row.removeEventListener("pointerenter", onEnter);
                row.removeEventListener("pointerleave", onLeave);
              });
            });

          return () => disposers.forEach((dispose) => dispose());
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative py-28 sm:py-40"
    >
      <header className="px-5 pb-14 sm:px-10 sm:pb-20">
        <p className="type-mono mb-6">{section.label}</p>
        <h2
          ref={titleRef}
          data-skew
          className="type-display max-w-5xl text-[clamp(2.2rem,7vw,6rem)]"
        >
          {section.title}
        </h2>
        <p className="type-mono mt-7 max-w-xl normal-case leading-relaxed tracking-[0.08em]">
          {section.lede}
        </p>
      </header>

      <div data-show-list>
        {projects.map((project) => (
          <a
            key={project.id}
            data-show-row
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="show-row"
            aria-label={`${project.name} — ${project.blurb}`}
          >
            <span className="type-mono text-faint">{project.index}</span>
            <span className="show-name" data-skew>
              {project.name}
            </span>
            <span className="show-meta">
              <span className="type-mono-bright">
                {project.stack.join(" + ")}
              </span>
              <span className="type-mono hidden max-w-64 normal-case tracking-[0.06em] sm:block">
                {project.blurb}
              </span>
            </span>
          </a>
        ))}
      </div>

      {/* Cursor-chasing abstract reveal block */}
      <div ref={followerRef} className="follower" aria-hidden="true">
        <span ref={followerLabelRef} className="follower-label" />
      </div>
    </section>
  );
}
