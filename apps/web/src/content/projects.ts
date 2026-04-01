// ============================================================
// Projects Content Model — Case-study format
// ============================================================

export type ProjectMeta = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "live" | "archived" | "wip";
  stack: string[];
  featured?: boolean;
  coverImage?: string;
  liveUrl?: string;
  repoUrl?: string;
  year: number;
  category: "platform" | "tool" | "library" | "experiment" | "consulting";
};

export type ProjectDetail = ProjectMeta & {
  problem: string;
  solution: string;
  architecture: string;
  keyDecisions: { decision: string; rationale: string }[];
  outcomes: string[];
  metrics?: { label: string; value: string }[];
};

// ---- Loaders -------------------------------------------------------

export async function getAllProjects(): Promise<ProjectMeta[]> {
  return projects;
}

export async function getProject(slug: string): Promise<ProjectDetail | null> {
  return projectDetails.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProjects(): Promise<ProjectMeta[]> {
  return projects.filter((p) => p.featured).slice(0, 3);
}

export function getProjectSlugs(): { slug: string }[] {
  return projects.map((p) => ({ slug: p.slug }));
}

// ---- Mock data -----------------------------------------------------

export const projects: ProjectMeta[] = [
  {
    slug: "envanty",
    name: "Envanty Platform",
    tagline: "Multi-tenant kurumsal yönetim platformu",
    description:
      "Modüler backend, premium dashboard arayüzü, dosya güvenliği ve tam gözlemlenebilirlik ile kurumsal ölçekte SaaS platformu.",
    status: "live",
    stack: [".NET 9", "Wolverine", "CQRS", "React", "PostgreSQL", "Redis"],
    featured: true,
    year: 2024,
    category: "platform",
  },
  {
    slug: "portfolio-platform",
    name: "Portfolio Platform",
    tagline: "Bu site — blog, snippets ve projeler için SSG altyapısı",
    description:
      "Next.js App Router, MDX-hazır içerik mimarisi ve yüksek performanslı statik üretim ile kişisel brand platformu.",
    status: "live",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "GSAP"],
    featured: true,
    year: 2025,
    category: "tool",
  },
  {
    slug: "http-monitor",
    name: "HTTP Monitor",
    tagline: "Lightweight endpoint monitoring aracı",
    description:
      "Servislerinizin ayakta olup olmadığını izleyen, webhook ve e-posta bildirimleri gönderen minimal monitoring aracı.",
    status: "wip",
    stack: [".NET", "Minimal API", "SQLite", "React"],
    featured: false,
    year: 2025,
    category: "tool",
  },
];

export const projectDetails: ProjectDetail[] = [
  {
    ...projects[0],
    problem:
      "Farklı müşterilerin aynı altyapıyı paylaştığı ama birbirinden tamamen izole çalıştığı çok-kiracılı (multi-tenant) bir platform gerekliydi. Mevcut çözümler ya çok karmaşıktı ya da güvenlik izolasyonunu yeterince sağlayamıyordu.",
    solution:
      "Wolverine tabanlı CQRS mimarisi ile her tenant için veri izolasyonu, modüler domain sınırları ve izleme altyapısı kuruldu. React dashboard premium kullanıcı deneyimi sağlıyor.",
    architecture:
      "Clean Architecture katmanları: Domain → Application → Infrastructure → Presentation. Wolverine mesaj yolu ile komut/sorgu ayrımı. PostgreSQL satır düzeyinde güvenlik ile tenant izolasyonu.",
    keyDecisions: [
      {
        decision: "Wolverine'i MediatR yerine tercih etmek",
        rationale:
          "Sagas, durable inbox/outbox ve daha sağlam mesajlaşma semantiği gerekliydi.",
      },
      {
        decision: "PostgreSQL Row-Level Security",
        rationale:
          "Uygulama katmanında tenant filtresi yerine veritabanı katmanında zorunluluk.",
      },
    ],
    outcomes: [
      "5 farklı müşteri onboarding'i sorunsuz tamamlandı",
      "Tenant başına sıfır veri sızıntısı, tüm güvenlik denetimleri geçti",
      "Dashboard yüklenme süresi p95 < 200ms",
    ],
    metrics: [
      { label: "Tenant sayısı", value: "5" },
      { label: "API p95 latency", value: "< 80ms" },
      { label: "Uptime (son 90 gün)", value: "99.97%" },
    ],
  },
  {
    ...projects[1],
    problem:
      "Kişisel markayı yansıtan, SEO'ya hazır, hızlı ve ölçeklenebilir bir blog/portfolio platformu gerekiyordu.",
    solution:
      "Next.js App Router + statik üretim ile içerik-öncelikli mimari. GSAP/Lenis ile premium hissiyat, Shiki ile kod vurgulaması.",
    architecture:
      "Tam statik üretim (SSG), içerik dosya sistemi üzerinde. İleride MDX veya CMS entegrasyonu için hazır API katmanı.",
    keyDecisions: [
      {
        decision: "Tailwind CSS v4 seçimi",
        rationale:
          "CSS değişkenleri tabanlı theme sistemi, daha az JavaScript, daha hızlı build.",
      },
    ],
    outcomes: [
      "Lighthouse performans skoru 98+",
      "Core Web Vitals tümü 'Good' bandında",
      "Kolay içerik yönetimi ve blog yazımı",
    ],
  },
  {
    ...projects[2],
    problem:
      "Açık kaynak monitoring araçları ya çok ağır ya da self-hosted kurulumu karmaşık.",
    solution:
      "SQLite destekli minimal .NET servisi + React arayüzü ile sıfır bağımlılıklı monitoring.",
    architecture: "Minimal API, background service, SQLite, basit React SPA.",
    keyDecisions: [
      {
        decision: "SQLite tercih edildi",
        rationale: "Harici veritabanı gerektirmeden tek binary deploy.",
      },
    ],
    outcomes: ["Geliştirme devam ediyor"],
  },
];
