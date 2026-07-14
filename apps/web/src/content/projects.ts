// ============================================================
// Proje endeksi · teslim edilmiş işlerin listesi. Kaynak: CV.
// "sketch" alanı, hover önizlemesinde çizilen soyut monokrom
// kompozisyonun tipini seçer (ekran görüntüsü yerine konsept).
// ============================================================

export type ProjectSketch = "grid" | "browser" | "qr" | "shaft" | "document";

export type ProjectEntry = {
  id: string;
  index: string;
  name: string;
  description: string;
  stack: string[];
  role: string;
  interesting: string;
  href?: string;
  note?: string;
  sketch: ProjectSketch;
};

export const projectsSection = {
  label: "05 / PROJE ENDEKSİ",
  title: "Teslim edilmiş işler",
  lede: "Konsept değil, canlıya alınmış işler. Üzerine gelince dosya önizlemesi açılır.",
} as const;

export const projects: ProjectEntry[] = [
  {
    id: "hrm-saas",
    index: "01",
    name: "HRM SAAS PLATFORMU",
    description:
      "Legacy ASP.NET MVC ürününden dönüştürülmüş multi-tenant kurumsal HRM. Altı modül canlıda, iki kurumsal şirkette production'da.",
    stack: ["ASP.NET Core", "CQRS", "EF Core", "RabbitMQ", "Redis", "React + TS"],
    role: "FULL-STACK SOFTWARE DEVELOPER",
    interesting:
      "Tenant izolasyonu veri katmanında; ağır işler RabbitMQ + WolverineFx ile asenkron.",
    note: "KURUM İÇİ ÜRÜN · DOSYA 01",
    sketch: "grid",
  },
  {
    id: "mecode-web",
    index: "02",
    name: "MECODEBILISIM.COM",
    description:
      "Şirketin kurumsal yüzü: içerik, sayfa ve medya yönetimi CRUD ekranlı admin panelde; SEO ayarları panelden yönetiliyor.",
    stack: ["C#", "ASP.NET Core MVC", "Web API"],
    role: "GELİŞTİRİCİ · STAJ DÖNEMİ",
    interesting: "Meta, slug ve sayfa ayarları geliştirici döngüsünden çıkarıldı.",
    href: "https://mecodebilisim.com",
    sketch: "browser",
  },
  {
    id: "coffee-lounge",
    index: "03",
    name: "THEBESTOFCOFFEELOUNGE.COM",
    description:
      "Kafeye özel, mobil öncelikli dijital menü. Kategori bazlı yapı, panelden güncellenen içerik; masada QR ile açılıyor.",
    stack: ["Next.js", "React", "TypeScript"],
    role: "FREELANCER",
    interesting: "Menü içeriği dinamik; kafe menüyü kod dokunuşu olmadan güncelliyor.",
    href: "https://thebestofcoffeelounge.com",
    sketch: "qr",
  },
  {
    id: "proset",
    index: "04",
    name: "PROSETELEVATOR.COM",
    description:
      "SEO odaklı kurumsal tanıtım sitesi. Sayfa yapısı ve performans, arama motoru görünürlüğü için optimize edildi.",
    stack: ["Next.js", "SEO", "Performans"],
    role: "FREELANCER",
    interesting: "Tasarım kadar Lighthouse skoru da teslimatın parçasıydı.",
    href: "https://prosetelevator.com",
    sketch: "shaft",
  },
  {
    id: "baranboya",
    index: "05",
    name: "BARANBOYA.COM",
    description:
      "İçerik yönetimli dinamik kurumsal uygulama. Rol bazlı yetkilendirme ve 2FA dahil güvenlik önlemleriyle teslim edildi.",
    stack: ["PHP", "Laravel", "MySQL"],
    role: "FREELANCER",
    interesting: "Yetki sınırlarını arayüz değil, sunucu tarafı zorluyor.",
    href: "https://baranboya.com",
    sketch: "document",
  },
];
