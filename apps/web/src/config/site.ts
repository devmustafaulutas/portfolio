export const siteConfig = {
  url: "https://mustafaulutas.com",
  name: "Mustafa Ulutaş",
  role: "Backend Architect & Full-Stack Developer",
  tagline: "Dijital Yolculuk — Deep Tech & Evolution",
  description:
    "Backend ağırlıklı Full-Stack .NET Developer. Legacy ASP.NET MVC tabanlı bir HRM ürününü ASP.NET Core, Clean Architecture, CQRS ve React + TypeScript ile multi-tenant SaaS mimarisine taşıdım. Kariyer yolculuğumu sinematik bir scroll deneyimiyle keşfedin.",
  locale: "tr_TR",
  location: "Kocaeli, Türkiye",
  email: "mustafaum538@gmail.com",
  social: {
    github: "https://github.com/devmustafaulutas",
    linkedin: "https://www.linkedin.com/in/mustafaulutas",
  },
  keywords: [
    "Mustafa Ulutaş",
    "Backend Architect",
    "Full-Stack Developer",
    ".NET Developer",
    "ASP.NET Core",
    "Clean Architecture",
    "CQRS",
    "Multi-tenant SaaS",
    "RabbitMQ",
    "React",
    "TypeScript",
    "Next.js",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
