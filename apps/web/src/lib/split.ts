// ============================================================
// SplitText'in ücretsiz, minimal alternatifi.
// SSR'da metin düz hâliyle kalır (SEO); split yalnızca
// istemcide, animasyon gerekiyorsa yapılır.
// ============================================================

/**
 * Elemanın metnini kelime kelime <span>'lere böler.
 * Dönen dizi animasyon hedefi olarak kullanılır;
 * `revert` orijinal metni geri koyar.
 */
export function splitWords(el: HTMLElement): {
  words: HTMLElement[];
  revert: () => void;
} {
  const original = el.textContent ?? "";
  const words = original.split(/\s+/).filter(Boolean);
  el.textContent = "";

  const spans = words.map((word, i) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.style.display = "inline-block";
    span.style.willChange = "opacity";
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    return span;
  });

  return {
    words: spans,
    revert: () => {
      el.textContent = original;
    },
  };
}

/**
 * Elemanın metnini satır maskesi için tek bir iç span'e sarar.
 * Dış elemana overflow-hidden verilmelidir.
 */
export function wrapInner(el: HTMLElement): HTMLElement {
  const inner = document.createElement("span");
  inner.style.display = "inline-block";
  inner.style.willChange = "transform";
  while (el.firstChild) inner.appendChild(el.firstChild);
  el.appendChild(inner);
  return inner;
}
