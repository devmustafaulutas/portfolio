// ============================================================
// SEO Utilities — JSON-LD structured data helpers
// ============================================================


import { siteConfig } from "@/config/site";
import type { PostMeta } from "@/content/posts";
import type { ProjectMeta } from "@/content/projects";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter,
    ],
    jobTitle: siteConfig.author.role,
    description: siteConfig.author.bio,
    email: siteConfig.author.email,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/blog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function blogPostingSchema(post: PostMeta, canonical: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: canonical,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    keywords: post.tags.join(", "),
    inLanguage: "tr",
    isPartOf: {
      "@type": "Blog",
      name: `${siteConfig.name} — Blog`,
      url: `${siteConfig.url}/blog`,
    },
  };
}

export function softwareSchema(project: ProjectMeta, canonical: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.description,
    url: canonical,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
    },
    applicationCategory: "DeveloperApplication",
    programmingLanguage: project.stack,
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href.startsWith("http")
        ? item.href
        : `${siteConfig.url}${item.href}`,
    })),
  };
}

export function jsonLd(schema: object) {
  return JSON.stringify(schema);
}