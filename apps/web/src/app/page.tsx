import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Code2,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

const LINKS = {
  projects: "/projects",
  blog: "/blog",
  snippets: "/snippets",
  email: "mailto:hello@example.com",
  github: "https://github.com/",
  linkedin: "https://linkedin.com/",
};

function KineticLine({ children }: { children: string }) {
  return (
    <div data-kinetic-line className="kinetic-line">
      <span className="kinetic-line__inner">{children}</span>
    </div>
  );
}

function NavPill({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-magnetic
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
        "ocean-pill hover:-translate-y-[1px] active:translate-y-0 transition will-change-transform"
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:rotate-45" />
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="relative">
      {/* HERO */}
      <section data-section data-hero className="">
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-16 md:pt-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full ocean-kicker-pill px-4 py-2 text-xs">
              <span className="ocean-dot" />
              OCEAN PORTFOLIO • DAY/NIGHT • LENIS+GSAP
            </div>

            <h1
              data-hero-title
              className="mt-7 text-[clamp(44px,6vw,84px)] font-semibold tracking-tight leading-[0.98]"
            >
              Merhaba, ben Mustafa Ulutaş.
            </h1>

            <p
              data-hero-lead
              className="mt-5 text-base md:text-lg leading-8 text-foreground/75 max-w-[68ch]"
            >
              Üretimde çalışan sistemler kuruyorum: performans, güvenlik ve tasarım aynı sahnede.
              Bu sayfa “UI” değil — <span className="text-foreground">hissettiren</span> bir dalış.
              Üstte yüzey aydınlık, aşağı indikçe derinleşiyor.
            </p>

            <div data-hero-cta className="mt-8 flex flex-wrap gap-3">
              <Link href={LINKS.projects} data-magnetic className="ocean-cta">
                Selected Work <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={LINKS.blog} data-magnetic className="ocean-cta ghost">
                Writing <BookOpen className="h-4 w-4" />
              </Link>
              <Link href={LINKS.snippets} data-magnetic className="ocean-cta ghost">
                Snippets <Code2 className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-2 text-xs text-foreground/70">
              {["Performance", "Security", "Systems", "UX", "Storytelling"].map((t) => (
                <span key={t} className="ocean-chip px-3 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-2">
              <NavPill href={LINKS.github}>
                <Github className="h-4 w-4" /> GitHub
              </NavPill>
              <NavPill href={LINKS.linkedin}>
                <Linkedin className="h-4 w-4" /> LinkedIn
              </NavPill>
              <NavPill href={LINKS.email}>
                <Mail className="h-4 w-4" /> Email
              </NavPill>
            </div>
            <div className="mt-10 ocean-scroll-cue">
              <div className="ocean-scroll-cue__dot" />
              <div className="text-sm text-foreground/70">
                Scroll → yüzey ışığı azalır, “ink” artar, tipografi sahne değiştirir.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KINETIC TYPOGRAPHY — PINNED SCENE */}
      <section data-section data-kinetic className="relative">
        <div data-kinetic-pin className="mx-auto max-w-6xl px-6 py-24 md:py-28">
          <div className="max-w-4xl">
            <div className="text-xs tracking-wide text-foreground/60">
              CHAPTER 01 • SURFACE → MIDWATER
            </div>

            <h2
              data-kinetic-title
              className="mt-5 text-[clamp(36px,5.2vw,78px)] font-semibold tracking-tight leading-[1.02]"
            >
              Daha az UI, daha çok sahne.
            </h2>

            <p
              data-kinetic-sub
              className="mt-5 text-base md:text-lg leading-8 text-foreground/75 max-w-[70ch]"
            >
              Bu bölüm pinned: scroll ettikçe cümleler “su gibi” akar. Blur, spacing ve
              mask reveal ile okyanus hissi. (Vel/scroll değerleri Lenis’ten geliyor.)
            </p>

            <div className="mt-12 space-y-3">
              <KineticLine>Ship systems.</KineticLine>
              <KineticLine>Polish UX.</KineticLine>
              <KineticLine>Harden security.</KineticLine>
              <KineticLine>Tell it cinematically.</KineticLine>
            </div>

            <div className="mt-12 ocean-rule" />
            <p className="mt-8 text-sm text-foreground/70">
              İpucu: mouse’u gezdir → su yüzeyi “spotlight” takip eder. Tıklayınca route wipe var.
            </p>
          </div>
        </div>
      </section>

      {/* SELECTED WORK — LIST (no cards) */}
      <section data-section className="mx-auto max-w-6xl px-6 py-24 md:py-28">
        <div className="text-xs tracking-wide text-foreground/60">CHAPTER 02 • WORK</div>
        <h3 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">
          Seçilmiş işler (liste, kart değil).
        </h3>
        <p className="mt-4 text-sm md:text-base leading-7 text-foreground/75 max-w-[70ch]">
          Hover’da satır “kayarak” tepki verir. Scroll’da reveal var. Minimal içerik + maksimum his.
        </p>

        <ul className="mt-10 divide-y divide-border/60">
          {[
            {
              title: "Envanty Platform",
              meta: ".NET 9 • CQRS • Multi-tenant • React",
              href: LINKS.projects,
            },
            {
              title: "Dashboard Builder",
              meta: "Grid systems • Layouts • Motion • DX",
              href: LINKS.projects,
            },
            {
              title: "Engineering Notes",
              meta: "Scaling • Performance • Security",
              href: LINKS.blog,
            },
            {
              title: "Reusable Snippets",
              meta: "UI primitives • Hooks • Patterns",
              href: LINKS.snippets,
            },
          ].map((i) => (
            <li key={i.title} className="py-6 md:py-7">
              <Link
                href={i.href}
                data-reveal
                data-hoverline
                className="work-line group flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between"
              >
                <span className="work-line__title text-2xl md:text-3xl font-semibold tracking-tight">
                  {i.title}
                </span>
                <span className="work-line__meta text-sm text-foreground/70">
                  {i.meta}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* DEEP END — CONTACT */}
      <section data-section className="mx-auto max-w-6xl px-6 pb-28 pt-10 md:pt-14">
        <div className="text-xs tracking-wide text-foreground/60">CHAPTER 03 • ABYSS</div>
        <h3 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">
          Derinlikte konuşalım.
        </h3>
        <p className="mt-5 text-sm md:text-base leading-7 text-foreground/75 max-w-[70ch]">
          Aşağı indikçe ortam koyulaşır — ama tipografi daha netleşir. Bu hissi tüm siteye yayacağız.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={LINKS.email} data-magnetic className="ocean-cta">
            Email <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href={LINKS.github} data-magnetic className="ocean-cta ghost">
            GitHub <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href={LINKS.linkedin} data-magnetic className="ocean-cta ghost">
            LinkedIn <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-16 h-[22svh]" aria-hidden="true" />
      </section>
    </main>
  );
}
