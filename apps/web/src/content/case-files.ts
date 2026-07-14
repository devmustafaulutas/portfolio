// ============================================================
// Vaka dosyaları · en güçlü işlerin dosya formatında sunumu.
// Her dosya: problem → mimari → uygulama → kararlar → sonuç.
// "proves" satırı, dosyanın mühendis hakkında ne söylediğidir.
// ============================================================

export type CaseSegment = {
  label: string;
  text: string;
};

export type CaseFile = {
  id: string;
  fileNo: string;
  classification: string;
  title: string;
  subtitle: string;
  segments: CaseSegment[];
  stack: string[];
  proves: string;
  hasDiagram?: boolean;
};

export const caseFilesSection = {
  label: "03 / VAKA DOSYALARI",
  title: "Kanıt, kartvizitten güçlüdür.",
  lede: "Proje kartı değil, mühendislik dosyası. Açın: problem, mimari, kararlar ve sonuç. Hepsi kayıt altında.",
} as const;

export const caseFiles: CaseFile[] = [
  {
    id: "dosya-01",
    fileNo: "DOSYA 01",
    classification: "PRODUCTION · CANLI",
    title: "Legacy'den SaaS'a",
    subtitle: "Kurumsal HRM ürününün multi-tenant yeniden doğuşu · Mecode Bilişim",
    segments: [
      {
        label: "PROBLEM",
        text: "Şirketin elinde aceleye getirilen ASP.NET MVC ile yazılmış bir HRM ürünü vardı. Ürünün sürdürülebilirliği pek mümkün değildi ve ürünü birden fazla kurumsal müşteriye, birbirinden tamamen izole veriyle hizmet vermesi gerekiyordu. Mevcut mimari bunun için tasarlanmamıştı.",
      },
      {
        label: "MİMARİ",
        text: "Onarmak yerine yeniden kurdum. ASP.NET Core üzerinde, Clean Architecture ve feature-based CQRS ile sıfırdan bir çekirdek tasarladım: Minimal API uçları, EF Core ile modellenen ilişkisel veritabanı ve domain'i dış dünyadan koruyan katı katman sınırları.",
      },
      {
        label: "UYGULAMA",
        text: "Tenant bazlı veri izolasyonu sistemin en alt katmanına gömüldü. Kimlik akışları JWT ve RBAC ile örüldü; middleware, merkezi logging ve Redis caching ile desteklendi. React + TypeScript tarafında ise role/permission bazlı, mobil uyumlu bir dashboard ve admin panel geliştirdim.",
      },
      {
        label: "KARARLAR",
        text: "Multi-tenant bir sistemde en pahalı hata veri sızıntısıdır; izolasyon bu yüzden arayüzde değil, veri katmanında yaşıyor. Ağır işler kullanıcıyı bekletmesin diye RabbitMQ ve WolverineFx ile asenkron mesajlaşma altyapısı kurdum. Senkron düşünen sistemler, yük altında ilk ezilenlerdir.",
      },
      {
        label: "SONUÇ",
        text: "Envanter Yönetimi, Zimmet, Bordro, Çalışan İletişim Platformu, İK Chatbot, Anket ve Operasyonel Mükemmellik. Ürün bugün iki kurumsal şirkette production ortamında çalışıyor.",
      },
    ],
    stack: [
      "ASP.NET Core",
      "Clean Architecture",
      "Feature-Based CQRS",
      "Minimal API",
      "EF Core",
      "JWT / RBAC",
      "Redis",
      "RabbitMQ",
      "WolverineFx",
      "React",
      "TypeScript",
    ],
    proves:
      "Bu dosya, legacy bir sistemi production'ı durdurmadan modern bir mimariye taşıyabildiğimi ve güvenliği sonradan değil, ilk günden tasarladığımı gösteriyor.",
    hasDiagram: true,
  },
  {
    id: "dosya-02",
    fileNo: "DOSYA 02",
    classification: "PRODUCTION · CANLI",
    title: "Panelden yönetilen kurumsal yüz",
    subtitle: "mecodebilisim.com · içerik altyapısı ve SEO katmanı",
    segments: [
      {
        label: "PROBLEM",
        text: "Şirketin kurumsal web sitesi, her içerik değişikliği için geliştiriciye bağımlıydı. İçerik, sayfa, medya ve SEO ayarlarının kod dokunuşu olmadan yönetilebilmesi gerekiyordu.",
      },
      {
        label: "MİMARİ",
        text: "C# ile ASP.NET Core MVC ve ASP.NET Web API üzerine kurulu dinamik bir yapı. Site içeriği veritabanından besleniyor; yönetim tarafı dashboard'lu bir admin panelde toplanıyor.",
      },
      {
        label: "UYGULAMA",
        text: "İçerik, sayfa ve medya yönetimi için CRUD ekranları geliştirdim. Meta title, description, slug ve sayfa ayarlarının tamamı panelden yönetiliyor; SEO artık kod değil, içerik işi.",
      },
      {
        label: "SONUÇ",
        text: "mecodebilisim.com yayında. İçerik ve SEO yönetimi geliştirici döngüsünden çıkıp ürünün kendi paneline taşındı.",
      },
    ],
    stack: ["C#", "ASP.NET Core MVC", "ASP.NET Web API", "SEO Yönetimi", "Admin Panel"],
    proves:
      "Bu dosya, yalnızca kod değil ürün düşündüğümü gösteriyor: içeriği geliştirici değil, içeriğin sahibi yönetmeli.",
  },
  {
    id: "dosya-03",
    fileNo: "DOSYA 03",
    classification: "TESLİM EDİLDİ · SERBEST",
    title: "Güvenlik önce",
    subtitle: "baranboya.com · içerik yönetimli kurumsal uygulama",
    segments: [
      {
        label: "PROBLEM",
        text: "Kurumsal bir müşteri için yalnızca vitrin değil; içeriğin yönetilebildiği, yetkilerin ayrıştığı ve yönetim erişiminin korunduğu dinamik bir web uygulaması gerekiyordu.",
      },
      {
        label: "MİMARİ",
        text: "PHP/Laravel üzerinde içerik yönetimli dinamik bir kurumsal uygulama. Veri modeli MySQL ile kuruldu, yetkilendirme rol bazlı tasarlandı.",
      },
      {
        label: "UYGULAMA",
        text: "Admin paneline iki faktörlü doğrulama (2FA) dahil temel güvenlik önlemlerini uyguladım. Roller yetki sınırlarını arayüzden değil, sunucu tarafından zorluyor.",
      },
      {
        label: "SONUÇ",
        text: "baranboya.com canlıda. Müşteri içeriğini kendi yönetiyor, yönetim erişimi 2FA ile korunuyor.",
      },
    ],
    stack: ["PHP", "Laravel", "MySQL", "RBAC", "2FA"],
    proves:
      "Bu dosya, stack'ten bağımsız düşündüğümü gösteriyor: güvenlik ve yetki modeli, hangi framework olursa olsun aynı ciddiyetle kurulur.",
  },
];
