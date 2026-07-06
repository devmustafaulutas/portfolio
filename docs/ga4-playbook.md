# GA4 Playbook (Custom Dimensions + Funnel)

Bu dokuman, mevcut event entegrasyonunu GA4 tarafinda raporlanabilir hale getirmek icin gerekli setup adimlarini toplar.

## 1) Prerequisite

- Env:
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
- Mevcut event'ler:
  - `view_project`
  - `click_contact_cta`
  - `submit_contact`
  - `click_project_cta`

## 2) Custom Dimensions (Event-scoped)

GA4 > Admin > Custom definitions > Create custom dimensions:

1. **Event Label**
   - Dimension name: `event_label`
   - Scope: `Event`
   - Event parameter: `label`

2. **Event Location**
   - Dimension name: `event_location`
   - Scope: `Event`
   - Event parameter: `location`

3. **Event Href**
   - Dimension name: `event_href`
   - Scope: `Event`
   - Event parameter: `href`

4. **Project Slug**
   - Dimension name: `project_slug`
   - Scope: `Event`
   - Event parameter: `project_slug`

5. **Project Name**
   - Dimension name: `project_name`
   - Scope: `Event`
   - Event parameter: `project_name`

6. **Project Category**
   - Dimension name: `project_category`
   - Scope: `Event`
   - Event parameter: `project_category`

Not:
- Yeni custom dimension'lar geriye donuk veri doldurmaz.
- Setup sonrasi 24 saat veri gecikmesi normaldir.

## 3) Conversions (Key Events)

GA4 > Admin > Key events:

- `submit_contact` -> **ON** (primary conversion)
- `click_contact_cta` -> **ON** (micro conversion)

Opsiyonel:
- `click_project_cta` mikro conversion olarak acilabilir.

## 4) Event Dictionary

### `view_project`
- Ne zaman: proje detay sayfasi acildiginda
- Params:
  - `project_slug`
  - `project_name`
  - `project_category`

### `click_contact_cta`
- Ne zaman: contact niyeti tasiyan CTA tiklarinda
- Params:
  - `label`
  - `location`
  - `href`

### `submit_contact`
- Ne zaman: contact sayfasindaki kanal karti tiklandiginda
- Params:
  - `label`
  - `location`
  - `href`

### `click_project_cta`
- Ne zaman: proje dis link butonlari tiklandiginda
- Params:
  - `label`
  - `location`
  - `href`

## 5) Validation Checklist

- Realtime raporda event gorunuyor mu?
- DebugView'da parametreler (`label`, `location`, `project_slug`) geliyor mu?
- `submit_contact` key event olarak sayiliyor mu?
- `event_location` dimension'inda `site_header`, `site_footer`, `contact_page` dagilimi gorunuyor mu?
