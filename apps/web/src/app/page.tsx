import Link from "next/link";
import {
  ArrowUpRight,
  Play,
  Waves,
  Sparkles,
  Shield,
  Gauge,
  Layers,
  Radar,
  Cpu,
  PenTool,
  BookOpen,
  Code2,
  Mail,
  Github,
  Linkedin,
} from "lucide-react";

// ✅ Import path’leri sende farklıysa düzelt
import { OceanBackdrop } from "@/src/components/layout/ocean-backdrop";
import { OceanScene } from "@/src/components/layout/ocean-scene";

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

const HERO = {
  name: "Mustafa Ulutaş",
  title: "Software Engineer",
  tagline:
    "Okyanusun içinde çalışan ürünler: performans, güvenlik, tasarım ve hikâye anlatımı. Burada her şey sinematik: derinlik + motion + premium yüzeyler.",
  badges: ["Ship", "Learn", "Polish", "Performance", "Security", "Design"],
};

function CTA({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "glass";
}) {
  return (
    <Link
      href={href}
      data-magnetic
      className={cx(
        "group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition will-change-transform",
        "hover:-translate-y-0.5 active:translate-y-0",
        variant === "primary"
          ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
          : "glass-surface text-foreground/90"
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

function MiniPill({ icon: Icon, label, value }: any) {
  return (
    <div className="glass-surface flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-tight">
          <div className="text-[11px] text-foreground/60">{label}</div>
          <div className="text-sm font-semibold text-foreground">{value}</div>
        </div>
      </div>
      <div className="h-2 w-2 rounded-full bg-white/40 shadow-[0_0_16px_rgba(255,255,255,0.35)]" />
    </div>
  );
}

function SlideCard({
  kicker,
  title,
  desc,
  href,
  icon: Icon,
  tags,
}: {
  kicker: string;
  title: string;
  desc: string;
  href: string;
  icon: any;
  tags: string[];
}) {
  return (
    <Link
      href={href}
      data-magnetic
      className={cx(
        "group relative w-[320px] shrink-0 overflow-hidden rounded-[28px] border border-border/60",
        "bg-white/5 backdrop-blur-[14px] shadow-[0_22px_70px_rgba(0,0,0,0.35)]",
        "transition hover:-translate-y-1"
      )}
    >
      <div className="absolute inset-0 opacity-70">
        <div className="hero-ocean" />
        <div className="hero-caustics" />
        <div className="hero-bubbles" />
        <div className="hero-vignette" />
      </div>

      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="text-[11px] tracking-wide text-foreground/65">{kicker}</div>
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          {title}
        </div>
        <div className="mt-2 text-sm leading-6 text-foreground/70">{desc}</div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/60 bg-white/5 px-2.5 py-1 text-[11px] text-foreground/70"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          Explore
          <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="relative">
      {/* background layers (cinematic ocean) */}
      <OceanBackdrop sharkSrc="/assets/mascots/shark/shark-silhouette.svg" />
      <OceanScene sharkSrc="/assets/mascots/shark/shark-angry.svg" />

      {/* foreground */}
      <div className="relative z-10">
        <div className="scroll-progress" />

        {/* =========================
            HERO (PINNED / CINEMATIC)
           ========================= */}
        <section
          data-hero-pin
          data-section
          className="relative min-h-[100svh] overflow-hidden"
        >
          {/* ambient hero overlays */}
          <div className="pointer-events-none absolute inset-0">
            <div className="hero-ocean" />
            <div className="hero-caustics" />
            <div className="hero-bubbles" />
            <div className="hero-vignette" />
            <div className="ocean-hero-glow" />
            <div className="ocean-hero-grid" />
            <div className="ocean-hero-depth" />
          </div>

          <div className="mx-auto max-w-6xl px-6 pb-20 pt-28 md:pt-32">
            <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
              {/* LEFT */}
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full glass-surface px-4 py-2 text-xs text-foreground/75">
                  <Waves className="h-4 w-4 text-primary" />
                  <span className="tracking-wide">CINEMATIC OCEAN • PORTFOLIO</span>
                  <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
                    depth: <span className="font-semibold">live</span>
                  </span>
                </div>

                <h1
                  data-hero-title
                  className="mt-6 text-5xl font-semibold tracking-tight text-foreground md:text-6xl"
                >
                  <span className="block">Merhaba, ben</span>
                  <span className="block">{HERO.name}.</span>
                </h1>

                <p
                  data-hero-lead
                  className="mt-5 max-w-2xl text-sm leading-7 text-foreground/75 md:text-base md:leading-8"
                >
                  {HERO.tagline}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <CTA href="#dive" variant="primary">
                    <Play className="h-4 w-4" />
                    Dive in
                  </CTA>

                  <CTA href={LINKS.projects} variant="glass">
                    <Layers className="h-4 w-4" />
                    Projects
                  </CTA>

                  <CTA href={LINKS.blog} variant="glass">
                    <BookOpen className="h-4 w-4" />
                    Writing
                  </CTA>

                  <CTA href={LINKS.snippets} variant="glass">
                    <Code2 className="h-4 w-4" />
                    Snippets
                  </CTA>
                </div>

                <div className="mt-10 flex flex-wrap gap-2">
                  {HERO.badges.map((b) => (
                    <span
                      key={b}
                      data-hero-chip
                      className="rounded-full border border-border/60 bg-white/5 px-3 py-1 text-[11px] text-foreground/70 backdrop-blur-[10px]"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <div className="mt-10 ocean-divider" />

                <div className="mt-6 flex items-center gap-3 text-sm text-foreground/75">
                  <div className="hero-scroll-cue">
                    <div className="hero-scroll-dot" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Scroll</div>
                    <div className="text-[12px] text-foreground/60">
                      “derinlik” artacak, sahne değişecek.
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT (HUD / SONAR) */}
              <div
                data-hero-right
                className="relative overflow-hidden rounded-[32px] ocean-panel p-6"
              >
                <div className="absolute inset-0 opacity-80">
                  <div className="ocean-hero-glow" />
                </div>

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-foreground/60">Submarine HUD</div>
                      <div className="mt-1 text-lg font-semibold tracking-tight">
                        Mission Control
                      </div>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5">
                      <Radar className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  {/* Depth meter (uses --scroll) */}
                  <div className="mt-5 rounded-2xl border border-border/60 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-[11px] text-foreground/65">
                      <span>Depth</span>
                      <span className="font-semibold text-foreground/80">
                        controlled by scroll
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/25">
                      <div
                        className="depth-bar h-full rounded-full bg-[hsl(var(--primary))] shadow-[0_0_18px_rgba(120,140,255,0.45)]"
                        style={{ transform: "scaleX(var(--scroll))" }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <MiniPill icon={Gauge} label="Performance" value="Fast UI / smooth scroll" />
                    <MiniPill icon={Shield} label="Security" value="Hardened, production-first" />
                    <MiniPill icon={PenTool} label="Design" value="Premium glass + motion" />
                    <MiniPill icon={Cpu} label="Systems" value="Modular architecture" />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link
                      href={LINKS.github}
                      data-magnetic
                      className="glass-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-foreground/80"
                    >
                      <Github className="h-4 w-4" />
                      GitHub <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={LINKS.linkedin}
                      data-magnetic
                      className="glass-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-foreground/80"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={LINKS.email}
                      data-magnetic
                      className="glass-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-foreground/80"
                    >
                      <Mail className="h-4 w-4" />
                      Email <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            DIVE ENTRY (REVEAL)
           ========================= */}
        <section id="dive" data-section className="mx-auto max-w-6xl px-6 py-16">
          <div className="glass-surface rounded-[34px] p-8 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="text-xs tracking-wide text-foreground/60" data-reveal>
                  CHAPTER 01 • SURFACE
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl" data-reveal>
                  Okyanus burada başlıyor.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/70" data-reveal>
                  Scroll ilerledikçe sahne “derinleşiyor”. Hero pin, stacked rail ve yatay
                  scroller ile sinema dili kuruyoruz.
                </p>
              </div>

              <div className="flex gap-3">
                <CTA href={LINKS.projects} variant="primary">
                  <Layers className="h-4 w-4" />
                  Selected Work
                </CTA>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FEATURE RAIL (PINNED STACK)
           ========================= */}
        <section
          data-feature-rail
          data-section
          className="relative mx-auto max-w-6xl px-6 pb-24"
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            {/* Left narration */}
            <div className="pt-6">
              <div className="glass-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-foreground/70">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>CHAPTER 02 • THE RAIL</span>
              </div>

              <h3 className="mt-6 text-3xl font-semibold tracking-tight" data-reveal>
                Stack’lenen sahneler.
              </h3>
              <p className="mt-4 text-sm leading-7 text-foreground/70" data-reveal>
                Bu bölüm pinned. Kartlar üst üste “stack” gibi durur ve scroll ile sahne
                sahne öne çıkar.
              </p>

              <div className="mt-8 ocean-divider" />

              <div className="mt-6 grid gap-3">
                <div className="glass-surface rounded-2xl p-4" data-reveal>
                  <div className="text-xs text-foreground/60">Vibe</div>
                  <div className="mt-1 font-semibold">Cinematic ocean / premium glass</div>
                </div>
                <div className="glass-surface rounded-2xl p-4" data-reveal>
                  <div className="text-xs text-foreground/60">Motion</div>
                  <div className="mt-1 font-semibold">Pin + scrub + parallax</div>
                </div>
                <div className="glass-surface rounded-2xl p-4" data-reveal>
                  <div className="text-xs text-foreground/60">Narration</div>
                  <div className="mt-1 font-semibold">Case studies gibi section’lar</div>
                </div>
              </div>
            </div>

            {/* Right stack cards (data-feature-item) */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 opacity-40">
                <div className="hero-caustics" />
              </div>

              <div className="grid gap-4">
                <div
                  data-feature-item
                  className="ocean-panel rounded-[34px] p-7 md:p-8"
                >
                  <div className="text-xs tracking-wide text-foreground/60">
                    SCENE A • SYSTEMS
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    Product & platform sistemleri
                  </div>
                  <p className="mt-3 text-sm leading-7 text-foreground/70">
                    Modüler yapı, okunabilir akış, production-first yaklaşım.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Architecture", "CQRS", "DX", "Observability"].map((t) => (
                      <span key={t} className="rounded-full border border-border/60 bg-white/5 px-3 py-1 text-[11px] text-foreground/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  data-feature-item
                  className="ocean-panel rounded-[34px] p-7 md:p-8"
                >
                  <div className="text-xs tracking-wide text-foreground/60">
                    SCENE B • PERFORMANCE
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    Hız hissi: akış, latency, motion
                  </div>
                  <p className="mt-3 text-sm leading-7 text-foreground/70">
                    Lenis + ScrollTrigger + micro-interactions: “premium” hissi veren akıcılık.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["UX latency", "Smooth scroll", "GPU-friendly", "No jank"].map((t) => (
                      <span key={t} className="rounded-full border border-border/60 bg-white/5 px-3 py-1 text-[11px] text-foreground/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  data-feature-item
                  className="ocean-panel rounded-[34px] p-7 md:p-8"
                >
                  <div className="text-xs tracking-wide text-foreground/60">
                    SCENE C • SECURITY
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    Güvenlik: sert, temiz, sistematik
                  </div>
                  <p className="mt-3 text-sm leading-7 text-foreground/70">
                    Upload hardening, rate limit, headers, authz—şovun arkasında sağlamlık.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Hardening", "Policy", "RateLimit", "Audit"].map((t) => (
                      <span key={t} className="rounded-full border border-border/60 bg-white/5 px-3 py-1 text-[11px] text-foreground/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  data-feature-item
                  className="ocean-panel rounded-[34px] p-7 md:p-8"
                >
                  <div className="text-xs tracking-wide text-foreground/60">
                    SCENE D • DESIGN
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-tight">
                    Glass + depth + cinematic composition
                  </div>
                  <p className="mt-3 text-sm leading-7 text-foreground/70">
                    Okyanus sahnesi + premium yüzeyler + güçlü tipografi: film hissi.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Composition", "Typography", "Motion", "Narrative"].map((t) => (
                      <span key={t} className="rounded-full border border-border/60 bg-white/5 px-3 py-1 text-[11px] text-foreground/70">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            HORIZONTAL SCROLLER (PINNED)
           ========================= */}
        <section data-hscroll data-section className="relative">
          <div
            data-hscroll-pin
            className="relative mx-auto max-w-6xl px-6 pb-24 pt-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="glass-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs text-foreground/70">
                  <Waves className="h-4 w-4 text-primary" />
                  <span>CHAPTER 03 • THE CAROUSEL</span>
                </div>
                <h3 className="mt-5 text-3xl font-semibold tracking-tight" data-reveal>
                  Yatay sahne akışı (GSAP docs vibe).
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-foreground/70" data-reveal>
                  Bu track pinned. Scroll ettikçe sahneler sağa akar: projects → writing → snippets.
                </p>
              </div>

              <div className="flex gap-3">
                <CTA href={LINKS.projects} variant="primary">
                  <Layers className="h-4 w-4" />
                  All Projects
                </CTA>
              </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-[34px] border border-border/60 bg-white/5 p-6 backdrop-blur-[14px]">
              <div data-hscroll-track className="flex gap-5">
                <SlideCard
                  kicker="PROJECT"
                  title="Envanty Platform"
                  desc="Multi-tenant enterprise: modules, workflow, files, dashboards."
                  href={LINKS.projects}
                  icon={Layers}
                  tags={[".NET 9", "Wolverine", "CQRS", "React"]}
                />
                <SlideCard
                  kicker="CASE STUDY"
                  title="Dashboard Builder"
                  desc="Bento grid, layouts, widgets, premium motion."
                  href={LINKS.projects}
                  icon={Gauge}
                  tags={["RGL", "Shadcn", "Motion", "UX"]}
                />
                <SlideCard
                  kicker="WRITING"
                  title="Engineering Notes"
                  desc="Gerçek problemler: performans, mimari, DX."
                  href={LINKS.blog}
                  icon={BookOpen}
                  tags={["Patterns", "Scaling", "Docs", "Clarity"]}
                />
                <SlideCard
                  kicker="SNIPPETS"
                  title="Reusable UI"
                  desc="Grid, dialogs, filters, composable components."
                  href={LINKS.snippets}
                  icon={Code2}
                  tags={["React", "TypeScript", "UI", "Hooks"]}
                />
                <SlideCard
                  kicker="SECURITY"
                  title="Upload Hardening"
                  desc="Scan, safe paths, strict validation, policies."
                  href={LINKS.projects}
                  icon={Shield}
                  tags={["AV scan", "Headers", "Rate limit", "Authz"]}
                />
                <SlideCard
                  kicker="DESIGN"
                  title="Cinematic Ocean"
                  desc="Sahne + ışık + caustics + shark passes."
                  href="#"
                  icon={Sparkles}
                  tags={["Caustics", "Depth", "Glass", "Narrative"]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FINAL SCENES (BIG SECTIONS)
           ========================= */}
        <section data-section className="mx-auto max-w-6xl px-6 pb-28 pt-10">
          <div className="grid gap-6">
            <div className="ocean-panel relative overflow-hidden rounded-[40px] p-10 md:p-12">
              <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="hero-ocean" />
                <div className="hero-caustics" />
                <div className="hero-vignette" />
              </div>

              <div className="relative">
                <div className="text-xs tracking-wide text-foreground/60" data-reveal>
                  CHAPTER 04 • THE DEPTH
                </div>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl" data-reveal>
                  “Sahne kurulur, ürün konuşur.”
                </h3>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-foreground/70" data-reveal>
                  Bu anasayfa bir “portfolio listesi” değil; bir film açılışı. Okyanus arka plan,
                  içerik sahne, scroll tempo.
                </p>

                <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                  <CTA href={LINKS.blog} variant="primary">
                    <BookOpen className="h-4 w-4" />
                    Read the log
                  </CTA>
                  <CTA href={LINKS.snippets} variant="glass">
                    <Code2 className="h-4 w-4" />
                    Open snippets
                  </CTA>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="glass-surface rounded-[34px] p-7" data-reveal>
                <div className="text-xs text-foreground/60">CUT • Projects</div>
                <div className="mt-2 text-lg font-semibold">Case study odaklı işler</div>
                <p className="mt-2 text-sm leading-7 text-foreground/70">
                  Üretimde çalışan, ölçülen ve taşınabilir sistemler.
                </p>
                <Link href={LINKS.projects} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" data-magnetic>
                  Explore <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="glass-surface rounded-[34px] p-7" data-reveal>
                <div className="text-xs text-foreground/60">CUT • Writing</div>
                <div className="mt-2 text-lg font-semibold">Notlar & rehberler</div>
                <p className="mt-2 text-sm leading-7 text-foreground/70">
                  Net anlatım, örnek odaklı içerikler, editorial akış.
                </p>
                <Link href={LINKS.blog} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" data-magnetic>
                  Read <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="glass-surface rounded-[34px] p-7" data-reveal>
                <div className="text-xs text-foreground/60">CUT • Snippets</div>
                <div className="mt-2 text-lg font-semibold">Tekrar kullanılabilir parçalar</div>
                <p className="mt-2 text-sm leading-7 text-foreground/70">
                  UI kit parçaları, hooks, grid patterns, utility’ler.
                </p>
                <Link href={LINKS.snippets} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" data-magnetic>
                  Open <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            CREDITS (CONTACT)
           ========================= */}
        <section data-section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="ocean-panel rounded-[44px] p-10 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="text-xs tracking-wide text-foreground/60" data-reveal>
                  CREDITS
                </div>
                <div className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl" data-reveal>
                  End of the dive.
                </div>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/70" data-reveal>
                  İş, fikir, ürün… mesaj bırak. Okyanus kapanmadan.
                </p>

                <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                  <CTA href={LINKS.email} variant="primary">
                    <Mail className="h-4 w-4" />
                    Email
                  </CTA>
                  <CTA href={LINKS.github} variant="glass">
                    <Github className="h-4 w-4" />
                    GitHub
                  </CTA>
                  <CTA href={LINKS.linkedin} variant="glass">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </CTA>
                </div>
              </div>

              <div className="glass-surface rounded-[34px] p-7" data-reveal>
                <div className="text-xs text-foreground/60">Now playing</div>
                <div className="mt-2 text-lg font-semibold">Cinematic Ocean Homepage</div>

                <div className="mt-5 space-y-3 text-sm text-foreground/75">
                  <div className="flex items-center justify-between">
                    <span>Hero pin</span>
                    <span className="text-foreground/60">enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Feature rail stack</span>
                    <span className="text-foreground/60">enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Horizontal scroller</span>
                    <span className="text-foreground/60">enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shark passes</span>
                    <span className="text-foreground/60">enabled</span>
                  </div>
                </div>

                <div className="mt-6 ocean-divider" />
                <div className="mt-4 text-xs text-foreground/60">
                  “Sahne + motion + premium yüzey” = senin istediğin şov.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
