import { Container } from "@/src/components/layout/container";

export function DocShell({
  nav,
  toc,
  children,
}: {
  nav?: React.ReactNode;
  toc?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-10">
      <div className="grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)_240px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{nav}</div>
        </aside>

        <main className="min-w-0">{children}</main>

        <aside className="hidden lg:block">
          <div className="sticky top-24">{toc}</div>
        </aside>
      </div>
    </Container>
  );
}
