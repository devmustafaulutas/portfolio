"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap, SplitText } from "@/lib/gsap";
import { scrollBus } from "@/lib/scroll-bus";
import { cn } from "@/lib/cn";
import type {
  ApexData,
  FreelanceProject,
  JourneyNode,
} from "@/content/journey";

type JourneyIntro = {
  label: string;
  title: string;
  lede: string;
};

type TheJourneyTimelineProps = {
  intro: JourneyIntro;
  nodes: JourneyNode[];
  apex: ApexData;
  modules: string[];
};

/**
 * Builds a smooth vertical S-curve through the given anchor points.
 * Coordinates are plain pixels because the SVG viewBox is kept in
 * sync with the rail's real size — MotionPathPlugin alignment stays
 * exact on every breakpoint.
 */
function buildSpinePath(anchors: { x: number; y: number }[]): string {
  if (anchors.length === 0) return "";
  let d = `M ${anchors[0].x} ${anchors[0].y}`;
  for (let i = 1; i < anchors.length; i += 1) {
    const prev = anchors[i - 1];
    const cur = anchors[i];
    const midY = (prev.y + cur.y) / 2;
    d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
  }
  return d;
}

export function TheJourneyTimeline({
  intro,
  nodes,
  apex,
  modules,
}: TheJourneyTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const basePathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);
  const livePathRef = useRef<SVGPathElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const introTitleRef = useRef<HTMLHeadingElement>(null);
  const apexRef = useRef<HTMLDivElement>(null);
  const [layoutVersion, setLayoutVersion] = useState(0);

  // Any rail resize (fonts settling, orientation change, breakpoint
  // switch) invalidates the pixel-space spine — rebuild everything.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let timer = 0;
    let firstPass = true;
    const observer = new ResizeObserver(() => {
      if (firstPass) {
        firstPass = false;
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(
        () => setLayoutVersion((version) => version + 1),
        180,
      );
    });
    observer.observe(rail);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  // Magnetic hover for freelance project cards. Registered once in a
  // plain effect (element identity is stable across spine rebuilds).
  useEffect(() => {
    ensureGsap();
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const disposers: (() => void)[] = [];

    section
      .querySelectorAll<HTMLElement>("[data-magnetic]")
      .forEach((card) => {
        const chips = card.querySelectorAll<HTMLElement>(".tech-chip");
        const xTo = gsap.quickTo(card, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.5, ease: "power3" });

        const onMove = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          xTo(
            gsap.utils.clamp(
              -16,
              16,
              (event.clientX - (rect.left + rect.width / 2)) * 0.18,
            ),
          );
          yTo(
            gsap.utils.clamp(
              -14,
              14,
              (event.clientY - (rect.top + rect.height / 2)) * 0.18,
            ),
          );
        };

        const onEnter = () => {
          gsap.to(card, {
            scale: 1.045,
            borderColor: "rgba(56,225,255,0.45)",
            duration: 0.45,
            ease: "deepOut",
          });
          gsap.to(chips, {
            borderColor: "rgba(56,225,255,0.65)",
            color: "#c9f3ff",
            boxShadow: "0 0 16px rgba(56,225,255,0.28)",
            duration: 0.35,
            stagger: 0.05,
          });
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
          gsap.to(card, {
            scale: 1,
            borderColor: "rgba(230,237,240,0.08)",
            duration: 0.6,
            ease: "deepOut",
          });
          gsap.to(chips, {
            borderColor: "rgba(230,237,240,0.08)",
            color: "#97a4ab",
            boxShadow: "0 0 0 rgba(56,225,255,0)",
            duration: 0.4,
          });
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        disposers.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

    return () => disposers.forEach((dispose) => dispose());
  }, []);

  useGSAP(
    () => {
      ensureGsap();
      const section = sectionRef.current;
      const rail = railRef.current;
      const svg = svgRef.current;
      const basePath = basePathRef.current;
      const glowPath = glowPathRef.current;
      const livePath = livePathRef.current;
      const orb = orbRef.current;
      const apexEl = apexRef.current;
      if (
        !section ||
        !rail ||
        !svg ||
        !basePath ||
        !glowPath ||
        !livePath ||
        !orb ||
        !apexEl
      ) {
        return;
      }

      // ---- 1. Rebuild the spine in pixel space --------------------
      const railRect = rail.getBoundingClientRect();
      const width = rail.clientWidth;
      const height = rail.scrollHeight;
      const isWide = width >= 900;
      const centerX = width / 2;
      const laneX = 26;
      const amp = Math.min(width * 0.16, 210);

      const anchors = [{ x: isWide ? centerX : laneX, y: 0 }];
      rail
        .querySelectorAll<HTMLElement>("[data-journey-node]")
        .forEach((node) => {
          const nodeRect = node.getBoundingClientRect();
          const y = nodeRect.top - railRect.top + nodeRect.height / 2;
          const side = node.dataset.side === "left" ? -1 : 1;
          anchors.push({ x: isWide ? centerX + side * amp : laneX, y });
        });
      anchors.push({ x: isWide ? centerX : laneX, y: height });

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("preserveAspectRatio", "none");
      const d = buildSpinePath(anchors);
      basePath.setAttribute("d", d);
      glowPath.setAttribute("d", d);
      livePath.setAttribute("d", d);

      // ---- 2. Draw-on-scroll + travelling orb ----------------------
      const pathLength = livePath.getTotalLength();
      gsap.set([livePath, glowPath], {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      const drawTrigger = {
        trigger: rail,
        start: "top 62%",
        end: "bottom 70%",
        scrub: 1.1,
      } as const;

      gsap.to([livePath, glowPath], {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: drawTrigger,
      });

      gsap.set(orb, { xPercent: -50, yPercent: -50, opacity: 0 });
      gsap.to(orb, {
        motionPath: {
          path: livePath,
          align: livePath,
          alignOrigin: [0.5, 0.5],
        },
        ease: "none",
        scrollTrigger: {
          ...drawTrigger,
          onToggle: (self) =>
            gsap.to(orb, { opacity: self.isActive ? 1 : 0, duration: 0.3 }),
        },
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ---- 3. Section intro reveals ------------------------------
        if (introTitleRef.current) {
          SplitText.create(introTitleRef.current, {
            type: "chars",
            mask: "chars",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 110,
                duration: 0.9,
                ease: "deepOut",
                stagger: 0.035,
                scrollTrigger: {
                  trigger: introTitleRef.current,
                  start: "top 82%",
                },
              }),
          });
        }

        // ---- 4. Nodes surface from the Z axis ----------------------
        rail
          .querySelectorAll<HTMLElement>("[data-journey-card]")
          .forEach((card) => {
            gsap.fromTo(
              card,
              {
                opacity: 0,
                y: 70,
                z: -340,
                rotateX: 9,
                transformPerspective: 1100,
              },
              {
                opacity: 1,
                y: 0,
                z: 0,
                rotateX: 0,
                duration: 1.2,
                ease: "deepOut",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              },
            );
          });

        // ---- 5. THE APEX — Envanty, pinned and scrubbed ------------
        const apexTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: apexEl,
            start: "top top",
            end: "+=220%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              scrollBus.intensity = self.progress;
            },
          },
        });

        apexTimeline
          .fromTo(
            "[data-apex-dim]",
            { opacity: 0 },
            { opacity: 1, duration: 0.55, ease: "none" },
            0,
          )
          .fromTo(
            "[data-apex-kicker]",
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.3 },
            0.05,
          )
          .fromTo(
            "[data-apex-product]",
            { opacity: 0, scale: 0.8, filter: "blur(14px)" },
            {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.85,
              ease: "surge",
            },
            0.18,
          )
          .fromTo(
            "[data-apex-statement]",
            { opacity: 0, y: 34 },
            { opacity: 1, y: 0, duration: 0.45 },
            0.75,
          )
          .fromTo(
            "[data-apex-stat]",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 },
            1.05,
          );

        apex.stats.forEach((stat, index) => {
          const el = apexEl.querySelector<HTMLElement>(
            `[data-apex-counter="${index}"]`,
          );
          if (!el) return;
          apexTimeline.fromTo(
            el,
            { innerText: 0 },
            {
              innerText: stat.value,
              snap: { innerText: 1 },
              duration: 0.45,
              ease: "none",
            },
            1.1 + index * 0.12,
          );
        });

        apexTimeline
          .fromTo(
            "[data-apex-chip]",
            { opacity: 0, y: 24, filter: "blur(6px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.45,
              stagger: 0.05,
            },
            1.45,
          )
          .fromTo(
            "[data-apex-modules]",
            { opacity: 0 },
            { opacity: 1, duration: 0.4 },
            1.85,
          )
          .to({}, { duration: 0.4 }, 2.25);
      });
    },
    { dependencies: [layoutVersion], revertOnUpdate: true, scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="journey" className="relative">
      {/* ---- Intro -------------------------------------------------- */}
      <div className="px-5 pb-24 pt-32 sm:px-10 sm:pb-32 sm:pt-44">
        <p className="voice-mono-bright mb-6">{intro.label}</p>
        <h2
          ref={introTitleRef}
          className="voice-display text-ink text-[clamp(3.2rem,11vw,9.5rem)]"
        >
          {intro.title}
        </h2>
        <p className="voice-mono mt-8 max-w-2xl leading-relaxed normal-case tracking-[0.08em]">
          {intro.lede}
        </p>
      </div>

      {/* ---- Rail: spine + nodes ------------------------------------ */}
      <div ref={railRef} className="relative px-5 sm:px-10">
        <svg ref={svgRef} className="journey-svg" role="presentation">
          <defs>
            <linearGradient id="journey-stroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38e1ff" />
              <stop offset="72%" stopColor="#38e1ff" />
              <stop offset="100%" stopColor="#ff4a26" />
            </linearGradient>
          </defs>
          <path ref={basePathRef} className="journey-path-base" d="M 0 0" />
          <path ref={glowPathRef} className="journey-path-glow" d="M 0 0" />
          <path ref={livePathRef} className="journey-path-live" d="M 0 0" />
        </svg>
        <div ref={orbRef} className="journey-orb" />

        <ol className="relative z-10 flex flex-col gap-[16vh] py-[10vh] pl-12 sm:pl-14 lg:pl-0">
          {nodes.map((node) => (
            <li
              key={node.id}
              data-journey-node
              data-side={node.side}
              className={cn(
                "w-full",
                node.kind === "freelance" ? "lg:w-[58%]" : "lg:w-[46%]",
                node.side === "left"
                  ? "lg:self-start lg:pl-[2%]"
                  : "lg:self-end lg:pr-[2%]",
              )}
            >
              <JourneyCard node={node} />
            </li>
          ))}
        </ol>
      </div>

      {/* ---- Apex: ENVANTY ------------------------------------------ */}
      <div ref={apexRef} className="apex-stage flex min-h-svh items-center">
        <div data-apex-dim className="apex-dim" />
        <div className="relative z-10 w-full px-5 py-20 sm:px-10">
          <p
            data-apex-kicker
            className="voice-mono-bright mb-6 leading-relaxed"
          >
            {apex.kicker}
          </p>
          <h3 data-apex-product className="voice-display apex-product">
            {apex.product}
          </h3>
          <p
            data-apex-statement
            className="mt-8 max-w-3xl text-base leading-relaxed text-dim sm:text-lg"
          >
            {apex.statement}
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
            {apex.stats.map((stat, index) => (
              <div key={stat.label} data-apex-stat>
                <p className="apex-stat-value glow-pulse">
                  {stat.prefix}
                  <span data-apex-counter={index}>{stat.value}</span>
                  {stat.suffix}
                </p>
                <p className="voice-mono mt-3">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-3">
            {apex.stack.map((item) => (
              <span key={item} data-apex-chip className="apex-chip">
                {item}
              </span>
            ))}
          </div>

          <p
            data-apex-modules
            className="voice-mono mt-12 max-w-3xl leading-loose"
          >
            PRODUCTION MODÜLLERİ — {modules.join(" · ").toUpperCase()}
          </p>
        </div>
      </div>
    </section>
  );
}

function JourneyCard({ node }: { node: JourneyNode }) {
  return (
    <article data-journey-card className="node-card">
      <header className="flex items-start justify-between gap-4">
        <span className="voice-display text-outline text-5xl sm:text-6xl">
          {node.index}
        </span>
        <span className="node-period">{node.period}</span>
      </header>

      <p className="voice-mono-bright mt-6">{node.eyebrow}</p>
      <h3 className="voice-display text-ink mt-3 text-3xl sm:text-4xl">
        {node.title}
      </h3>
      {node.org ? <p className="voice-mono mt-2">{node.org}</p> : null}

      <p className="mt-5 text-[0.95rem] leading-relaxed text-dim">
        {node.summary}
      </p>

      {node.bullets && node.bullets.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-2">
          {node.bullets.map((bullet) => (
            <li
              key={bullet}
              className="font-mono text-[0.74rem] leading-relaxed text-ghost"
            >
              <span className="text-pulse">▸ </span>
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}

      {node.projects && node.projects.length > 0 ? (
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {node.projects.map((project) => (
            <ProjectCard key={project.domain} project={project} />
          ))}
        </div>
      ) : null}

      {node.tech && node.tech.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {node.tech.map((tech) => (
            <span key={tech} className="tech-chip">
              {tech}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function ProjectCard({ project }: { project: FreelanceProject }) {
  return (
    <a
      data-magnetic
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
    >
      <p className="voice-display text-ink text-xl leading-none">
        {project.name}
      </p>
      <p className="voice-mono-bright mt-2 text-[0.6rem]">{project.domain}</p>
      <p className="mt-3 text-[0.78rem] leading-relaxed text-ghost">
        {project.summary}
      </p>
      <span className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <span key={tech} className="tech-chip">
            {tech}
          </span>
        ))}
      </span>
    </a>
  );
}
