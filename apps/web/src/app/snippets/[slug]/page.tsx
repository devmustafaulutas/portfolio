import { notFound } from "next/navigation";
import { DocShell } from "@/src/components/layout/doc-shell";
import { Toc } from "@/src/components/content/toc";
import { CodeBlock } from "@/src/components/content/code-block";
import { getSnippet, snippetsIndex } from "@/src/features/snippets/snippets.index";

export default async function SnippetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const snip = getSnippet(slug);
  if (!snip) return notFound();

  return (
    <main>
      <DocShell
        nav={
          <div className="rounded-2xl border bg-card p-4">
            <div className="text-xs font-semibold tracking-wide text-foreground/70">
              Snippets
            </div>
            <div className="mt-3 space-y-2 text-sm">
              {snippetsIndex.map((s) => (
                <a
                  key={s.slug}
                  href={`/snippets/${s.slug}`}
                  className={[
                    "block rounded-lg px-2 py-1.5 transition",
                    s.slug === slug
                      ? "bg-muted text-foreground"
                      : "text-foreground/75 hover:bg-muted/60 hover:text-foreground",
                  ].join(" ")}
                >
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        }
        toc={<Toc selector="article h2, article h3" />}
      >
        <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-mono prose-p:leading-8">
          <header data-section>
            <p data-reveal className="text-sm text-foreground/60">
              Snippet / {snip.language}
            </p>
            <h1 data-reveal>{snip.title}</h1>
            <p data-reveal>{snip.description}</p>
          </header>

          <section data-section className="mt-10">
            <h2 id="code" data-reveal>Code</h2>
            <div data-reveal className="mt-4">
              <CodeBlock
                lang={snip.language}
                filename={`${snip.slug}.${snip.language}`}
                code={snip.code}
              />
            </div>
          </section>

          <section data-section className="mt-10">
            <h2 id="notes" data-reveal>Notes</h2>
            <ul data-reveal>
              <li>Bu snippet’leri ileride API’den yönetip admin panelde düzenleyeceğiz.</li>
              <li>Tag’ler: {snip.tags.join(", ")}</li>
            </ul>
          </section>
        </article>
      </DocShell>
    </main>
  );
}
