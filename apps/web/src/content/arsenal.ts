// ============================================================
// Tech Arsenal Content Model — marquee rows, weighted by tier.
// "core" items render as oversized display type; the backend
// row is intentionally the loudest.
// ============================================================

export type ArsenalTier = "core" | "strong" | "tool";

export type ArsenalItem = {
  label: string;
  tier: ArsenalTier;
};

export type ArsenalRow = {
  id: string;
  heading: string;
  direction: 1 | -1;
  baseSpeed: number;
  emphasis: "aggressive" | "standard" | "quiet";
  items: ArsenalItem[];
};

export const arsenalIntro = {
  label: "03 // TECH ARSENAL",
  title: "Cephanelik",
  lede: "Liste değil, mühimmat. Scroll hızına tepki verir — ne kadar hızlı kaydırırsan, bant o kadar hızlanır.",
} as const;

export const arsenalRows: ArsenalRow[] = [
  {
    id: "backend",
    heading: "BACKEND & ARCHITECTURE",
    direction: -1,
    baseSpeed: 42,
    emphasis: "aggressive",
    items: [
      { label: "C#", tier: "core" },
      { label: ".NET", tier: "core" },
      { label: "ASP.NET CORE", tier: "core" },
      { label: "CQRS", tier: "core" },
      { label: "CLEAN ARCHITECTURE", tier: "core" },
      { label: "RABBITMQ", tier: "core" },
      { label: "MULTI-TENANT SAAS", tier: "core" },
      { label: "MINIMAL API", tier: "strong" },
      { label: "EF CORE", tier: "strong" },
      { label: "WOLVERINEFX", tier: "strong" },
      { label: "REDIS", tier: "strong" },
      { label: "JWT / RBAC", tier: "strong" },
    ],
  },
  {
    id: "frontend",
    heading: "FRONTEND",
    direction: 1,
    baseSpeed: 34,
    emphasis: "standard",
    items: [
      { label: "REACT", tier: "strong" },
      { label: "TYPESCRIPT", tier: "strong" },
      { label: "NEXT.JS", tier: "strong" },
      { label: "VITE", tier: "tool" },
      { label: "JAVASCRIPT", tier: "tool" },
      { label: "HTML", tier: "tool" },
      { label: "CSS", tier: "tool" },
      { label: "LARAVEL", tier: "tool" },
    ],
  },
  {
    id: "tools",
    heading: "TOOLS & RUNTIME",
    direction: -1,
    baseSpeed: 28,
    emphasis: "quiet",
    items: [
      { label: "DOCKER", tier: "strong" },
      { label: "GIT", tier: "tool" },
      { label: "GITHUB", tier: "tool" },
      { label: "SWAGGER", tier: "tool" },
      { label: "SCALAR", tier: "tool" },
      { label: "POSTMAN", tier: "tool" },
      { label: "IIS", tier: "tool" },
      { label: "KESTREL", tier: "tool" },
      { label: "REST API", tier: "tool" },
      { label: "LINQ", tier: "tool" },
      { label: "DEPENDENCY INJECTION", tier: "tool" },
      { label: "MIDDLEWARE", tier: "tool" },
    ],
  },
];
