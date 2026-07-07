// ============================================================
// Manifesto Content — hero reveal lines + the long-form
// "Hakkımda" copy. Pure data; the sections own the choreography.
// ============================================================

export const heroContent = {
  name: "MUSTAFA ULUTAŞ",
  role: "Backend Architect & Full-Stack Developer",
  meta: ["KOCAELİ — 40.68°N 30.05°E", "REV 2026.07", "SİYAH ÜZERİNE BEYAZ"],
  strip: ".NET · CLEAN ARCHITECTURE · CQRS — REACT + TYPESCRIPT",
  status: "SİSTEM DURUMU — CANLI · 02 KURUMSAL MÜŞTERİ",
  scrollCue: "KEŞFET — BÖLÜM 01",
} as const;

/**
 * Revealed inside the pinned hero while the name disintegrates.
 * Short, declarative lines — each one lands alone on the black.
 */
export const heroManifesto = {
  kicker: "YAZILIM MİMARLIĞI MANİFESTOSU",
  lines: [
    "Kod yazmıyorum.",
    "Yük altında ayakta kalan sistemler kuruyorum.",
    "Siyah ve beyaz gibi: ya çalışır, ya çalışmaz.",
  ],
} as const;

export type ManifestoParagraph = {
  id: string;
  text: string;
};

export const manifestoSection = {
  label: "01 — MANİFESTO",
  title: "Sistemin kalbi, görünmeyen yerinde atar",
  paragraphs: [
    {
      id: "core",
      text: "Bir yazılımın gerçek karakteri, arayüzünde değil; isteklerin karşılandığı, verinin sınırlarının çizildiği o görünmez katmanda ortaya çıkar. Ben o katmanda yaşıyorum. C# ve .NET ekosisteminde, Clean Architecture'ın katı sınırları ve CQRS'in net sorumluluk ayrımı üzerine sistemler kuruyorum. Domain'in ne olduğunu bilmeyen bir controller, bana göre daha yazılmadan çökmüş demektir.",
    },
    {
      id: "envanty",
      text: "En büyük kanıtım Envanty: Legacy ASP.NET MVC ile yazılmış bir HRM ürününü devraldım ve onu satır satır, kendi ellerimle modern bir multi-tenant SaaS platformuna dönüştürdüm. Bu mimari benim şahsi eserim — feature-based CQRS, Minimal API ve EF Core üzerine kurulu backend; tenant bazlı veri izolasyonu; JWT ve RBAC ile örülmüş, parolaların BCrypt ile hash'lendiği güvenli kimlik akışları; Redis ile hızlandırılmış okuma yolları. Sistem bugün iki kurumsal şirkette canlı çalışıyor ve her sabah benim kurduğum temellerin üzerinde uyanıyor.",
    },
    {
      id: "async",
      text: "Senkron düşünen sistemler, trafiğin altında ilk ezilenlerdir. Bu yüzden Envanty'nin omurgasına RabbitMQ ve WolverineFx ile asenkron bir sinir sistemi döşedim: bordro hesapları, bildirimler ve entegrasyonlar kuyruklarda akar; kullanıcı hiçbir zaman altyapının terlediğini hissetmez. Mesajlaşma altyapısı benim için bir 'ek özellik' değil, mimarinin ta kendisidir.",
    },
    {
      id: "surface",
      text: "Backend'de kurduğum disiplini yüzeye de taşıyorum. React ve TypeScript ile role/permission bazlı dashboard'lar, Next.js ile arama motorlarının sevdiği kurumsal siteler geliştiriyorum. Benim için frontend, backend'in vitrini değil; aynı mühendislik standardının devamıdır. Bir sistemin her katmanına aynı soruyu sorarım: bu, iki yıl sonra da savunulabilir mi?",
    },
  ] satisfies ManifestoParagraph[],
} as const;
