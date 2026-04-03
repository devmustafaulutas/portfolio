import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroScene } from "@/components/home/hero-scene";
import { HomeStory } from "@/components/home/home-story";
import {
  getFeaturedPosts,
  getLatestPosts,
} from "@/content/posts";
import { getFeaturedSnippets } from "@/content/snippets";
import { formatDateShort } from "@/lib/format";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Creative Full-Stack Engineer`,
  description: siteConfig.description,
};

export default async function HomePage() {
  const [featuredPosts, latestPosts, snippets] = await Promise.all([
    getFeaturedPosts(),
    getLatestPosts(4),
    getFeaturedSnippets(),
  ]);

  const postsSource = featuredPosts.length > 0 ? featuredPosts : latestPosts;

  const uniquePosts = Array.from(
    new Map(postsSource.map((post) => [post.slug, post])).values()
  );

  const leadPost = uniquePosts[0] ?? latestPosts[0] ?? null;

  const sidePosts = Array.from(
    new Map(
      [...uniquePosts.slice(1), ...latestPosts]
        .filter((post) => (leadPost ? post.slug !== leadPost.slug : true))
        .map((post) => [post.slug, post])
    ).values()
  ).slice(0, 3);

  return (
    <>
      <HeroScene />
      <HomeStory />

      <section className="container-site py-20 md:py-24">
        {/* <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-label mb-4">Seçtiğim birkaç yazı</div>
            <h2 className="text-heading text-[clamp(2rem,4vw,3.5rem)] text-[hsl(var(--foreground))]">
              Zihnimde dolaşan şeyler.
            </h2>
            <p className="mt-4 max-w-[42ch] text-base leading-8 text-[hsl(var(--foreground-2))]">
              Daha çok ürün, yazılım mimarisi, performans, arayüz hissi ve
              geliştirme sırasında fark yaratan küçük kararlar üzerine yazıyorum.
            </p>
          </div>

          <Link href="/blog" className="btn btn-secondary">
            Tüm yazılar
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div> */}

        {leadPost ? (
          <Link
            href={`/blog/${leadPost.slug}`}
            className="group block border-y border-[hsl(var(--border))] py-10 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-4">
              <time dateTime={leadPost.date} className="text-label">
                {formatDateShort(leadPost.date)}
              </time>
              <span className="text-xs text-[hsl(var(--foreground-3))]">
                {leadPost.readingTime}
              </span>
            </div>

            <h3 className="mt-5 max-w-[16ch] text-heading text-[clamp(1.9rem,4vw,3.7rem)] text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))]">
              {leadPost.title}
            </h3>

            <p className="mt-5 max-w-[52ch] text-base leading-8 text-[hsl(var(--foreground-2))]">
              {leadPost.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {leadPost.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="badge">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ) : null}

        {sidePosts.length > 0 ? (
          <div className="mt-8">
            {sidePosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="work-row group"
              >
                <div className="max-w-[38rem]">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <time dateTime={post.date} className="text-label">
                      {formatDateShort(post.date)}
                    </time>
                    <span className="text-xs text-[hsl(var(--foreground-3))]">
                      {post.readingTime}
                    </span>
                  </div>

                  <h3 className="work-row__title text-heading text-[1.22rem] text-[hsl(var(--foreground))] transition-colors">
                    {post.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[hsl(var(--foreground-2))]">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
{/* 
      <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--surface-subtle)/0.22)]">
        <div className="container-site py-20 md:py-24">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="section-label mb-4">Kısa notlar</div>
              <h2 className="text-heading text-[clamp(1.9rem,4vw,3.2rem)] text-[hsl(var(--foreground))]">
                Küçük ama işe yarayan parçalar.
              </h2>
              <p className="mt-4 max-w-[40ch] text-base leading-8 text-[hsl(var(--foreground-2))]">
                Bazen uzun yazmak yerine küçük bir snippet ya da kısa bir teknik
                not daha çok işe yarıyor.
              </p>
            </div>

            <Link href="/blog#snippets" className="btn btn-ghost">
              Blog içinde gör
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {snippets.slice(0, 3).map((snippet) => (
              <Link
                key={snippet.slug}
                href={`/snippets/${snippet.slug}`}
                className="group rounded-[22px] border border-[hsl(var(--border))] p-5 transition-all duration-200 hover:-translate-y-[2px] hover:border-[hsl(var(--accent)/0.34)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="badge badge-accent">Snippet</span>
                  <span className="text-xs text-[hsl(var(--foreground-3))]">
                    {snippet.language}
                  </span>
                </div>

                <h3 className="mt-4 text-heading text-[1rem] text-[hsl(var(--foreground))] transition-colors group-hover:text-[hsl(var(--accent))]">
                  {snippet.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[hsl(var(--foreground-2))]">
                  {snippet.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {snippet.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}
    </>
  );
}