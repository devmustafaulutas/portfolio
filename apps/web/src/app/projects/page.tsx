import { Container } from "@/src/components/layout/container";
import { projectsIndex } from "@/src/features/projects/projects.index";

export default function ProjectsPage() {
  return (
    <main>
      <Container className="py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          Case study formatında: problem → çözüm → mimari → sonuçlar.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {projectsIndex.map((p) => (
            <a
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
              data-magnetic
            >
              <div className="text-base font-semibold tracking-tight">
                {p.name}
              </div>
              <div className="mt-2 text-sm leading-6 text-foreground/70">
                {p.description}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.stack.slice(0, 5).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-foreground/70"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-4 text-xs font-medium text-foreground/70">
                Open →
              </div>
            </a>
          ))}
        </div>
      </Container>
    </main>
  );
}
