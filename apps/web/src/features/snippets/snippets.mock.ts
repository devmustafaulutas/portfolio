export type SnippetSummary = {
  slug: string;
  title: string;
  language: string;
  tags: string[];
  preview: string;
};

export const snippets: SnippetSummary[] = [
  {
    slug: "http-client-fetcher",
    title: "Typed Fetcher",
    language: "TypeScript",
    tags: ["http", "fetch", "types"],
    preview: "export async function get<T>(url: string): Promise<T> { ... }",
  },
  {
    slug: "efcore-migrations-cli",
    title: "EF Core CLI (Clean Setup)",
    language: "C#",
    tags: ["efcore", "migrations"],
    preview: "dotnet ef migrations add Initial --project ...",
  },
];
