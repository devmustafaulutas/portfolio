import React from "react";
import { CodeBlock } from "@/src/components/content/code-block";
import { DemoTabs } from "@/src/components/demos/demo-tabs";
import { LiveCounterDemo } from "@/src/components/demos/live-counter-demo";
import { HorizontalChapters } from "@/src/components/motion/horizontal-chapters";

export async function CleanArchitecturePost() {
  return (
    <>
      <header data-section>
        <p data-reveal className="text-sm text-foreground/60">
          Architecture / DX / Deploy
        </p>
        <h1 data-reveal>Clean Architecture + Next.js: Production-grade template</h1>
        <p data-reveal>
          Bu yazı “blog” değil, dokümantasyon hissi veren bir teknik deneyim sayfası.
          Sticky TOC + sol nav + scroll animasyonları ile uzun içerik bile akıyor.
        </p>
      </header>

      <section data-section className="mt-12">
        <h2 id="goals" data-reveal>Hedefler</h2>
        <ul data-reveal>
          <li>Monorepo’da net sınırlar: web/admin/api + paylaşılan paketler</li>
          <li>Clean Architecture: Domain bağımsız, infra dışarıda</li>
          <li>DX: typed SDK, hızlı dev, hızlı deploy</li>
        </ul>
      </section>

      <section data-section className="mt-12">
        <h2 id="structure" data-reveal>Dizin / Katmanlar</h2>
        <p data-reveal>
          Backend: Domain → Application → Infrastructure → Api. Frontend: app router + feature-based.
        </p>

        <div data-reveal className="mt-4">
          <CodeBlock
            lang="bash"
            filename="tree (simplified)"
            code={`apps/
  web/ (Next)
  admin/ (Next)
  api/ (ASP.NET)
packages/
  ui/  (shared components)
  sdk/ (typed http client)`}
          />
        </div>
      </section>

      <section data-section className="mt-12">
        <h2 id="sdk" data-reveal>Typed SDK yaklaşımı</h2>
        <p data-reveal>
          Frontend doğrudan endpoint string’leriyle yaşamasın; `packages/sdk` üzerinden typed client kullansın.
        </p>

        <div data-reveal className="mt-4">
          <CodeBlock
            lang="ts"
            filename="packages/sdk/src/posts.ts"
            code={`import { http } from "./http";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
};

export async function listPosts() {
  return http.get<PostSummary[]>("/api/posts");
}`}
          />
        </div>
      </section>

      <section data-section className="mt-12">
        <h2 id="deploy" data-reveal>Deploy stratejisi</h2>
        <p data-reveal>
          Web: Vercel. API: Azure App Service / Container Apps. DB: Azure Postgres. Bu kombinasyon hızlı iterasyon + kurumsal stabilite.
        </p>

        <div data-reveal className="mt-4">
          <CodeBlock
            lang="md"
            filename="deploy.md"
            code={`- Vercel: preview deployments, edge caching, image pipeline
- Azure: managed scaling, networking, identity
- Postgres: migrations, backups, monitoring`}
          />
        </div>
      </section>
            <section data-section className="mt-12">
        <h2 id="chapters" data-reveal>Chapters (Horizontal)</h2>
        <p data-reveal>
          Bu pattern dokümantasyonda aşırı premium durur: “bölümler” akışı scroll ile yatay ilerler.
        </p>

        <HorizontalChapters
          chapters={[
            {
              title: "Boundary",
              desc: "Katman sınırları. Domain saf kalır.",
              bullets: ["Domain bağımsız", "Use-case odaklı Application", "Infra dışarıda"],
            },
            {
              title: "DX",
              desc: "Typed SDK + tek kaynak endpoint yaklaşımı.",
              bullets: ["packages/sdk", "zod/DTO eşleşmesi", "ön yüz stabil"],
            },
            {
              title: "Deploy",
              desc: "Vercel + Azure + Postgres ile hızlı iterasyon.",
              bullets: ["Preview deploy", "Managed DB", "Log/trace standardı"],
            },
            {
              title: "UI",
              desc: "Docs hissi: sticky nav + TOC + demo embed.",
              bullets: ["Okunabilir tipografi", "micro-interactions", "code blocks"],
            },
          ]}
        />
      </section>

      <section data-section className="mt-12">
        <h2 id="demo" data-reveal>Interactive Demo Embed</h2>
        <p data-reveal>
          Okurken “his” veren kısım burada: Preview/Code tab’lı canlı demo.
        </p>

        <DemoTabs
          title="Counter Demo (Preview/Code)"
          subtitle="Dokümantasyonda anlatılan davranışı canlı göster."
          preview={<LiveCounterDemo />}
          code={
            <div className="mt-4">
              <CodeBlock
                lang="tsx"
                filename="live-counter-demo.tsx"
                code={`"use client";
import React, { useState } from "react";

export function LiveCounterDemo() {
  const [n, setN] = useState(3);
  return (
    <div>
      <div>{n}</div>
      <button onClick={() => setN(x => x + 1)}>+</button>
      <button onClick={() => setN(x => Math.max(0, x - 1))}>-</button>
      <button onClick={() => setN(0)}>reset</button>
    </div>
  );
}`}
              />
            </div>
          }
        />
      </section>

    </>
  );
}

