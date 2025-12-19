export type ProjectSummary = {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  href?: string;
};

export const projects: ProjectSummary[] = [
  {
    slug: "envanty",
    name: "Envanty Platform",
    description:
      "Multi-tenant kurumsal platform: modüler backend, premium dashboard UI, dosya güvenliği ve gözlemlenebilirlik.",
    stack: [".NET", "Wolverine", "React", "PostgreSQL"],
  },
  {
    slug: "portfolio-platform",
    name: "Portfolio Platform",
    description:
      "Blog + snippets + projects; admin panel ile içerik yönetimi.",
    stack: ["Next.js", "TypeScript", "Tailwind"],
  },
];
