import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar, Clock, Tag } from "lucide-react";
import { getAllPosts, getPost, getPostSlugs } from "@/content/posts";
import { siteConfig } from "@/config/site";
import { formatDate, formatDateShort, isoDate } from "@/lib/format";
import { blogPostingSchema, breadcrumbSchema, jsonLd } from "@/lib/seo";
import { Toc } from "@/components/content/toc";
import { CopyLinkButton } from "@/components/content/copy-button";
import { PostContent } from "@/components/content/post-content";

export async function generateStaticParams() {
  return getPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const canonical = `${siteConfig.url}/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: canonical,
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      authors: [siteConfig.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();

  const relatedPosts = allPosts
    .filter((item) => item.slug !== slug && item.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 3);

  const sidePosts = allPosts.filter((item) => item.slug !== slug).slice(0, 6);
  const canonical = `${siteConfig.url}/blog/${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(blogPostingSchema(post, canonical)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Ana Sayfa", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: post.title, href: `/blog/${slug}` },
            ])
          ),
        }}
      />

      <header className="border-b border-[hsl(var(--border))]">
        <div className="container-site py-12 md:py-16">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-[hsl(var(--foreground-2))] transition-colors hover:text-[hsl(var(--foreground))]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Blog
          </Link>

          <div className="mb-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="badge transition-colors hover:border-[hsl(var(--accent)/0.34)] hover:text-[hsl(var(--accent))]"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </Link>
            ))}
          </div>

          <h1 className="text-display max-w-[13ch] text-[clamp(2.2rem,6vw,4.8rem)] text-[hsl(var(--foreground))]">
            {post.title}
          </h1>

          <p className="mt-6 max-w-[56ch] text-lg leading-8 text-[hsl(var(--foreground-2))]">
            {post.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[hsl(var(--foreground-3))]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={isoDate(post.date)}>{formatDate(post.date)}</time>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>

            <span>{siteConfig.author.name}</span>

            <div className="sm:ml-auto">
              <CopyLinkButton url={canonical} />
            </div>
          </div>
        </div>
      </header>

      <div className="container-site">
        <div className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_220px] xl:grid-cols-[220px_minmax(0,1fr)_220px]">
          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-1">
              <div className="mb-3 text-label">Diğer Yazılar</div>
              {sidePosts.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="block rounded-xl px-3 py-2 text-xs leading-relaxed text-[hsl(var(--foreground-2))] transition hover:bg-[hsl(var(--surface-subtle))] hover:text-[hsl(var(--foreground))]"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </aside>

          <article className="min-w-0 prose-article">
            <PostContent slug={slug} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Toc />
            </div>
          </aside>
        </div>
      </div>

      <section className="border-t border-[hsl(var(--border))]" aria-label="Yazar">
        <div className="container-site py-10">
          <div className="flex max-w-2xl items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface-subtle))] text-lg font-bold text-[hsl(var(--foreground))]"
              aria-hidden="true"
            >
              M
            </div>

            <div>
              <div className="text-sm font-semibold text-[hsl(var(--foreground))]">
                {siteConfig.author.name}
              </div>
              <div className="mb-2 text-xs text-[hsl(var(--foreground-3))]">
                {siteConfig.author.role}
              </div>
              <p className="text-sm leading-relaxed text-[hsl(var(--foreground-2))]">
                {siteConfig.author.bio}
              </p>

              <div className="mt-3 flex gap-2">
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge transition-colors hover:border-[hsl(var(--accent)/0.34)] hover:text-[hsl(var(--accent))]"
                >
                  GitHub
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge transition-colors hover:border-[hsl(var(--accent)/0.34)] hover:text-[hsl(var(--accent))]"
                >
                  X
                  <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="border-t border-[hsl(var(--border))]" aria-labelledby="related-heading">
          <div className="container-site py-12">
            <div className="mb-6 section-label">İlgili Yazılar</div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="post-card group">
                  <time className="text-label" dateTime={item.date}>
                    {formatDateShort(item.date)}
                  </time>
                  <h2 className="text-heading text-[1rem] text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))]">
                    {item.title}
                  </h2>
                  <p className="line-clamp-2 text-sm leading-7 text-[hsl(var(--foreground-2))]">
                    {item.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}