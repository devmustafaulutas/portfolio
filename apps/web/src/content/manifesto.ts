// ============================================================
// Mühendislik manifestosu · "Hakkımda" yerine duruş metni.
// ============================================================

export const manifestoContent = {
  label: "01 ",
  title: "Sistem, görünmeyen yerinde ayakta durur.",
  pullQuote: ["ÖNCE SINIRLAR.", "SONRA SÖZLEŞMELER.", "EN SONDA KOD."],
  paragraphs: [
    {
      id: "dusunce",
      text: "Bir yazılımı güzel gösteren şey arayüzü olabilir; ama onu yıllarca ayakta tutan şey mimarisidir. Ben de işe hep aynı sırayla bakarım: önce sınırlar, sonra sözleşmeler, en sonda kod. C# ve .NET tarafında, Clean Architecture'ın katı katman sınırları ve CQRS'in net sorumluluk ayrımı üzerine sistemler kuruyorum. Domain'ini tanımayan kod, bana göre daha ilk günden borçlanmıştır.",
    },
    {
      id: "mimari",
      text: "Multi-tenant bir SaaS'ta en pahalı hata veri sızıntısıdır. Bu yüzden tenant izolasyonunu arayüze değil, sistemin en alt katmanına gömerim. Kimliği JWT doğrular, yetkiyi RBAC çizer, okuma yollarını Redis hızlandırır. Ağır işler ise RabbitMQ ve WolverineFx üzerinden asenkron kuyruklara devredilir. Güvenlik de performans da sonradan eklenecek özellikler değil, ilk gün verilecek mimari kararlardır.",
    },
    {
      id: "zanaat",
      text: "Backend disiplinini frontend zanaatıyla birleştirmeyi seviyorum. React ve TypeScript ile kurduğum arayüzler, arkadaki sistemin gücünü kullanıcıya taşımak için var: rol bazlı dashboard'lar, panelden yönetilen içerik, SEO'su baştan düşünülmüş sayfalar. Kullanıcı mimariyi hiç görmez; ama her tıklamada onu hisseder.",
    },
    {
      id: "problem",
      text: "En sevdiğim problem tipi de belli: yılların yükünü taşıyan, kimsenin dokunmak istemediği legacy bir sistemi alıp ona production'da yaşayan modern bir gelecek kurmak. Bakımı kolay, ölçeklenmeye hazır ve gerçekten teslim edilmiş yazılım. Benim için \"bitti\"nin tanımı bu.",
    },
  ],
  proof: [
    { value: "06", label: "MODÜL CANLIDA" },
    { value: "02", label: "KURUMSAL ŞİRKETTE PRODUCTION" },
    { value: "03", label: "SERBEST PROJE TESLİM EDİLDİ" },
  ],
} as const;
