import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { getAllProjects, getProject, getProjectSlugs } from "@/content/projects";
import { siteConfig } from "@/config/site";
import { softwareSchema, breadcrumbSchema, jsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return getProjectSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  const canonical = `${siteConfig.url}/projects/${slug}`;

  return {
    title: project.name,
    description: project.description,
    alternates: { canonical },
    openGraph: {
      title: project.name,
      description: project.description,
      url: canonical,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const canonical = `${siteConfig.url}/projects/${slug}`;
  const allProjects = await getAllProjects();
  const related = allProjects
    .filter((p) => p.slug !== slug && p.category === project.category)
    .slice(0, 2);

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
        dangerouslySetInnerHTML={{ __html: jsonLd(softwareSchema(project, canonical)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Ana Sayfa", href: "/" },
              { name: "Projects", href: "/projects" },
              { name: project.name, href: `/projects/${slug}` },
            ])
          ),
        }}
      />

      {/* Project hero */}
      <header className="border-b border-[hsl(var(--border))]">
        <div className="container-site py-12 md:py-16">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm
                       text-[hsl(var(--foreground-2))] hover:text-[hsl(var(--foreground))]
                       transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Projects
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`badge ${statusBadge[project.status]}`}>
              {statusLabel[project.status]}
            </span>
            <span className="badge">{project.year}</span>
            <span className="badge">{project.category}</span>
          </div>

          <h1 className="text-heading text-[clamp(2rem,4.5vw,3.25rem)] text-[hsl(var(--foreground))] mb-4 max-w-[18em]">
            {project.name}
          </h1>

          <p className="text-body text-base max-w-[55ch] mb-7">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-7">
            {project.stack.map((tech) => (
              <span key={tech} className="badge">{tech}</span>
            ))}
          </div>

          {/* External links */}
          <div className="flex gap-2 flex-wrap">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Canlıya Bak
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <Github className="h-3.5 w-3.5" />
                Kaynak Kod
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Case study body */}
      <div className="container-site py-12 md:py-16">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_280px]">

          {/* Main content */}
          <div className="space-y-12 min-w-0">

            {/* Problem */}
            <section aria-labelledby="problem-heading">
              <div className="section-label mb-3">Problem</div>
              <h2 id="problem-heading" className="text-heading text-xl text-[hsl(var(--foreground))] mb-4">
                Hangi problemi çözüyoruz?
              </h2>
              <p className="prose-article text-base leading-relaxed">{project.problem}</p>
            </section>

            {/* Solution */}
            <section aria-labelledby="solution-heading">
              <div className="section-label mb-3">Çözüm</div>
              <h2 id="solution-heading" className="text-heading text-xl text-[hsl(var(--foreground))] mb-4">
                Nasıl yaklaştık?
              </h2>
              <p className="prose-article text-base leading-relaxed">{project.solution}</p>
            </section>

            {/* Architecture */}
            <section aria-labelledby="arch-heading">
              <div className="section-label mb-3">Mimari</div>
              <h2 id="arch-heading" className="text-heading text-xl text-[hsl(var(--foreground))] mb-4">
                Sistem mimarisi
              </h2>
              <p className="prose-article text-base leading-relaxed">{project.architecture}</p>
            </section>

            {/* Key decisions */}
            {project.keyDecisions?.length > 0 && (
              <section aria-labelledby="decisions-heading">
                <div className="section-label mb-3">Kararlar</div>
                <h2 id="decisions-heading" className="text-heading text-xl text-[hsl(var(--foreground))] mb-6">
                  Kritik tasarım kararları
                </h2>
                <div className="space-y-4">
                  {project.keyDecisions.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[hsl(var(--border))]
                                 bg-[hsl(var(--card))] p-5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-label text-[hsl(var(--accent))] mt-0.5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="text-heading text-sm text-[hsl(var(--foreground))] mb-1.5">
                            {d.decision}
                          </h3>
                          <p className="text-sm text-[hsl(var(--foreground-2))] leading-relaxed">
                            {d.rationale}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Outcomes */}
            {project.outcomes?.length > 0 && (
              <section aria-labelledby="outcomes-heading">
                <div className="section-label mb-3">Sonuçlar</div>
                <h2 id="outcomes-heading" className="text-heading text-xl text-[hsl(var(--foreground))] mb-5">
                  Neler elde edildi?
                </h2>
                <ul className="space-y-2">
                  {project.outcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[hsl(var(--foreground-2))]">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))] shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
                <div className="text-label mb-4">Metrikler</div>
                <div className="space-y-3">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="flex items-baseline justify-between gap-2">
                      <span className="text-xs text-[hsl(var(--foreground-3))]">{m.label}</span>
                      <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stack */}
            <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
              <div className="text-label mb-4">Teknoloji Yığını</div>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span key={tech} className="badge text-[10px]">{tech}</span>
                ))}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
                <div className="text-label mb-4">İlgili Projeler</div>
                <div className="space-y-3">
                  {related.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/projects/${p.slug}`}
                      className="flex items-start justify-between gap-2 group"
                    >
                      <span className="text-sm text-[hsl(var(--foreground-2))]
                                       group-hover:text-[hsl(var(--accent))] transition-colors">
                        {p.name}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[hsl(var(--foreground-3))]
                                               group-hover:text-[hsl(var(--accent))] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
