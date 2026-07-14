"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { initReveals } from "@/lib/reveal";
import { caseFilesSection, caseFiles } from "@/content/case-files";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * DOSYA 01'in mimari şeması · CSS ile çizilen monokrom diyagram.
 * Dosya açıldığında çizgiler stroke-dashoffset ile çizilir.
 * Dekor değil, içerik: gerçek sistem topolojisini gösterir.
 */
function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 640 380"
      className="file-diagram mt-4 w-full"
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <line x1="320" y1="56" x2="320" y2="96" strokeWidth="1" />
      <line x1="320" y1="140" x2="320" y2="180" strokeWidth="1" />
      <path d="M320 232 L320 260 L125 260 L125 296" strokeWidth="1" />
      <line x1="320" y1="232" x2="320" y2="296" strokeWidth="1" />
      <path d="M320 232 L320 260 L515 260 L515 296" strokeWidth="1" />

      <rect x="210" y="12" width="220" height="44" strokeWidth="1" />
      <rect x="200" y="96" width="240" height="44" strokeWidth="1" />
      <rect x="180" y="180" width="280" height="52" strokeWidth="1" />
      <rect x="40" y="296" width="170" height="44" strokeWidth="1" />
      <rect x="235" y="296" width="170" height="44" strokeWidth="1" />
      <rect x="430" y="296" width="170" height="44" strokeWidth="1" />
      <rect x="24" y="164" width="592" height="196" strokeWidth="1" strokeDasharray="5 6" opacity="0.5" />

      <text x="320" y="39" textAnchor="middle" className="font-mono" fontSize="12" stroke="none" fill="currentColor">
        REACT + TS DASHBOARD
      </text>
      <text x="320" y="123" textAnchor="middle" className="font-mono" fontSize="12" stroke="none" fill="currentColor">
        MINIMAL API · JWT / RBAC
      </text>
      <text x="320" y="211" textAnchor="middle" className="font-mono" fontSize="12" stroke="none" fill="currentColor">
        CQRS ÇEKİRDEK · CLEAN ARCHITECTURE
      </text>
      <text x="125" y="323" textAnchor="middle" className="font-mono" fontSize="11" stroke="none" fill="currentColor">
        EF CORE · VERİTABANI
      </text>
      <text x="320" y="323" textAnchor="middle" className="font-mono" fontSize="11" stroke="none" fill="currentColor">
        REDIS CACHE
      </text>
      <text x="515" y="316" textAnchor="middle" className="font-mono" fontSize="11" stroke="none" fill="currentColor">
        RABBITMQ +
      </text>
      <text x="515" y="330" textAnchor="middle" className="font-mono" fontSize="11" stroke="none" fill="currentColor">
        WOLVERINEFX
      </text>
      <text x="38" y="184" className="font-mono" fontSize="10" stroke="none" fill="currentColor" opacity="0.6">
        TENANT İZOLASYON SINIRI
      </text>
    </svg>
  );
}

/**
 * Vaka dosyaları · proje kartı yerine dosya dolabı.
 * Kapalı sıralar siyah çelik; açılan dosya kâğıt gibi beyaza döner.
 * Genişleme grid-template-rows ile (ölçüm yok, tersinir, ucuz).
 */
export default function CaseFiles() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string | null>(caseFiles[0].id);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        initReveals(section);
      });
      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  // Akordeon yüksekliği değişince sayfa uzunluğu da değişir;
  // geçiş bitince ScrollTrigger konumları tazelenmeli.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 760);
    return () => window.clearTimeout(id);
  }, [openId]);

  return (
    <section id="dosyalar" ref={sectionRef} className="relative bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
        <SectionHeading
          label={caseFilesSection.label}
          title={caseFilesSection.title}
          lede={caseFilesSection.lede}
        />

        <div className="mt-16 border-t border-paper/15 md:mt-24">
          {caseFiles.map((file) => {
            const isOpen = openId === file.id;
            return (
              <article
                key={file.id}
                id={file.id}
                className={`border-b border-paper/15 ${isOpen ? "file-open" : ""}`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${file.id}-body`}
                    onClick={() => setOpenId(isOpen ? null : file.id)}
                    className={`group flex w-full flex-wrap items-baseline gap-x-6 gap-y-2 px-2 py-7 text-left transition-colors duration-500 md:px-6 md:py-9 ${
                      isOpen ? "bg-paper text-ink" : "hover:bg-paper hover:text-ink"
                    }`}
                    data-cursor
                  >
                    <span className="font-mono text-[10px] tracking-[0.25em] opacity-60 md:text-[11px]">
                      {file.fileNo}
                    </span>
                    <span className="font-display text-2xl uppercase leading-none md:text-4xl">
                      {file.title}
                    </span>
                    <span className="basis-full font-mono text-[10px] tracking-[0.15em] opacity-55 md:basis-auto md:text-[11px]">
                      {file.subtitle}
                    </span>
                    <span className="ml-auto flex items-center gap-4">
                      <span className="hidden font-mono text-[9px] tracking-[0.25em] opacity-50 lg:inline">
                        {file.classification}
                      </span>
                      <span
                        aria-hidden
                        className={`font-mono text-xl transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                      >
                        +
                      </span>
                    </span>
                  </button>
                </h3>

                <div className="file-body" id={`${file.id}-body`}>
                  <div className="file-body-inner">
                    <div className="grid gap-10 bg-paper px-2 pb-12 pt-2 text-ink md:grid-cols-12 md:px-6 md:pb-16">
                      <div className="space-y-8 md:col-span-7">
                        {file.segments.map((segment) => (
                          <div key={segment.label}>
                            <p className="font-mono text-[10px] tracking-[0.3em] opacity-50 md:text-[11px]">
                              {segment.label}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed md:text-base">
                              {segment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="md:col-span-5">
                        <p className="font-mono text-[10px] tracking-[0.3em] opacity-50 md:text-[11px]">
                          STACK
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {file.stack.map((item) => (
                            <li
                              key={item}
                              className="border border-ink/25 px-2.5 py-1 font-mono text-[9px] tracking-[0.15em] md:text-[10px]"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>

                        {file.hasDiagram ? (
                          <div className="mt-8">
                            <p className="font-mono text-[10px] tracking-[0.3em] opacity-50 md:text-[11px]">
                              SİSTEM TOPOLOJİSİ
                            </p>
                            <ArchitectureDiagram />
                          </div>
                        ) : null}

                        <div className="mt-8 border-l-2 border-ink pl-4">
                          <p className="font-mono text-[10px] tracking-[0.3em] opacity-50 md:text-[11px]">
                            BU DOSYA NEYİ KANITLIYOR
                          </p>
                          <p className="mt-2 text-sm italic leading-relaxed md:text-base">
                            {file.proves}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
