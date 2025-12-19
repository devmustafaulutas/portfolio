export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; 
  tags: string[];
};

export const posts: PostSummary[] = [
  {
    slug: "clean-architecture-dotnet-nextjs",
    title: "Clean Architecture: .NET API + Next.js Web",
    excerpt:
      "Monorepo’da ölçeklenebilir bir mimariyi nasıl kuruyorum: katmanlar, bağımlılık yönü, deploy stratejisi.",
    date: "2025-12-16",
    tags: ["dotnet", "nextjs", "architecture"],
  },
  {
    slug: "react-query-patterns",
    title: "React Query Patterns (Production Notes)",
    excerpt:
      "Cache, invalidate, optimistic update ve server-state sınırlarını netleştirme.",
    date: "2025-12-10",
    tags: ["react", "tanstack", "frontend"],
  },
];
