"use client";

import React, { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";
import styles from "./theme-toggle.module.css";

export function ThemeToggle() {
  const id = useId();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Uiverse: checked = gündüz (light)
  const current = resolvedTheme ?? theme;
  const isLight = mounted ? current === "light" : true;

  // hydration’da zıplamasın diye placeholder
  if (!mounted) {
    return <div className="h-[2.2em] w-[4em] rounded-full border bg-card" />;
  }

  return (
    <label className={styles.switch} aria-label="Tema değiştir">
      <input
        id={id}
        type="checkbox"
        checked={isLight}
        onChange={(e) => setTheme(e.target.checked ? "light" : "dark")}
      />
      <span className={styles.slider}>
        <div className={`${styles.star} ${styles.star_1}`} />
        <div className={`${styles.star} ${styles.star_2}`} />
        <div className={`${styles.star} ${styles.star_3}`} />

        <svg viewBox="0 0 16 16" className={`${styles.cloud} ${styles.cloud_1}`}>
          <path
            transform="matrix(.77976 0 0 .78395-299.99-418.63)"
            fill="#fff"
            d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v .034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
          />
        </svg>
      </span>
    </label>
  );
}
