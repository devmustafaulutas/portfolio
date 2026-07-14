// ============================================================
// Açılış sekansı + hero içeriği.
// Tüm iddialar CV'den gelir; hiçbir metrik uydurulmamıştır.
// ============================================================

export const bootContent = {
  logLines: [
    "BAĞLANTI KURULUYOR: mustafaulutas.com",
    "ÇEKİRDEK YÜKLENİYOR: CLEAN ARCHITECTURE / CQRS",
    "KİMLİK DOĞRULANIYOR: JWT · RBAC",
    "TENANT İZOLASYONU: AKTİF",
    "SİSTEM GÜNLÜĞÜ AÇILIYOR",
  ],
  cornerTopLeft: "SİSTEM GÜNLÜĞÜ",
  cornerTopRight: "KOCAELİ, TR",
  cornerBottomRight: "YÜKLENİYOR",
  name: "MUSTAFA ULUTAŞ",
  skipHint: "GEÇMEK İÇİN TIKLA",
} as const;

export const heroContent = {
  kicker: "SİSTEM GÜNLÜĞÜ / GİRİŞ KAYDI",
  firstName: "MUSTAFA",
  lastName: "ULUTAŞ",
  role: "FULL-STACK SOFTWARE DEVELOPER",
  statement:
    "Backend ağırlıklı bir .NET geliştiricisiyim. Backend'de disiplin, frontend'de zanaat.",
  meta: [
    { label: "KONUM", value: "KOCAELİ, TÜRKİYE" },
    { label: "ODAK", value: "BACKEND" },
    { label: "DURUM", value: "SOFTWARE DEVELOPER" },
  ],
  scrollCue: "KAYDIR VE SİSTEME GİR",
  status: "SİSTEM CANLI",
} as const;
