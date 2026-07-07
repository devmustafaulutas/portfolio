// ============================================================
// Experience Content — the giant monochrome accordion.
// Each entry is written as a short case study, not a CV bullet.
// ============================================================

export type ExperienceEntry = {
  id: string;
  index: string;
  period: string;
  company: string;
  role: string;
  headline: string;
  paragraphs: string[];
  tech: string[];
};

export const experienceSection = {
  label: "02 — KARİYER",
  title: "Vaka analizleri",
  lede: "Her satır bir pozisyon değil, çözülmüş bir problem. Açın ve mimarinin içine bakın.",
} as const;

export const experienceEntries: ExperienceEntry[] = [
  {
    id: "mecode-fullstack",
    index: "01",
    period: "08.2025 — GÜNÜMÜZ",
    company: "Mecode Bilişim",
    role: "Full-Stack Software Developer",
    headline: "Envanty — bir legacy ürünün yeniden doğuşu",
    paragraphs: [
      "Devraldığım şey, yılların yorgunluğunu taşıyan ASP.NET MVC tabanlı bir HRM ürünüydü. Yaptığım şey ise onu onarmak değil, yeniden var etmek oldu: ASP.NET Core üzerinde Clean Architecture ve feature-based CQRS ile sıfırdan bir çekirdek tasarladım. Minimal API uçları, EF Core ile modellenmiş ilişkisel bir veritabanı ve domain'i dış dünyadan koruyan katman sınırları — bu mimarinin her kararı, her satırı benim imzamı taşıyor.",
      "Multi-tenant bir SaaS'ta en pahalı hata, bir müşterinin verisinin diğerine sızmasıdır. Tenant bazlı veri izolasyonunu sistemin en alt katmanına gömdüm; üstüne JWT ve RBAC ile rol tabanlı bir yetki ağı, parolaların BCrypt ile hash'lendiği sağlam bir kimlik akışı ve Redis destekli önbellekleme kurdum. Middleware zinciri ve yapılandırılmış loglama sayesinde sistemin her nefesi izlenebilir durumda.",
      "Ağır işleri kullanıcının sırtından almak için RabbitMQ ve WolverineFx ile asenkron mesajlaşma altyapısını inşa ettim. Envanter Yönetimi, Zimmet, Bordro, Çalışan İletişim Platformu, İK Chatbot ve Anket — altı modülü React + TypeScript ile yazdığım role/permission bazlı, mobil uyumlu dashboard'un arkasında canlıya aldım. Ürün bugün iki kurumsal şirkette production'da koşuyor.",
    ],
    tech: [
      "ASP.NET Core",
      "Clean Architecture",
      "CQRS",
      "Minimal API",
      "EF Core",
      "RabbitMQ",
      "WolverineFx",
      "Redis",
      "JWT / RBAC",
      "BCrypt",
      "React + TypeScript",
    ],
  },
  {
    id: "mecode-intern",
    index: "02",
    period: "05.2025 — 08.2025",
    company: "Mecode Bilişim",
    role: "Intern",
    headline: "Kurumsal web varlığını uçtan uca yeniden kurmak",
    paragraphs: [
      "Staj dönemimde şirketin dijital yüzü olan mecodebilisim.com'u C# ile, ASP.NET Core MVC ve Web API üzerinde geliştirip güncelledim. Site bir tanıtım sayfası olmaktan çıkıp, içerik, sayfa ve medya yönetiminin CRUD ekranlarıyla tek panelden yönetildiği, dashboard'lu dinamik bir platforma dönüştü.",
      "Asıl farkı SEO katmanında yarattım: meta title ve description'ların, slug'ların ve sayfa ayarlarının panelden yönetildiği bir altyapı kurdum. Böylece pazarlama tarafı, geliştiriciye ihtiyaç duymadan arama görünürlüğünü kendi elleriyle yönetebilir hâle geldi. Bu proje, 'stajyer işi' tanımını benim sözlüğümden sildi.",
    ],
    tech: ["ASP.NET Core MVC", "Web API", "C#", "SEO Altyapısı", "Admin Panel"],
  },
  {
    id: "bimser",
    index: "03",
    period: "01.2025 — 05.2025",
    company: "Bimser Türkiye",
    role: "Long Term Intern",
    headline: "Kurumsal disiplinin dövüldüğü yer",
    paragraphs: [
      "Bimser'de kurumsal ölçekte yazılımın nasıl nefes aldığını öğrendim: API tasarımının bir toplantı çıktısı değil, analizle başlayıp testle mühürlenen bir süreç olduğunu; modüler kod yapısının bir tercih değil, hayatta kalma stratejisi olduğunu. Analiz, geliştirme ve test akışlarının içinde aktif olarak yer aldım.",
      "Bugün kendi mimarilerimde uyguladığım code-review refleksi, isimlendirme titizliği ve 'önce sınır, sonra kod' yaklaşımının temeli bu dönemde atıldı. Kurumsal standartlar benim için bir kural kitabı değil, kas hafızası hâline geldi.",
    ],
    tech: ["C#", ".NET", "REST API", "Analiz & Test", "Enterprise Standards"],
  },
  {
    id: "freelance",
    index: "04",
    period: "FREELANCE DÖNEMİ",
    company: "Bağımsız",
    role: "Freelancer",
    headline: "Gerçek müşteriler, gerçek trafik, tek sorumlu: ben",
    paragraphs: [
      "Freelance dönemim, teoriyi faturaya dönüştürdüğüm dönemdi. The Best Coffee Lounge için Next.js ile masada QR ile açılan, kategori bazlı ve panelden güncellenebilen mobil öncelikli bir dijital menü; Proset Elevator için sayfa yapısı ve performansı arama motorlarına göre eğilmiş SEO odaklı bir kurumsal site; Baran Boya için ise PHP/Laravel üzerinde MySQL destekli, rol bazlı yetkilendirme ve 2FA ile korunan içerik yönetimli bir kurumsal uygulama teslim ettim.",
      "Bu projelerin hiçbirinde arkamda bir ekip yoktu. Tasarım kararından veritabanı şemasına, deploy'dan güvenlik önlemine kadar her şeyin tek sahibi bendim — ve üçü de bugün hâlâ canlıda.",
    ],
    tech: ["Next.js", "TypeScript", "Laravel", "PHP", "MySQL", "RBAC + 2FA", "SEO"],
  },
  {
    id: "foundation",
    index: "05",
    period: "05.2025",
    company: "Sakarya Uygulamalı Bilimler Üniversitesi",
    role: "Ön Lisans — Bilgisayar Programcılığı",
    headline: "Temel: akademi + sertifika + dil",
    paragraphs: [
      "Mühendislik sezgimin temelini Sakarya Uygulamalı Bilimler Üniversitesi'nde attım: algoritmik düşünce, veri yapıları ve programlamanın el kirleten pratiği. Akademik müfredatın üstüne BTK Akademi'den Siber Güvenliğe Giriş ve İleri Seviye Python sertifikalarını ekledim — çünkü güvenliği sonradan öğrenen değil, baştan hesaba katan biri olmak istiyorum.",
      "B2 seviyesinde İngilizce ile dokümantasyonu kaynağından okuyor, global ekosistemi gecikmesiz takip ediyorum.",
    ],
    tech: ["Algoritma", "Veri Yapıları", "Python", "Siber Güvenlik", "İngilizce B2"],
  },
];
