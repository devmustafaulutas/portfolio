import { Container } from "@/src/components/layout/container";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <Container className="flex flex-col gap-3 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} Mustafa Ulutaş. Built with Next.js.
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-600">
          <a className="hover:text-slate-900" href="/blog">Blog</a>
          <a className="hover:text-slate-900" href="/snippets">Snippets</a>
          <a className="hover:text-slate-900" href="/projects">Projects</a>
        </div>
      </Container>
    </footer>
  );
}