export async function ReactQueryPatternsPost() {
  return (
    <>
      <header data-section>
        <p data-reveal className="text-sm text-foreground/60">
          Frontend / Data Layer
        </p>
        <h1 data-reveal>React Query Patterns (Production Notes)</h1>
        <p data-reveal>
          “Server state” ile “UI state” sınırlarını doğru çekince performans ve sadelik otomatik geliyor.
        </p>
      </header>

      <section data-section className="mt-12">
        <h2 id="cache" data-reveal>Cache ana prensip</h2>
        <p data-reveal>
          Aynı veriyi 3 farklı yerde tutma. Tek kaynak: query cache. Form state ayrı.
        </p>

        <div data-reveal className="mt-4">
          <CodeBlock
            lang="tsx"
            filename="usePosts.ts"
            code={`import { useQuery } from "@tanstack/react-query";
import { listPosts } from "@portfolio/sdk";

export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: listPosts,
    staleTime: 30_000,
  });
}`}
          />
        </div>
      </section>

      <section data-section className="mt-12">
        <h2 id="optimistic" data-reveal>Optimistic update</h2>
        <p data-reveal>
          UI “anında” güncellensin ama rollback güvenli olsun.
        </p>
      </section>
    </>
  );
}
export async function PremiumDocsUiPost() {
  return (
    <>
      <header data-section>
        <p data-reveal className="text-sm text-foreground/60">UI / Motion / Docs</p>
        <h1 data-reveal>Premium Docs UI System</h1>
        <p data-reveal>
          Sticky TOC, section-based reveal, micro-interactions ve demo embed’ler ile “teknik deneyim tasarımı”.
        </p>
      </header>

      <section data-section className="mt-12">
        <h2 id="toc" data-reveal>Sticky TOC</h2>
        <p data-reveal>
          Uzun içerikte kullanıcı “kaybolmasın”. Sağ TOC aktif heading’i takip eder.
        </p>
      </section>

      <section data-section className="mt-12">
        <h2 id="motion" data-reveal>Motion dili</h2>
        <p data-reveal>
          GSAP ile sadece show-off değil: hiyerarşi, tempo ve “okuma akışı” tasarlanır.
        </p>
      </section>
    </>
  );
}

export async function EfCorePostgresMigrationsPost() {
  return (
    <>
      <header data-section>
        <p data-reveal className="text-sm text-foreground/60">.NET / EF Core</p>
        <h1 data-reveal>EF Core + Postgres Migrations Playbook</h1>
        <p data-reveal>
          Clean Architecture’da migrations alırken en sık yaşanan tuzakları çözen kısa playbook.
        </p>
      </header>

      <section data-section className="mt-12">
        <h2 id="cli" data-reveal>CLI komutları</h2>
        <div data-reveal className="mt-4">
          <CodeBlock
            lang="bash"
            filename="migrations.sh"
            code={`dotnet ef migrations add Initial --project Infrastructure --startup-project Api
dotnet ef database update --project Infrastructure --startup-project Api`}
          />
        </div>
      </section>

      <section data-section className="mt-12">
        <h2 id="design" data-reveal>Design paketi</h2>
        <p data-reveal>
          EF Tools için startup projesinde Design package gerekir (Api).
        </p>
        <div data-reveal className="mt-4">
          <CodeBlock
            lang="json"
            filename="Api.csproj"
            code={`<ItemGroup>
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.1">
    <PrivateAssets>all</PrivateAssets>
  </PackageReference>
</ItemGroup>`}
          />
        </div>
      </section>
    </>
  );
}
