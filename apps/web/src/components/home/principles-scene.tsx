"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CountUp } from "@/components/ui/count-up";

gsap.registerPlugin(ScrollTrigger);

const PRINCIPLES = [
  {
    num: "01",
    title: "Üretim Önce",
    body: "Bir özelliğin ne kadar iyi göründüğü değil, milyonlarca istekte nasıl davrandığı önemlidir. Her karar üretim gerçekliğiyle test edilmelidir.",
    metric: null,
  },
  {
    num: "02",
    title: "Güvenlik Tasarımda",
    body: "Güvenlik sonradan eklenen bir katman değil, mimarinin temel bileşenidir. Tehdit modeli özellik listesinden önce gelir.",
    metric: null,
  },
  {
    num: "03",
    title: "Ölçülebilir DX",
    body: "Geliştiricinin mutlu olduğu sistemler daha az hata içerir. Onboarding süresi, test kolaylığı ve hata mesajlarının anlaşılırlığı gerçek metriklerdir.",
    metric: null,
  },
  {
    num: "04",
    title: "Sadelik Kazanılır",
    body: "Karmaşıklık bir ödüldür, kazanılmalıdır. Basit kalmak vazgeçmek değil, disiplindir. Her soyutlama borçtur; faizini ödeyin.",
    metric: null,
  },
];

const STATS = [
  { value: 99.97, suffix: "%", label: "Uptime (son 90 gün)", decimals: 2 },
  { value: 80,    suffix: "ms", label: "API p95 latency", decimals: 0 },
  { value: 5,     suffix: "+", label: "Üretim tenantı", decimals: 0 },
  { value: 98,    suffix: "",  label: "Lighthouse skoru", decimals: 0 },
];

export function PrinciplesScene() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const listRef     = useRef<HTMLUListElement>(null);
  const numbersRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const list    = listRef.current;
    if (!section || !list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      list.querySelectorAll<HTMLElement>(".principle-item").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const items = list.querySelectorAll<HTMLElement>(".principle-item");

      // Each item fades + slides in on scroll
      items.forEach((item) => {
        const num   = item.querySelector(".principle-num");
        const title = item.querySelector(".principle-title");
        const body  = item.querySelector(".principle-body");

        gsap.set([num, title, body], { opacity: 0, y: 18 });

        ScrollTrigger.create({
          trigger: item,
          start: "top 78%",
          once: true,
          onEnter: () => {
            gsap.to([num, title, body], {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.08,
            });
          },
        });
      });

      // Stats counter trigger
      if (numbersRef.current) {
        gsap.fromTo(
          numbersRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: numbersRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="principles-heading"
      className="border-t border-[hsl(var(--border))] bg-[hsl(var(--surface-subtle))]"
    >
      <div className="container-site py-24 md:py-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="section-label mb-3 block">Mühendislik İlkeleri</span>
            <h2
              id="principles-heading"
              className="text-heading text-[clamp(2rem,4vw,3.5rem)] text-[hsl(var(--foreground))] max-w-[14ch]"
            >
              Her karar bir sistem sorusudur.
            </h2>
          </div>
        </div>

        {/* Principles grid */}
        <ul ref={listRef} className="grid md:grid-cols-2 gap-px border border-[hsl(var(--border))] rounded-2xl overflow-hidden">
          {PRINCIPLES.map((p) => (
            <li
              key={p.num}
              className="principle-item bg-[hsl(var(--card))] p-7 md:p-8
                         hover:bg-[hsl(var(--surface-raised))] transition-colors duration-300"
            >
              <div className="principle-num text-[11px] font-mono font-semibold
                              text-[hsl(var(--accent))] tracking-widest mb-4">
                {p.num}
              </div>
              <h3 className="principle-title text-xl font-semibold tracking-tight
                             text-[hsl(var(--foreground))] mb-3">
                {p.title}
              </h3>
              <p className="principle-body text-sm text-[hsl(var(--foreground-2))] leading-relaxed">
                {p.body}
              </p>
            </li>
          ))}
        </ul>

        {/* Stats row */}
        <div ref={numbersRef} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <div className="text-[clamp(2rem,5vw,3.25rem)] font-black tracking-tighter text-[hsl(var(--foreground))] leading-none">
                <CountUp
                  to={s.value}
                  decimals={s.decimals}
                  suffix={s.suffix}
                  duration={2.2}
                />
              </div>
              <div className="text-xs text-[hsl(var(--foreground-3))] leading-snug">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}