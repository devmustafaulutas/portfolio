export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  readingTime: string;
};

export const postsIndex: PostMeta[] = [
  {
    slug: "clean-architecture-dotnet-nextjs",
    title: "Clean Architecture: .NET API + Next.js Web (Production Template)",
    excerpt:
      "Monorepo, katmanlar, bağımlılık yönü, deploy stratejisi ve DX (developer experience) notları.",
    date: "2025-12-16",
    tags: ["dotnet", "nextjs", "architecture", "monorepo"],
    readingTime: "9 min",
  },
  {
    slug: "react-query-patterns",
    title: "React Query Patterns (Production Notes)",
    excerpt:
      "Cache, invalidate, optimistic update, server-state sınırları ve performans.",
    date: "2025-12-10",
    tags: ["react", "tanstack", "frontend"],
    readingTime: "6 min",
  },
  {
  slug: "premium-docs-ui-system",
  title: "Premium Docs UI System: Sticky TOC + Motion + Code Blocks",
  excerpt: "TOC, docs shell, micro-interactions, shiki code blocks ve demo embed mimarisi.",
  date: "2025-12-17",
  tags: ["ui", "docs", "gsap", "lenis"],
  readingTime: "7 min",
},
{
  slug: "efcore-postgres-migrations-playbook",
  title: "EF Core + Postgres Migrations Playbook (Clean Architecture)",
  excerpt: "Startup project/design paketleri, migration komutları, CI/CD’de güvenli update stratejisi.",
  date: "2025-12-14",
  tags: ["dotnet", "efcore", "postgres"],
  readingTime: "8 min",
},

];

export function getPostMeta(slug: string) {
  return postsIndex.find((x) => x.slug === slug) ?? null;
}
