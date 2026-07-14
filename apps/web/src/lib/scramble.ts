// ============================================================
// Özel scramble/şifre-çözme motoru · ücretli GSAP eklentisi
// kullanılmaz. rAF tabanlıdır; karakterler soldan sağa doğru
// kilitleninceye kadar rastgele glif gösterir.
// ============================================================

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@+=/\\<>[]{}";

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export function randomHash(length: number): string {
  let out = "";
  for (let i = 0; i < length; i += 1) out += randomGlyph();
  return out;
}

export type ScrambleOptions = {
  /** Toplam süre (ms). */
  duration?: number;
  /** Kilitlenmemiş karakterlerin kaç ms'de bir değişeceği. */
  tick?: number;
  /** Çözülme başlamadan önce tam-rastgele geçen süre (ms). */
  hold?: number;
  onComplete?: () => void;
};

/**
 * `el` içindeki metni rastgele gliflerden hedef metne çözer.
 * Dönen fonksiyon animasyonu iptal eder (cleanup için).
 */
export function scrambleTo(
  el: HTMLElement,
  target: string,
  options: ScrambleOptions = {},
): () => void {
  const { duration = 900, tick = 40, hold = 0, onComplete } = options;
  const chars = Array.from(target);
  let frame = 0;
  let lastTick = 0;
  let start: number | null = null;
  let cancelled = false;

  const render = (now: number) => {
    if (cancelled) return;
    if (start === null) start = now;
    const elapsed = now - start;
    const progress = Math.min(Math.max((elapsed - hold) / duration, 0), 1);
    const locked = Math.floor(progress * chars.length);

    if (now - lastTick >= tick || progress >= 1) {
      lastTick = now;
      let out = "";
      for (let i = 0; i < chars.length; i += 1) {
        const ch = chars[i];
        if (i < locked || progress >= 1) out += ch;
        else if (ch === " ") out += " ";
        else out += randomGlyph();
      }
      el.textContent = out;
    }

    if (progress >= 1) {
      onComplete?.();
      return;
    }
    frame = requestAnimationFrame(render);
  };

  frame = requestAnimationFrame(render);

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
    el.textContent = target;
  };
}
