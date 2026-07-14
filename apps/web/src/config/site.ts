export const site = {
  url: "https://mustafaulutas.com",
  name: "Mustafa Ulutaş",
  role: "Full-Stack Software Developer",
  title: "Mustafa Ulutaş · Full-Stack Software Developer",
  description:
    "Backend ağırlıklı Full-Stack .NET geliştiricisi. Legacy bir HRM ürününü ASP.NET Core, Clean Architecture, CQRS ve React + TypeScript ile multi-tenant SaaS mimarisine taşıdım; sistem iki kurumsal şirkette canlı çalışıyor.",
  locale: "tr_TR",
  location: "Kocaeli, Türkiye",
  email: "mustafaulutasdev@gmail.com",
  social: {
    github: "https://github.com/devmustafaulutas",
    linkedin: "https://www.linkedin.com/in/mustafa-uluta%C5%9F-59aa82297/",
  },
  rev: "REV 2026.07",
  keywords: [
    "Mustafa Ulutaş",
    "Full-Stack Software Developer",
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

export type Site = typeof site;
