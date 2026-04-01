// PostContent renders the actual MDX/content for a blog post.
// Currently uses a static registry — replace with MDX or CMS loader later.

import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/content/code-block";

// ---- Helpers -------------------------------------------------------

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-heading text-[1.5rem] text-[hsl(var(--foreground))] mt-10 mb-4 scroll-mt-24">
      {children}
    </h2>
  );
}

function H3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="text-heading text-[1.1875rem] text-[hsl(var(--foreground))] mt-8 mb-3 scroll-mt-24">
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[hsl(var(--foreground))/0.88] leading-[1.85] mb-6">{children}</p>;
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2 mb-6 pl-5 list-disc text-[hsl(var(--foreground))/0.85]">{children}</ul>;
}

function LI({ children }: { children: React.ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.875em] bg-[hsl(var(--code-bg))] border border-[hsl(var(--code-border))]
                     rounded px-[0.3em] py-[0.1em] text-[hsl(var(--accent))]">
      {children}
    </code>
  );
}

function Callout({ type = "info", children }: { type?: "info" | "warn"; children: React.ReactNode }) {
  return (
    <div className={`callout callout-${type} my-6 text-sm leading-relaxed`}>
      {children}
    </div>
  );
}

function HR() {
  return <hr className="my-10 border-[hsl(var(--border))]" />;
}

// ---- Content registry ---------------------------------------------
// Each entry is an async function returning JSX.
// Replace with: import(`@/content/posts/${slug}.mdx`) for MDX.

type ContentRenderer = () => Promise<React.ReactNode>;

