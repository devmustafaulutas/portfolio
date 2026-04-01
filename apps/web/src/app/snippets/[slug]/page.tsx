import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSnippet, getSnippetSlugs } from "@/content/snippets";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, jsonLd } from "@/lib/seo";
import { languageColor } from "@/lib/format";
import { CodeBlock } from "@/components/content/code-block";
import { CopyCodeButton } from "@/components/content/copy-button";

export async function generateStaticParams() {
  return getSnippetSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const snippet = await getSnippet(slug);
  if (!snippet) return {};

  return {
    title: snippet.title,
    description: snippet.description,
    alternates: { canonical: `${siteConfig.url}/snippets/${slug}` },
  };
}

export default async function SnippetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const snippet = await getSnippet(slug);
  if (!snippet) notFound();

  const langColor = languageColor(snippet.language);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Ana Sayfa", href: "/" },
              { name: "Blog", href: "/blog#snippets" },
              { name: snippet.title, href: `/snippets/${slug}` },
            ])
          ),
        }}
      />

      <div className="container-narrow py-12 md:py-16">
        <Link
          href="/blog#snippets"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-[hsl(var(--foreground-2))] transition-colors hover:text-[hsl(var(--foreground))]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Blog içindeki snippets
        </Link>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className="badge font-mono text-[10px]"
              style={{ borderColor: `${langColor}50`, color: langColor }}
            >
              {snippet.language}
            </span>

            {snippet.tags.map((tag) => (
              <span key={tag} className="badge text-[10px]">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-heading mb-3 text-[clamp(1.9rem,4vw,3rem)] text-[hsl(var(--foreground))]">
            {snippet.title}
          </h1>

          <p className="text-body max-w-[56ch]">{snippet.description}</p>
        </header>

        <section aria-label="Kod">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-label">Kod</div>
            <CopyCodeButton code={snippet.code} />
          </div>

          <CodeBlock
            code={snippet.code}
            language={snippet.language}
            filename={`${slug}.${langExt(snippet.language)}`}
          />
        </section>

        {snippet.usage ? (
          <section aria-label="Kullanım" className="mt-10">
            <div className="mb-3 text-label">Kullanım Örneği</div>
            <CodeBlock code={snippet.usage} language={snippet.language} filename="usage" />
          </section>
        ) : null}

        {snippet.notes ? (
          <section aria-label="Notlar" className="mt-10">
            <div className="mb-3 text-label">Notlar</div>
            <div className="callout callout-info text-sm leading-relaxed">{snippet.notes}</div>
          </section>
        ) : null}
      </div>
    </>
  );
}

function langExt(lang: string): string {
  const map: Record<string, string> = {
    TypeScript: "ts",
    JavaScript: "js",
    "C#": "cs",
    Shell: "sh",
    YAML: "yml",
    SQL: "sql",
    Rust: "rs",
    Go: "go",
    Python: "py",
  };

  return map[lang] ?? "txt";
}