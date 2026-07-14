// ============================================================
// Teknik cephanelik · CV'deki yetenek setinin disiplinlere
// ayrılmış hâli. "weight" görsel vurguyu belirler; backend ve
// mimari grupları bilinçli olarak öne çıkarılır.
// ============================================================

export type ArsenalGroup = {
  id: string;
  index: string;
  name: string;
  items: string[];
  weight: "primary" | "secondary";
};

export const arsenalSection = {
  label: "04 / CEPHANELİK",
  title: "Araçlar değil, kararlar.",
  lede: "Bir teknoloji listesi tek başına hiçbir şey söylemez; hangi katmanda neyin, neden kullanıldığı her şeyi söyler.",
  extras: "SAHADA AYRICA: PHP · LARAVEL · MYSQL · PYTHON (BTK, İLERİ SEVİYE) · SİBER GÜVENLİK TEMELLERİ (BTK) · İNGİLİZCE B2",
} as const;

export const marqueeWords = [
  ".NET",
  "CLEAN ARCHITECTURE",
  "CQRS",
  "MULTI-TENANT",
  "RABBITMQ",
  "REDIS",
  "REACT",
  "TYPESCRIPT",
  "EF CORE",
  "DOCKER",
] as const;

export const arsenalGroups: ArsenalGroup[] = [
  {
    id: "backend",
    index: "01",
    name: "BACKEND & ÇEKİRDEK",
    items: [
      "C#",
      ".NET",
      "ASP.NET Core",
      "Minimal API",
      "EF Core",
      "REST API",
      "Middleware",
      "Dependency Injection",
      "LINQ",
    ],
    weight: "primary",
  },
  {
    id: "mimari",
    index: "02",
    name: "MİMARİ",
    items: [
      "Clean Architecture",
      "Feature-Based CQRS",
      "Multi-Tenant Architecture",
      "İlişkisel Veritabanı Tasarımı",
    ],
    weight: "primary",
  },
  {
    id: "guvenlik",
    index: "03",
    name: "GÜVENLİK & MESAJLAŞMA",
    items: ["JWT", "Authentication", "RBAC", "Redis", "RabbitMQ", "WolverineFx"],
    weight: "secondary",
  },
  {
    id: "frontend",
    index: "04",
    name: "FRONTEND & DENEYİM",
    items: ["React", "TypeScript", "Next.js", "Vite", "JavaScript", "HTML", "CSS"],
    weight: "secondary",
  },
  {
    id: "teslimat",
    index: "05",
    name: "ARAÇLAR & TESLİMAT",
    items: ["Git", "GitHub", "Docker", "IIS", "Kestrel", "Swagger", "Scalar", "Postman"],
    weight: "secondary",
  },
];
