import { gsap } from "@/lib/gsap";

/**
 * Kapsam içindeki [data-reveal] elemanlarına tersinir,
 * scroll'a bağlı giriş animasyonu uygular. Başlangıç durumu
 * JS ile verildiği için JS yoksa içerik görünür kalır.
 */
export function initReveals(scope: HTMLElement): void {
  const elements = scope.querySelectorAll<HTMLElement>("[data-reveal]");
  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 48 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}
