import { Container } from "@/src/components/layout/container";
import { BlogList } from "@/src/features/posts/blog-list";

export default function BlogListPage() {
  return (
    <main>
      <Container className="py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Blog
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          Mimari, DX, deploy, performans ve teknik notlar.
        </p>

        <BlogList />
      </Container>
    </main>
  );
}
