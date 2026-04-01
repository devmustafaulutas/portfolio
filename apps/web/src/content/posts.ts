// ============================================================
// Posts Content Model
// Ready to evolve into MDX / CMS / API-backed content
// ============================================================

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  updatedAt?: string;
  tags: string[];
  readingTime: string;
  featured?: boolean;
  coverImage?: string;
  series?: string;
};

// ---- Content loader (swap this function for CMS/MDX later) ---------

export async function getAllPosts(): Promise<PostMeta[]> {
  return posts;
}

export async function getPost(slug: string): Promise<PostMeta | null> {
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedPosts(): Promise<PostMeta[]> {
  return posts.filter((p) => p.featured).slice(0, 3);
}

export async function getLatestPosts(n = 5): Promise<PostMeta[]> {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  return posts.filter((p) => p.tags.includes(tag));
}

export function getAllTags(): string[] {
  return [...new Set(posts.flatMap((p) => p.tags))].sort();
}

// ---- Mock data (replace with real content) -------------------------

export const posts: PostMeta[] = [
  {
    slug: "clean-architecture-dotnet-nextjs",
    title: "Clean Architecture: .NET API + Next.js Web (Production Template)",
    excerpt:
      "Monorepo'da ölçeklenebilir mimari nasıl kurulur: katmanlar, bağımlılık yönü, proje şablonu ve CI/CD deploy stratejisi.",
    date: "2025-12-16",
    tags: ["dotnet", "nextjs", "architecture", "monorepo"],
    readingTime: "9 dk",
    featured: true,
  },
  {
    slug: "react-query-patterns",
    title: "React Query Patterns (Production Notes)",
    excerpt:
      "Cache, invalidate, optimistic update, server-state sınırları ve gerçek dünya performans notları.",
    date: "2025-12-10",
    tags: ["react", "tanstack", "frontend"],
    readingTime: "6 dk",
    featured: true,
  },
  {
    slug: "premium-docs-ui-system",
    title: "Premium Docs UI: Sticky TOC + Motion + Code Blocks",
    excerpt:
      "Yapışkan içindekiler, mikro-animasyonlar, Shiki kod blokları ve demo embed mimarisi ile yüksek kaliteli bir belge arayüzü.",
    date: "2025-12-17",
    tags: ["ui", "docs", "gsap", "lenis"],
    readingTime: "7 dk",
    featured: false,
  },
  {
    slug: "efcore-postgres-migrations-playbook",
    title: "EF Core + Postgres Migrations Playbook",
    excerpt:
      "Startup project/design paketleri, migration komutları, CI/CD güvenli güncelleme stratejisi ve yaygın tuzaklar.",
    date: "2025-12-14",
    tags: ["dotnet", "efcore", "postgres"],
    readingTime: "8 dk",
    featured: false,
  },
  {
    slug: "performance-budgets-nextjs",
    title: "Next.js Uygulamalarında Performans Bütçesi",
    excerpt:
      "LCP, FID, CLS hedefleri, bundle analizi, image optimizasyonu ve gerçek dünya performans monitoring kurulumu.",
    date: "2025-11-28",
    tags: ["nextjs", "performance", "web-vitals"],
    readingTime: "11 dk",
    featured: false,
  },
];

// ---- Static params for generateStaticParams -----------------------

export function getPostSlugs(): { slug: string }[] {
  return posts.map((p) => ({ slug: p.slug }));
}
