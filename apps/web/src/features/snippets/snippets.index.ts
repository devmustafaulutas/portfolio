export type SnippetMeta = {
  slug: string;
  title: string;
  language: "ts" | "tsx" | "csharp" | "bash" | "sql";
  tags: string[];
  description: string;
  code: string;
};

export const snippetsIndex: SnippetMeta[] = [
  {
    slug: "typed-fetcher",
    title: "Typed Fetcher (tiny http client)",
    language: "ts",
    tags: ["http", "fetch", "types"],
    description: "Küçük, typed ve hataya dayanıklı fetch wrapper.",
    code: `export async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json() as Promise<T>;
}`,
  },
  {
    slug: "efcore-migrations",
    title: "EF Core Migrations CLI (clean)",
    language: "bash",
    tags: ["efcore", "migrations", "dotnet"],
    description: "Clean Architecture solution’da doğru CLI komutları.",
    code: `dotnet ef migrations add Initial --project Infrastructure --startup-project Api
dotnet ef database update --project Infrastructure --startup-project Api`,
  },
  {
  slug: "gsap-scrolltrigger-horizontal",
  title: "GSAP Horizontal Scroll (Pin + TranslateX)",
  language: "ts",
  tags: ["gsap", "scrolltrigger", "ui"],
  description: "Pinned section içinde yatay ilerleyen track pattern.",
  code: `// pseudo: track scrollWidth - container width
// ScrollTrigger: pin + scrub, animate x: 0 -> -maxX`,
},
{
  slug: "next-themes-toggle-gotcha",
  title: "next-themes Toggle Gotcha (disableTransitionOnChange)",
  language: "ts",
  tags: ["nextjs", "themes", "ui"],
  description: "Switch animasyonu niye ölür? sebep: disableTransitionOnChange.",
  code: `// ThemeProvider'da disableTransitionOnChange varsa
// CSS transition'lar theme switch anında kill olur.
// kaldır: <ThemeProvider attribute="class" ... />`,
},

];

export function getSnippet(slug: string) {
  return snippetsIndex.find((x) => x.slug === slug) ?? null;
}
