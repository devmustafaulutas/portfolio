"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./shark-mascot.module.css";

const STORAGE_KEY = "blog:mascot:shark:hidden";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

export function SharkMascot() {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  const [hidden, setHidden] = useState(true); // ilk render’da zıplamasın
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const val = window.localStorage.getItem(STORAGE_KEY);
    setHidden(val === "1");
    setReady(true);
  }, []);

  const mood = useMemo(() => {
    if (!pathname) return { title: "Selam!", text: "Blog’da yüzüyorum 🦈" };

    if (pathname.startsWith("/snippets"))
      return { title: "Kod zamanı", text: "Snippet kokusu aldım 👀" };

    if (pathname.startsWith("/projects"))
      return { title: "Proje modu", text: "Showcase’e dalıyorum 🫧" };

    if (pathname.startsWith("/blog"))
      return { title: "Okuma modu", text: "Yeni yazı var mı?" };

    return { title: "Selam!", text: "Takılıyorum burada 🦈" };
  }, [pathname]);

  if (!ready || hidden) return null;

  return (
    <div className={styles.root} aria-hidden={false}>
      <div
        className={styles.card}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => {
            window.localStorage.setItem(STORAGE_KEY, "1");
            setHidden(true);
          }}
          aria-label="Maskotu gizle"
          title="Maskotu gizle"
        >
          ×
        </button>

        <div className={`${styles.bubble} ${hover ? styles.bubbleOpen : ""}`}>
          <div className={styles.bubbleTitle}>{mood.title}</div>
          <div className={styles.bubbleText}>{mood.text}</div>
        </div>

        <div
          className={[
            styles.sharkWrap,
            reducedMotion ? styles.noMotion : "",
            hover ? styles.sharkHover : styles.sharkPeek,
          ].join(" ")}
        >
          <img
            src="/assets/mascots/shark/shark-logo.svg"
            alt="Shark mascot"
            className={styles.sharkImg}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
