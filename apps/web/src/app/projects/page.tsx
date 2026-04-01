import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllProjects } from "@/content/projects";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Üretimde çalışan projeler, mimari kararlar ve vaka çalışmaları.",
  alternates: { canonical: `${siteConfig.url}/projects` },
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  const statusLabel: Record<string, string> = {
    live: "Canlı",
    wip: "Geliştiriliyor",
    archived: "Arşiv",
  };

  const statusBadge: Record<string, string> = {
    live: "badge-accent",
    wip: "badge-warm",
    archived: "",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Ana Sayfa", href: "/" },
              { name: "Projects", href: "/projects" },
            ])
          ),
        }}
      />

      <div className="container-site py-14 md:py-20">
        {/* Header */}
        <header className="mb-14">
          <div className="section-label mb-3">Projects</div>
          <h1 className="text-heading text-[clamp(2rem,4vw,3rem)] text-[hsl(var(--foreground))] mb-4">
            Seçilmiş projeler ve vaka çalışmaları.
          </h1>
          <p className="text-body max-w-[52ch]">
            Mimari kararlar, teknik zorluklara yaklaşımım ve üretim deneyimleri.
          </p>
        </header>

        {/* Project list */}
        <ul aria-label="Projeler" className="space-y-4">
          {projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group block rounded-2xl border border-[hsl(var(--border))]
                           bg-[hsl(var(--card))] p-6 md:p-7 transition-all duration-200
                           hover:border-[hsl(var(--accent)/0.35)]
                           hover:shadow-[0_4px_24px_hsl(var(--accent)/0.05)]
                           hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h2 className="text-heading text-lg md:text-xl text-[hsl(var(--foreground))]
                                     group-hover:text-[hsl(var(--accent))] transition-colors">
                        {project.name}
                      </h2>
                      <span className={`badge ${statusBadge[project.status]}`}>
                        {statusLabel[project.status]}
                      </span>
                      <span className="badge">{project.year}</span>
                    </div>
                    <p className="text-sm md:text-base text-[hsl(var(--foreground-2))] leading-relaxed mb-4 max-w-[65ch]">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span key={tech} className="badge text-[10px]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <ArrowUpRight
                      className="h-5 w-5 text-[hsl(var(--foreground-3))]
                                 group-hover:text-[hsl(var(--accent))] transition-colors"
                    />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
