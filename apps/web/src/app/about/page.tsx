import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: `${siteConfig.name} hakkında: çalışma yaklaşımı, odak alanları ve deneyim notları.`,
  alternates: { canonical: `${siteConfig.url}/about` },
};

const TIMELINE = [
  {
    period: "Bugün",
    title: "Creative full-stack ürün yaklaşımı",
    body: "Next.js tarafında motion ve premium UI, backend tarafında ise .NET ve sağlam mimari kararları aynı üründe buluşturmaya odaklanıyorum.",
  },
  {
    period: "Son yıllar",
    title: "Üretimde çalışan web sistemleri",
    body: "Performans, SEO, bakım kolaylığı ve kullanıcı deneyimi dengesini bozmadan ürün geliştirmeyi önemsiyorum.",
  },
  {
    period: "Sürekli",
    title: "Deney, öğrenme, rafine etme",
    body: "Her projede tasarımı, kod yapısını ve hissi tekrar düşünmeyi seviyorum. Amaç her seferinde biraz daha net ve güçlü bir deneyim üretmek.",
  },
] as const;

const FOCUS = ["Next.js App Router", "GSAP + Lenis", ".NET", "TypeScript", "SEO & Performance", "UI Systems"] as const;

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Ana Sayfa", href: "/" },
              { name: "About", href: "/about" },
            ])
          ),
        }}
      />

      <div className="container-site py-16 md:py-24">
        <header className="max-w-[58rem]">
          <div className="section-label mb-5">About me</div>
          <h1 className="text-display text-[clamp(2.8rem,8vw,6.4rem)] text-[hsl(var(--foreground))]">
            Arayüz ile sistem arasında köprü kuruyorum.
          </h1>
          <p className="mt-6 max-w-[46ch] text-lg leading-8 text-[hsl(var(--foreground-2))]">
            {siteConfig.author.bio} Benim için iyi ürün; yalnızca güzel görünmek değil, hızlı hissettirmek, anlaşılır olmak ve uzun vadede bakım maliyetini düşürmektir.
          </p>
        </header>

        <section className="mt-14 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-[hsl(var(--border))] bg-[linear-gradient(180deg,hsl(var(--surface)/0.8),hsl(var(--surface-raised)/0.72))] p-6 md:p-8">
            <div className="text-label mb-4">Odak alanlarım</div>
            <div className="flex flex-wrap gap-2">
              {FOCUS.map((item) => (
                <span key={item} className="badge badge-accent">{item}</span>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-[24px] border border-[hsl(var(--border))] p-5">
                <div className="text-sm font-semibold text-[hsl(var(--foreground))]">Yaklaşım</div>
                <p className="mt-2 text-sm leading-7 text-[hsl(var(--foreground-2))]">
                  Minimal yüzeyler, güçlü tipografi, kontrollü motion ve ölçülebilir performans. Şov için değil, etki için animasyon.
                </p>
              </div>
              <div className="rounded-[24px] border border-[hsl(var(--border))] p-5">
                <div className="text-sm font-semibold text-[hsl(var(--foreground))]">Çalışma şekli</div>
                <p className="mt-2 text-sm leading-7 text-[hsl(var(--foreground-2))]">
                  Önce bilgi mimarisi ve kullanıcı akışı, sonra motion dili, en son polish. Tasarım ve kod aynı masada çözülmeli.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.76)] p-6 md:p-8">
            <div className="text-label mb-6">Zaman çizgisi</div>
            <div className="space-y-6">
              {TIMELINE.map((item) => (
                <article key={item.title} className="relative border-l border-[hsl(var(--border))] pl-5">
                  <span className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--foreground-3))]">
                    {item.period}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[hsl(var(--foreground))]">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[hsl(var(--foreground-2))]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-[30px] border border-[hsl(var(--border))] bg-[hsl(var(--surface-subtle)/0.5)] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="section-label mb-4">Devam et</div>
              <h2 className="text-heading text-[clamp(1.75rem,4vw,3rem)] text-[hsl(var(--foreground))]">
                Yazılara ya da iletişim sayfasına geçebilirsin.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/blog" className="btn btn-primary">
                Blog
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Contact
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}