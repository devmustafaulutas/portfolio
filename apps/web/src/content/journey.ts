// ============================================================
// Kariyer yolculuğu · kronolojik bölümler. Kaynak: CV.
// "peak: true" olan bölüm yolculuğun zirvesidir ve görsel
// olarak ters çevrilmiş (kağıt-beyaz) panelde sunulur.
// ============================================================

export type JourneyChapter = {
  id: string;
  index: string;
  period: string;
  place: string;
  role: string;
  title: string;
  narrative: string;
  bullets: string[];
  tags: string[];
  peak?: boolean;
};

export const journeySection = {
  label: "02 / YOLCULUK",
  title: "GELİŞİM",
  lede: "Kronolojik bir liste değil. Her bölüm bir öncekinin üzerine kuruldu; sona doğru ölçek büyüyor.",
  hint: "KAYDIRMAYA DEVAM ET, ZAMAN İLERLESİN",
} as const;

export const journeyChapters: JourneyChapter[] = [
  {
    id: "koken",
    index: "00",
    period: "2025",
    place: "SAKARYA UYGULAMALI BİLİMLER ÜNİVERSİTESİ",
    role: "BİLGİSAYAR PROGRAMCILIĞI",
    title: "Köken",
    narrative:
      "Temel meraktan atıldı. Bilgisayar Programcılığı okurken bir yandan BTK Akademi'de İleri Seviye Python ve Siber Güvenliğe Giriş programlarını bitirdim. Kod yazmayı öğrenirken, yazılan kodun nasıl kırıldığını da merak ediyordum.",
    bullets: [
      "Ön Lisans: Bilgisayar Programcılığı (05.2025)",
      "BTK Akademi: İleri Seviye Python",
      "BTK Akademi: Siber Güvenliğe Giriş",
    ],
    tags: ["PYTHON", "SİBER GÜVENLİK TEMELLERİ", "ALGORİTMA"],
  },
  {
    id: "bimser",
    index: "01",
    period: "01.2025 → 05.2025",
    place: "BİMSER TÜRKİYE",
    role: "LONG TERM INTERN",
    title: "Disiplin",
    narrative:
      "Kurumsal yazılımın gerçek ritmini burada gördüm. API tasarımından analize, geliştirmeden test akışlarına kadar sürecin tamamına katıldım. Yazılımın tek kişilik bir hüner değil, standartlarla işleyen bir ekip işi olduğunu bu dönemde öğrendim.",
    bullets: [
      "Kurumsal geliştirme süreçlerinde API tasarımı, analiz ve test akışları",
      "Modüler kod yapısı ve kurumsal geliştirme standartları",
    ],
    tags: ["API TASARIMI", "ANALİZ", "TEST AKIŞLARI", "KURUMSAL STANDARTLAR"],
  },
  {
    id: "saha",
    index: "02",
    period: "2025",
    place: "SERBEST ÇALIŞMALAR",
    role: "FREELANCER",
    title: "Saha",
    narrative:
      "Kapsamı müşteriyle birlikte çizip tek başıma teslim ettiğim üç canlı iş. Laravel ile içerik yönetimli kurumsal bir uygulama, Next.js ile SEO odaklı bir tanıtım sitesi ve masada QR ile açılan bir dijital menü. Üç farklı problem, üç farklı stack, üç teslim.",
    bullets: [
      "baranboya.com: PHP/Laravel, MySQL, rol bazlı yetkilendirme ve 2FA",
      "prosetelevator.com: Next.js, SEO ve performans odaklı kurumsal site",
      "thebestcoffeelounge.com: Next.js, panelden yönetilen QR dijital menü",
    ],
    tags: ["LARAVEL", "NEXT.JS", "MYSQL", "2FA", "SEO"],
  },
  {
    id: "mecode-staj",
    index: "03",
    period: "05.2025 → 08.2025",
    place: "MECODE BİLİŞİM",
    role: "INTERN",
    title: "İçeriden",
    narrative:
      "Şirketin kendi web sitesi bana emanetti. mecodebilisim.com'u C# ile ASP.NET Core MVC ve Web API üzerinde geliştirip güncelledim. İçerik, sayfa ve medya yönetimi için CRUD ekranlı bir admin panel; meta ve slug ayarlarının panelden yönetildiği bir SEO katmanı kurdum.",
    bullets: [
      "mecodebilisim.com: ASP.NET Core MVC + ASP.NET Web API",
      "İçerik, sayfa ve medya yönetimi için CRUD ekranlı admin panel",
      "Panelden yönetilen meta, slug ve sayfa ayarlarıyla SEO yönetimi",
    ],
    tags: ["C#", "ASP.NET CORE MVC", "WEB API", "ADMIN PANEL", "SEO"],
  },
  {
    id: "mecode-engineer",
    index: "04",
    period: "08.2025 → GÜNÜMÜZ",
    place: "MECODE BİLİŞİM",
    role: "FULL-STACK SOFTWARE DEVELOPER",
    title: "Mimari",
    narrative:
      "Yolculuğun zirvesi. Legacy ASP.NET MVC tabanlı HRM ürününü, ASP.NET Core ve React + TypeScript ile multi-tenant SaaS mimarisine taşıdım. Yeni çekirdek Clean Architecture ve feature-based CQRS üzerine kuruldu; Minimal API uçları ve EF Core ile modellenen ilişkisel veritabanı da dahil, tamamı sıfırdan tasarlandı. Ürün bugün iki kurumsal şirkette canlı çalışıyor.",
    bullets: [
      "Legacy HRM ürünü, ASP.NET Core + React/TypeScript ile multi-tenant SaaS'a taşındı",
      "Clean Architecture, feature-based CQRS, Minimal API ve EF Core ile yeni çekirdek",
      "Tenant bazlı veri izolasyonu, JWT/RBAC, middleware, logging ve Redis caching",
      "RabbitMQ + WolverineFx ile asenkron mesajlaşma altyapısı",
      "Canlıdaki modüller: Envanter, Zimmet, Bordro, Çalışan İletişim Platformu, İK Chatbot, Anket",
      "React + TypeScript ile role/permission bazlı, mobil uyumlu dashboard",
    ],
    tags: ["ASP.NET CORE", "CQRS", "MULTI-TENANT", "RABBITMQ", "REDIS", "REACT + TS"],
    peak: true,
  },
];
