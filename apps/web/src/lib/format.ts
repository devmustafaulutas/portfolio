// ============================================================
// Format Utilities
// ============================================================

/** Format an ISO date string for display */
export function formatDate(iso: string, locale = "tr-TR"): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Short date format: "16 Ara 2025" */
export function formatDateShort(iso: string, locale = "tr-TR"): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Machine-readable datetime attribute */
export function isoDate(iso: string): string {
  return new Date(iso).toISOString();
}

/** Language display name */
export function languageLabel(lang: string): string {
  const map: Record<string, string> = {
    TypeScript: "TS",
    JavaScript: "JS",
    "C#": "C#",
    Shell: "SH",
    YAML: "YAML",
    JSON: "JSON",
    SQL: "SQL",
    Rust: "RS",
    Go: "GO",
    Python: "PY",
  };
  return map[lang] ?? lang.slice(0, 4).toUpperCase();
}

/** Language color accent */
export function languageColor(lang: string): string {
  const map: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    "C#": "#178600",
    Shell: "#89e051",
    YAML: "#cb171e",
    SQL: "#e38c00",
    Rust: "#dea584",
    Go: "#00add8",
    Python: "#3572A5",
  };
  return map[lang] ?? "#71717a";
}
