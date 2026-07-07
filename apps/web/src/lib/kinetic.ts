import { ensureGsap, gsap } from "./gsap";

/**
 * Character pools for the decryption aesthetic. DECRYPT_CHARS drives
 * ScrambleText reveals; BCRYPT_ALPHABET builds fake-but-plausible
 * bcrypt digests for the preloader stream.
 */
export const DECRYPT_CHARS = "ABCDEF0123456789$#/<>*+";

const BCRYPT_ALPHABET =
  "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Builds a random `$2b$12$…` string, shaped like a real bcrypt hash. */
export function makeBcryptHash(): string {
  let body = "";
  for (let i = 0; i < 53; i += 1) {
    body += BCRYPT_ALPHABET[Math.floor(Math.random() * BCRYPT_ALPHABET.length)];
  }
  return `$2b$12$${body}`;
}

type DecryptOptions = {
  /** ScrollTrigger start position (default: "top 80%"). */
  start?: string;
  duration?: number;
  chars?: string;
};

/**
 * Decryption reveal for headlines: when the element scrolls into
 * view, its letters churn through cipher characters and settle into
 * the original text. SSR keeps the real text in the DOM, so SEO and
 * no-JS readers never see the scramble.
 */
export function decryptOnScroll(
  element: HTMLElement,
  options: DecryptOptions = {},
): gsap.core.Tween {
  ensureGsap();
  const { start = "top 80%", duration = 1.5, chars = DECRYPT_CHARS } = options;
  const original = element.textContent ?? "";

  return gsap.to(element, {
    duration,
    ease: "none",
    scrambleText: {
      text: original,
      chars,
      speed: 0.4,
      revealDelay: 0.15,
    },
    scrollTrigger: {
      trigger: element,
      start,
    },
  });
}
