"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { initReveals } from "@/lib/reveal";
import { projectsSection, projects, type ProjectSketch } from "@/content/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrambleText from "@/components/ui/ScrambleText";

/**
 * Ekran görüntüsü yerine konsept: her proje için elle çizilmiş,
 * monokrom bir tel-kafes kompozisyonu. Panel imleci takip eder.
 */
function SketchArt({ type }: { type: ProjectSketch }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
  } as const;

  switch (type) {
    case "grid":
      return (
        <svg viewBox="0 0 320 220" className="h-full w-full" {...common}>
          <rect x="16" y="16" width="64" height="188" />
          <line x1="28" y1="40" x2="68" y2="40" />
          <line x1="28" y1="60" x2="68" y2="60" />
          <line x1="28" y1="80" x2="68" y2="80" />
          <rect x="96" y="16" width="208" height="44" />
          <rect x="96" y="76" width="98" height="60" />
          <rect x="206" y="76" width="98" height="60" />
          <rect x="96" y="152" width="208" height="52" />
          <path d="M104 192 L136 168 L168 184 L200 160 L232 176 L264 156 L296 168" />
        </svg>
      );
    case "browser":
      return (
        <svg viewBox="0 0 320 220" className="h-full w-full" {...common}>
          <rect x="16" y="16" width="288" height="188" />
          <line x1="16" y1="44" x2="304" y2="44" />
          <circle cx="32" cy="30" r="4" />
          <circle cx="48" cy="30" r="4" />
          <rect x="70" y="22" width="180" height="16" />
          <rect x="36" y="66" width="150" height="14" />
          <rect x="36" y="90" width="110" height="10" />
          <rect x="36" y="118" width="120" height="62" />
          <rect x="172" y="118" width="112" height="62" />
        </svg>
      );
    case "qr":
      return (
        <svg viewBox="0 0 320 220" className="h-full w-full" {...common}>
          <rect x="24" y="30" width="120" height="120" />
          <rect x="40" y="46" width="28" height="28" />
          <rect x="100" y="46" width="28" height="28" />
          <rect x="40" y="106" width="28" height="28" />
          <rect x="88" y="94" width="12" height="12" />
          <rect x="112" y="106" width="16" height="16" />
          <rect x="88" y="130" width="10" height="10" />
          <line x1="176" y1="46" x2="296" y2="46" />
          <line x1="176" y1="74" x2="272" y2="74" />
          <line x1="176" y1="102" x2="288" y2="102" />
          <line x1="176" y1="130" x2="260" y2="130" />
          <path d="M24 176 h272" strokeDasharray="4 6" />
          <rect x="176" y="150" width="60" height="10" />
        </svg>
      );
    case "shaft":
      return (
        <svg viewBox="0 0 320 220" className="h-full w-full" {...common}>
          <line x1="120" y1="12" x2="120" y2="208" />
          <line x1="200" y1="12" x2="200" y2="208" />
          <rect x="132" y="60" width="56" height="72" />
          <line x1="160" y1="60" x2="160" y2="132" />
          <path d="M150 36 L160 22 L170 36" />
          <path d="M150 184 L160 198 L170 184" />
          <line x1="36" y1="40" x2="96" y2="40" />
          <line x1="36" y1="60" x2="84" y2="60" />
          <line x1="224" y1="150" x2="292" y2="150" />
          <line x1="224" y1="170" x2="276" y2="170" />
        </svg>
      );
    case "document":
      return (
        <svg viewBox="0 0 320 220" className="h-full w-full" {...common}>
          <rect x="60" y="16" width="200" height="188" />
          <line x1="84" y1="52" x2="236" y2="52" />
          <line x1="84" y1="76" x2="212" y2="76" />
          <line x1="84" y1="96" x2="224" y2="96" />
          <rect x="132" y="128" width="56" height="44" />
          <path d="M144 128 v-12 a16 16 0 0 1 32 0 v12" />
          <line x1="160" y1="144" x2="160" y2="156" />
        </svg>
      );
  }
}

/**
 * Proje endeksi · dev tipografili satır listesi.
 * Hover: isim scramble olur, diğer satırlar söner, imleci izleyen
 * monokrom önizleme paneli açılır. Dokunmatikte panel yok;
 * tüm bilgi satırın içinde zaten mevcut.
 */