const registry: Record<string, ContentRenderer> = {
  "clean-architecture-dotnet-nextjs": async () => (
    <div className="prose-article">
      <P>
        .NET monoreposunda Next.js frontend ile bir Clean Architecture kurulumu, doğru yapıldığında 
        hem takım üretkenliğini artırır hem de sistemin test edilebilirliğini garantiler. 
        Bu yazıda gerçek bir projeye uyguladığım katman yapısını ve bağımlılık yönünü ele alacağım.
      </P>

      <H2 id="neden-clean-architecture">Neden Clean Architecture?</H2>
      <P>
        Çoğu ekip mimari pattern'leri "best practice" olduğu için uygular, ama neden işe yaradığını 
        anlamaz. CA'nın özü şu: <InlineCode>bağımlılıklar daima içeriye doğru akar</InlineCode>. 
        Domain katmanı hiçbir şeye bağımlı değil; altyapı her şeye bağımlı.
      </P>

      <H2 id="katman-yapisi">Katman Yapısı</H2>
      <P>Monoreponuzdaki proje yapısı şu şekilde olabilir:</P>

      <CodeBlock
        language="Shell"
        filename="proje yapısı"
        code={`src/
  Domain/           # Entity, ValueObject, IDomainEvent
  Application/      # UseCase, IRepository, IService, DTO
  Infrastructure/   # EF Core, dış servisler, repo impls
  Api/              # Controllers / Minimal API, DI setup
  Web/              # Next.js frontend (ayrı repo ya da packages/)`}
      />

      <H3 id="bagimlilik-yonu">Bağımlılık Yönü</H3>
      <P>
        Temel kural: <InlineCode>Infrastructure → Application → Domain</InlineCode>. 
        Application katmanı asla Infrastructure'u import etmez. Bunu garantilemek için 
        <InlineCode>ArchUnitNET</InlineCode> veya CI'da çalışan bir bağımlılık testi ekleyebilirsiniz.
      </P>

      <CodeBlock
        language="C#"
        filename="DependencyTests.cs"
        code={`[Fact]
public void Application_ShouldNot_DependOn_Infrastructure()
{
    var result = Types.InAssembly(typeof(ApplicationAssembly).Assembly)
        .ShouldNot()
        .HaveDependencyOn("Infrastructure")
        .GetResult();

    result.IsSuccessful.Should().BeTrue();
}`}
      />

      <H2 id="deploy-stratejisi">Deploy Stratejisi</H2>
      <P>
        Monorepo'da Next.js ve .NET API'yi ayrı container'lara build edip aynı Compose 
        veya Kubernetes namespace'inde çalıştırın. Geliştirme ortamında ise:
      </P>

      <CodeBlock
        language="YAML"
        filename="docker-compose.dev.yml"
        code={`services:
  api:
    build: ./src/Api
    ports: ["5000:8080"]
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    volumes:
      - ./src:/app/src  # hot reload

  web:
    build: ./src/Web
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8080
    depends_on: [api]`}
      />

      <Callout type="info">
        <strong>İpucu:</strong> Next.js &apos;rewrites&apos; ile geliştirme sırasında CORS sorununu 
        ortadan kaldırabilirsiniz. <InlineCode>/api/*</InlineCode> yollarını .NET API&apos;ye yönlendirin.
      </Callout>

      <H2 id="sonuc">Sonuç</H2>
      <P>
        Clean Architecture her proje için doğru seçim değil, ama kurumsal ölçekte büyüyen, 
        birden fazla takımın katkı yaptığı sistemlerde katman izolasyonu uzun vadede 
        yönetim kolaylığı sağlar. Önemli olan mimariyi körü körüne uygulamak değil, 
        neden uyguladığınızı bilmek.
      </P>
    </div>
  ),

  "react-query-patterns": async () => (
    <div className="prose-article">
      <P>
        TanStack Query (React Query) doğru kullanıldığında sunucu durumu yönetimini 
        köklü biçimde basitleştirir. Ancak üretim ortamında karşılaşılan senaryolar 
        belgelerde tam anlatılmaz. Gerçek projelerde öğrendiğim pattern'leri paylaşıyorum.
      </P>

      <H2 id="cache-stratejisi">Cache Stratejisi</H2>
      <P>
        Her veri türü için farklı <InlineCode>staleTime</InlineCode> değeri kullanın. 
        Kullanıcı profili sık değişmez; ürün listesi değişebilir.
      </P>

      <CodeBlock
        language="TypeScript"
        filename="query-config.ts"
        code={`export const queryConfig = {
  // Neredeyse hiç değişmeyen veriler (referans data)
  static: {
    staleTime: 60 * 60 * 1000, // 1 saat
    gcTime: 24 * 60 * 60 * 1000,
  },
  // Kullanıcı profili, ayarlar
  user: {
    staleTime: 5 * 60 * 1000,  // 5 dk
    gcTime: 30 * 60 * 1000,
  },
  // Gerçek zamanlı veriler
  realtime: {
    staleTime: 0,
    refetchInterval: 30_000,
  },
} satisfies Record<string, Parameters<typeof useQuery>[0]>;`}
      />

      <H2 id="optimistic-update">Optimistic Updates</H2>
      <P>
        UI'ı anında güncelleyin, hata durumunda geri alın. Kullanıcı deneyimini 
        önemli ölçüde iyileştirir.
      </P>

      <CodeBlock
        language="TypeScript"
        filename="use-toggle-like.ts"
        code={`export function useToggleLike(postId: string) {
  const queryClient = useQueryClient();
  const key = ["post", postId];

  return useMutation({
    mutationFn: (liked: boolean) => api.toggleLike(postId, liked),
    onMutate: async (liked) => {
      await queryClient.cancelQueries({ queryKey: key });
      const prev = queryClient.getQueryData<Post>(key);

      queryClient.setQueryData<Post>(key, (old) =>
        old ? { ...old, liked, likeCount: old.likeCount + (liked ? 1 : -1) } : old
      );

      return { prev };
    },
    onError: (_, __, ctx) => {
      // Hata durumunda geri al
      if (ctx?.prev) queryClient.setQueryData(key, ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}`}
      />

      <H2 id="server-state-siniri">Server State Sınırları</H2>
      <P>
        React Query sadece <em>sunucu durumu</em> için. UI state (modal açık/kapalı, 
        form state) için Zustand veya React state kullanın. İkisini karıştırmak 
        bakım zorluğu yaratır.
      </P>

      <Callout type="warn">
        <strong>Sık hata:</strong> <InlineCode>onSuccess</InlineCode> callback&apos;inde 
        başka mutation tetiklemek. Bunun yerine <InlineCode>onSettled</InlineCode> + 
        <InlineCode>invalidateQueries</InlineCode> zinciri kullanın.
      </Callout>

      <HR />

      <P>
        Doğru kullanılan TanStack Query, Redux veya Context tabanlı çözümlere kıyasla 
        hem daha az boilerplate hem de daha iyi kullanıcı deneyimi sunar.
      </P>
    </div>
  ),

  "premium-docs-ui-system": async () => (
    <div className="prose-article">
      <P>
        Premium bir belge arayüzü sadece iyi görünen değil, okuyucuyu içerikte 
        yönlendiren bir sistemdir. Bu yazıda bu sitenin belge bileşenlerini nasıl 
        kurduğumu anlatıyorum.
      </P>

      <H2 id="sticky-toc">Sticky TOC</H2>
      <P>
        İçindekiler tablosu, okuyucunun uzun makalelerde kaybolmamasını sağlar. 
        Intersection Observer ile aktif bölümü takip ediyoruz.
      </P>

      <CodeBlock
        language="TypeScript"
        filename="toc.tsx"
        code={`const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible.length > 0) setActiveId(visible[0].target.id);
  },
  { rootMargin: "-80px 0px -65% 0px" }
);`}
      />

      <H2 id="kod-bloklari">Kod Blokları</H2>
      <P>
        Shiki ile çift tema (light/dark) desteği. CSS değişkenleri ile tema değişimi 
        anında yansır, JavaScript gerektirmez.
      </P>

      <H2 id="okuma-ilerleme">Okuma İlerlemesi</H2>
      <P>
        <InlineCode>--scroll</InlineCode> CSS değişkeni GSAP/ScrollTrigger tarafından 
        güncellenir. Okuma çubuğu bu değeri doğrudan CSS ile tüketir:
      </P>

      <CodeBlock
        language="CSS"
        filename="globals.css"
        code={`.reading-progress {
  transform: scaleX(var(--scroll));
  transform-origin: left;
}`}
      />
    </div>
  ),

  "efcore-postgres-migrations-playbook": async () => (
    <div className="prose-article">
      <P>
        EF Core migration yönetimi, Clean Architecture projelerinde başlangıçta 
        kafa karıştırıcı olabilir. Startup ve infrastructure projeleri ayrı olduğunda 
        hangi komutları kullanmanız gerektiğini bu yazıda netleştiriyorum.
      </P>

      <H2 id="design-time-factory">IDesignTimeDbContextFactory</H2>
      <P>
        Infrastructure projesinde <InlineCode>DbContext</InlineCode> tanımlı, 
        ama <InlineCode>appsettings.json</InlineCode> Api projesinde. EF Core araçlarının 
        çalışması için bu fabrikayı oluşturun:
      </P>

      <CodeBlock
        language="C#"
        filename="AppDbContextFactory.cs"
        code={`public class AppDbContextFactory
    : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Api"))
            .AddJsonFile("appsettings.Development.json")
            .Build();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(config.GetConnectionString("Default"))
            .Options;

        return new AppDbContext(options);
    }
}`}
      />

      <H2 id="cli-komutlari">CLI Komutları</H2>

      <CodeBlock
        language="Shell"
        filename="migrations.sh"
        code={`# Migration ekle
dotnet ef migrations add <İsim> \\
  --project src/Infrastructure \\
  --startup-project src/Api \\
  --output-dir Persistence/Migrations

# Veritabanını güncelle
dotnet ef database update \\
  --project src/Infrastructure \\
  --startup-project src/Api

# Son migration'ı geri al (henüz apply edilmediyse)
dotnet ef migrations remove \\
  --project src/Infrastructure \\
  --startup-project src/Api

# SQL script üret (CI/CD için)
dotnet ef migrations script \\
  --project src/Infrastructure \\
  --startup-project src/Api \\
  --idempotent \\
  -o migration.sql`}
      />

      <H2 id="cicd-stratejisi">CI/CD Stratejisi</H2>
      <P>
        Üretimde <InlineCode>dotnet ef database update</InlineCode> yerine 
        idempotent SQL script kullanın. Bu şekilde migration geçmişi olmadan da 
        çalışır ve daha güvenlidir.
      </P>

      <Callout type="warn">
        Üretim veritabanında migration öncesi her zaman yedeğini alın.
      </Callout>
    </div>
  ),

  "performance-budgets-nextjs": async () => (
    <div className="prose-article">
      <P>
        Bir Next.js uygulamasının performans bütçesi belirlemek, LCP &lt; 2.5s ve 
        CLS &lt; 0.1 gibi hedefleri pratikte nasıl tutacağınızı anlamak demektir. 
        Sadece sayfa hızını değil, sürekli ölçüm ve regresyon önleme altyapısını kuruyoruz.
      </P>

      <H2 id="core-web-vitals">Core Web Vitals Hedefleri</H2>
      <P>
        Google&apos;ın &quot;Good&quot; bandı için hedefleriniz:
      </P>
      <UL>
        <LI><InlineCode>LCP</InlineCode> (Largest Contentful Paint): &lt; 2.5s</LI>
        <LI><InlineCode>INP</InlineCode> (Interaction to Next Paint): &lt; 200ms</LI>
        <LI><InlineCode>CLS</InlineCode> (Cumulative Layout Shift): &lt; 0.1</LI>
      </UL>

      <H2 id="bundle-analizi">Bundle Analizi</H2>
      <P>
        <InlineCode>@next/bundle-analyzer</InlineCode> ile JS bundle&apos;ını görselleştirin. 
        Büyük bağımlılıkları tespit edip <InlineCode>dynamic()</InlineCode> ile 
        lazy-load edin.
      </P>

      <CodeBlock
        language="TypeScript"
        filename="next.config.ts"
        code={`import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer({
  // config
});`}
      />

      <H2 id="image-optimizasyonu">Image Optimizasyonu</H2>
      <P>
        Next.js <InlineCode>Image</InlineCode> bileşenini her zaman kullanın. 
        LCP öğesi olan görsele <InlineCode>priority</InlineCode> prop&apos;u ekleyin.
      </P>

      <CodeBlock
        language="TypeScript"
        filename="hero.tsx"
        code={`<Image
  src="/hero.jpg"
  alt="Hero görseli"
  width={1200}
  height={630}
  priority          // LCP öğesi — preload
  sizes="100vw"
  quality={85}
/>`}
      />
    </div>
  ),
};

// ---- Component ----------------------------------------------------

export async function PostContent({ slug }: { slug: string }) {
  const renderer = registry[slug];

  if (!renderer) {
    return (
      <div className="py-10 text-center text-[hsl(var(--foreground-3))]">
        <p className="text-sm">İçerik henüz hazırlanmamış.</p>
      </div>
    );
  }

  const content = await renderer();
  return <>{content}</>;
}
