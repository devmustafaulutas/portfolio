export type ProjectMeta = {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  highlights: string[];
};

export const projectsIndex: ProjectMeta[] = [
  {
    slug: "envanty",
    name: "Envanty Platform",
    description:
      "Multi-tenant kurumsal platform: modüler backend, premium dashboard UI, dosya güvenliği, observability.",
    stack: [".NET", "Wolverine", "React", "PostgreSQL", "OpenTelemetry"],
    highlights: ["CQRS + workflow engine", "Secure file storage", "Premium admin UX"],
  },
  {
    slug: "portfolio-platform",
    name: "Portfolio Platform",
    description:
      "Blog + snippets + projects; admin panel ile içerik yönetimi. Next.js + .NET API + Azure Postgres.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Azure", "Postgres"],
    highlights: ["Docs-like blog experience", "Typed SDK", "Vercel + Azure deploy"],
  },
];

export function getProject(slug: string) {
  return projectsIndex.find((x) => x.slug === slug) ?? null;
}