export default function ProjectIndex() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelInnerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string>(projects[0].id);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const list = listRef.current;
      const panel = panelRef.current;
      const panelInner = panelInnerRef.current;
      if (!section || !list || !panel || !panelInner) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        initReveals(section);

        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        // Konum (x/y/rotation) dış panelde, scale + görünürlük iç
        // katmanda yaşar; aynı elemanda karışırlarsa GSAP transform
        // önbelleği uyarı üretir.
        gsap.set(panelInner, { autoAlpha: 0, scale: 0.85 });

        // quickTo'lar panel ilk kez konumlandıktan sonra kurulur;
        // aynı özelliğe gsap.set ile dokunmak uyarı üretir.
        let quick: {
          x: gsap.QuickToFunc;
          y: gsap.QuickToFunc;
          rot: gsap.QuickToFunc;
        } | null = null;
        let lastX = 0;

        const ensureQuick = (e: PointerEvent) => {
          if (quick) return;
          gsap.set(panel, { x: e.clientX + 28, y: e.clientY - 105 });
          quick = {
            x: gsap.quickTo(panel, "x", { duration: 0.45, ease: "power3.out" }),
            y: gsap.quickTo(panel, "y", { duration: 0.45, ease: "power3.out" }),
            rot: gsap.quickTo(panel, "rotation", { duration: 0.6, ease: "power3.out" }),
          };
        };

        const onMove = (e: PointerEvent) => {
          ensureQuick(e);
          quick?.x(e.clientX + 28);
          quick?.y(e.clientY - 105);
          quick?.rot(gsap.utils.clamp(-7, 7, (e.clientX - lastX) * 0.55));
          lastX = e.clientX;
        };
        const onEnter = (e: PointerEvent) => {
          lastX = e.clientX;
          ensureQuick(e);
          gsap.to(panelInner, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out", overwrite: "auto" });
        };
        const onLeave = () => {
          quick?.rot(0);
          gsap.to(panelInner, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: "power3.in", overwrite: "auto" });
        };

        list.addEventListener("pointermove", onMove, { passive: true });
        list.addEventListener("pointerenter", onEnter, { passive: true });
        list.addEventListener("pointerleave", onLeave, { passive: true });

        return () => {
          list.removeEventListener("pointermove", onMove);
          list.removeEventListener("pointerenter", onEnter);
          list.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const activeProject = projects.find((p) => p.id === activeId) ?? projects[0];

  return (
    <section id="projeler" ref={sectionRef} className="relative bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
        <SectionHeading
          label={projectsSection.label}
          title={projectsSection.title}
          lede={projectsSection.lede}
        />

        <div ref={listRef} className="group/list mt-16 md:mt-24">
          {projects.map((project) => (
            <a
              key={project.id}
              href={project.href ?? "#dosya-01"}
              target={project.href ? "_blank" : undefined}
              rel={project.href ? "noreferrer" : undefined}
              data-scramble-host
              data-cursor
              onPointerEnter={() => setActiveId(project.id)}
              onFocus={() => setActiveId(project.id)}
              className="group/row block border-t border-paper/15 py-8 transition-opacity duration-300 last:border-b group-hover/list:opacity-30 hover:opacity-100! focus-visible:opacity-100! md:py-10"
              data-reveal
            >
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <span className="font-mono text-[10px] tracking-[0.25em] opacity-50 md:text-xs">
                  {project.index}
                </span>
                <span className="font-display text-[clamp(1.9rem,6vw,4.6rem)] uppercase leading-none transition-transform duration-500 group-hover/row:translate-x-3">
                  <ScrambleText text={project.name} trigger="parent" />
                </span>
                <span className="ml-auto font-mono text-[9px] tracking-[0.2em] opacity-60 md:text-[11px]">
                  {project.note ?? "CANLI ↗"}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between">
                <p className="max-w-xl text-sm leading-relaxed opacity-65 md:text-base">
                  {project.description}
                  <span className="mt-1 block text-xs italic opacity-70 md:text-sm">
                    {project.interesting}
                  </span>
                </p>
                <p className="shrink-0 font-mono text-[9px] leading-relaxed tracking-[0.15em] opacity-50 md:text-right md:text-[10px]">
                  {project.role}
                  <span className="block">{project.stack.join(" · ")}</span>
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* İmleci takip eden önizleme dosyası */}
      <div
        ref={panelRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden h-[210px] w-[300px] will-change-transform md:block"
      >
        <div
          ref={panelInnerRef}
          className="h-full w-full border border-paper/30 bg-ink text-paper opacity-0"
        >
          <div className="relative h-[172px] w-full p-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`absolute inset-3 transition-opacity duration-300 ${
                project.id === activeId ? "opacity-100" : "opacity-0"
              }`}
            >
              <SketchArt type={project.sketch} />
            </div>
          ))}
          </div>
          <div className="flex items-center justify-between border-t border-paper/20 px-3 py-2 font-mono text-[9px] tracking-[0.2em]">
            <span>{activeProject.index} / {activeProject.name}</span>
            <span className="opacity-50">ÖNİZLEME</span>
          </div>
        </div>
      </div>
    </section>
  );
}
