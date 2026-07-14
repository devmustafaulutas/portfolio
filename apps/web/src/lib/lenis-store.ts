// ============================================================
// Lenis örneğine uygulama genelinden erişim. Header gibi
// bileşenler programatik scroll'u Lenis üzerinden yapmalı;
// native smooth scroll, Lenis'in rAF döngüsüyle çakışır.
// ============================================================

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}
