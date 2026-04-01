import type { Metadata } from "next";
import { Github, Linkedin, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: `${siteConfig.name} ile iletişime geçmek için e-posta ve sosyal bağlantılar.`,
  alternates: { canonical: `${siteConfig.url}/contact` },
};

const CHANNELS = [
  {
    title: "E-posta",
    description: "Yeni proje, freelance iş birliği veya sadece merhaba demek için en net kanal.",
    href: `mailto:${siteConfig.author.email}`,
    label: siteConfig.author.email,
    Icon: Mail,
  },
  {
    title: "LinkedIn",
    description: "Profesyonel bağlantı, ürün ve kariyer odaklı konuşmalar için.",
    href: siteConfig.social.linkedin,
    label: "LinkedIn profili",
    Icon: Linkedin,
  },
  {
    title: "GitHub",
    description: "Kod tarafını görmek, repolara bakmak ve teknik detayları incelemek için.",
    href: siteConfig.social.github,
    label: "GitHub profili",
    Icon: Github,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: "Ana Sayfa", href: "/" },
              { name: "Contact", href: "/contact" },
            ])
          ),
        }}
      />

      <div className="container-site py-16 md:py-24">
        <header className="max-w-[52rem]">
          <div className="section-label mb-5">Contact</div>
          <h1 className="text-display text-[clamp(2.8rem,8vw,6rem)] text-[hsl(var(--foreground))]">
            Bir şeyler üretelim.
          </h1>
          <p className="mt-6 max-w-[44ch] text-lg leading-8 text-[hsl(var(--foreground-2))]">
            {siteConfig.author.availability} En hızlı dönüş için e-posta en iyi kanal.
          </p>
        </header>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {CHANNELS.map(({ title, description, href, label, Icon }) => (
            <a
              key={title}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="group rounded-[28px] border border-[hsl(var(--border))] bg-[linear-gradient(180deg,hsl(var(--surface)/0.8),hsl(var(--surface-raised)/0.72))] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[hsl(var(--accent)/0.35)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface-subtle))] text-[hsl(var(--accent))]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[hsl(var(--foreground))]">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[hsl(var(--foreground-2))]">
                {description}
              </p>
              <div className="mt-6 text-sm font-medium text-[hsl(var(--accent))] group-hover:underline">
                {label}
              </div>
            </a>
          ))}
        </section>
      </div>
    </>
  );
}