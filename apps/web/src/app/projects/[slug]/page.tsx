import { notFound } from "next/navigation";
import { DocShell } from "@/src/components/layout/doc-shell";
import { Toc } from "@/src/components/content/toc";
import { getProject, projectsIndex } from "@/src/features/projects/projects.index";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return notFound();

  return (
    <main>
      <DocShell
        nav={
          <div className="rounded-2xl border bg-card p-4">
            <div className="text-xs font-semibold tracking-wide text-foreground/70">
              Projects
            </div>
            <div className="mt-3 space-y-2 text-sm">
              {projectsIndex.map((x) => (
                <a
                  key={x.slug}
                  href={`/projects/${x.slug}`}
                  className={[
                    "block rounded-lg px-2 py-1.5 transition",
                    x.slug === slug
                      ? "bg-muted text-foreground"
                      : "text-foreground/75 hover:bg-muted/60 hover:text-foreground",
                  ].join(" ")}
                >
                  {x.name}
                </a>
              ))}
            </div>
          </div>
        }
        toc={<Toc selector="article h2, article h3" />}
      >
        <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-mono prose-p:leading-8">
          <header data-section>
            <p data-reveal className="text-sm text-foreground/60">Case Study</p>
            <h1 data-reveal>{p.name}</h1>
            <p data-reveal>{p.description}</p>
          </header>

          <section data-section className="mt-12">
            <h2 id="stack" data-reveal>Stack</h2>
            <div data-reveal className="not-prose mt-4 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="rounded-full border bg-card px-3 py-1 text-xs">
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section data-section className="mt-12">
            <h2 id="highlights" data-reveal>Highlights</h2>
            <ul data-reveal>
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>

          <section data-section className="mt-12">
            <h2 id="architecture" data-reveal>Architecture</h2>
            <p data-reveal>
              Clean Architecture + typed SDK + UI package paylaşımı. Hedef: hızlı iterasyon + kurumsal güvenilirlik.
            </p>
          </section>
        </article>
      </DocShell>
    </main>
  );
}
