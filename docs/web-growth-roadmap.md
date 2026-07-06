# Web Growth Roadmap (Blog + Portfolio)

Bu dokuman, blog + portfolio urununun SEO, performans, UI/UX ve conversion tarafini senior-level bir operasyon modeline tasimak icin hazirlandi.

## 1) KPI ve Baseline (P0)

- North Star: nitelikli inbound talep (contact intent) + non-brand organik trafik.
- Core KPI:
  - Organik oturum (non-brand)
  - Contact CTA click-through rate
  - Contact submit conversion rate
  - Indexed URL coverage
  - Core Web Vitals (LCP, INP, CLS)
- Hedef SLO:
  - LCP < 2.5s (p75 mobile)
  - INP < 200ms (p75)
  - CLS < 0.1 (p75)
  - TTFB < 800ms (p75)

## 2) Audit Ozeti (Mevcut Durum)

### Guclu Taraflar

- Teknik SEO temeli mevcut: `robots`, `sitemap`, `rss`, canonical kullanimi.
- Yapilandirilmis veri kullanimi var: `Person`, `WebSite`, `BlogPosting`, `Breadcrumb`.
- Icerik modeli ayrik: `posts`, `projects`, `snippets`.
- Proje sayfalarinda case-study anlatim yapisi var (problem, cozum, outcomes).

### Kritik Bosluklar

- Tutarsiz metadata kaliplari (sayfalar arasi OG/Twitter ayrismasi).
- App Router altinda gecersiz nested layout kalintilari (render + metadata riski).
- Snippet detay sayfalarinda schema coverage dusuk (source-code semantic eksigi).
- Olcum katmani yok (GA4/event taxonomy/funnel gozlemi tanimsiz).
- Performans butcesi ve CI gate yok (regresyon riski yuksek).

## 3) Onceliklendirilmis Backlog

### P0 (1-2 hafta)

- `metadata` standardizasyonu:
  - tum landing/list/detail sayfalarinda canonical + OG image + Twitter parity
  - article sayfalarinda `publishedTime`, `modifiedTime`, `tags`
- App Router layout hijyeni:
  - alt route'larda yanlis `<html>/<body>` layoutlarini temizleme
- Schema coverage:
  - snippet sayfalarina `SoftwareSourceCode` ekleme
- Olcum plani:
  - event taxonomy (`view_project`, `click_contact_cta`, `submit_contact`)
  - dashboard sutunlari ve funnel tanimi

### P1 (2-6 hafta)

- Core Web Vitals iyilestirme:
  - hero ve motion etkilerinde JS maliyet analizi
  - font/image optimizasyonu ve preload stratejisi
- Icerik motoru:
  - topic-cluster plani (pillar + 3-5 cluster)
  - internal linking kurali (her yeni icerik min 3 cift yonlu bag)
- Conversion:
  - case-study CTA standardi
  - contact sayfasinda friction azaltma + guven sinyalleri

### P2 (6+ hafta)

- Programatik SEO destekleri:
  - metadata quality lint/check
  - broken links + orphan pages denetimi
- A/B test altyapisi:
  - CTA wording ve placement testleri
- Icerik refresh otomasyonu:
  - stale content alarmi (90/180 gun)

## 4) Sprint-1 Teknik Is Plani

### Epic A - SEO Foundation Hardening

- [x] Metadata helper olustur ve sayfalara uygula.
- [x] Nested layout kalintilarini temizle.
- [x] Snippet sayfalarina `SoftwareSourceCode` schema ekle.
- [ ] Search Console + sitemap index health kontrolu.
- [ ] Rich Results smoke testi.

Acceptance Criteria:
- Tum ana sayfalarda canonical + OG + Twitter alanlari tutarli.
- App Router tree'de root disinda `<html>/<body>` kalmamali.
- Snippet detay URL'lerinde source-code semantik schema gorunmeli.

### Epic B - Analytics ve Funnel Baseline

- [x] Analytics araci secimi (GA4 + opsiyonel privacy-friendly secondary).
- [x] Event isimlendirme standardi dokumani.
- [x] Contact funnel olcumu ve haftalik rapor paneli (spec + checklist).

Acceptance Criteria:
- En az 4 cekirdek event production'da kayit aliyor.
- Landing -> Project/Blog -> Contact yolculugu olculebiliyor.

Implementation Notes:
- GA4 bridge eklendi (`NEXT_PUBLIC_GA_MEASUREMENT_ID` ile aktif olur).
- Otomatik event'ler:
  - `view_project` (proje detay sayfasi acilisi)
  - `click_contact_cta` (header/footer/about/home contact CTA'lari)
  - `submit_contact` (contact sayfasi kanal kartlari)
  - `click_project_cta` (proje detay dis link butonlari)
- Data attribute tabanli takip: `data-analytics-event`, `data-analytics-label`, `data-analytics-location`.
- Dokumanlar:
  - `docs/ga4-playbook.md`
  - `docs/contact-funnel-dashboard.md`
  - `docs/weekly-growth-checklist.md`

## 5) Operasyon Modeli (Surekli)

- Haftalik:
  - CWV regresyon kontrolu
  - index coverage / crawl issue kontrolu
- Aylik:
  - top pages refresh
  - orphan content ve broken link taramasi
- Release gate:
  - lint + typecheck + build + smoke SEO checks

## 6) Riskler ve Notlar

- Motion agirligi (GSAP + scroll efektleri), mobil INP/LCP tarafinda risk olusturabilir.
- Icerik metinlerinde Turkce karakter ve ASCII transliterasyonu karisik; brand ve okunabilirlik icin standart belirlenmeli.
- Performans ve SEO kalitesi, olcum katmani kurulmadan sadece subjektif izlenimle yonetilemez.
