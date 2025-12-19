import { Container } from "@/src/components/layout/container";
import { snippetsIndex } from "@/src/features/snippets/snippets.index";

export default function SnippetsPage() {
  return (
    <main>
      <Container className="py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Snippets
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          Kopyala-yapıştır hazır, production’da iş gören parçalar.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {snippetsIndex.map((s) => (
            <a
              key={s.slug}
              href={`/snippets/${s.slug}`}
              className="group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
              data-magnetic
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold tracking-tight">
                    {s.title}
                  </div>
                  <div className="mt-1 text-sm text-foreground/70">
                    {s.description}
                  </div>
                </div>
                <span className="text-xs text-foreground/60">{s.language}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-foreground/70"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-4 text-xs font-medium text-foreground/70 group-hover:text-foreground">
                Open →
              </div>
            </a>
          ))}
        </div>
      </Container>
    </main>
  );
}
