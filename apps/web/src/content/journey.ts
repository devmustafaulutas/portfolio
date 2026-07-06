// ============================================================
// Journey Content Model — the single source of truth for the
// one-page timeline. Pure data: no UI concerns live here.
// ============================================================

export type JourneySide = "left" | "right";

export type JourneyKind =
  | "education"
  | "internship"
  | "freelance"
  | "career";

export type FreelanceProject = {
  name: string;
  domain: string;
  url: string;
  summary: string;
  tech: string[];
};

export type ApexStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type ApexData = {
  kicker: string;
  product: string;
  statement: string;
  bullets: string[];
  stats: ApexStat[];
  stack: string[];
};

export type JourneyNode = {
  id: string;
  index: string;
  period: string;
  kind: JourneyKind;
  side: JourneySide;
  eyebrow: string;
  title: string;
  org?: string;
  summary: string;
  bullets?: string[];
  tech?: string[];
  projects?: FreelanceProject[];
};

export const journeyIntro = {
  label: "02 // THE JOURNEY",
  title: "Dijital Yolculuk",
  lede: "Temel atmadan zirveye: her durak, bir sonraki sistemin mimarisini kurdu. Aşağı kaydır — çizgiyi takip et.",
} as const;

export const journeyNodes: JourneyNode[] = [
  {
    id: "sube",
    index: "01",
    period: "05.2025",
    kind: "education",
    side: "left",
    eyebrow: "TEMEL ATMA",
    title: "Sakarya Uygulamalı Bilimler Üniversitesi",
    org: "Ön Lisans — Bilgisayar Programcılığı",
    summary:
      "Mühendislik disiplininin temeli burada atıldı: algoritmik düşünce, veri yapıları ve üretim odaklı yazılım pratiği.",
    bullets: [
      "BTK Akademi — Siber Güvenliğe Giriş sertifikası",
      "BTK Akademi — İleri Seviye Python sertifikası",
      "İngilizce — B2",
    ],
    tech: ["C#", "Python", "SQL", "Algoritma"],
  },
  {
    id: "bimser",
    index: "02",
    period: "01.2025 — 05.2025",
    kind: "internship",
    side: "right",
    eyebrow: "KURUMSAL STANDARTLAR",
    title: "Bimser Türkiye",
    org: "Long Term Intern — Kocaeli",
    summary:
      "Kurumsal yazılım geliştirme süreçlerinin içinde: API tasarımı, analiz, geliştirme ve test akışları. Modüler kod yapısı ve kurumsal geliştirme standartları burada refleks hâline geldi.",
    bullets: [
      "Kurumsal API tasarımı, analiz ve test akışlarına aktif katılım",
      "Modüler mimari ve code-review disiplini",
    ],
    tech: ["C#", ".NET", "REST API", "Enterprise Patterns"],
  },
  {
    id: "freelance",
    index: "03",
    period: "FREELANCE DÖNEMİ",
    kind: "freelance",
    side: "left",
    eyebrow: "SAHADA KANIT",
    title: "Üretime Çıkan Projeler",
    summary:
      "Gerçek müşteriler, gerçek trafik, gerçek sorumluluk. Her proje canlıda — tasarımdan veritabanına uçtan uca teslim edildi.",
    projects: [
      {
        name: "The Best Coffee Lounge",
        domain: "thebestcoffeelounge.com",
        url: "https://thebestcoffeelounge.com",
        summary:
          "Kafeye özel, mobil öncelikli dijital menü. Kategori bazlı dinamik içerik yapısı; masada QR ile canlı kullanımda.",
        tech: ["Next.js", "TypeScript", "Responsive UI"],
      },
      {
        name: "Proset Elevator",
        domain: "prosetelevator.com",
        url: "https://prosetelevator.com",
        summary:
          "SEO odaklı kurumsal tanıtım sitesi. Sayfa yapısı ve performans optimizasyonu ile arama motoru görünürlüğü.",
        tech: ["Next.js", "SEO", "Performance"],
      },
      {
        name: "Baran Boya",
        domain: "baranboya.com",
        url: "https://baranboya.com",
        summary:
          "Dinamik kurumsal web uygulaması ve içerik yönetimli admin panel. Rol bazlı yetkilendirme ve 2FA dahil temel güvenlik.",
        tech: ["Laravel", "PHP", "MySQL", "RBAC + 2FA"],
      },
    ],
  },
  {
    id: "mecode-intern",
    index: "04",
    period: "05.2025 — 08.2025",
    kind: "internship",
    side: "right",
    eyebrow: "ÜRETİM HATTINA GİRİŞ",
    title: "Mecode Bilişim",
    org: "Intern — Kocaeli",
    summary:
      "Şirketin kurumsal web sitesini (mecodebilisim.com) ASP.NET Core MVC ve Web API ile geliştirip güncelledim; içerik, sayfa ve medya yönetimi tek panelde toplandı.",
    bullets: [
      "Dashboard'lu dinamik admin panel — içerik, sayfa ve medya için CRUD ekranları",
      "Meta title/description, slug ve sayfa ayarlarının panelden yönetildiği SEO altyapısı",
    ],
    tech: ["ASP.NET Core MVC", "Web API", "C#", "SEO Yönetimi"],
  },
];

export const apexData: ApexData = {
  kicker: "08.2025 — GÜNÜMÜZ // MECODE BİLİŞİM // FULL-STACK SOFTWARE DEVELOPER",
  product: "ENVANTY",
  statement:
    "Legacy ASP.NET MVC tabanlı HRM ürününü ASP.NET Core, Clean Architecture, Feature-based CQRS ve React + TypeScript ile multi-tenant SaaS mimarisine taşıdım.",
  bullets: [
    "Tenant bazlı veri izolasyonu, JWT/RBAC, middleware, logging ve Redis caching içeren güvenli authentication akışları",
    "RabbitMQ ve WolverineFx ile asenkron mesajlaşma / message queue altyapısı",
    "Minimal API + EF Core üzerine kurulan yeni backend mimarisi ve ilişkisel veritabanı tasarımı",
    "React + TypeScript ile role/permission bazlı, mobil uyumlu dashboard ve admin panel",
  ],
  stats: [
    { value: 2, label: "KURUMSAL ŞİRKETTE CANLI" },
    { value: 6, suffix: "+", label: "PRODUCTION MODÜLÜ" },
    { value: 1, label: "LEGACY ÜRÜN → MODERN SAAS" },
  ],
  stack: [
    ".NET CORE",
    "CLEAN ARCHITECTURE",
    "CQRS",
    "RABBITMQ",
    "MULTI-TENANT SAAS",
    "REDIS",
    "WOLVERINEFX",
    "EF CORE",
  ],
};

export const apexModules = [
  "Envanter Yönetimi",
  "Zimmet",
  "Bordro",
  "Çalışan İletişim Platformu",
  "İK Chatbot",
  "Anket",
] as const;
