import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllPosts, getAllTags } from "@/content/posts";
import { getFeaturedSnippets } from "@/content/snippets";
import { siteConfig } from "@/config/site";
import { formatDateShort } from "@/lib/format";
import { BlogSearch } from "@/components/content/blog-search";
import { breadcrumbSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Yazılar, notlar ve tekrar kullanılabilir snippet'lar: Next.js, .NET, performans, frontend motion ve sistem tasarımı.",
  alternates: { canonical: `${siteConfig.url}/blog` },
};

export default async function BlogPage() {
  const [posts, snippets] = await Promise.all([getAllPosts(), getFeaturedSnippets()]);
  const tags = getAllTags();

  const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = sortedPosts;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Ana Sayfa", href: "/" },
              { name: "Blog", href: "/blog" },
            ])
          ),
        }}
      />

      <div className="container-site py-16 md:py-24">
        <header className="max-w-[54rem]">
          <div className="section-label mb-5">Blog</div>
          <h1 className="text-display text-[clamp(2.8rem,8vw,6rem)] text-[hsl(var(--foreground))]">
            Yazılar, notlar, snippets.
          </h1>
          <p className="mt-6 max-w-[45ch] text-lg leading-8 text-[hsl(var(--foreground-2))]">
            Ayrı bir snippet vitrini yerine, okumayı ve hızlı referansı tek akışta topladım. Burada hem uzun yazılar hem de pratik kod notları var.
          </p>
        </header>

        {featured ? (
          <section aria-label="Öne çıkan yazı" className="mt-14">
            <div className="section-label mb-4">Öne çıkan</div>
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-[30px] border border-[hsl(var(--border))] bg-[linear-gradient(180deg,hsl(var(--surface)/0.8),hsl(var(--surface-raised)/0.72))] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[hsl(var(--accent)/0.35)] md:p-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="badge badge-accent">Featured</span>
                <time dateTime={featured.date} className="text-xs text-[hsl(var(--foreground-3))]">
                  {formatDateShort(featured.date)}
                </time>
                <span className="text-xs text-[hsl(var(--foreground-3))]">{featured.readingTime}</span>
              </div>
              <h2 className="mt-5 text-heading text-[1.5rem] text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))] md:text-[2rem]">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-[56ch] text-base leading-8 text-[hsl(var(--foreground-2))]">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {featured.tags.map((tag) => (
                  <span key={tag} className="badge">{tag}</span>
                ))}
                <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--accent))]">
                  Oku
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </section>
        ) : null}

        <section className="mt-14">
          <div className="section-label mb-5">Yazı arşivi</div>
          <BlogSearch posts={rest} tags={tags} />
        </section>

        <section id="snippets" className="mt-16 border-t border-[hsl(var(--border))] pt-16">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <div className="section-label mb-4">Snippets</div>
              <h2 className="text-heading text-[clamp(1.8rem,4vw,3rem)] text-[hsl(var(--foreground))]">
                Blog içindeki hızlı kod notları.
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {snippets.map((snippet) => (
              <Link key={snippet.slug} href={`/snippets/${snippet.slug}`} className="post-card group">
                <div className="flex items-center justify-between gap-3">
                  <span className="badge badge-warm">Snippet</span>
                  <span className="text-xs text-[hsl(var(--foreground-3))]">{snippet.language}</span>
                </div>
                <h3 className="text-heading text-[1rem] text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))]">
                  {snippet.title}
                </h3>
                <p className="text-sm leading-7 text-[hsl(var(--foreground-2))]">{snippet.description}</p>
                <div className="mt-auto flex flex-wrap gap-1 pt-2">
                  {snippet.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="badge">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}