// ============================================================
// Showcase Content — the giant hover-to-reveal project list.
// `pattern` picks one of the abstract monochrome follower looks.
// ============================================================

export type ShowcasePattern = "grid" | "waves" | "beams" | "halftone";

export type ShowcaseProject = {
  id: string;
  index: string;
  name: string;
  url: string;
  domain: string;
  year: string;
  blurb: string;
  stack: string[];
  pattern: ShowcasePattern;
};

export const showcaseSection = {
  label: "03 — SEÇİLMİŞ İŞLER",
  title: "Canlıda konuşan projeler",
  lede: "İsimlerin üzerine gel — her proje kendi dokusunu taşır. Tıkla ve canlısını gör.",
} as const;

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: "coffeelounge",
    index: "01",
    name: "The Best Coffee Lounge",
    url: "https://thebestcoffeelounge.com",
    domain: "thebestcoffeelounge.com",
    year: "2025",
    blurb:
      "Masada QR ile açılan, panelden yönetilen mobil öncelikli dijital menü.",
    stack: ["Next.js", "TypeScript"],
    pattern: "halftone",
  },
  {
    id: "baranboya",
    index: "02",
    name: "Baran Boya",
    url: "https://baranboya.com",
    domain: "baranboya.com",
    year: "2025",
    blurb:
      "Rol bazlı yetkilendirme ve 2FA ile korunan, içerik yönetimli kurumsal uygulama.",
    stack: ["Laravel", "MySQL"],
    pattern: "beams",
  },
  {
    id: "proset",
    index: "03",
    name: "Proset Elevator",
    url: "https://prosetelevator.com",
    domain: "prosetelevator.com",
    year: "2025",
    blurb:
      "Arama motoru görünürlüğü için eğilip bükülmüş, SEO odaklı kurumsal site.",
    stack: ["Next.js", "SEO"],
    pattern: "waves",
  },
  {
    id: "mecode",
    index: "04",
    name: "Mecode Bilişim",
    url: "https://mecodebilisim.com",
    domain: "mecodebilisim.com",
    year: "2025",
    blurb:
      "CRUD panelli, SEO'su panelden yönetilen kurumsal web platformu.",
    stack: ["ASP.NET Core", "Web API"],
    pattern: "grid",
  },
];
