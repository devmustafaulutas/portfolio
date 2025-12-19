import { notFound } from "next/navigation";
import { DocShell } from "@/src/components/layout/doc-shell";
import { Toc } from "@/src/components/content/toc";
import { postsIndex, getPostMeta } from "@/src/features/posts/posts.index";
import { postComponents } from "@/src/features/posts/posts.registry";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const meta = getPostMeta(slug);
  const renderer = postComponents[slug];
  if (!meta || !renderer) return notFound();

  const content = await renderer();

  return (
    <main>
      <DocShell
        nav={
          <div className="rounded-2xl border bg-card p-4">
            <div className="text-xs font-semibold tracking-wide text-foreground/70">
              Posts
            </div>
            <div className="mt-3 space-y-2 text-sm">
              {postsIndex.map((p) => (
                <a
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className={[
                    "block rounded-lg px-2 py-1.5 transition",
                    p.slug === slug
                      ? "bg-muted text-foreground"
                      : "text-foreground/75 hover:bg-muted/60 hover:text-foreground",
                  ].join(" ")}
                >
                  {p.title}
                </a>
              ))}
            </div>
          </div>
        }
        toc={<Toc />}
      >
        <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-mono prose-p:leading-8">
          <div className="not-prose mb-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full border bg-card px-3 py-1 text-xs text-foreground/70">
              {new Date(meta.date).toLocaleDateString("tr-TR")}
            </span>
            <span className="rounded-full border bg-card px-3 py-1 text-xs text-foreground/70">
              {meta.readingTime}
            </span>
            {meta.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-3 py-1 text-xs text-foreground/70"
              >
                {t}
              </span>
            ))}
          </div>

          {content}
        </article>
      </DocShell>
    </main>
  );
}
