# Contact Funnel Dashboard Spec

Bu dashboard, landing -> etkileşim -> iletisim niyeti akisini tek ekranda takip etmek icin tasarlandi.

## 1) Dashboard Blocks

### A. Executive KPIs

- Sessions (last 7 / 28 days)
- `click_contact_cta` count
- `submit_contact` count
- Contact intent conversion rate:
  - `submit_contact / sessions`
- CTA-to-submit rate:
  - `submit_contact / click_contact_cta`

### B. Funnel

Adimlar:
1. Session start
2. `click_contact_cta`
3. `submit_contact`

Gosterimler:
- step volume
- step-to-step dropoff
- overall completion rate

### C. Source Quality

Breakdown:
- source / medium
- landing page
- device category

Metrikler:
- sessions
- contact cta clicks
- submit_contact
- conversion rate

### D. Placement Performance

Dimension:
- `event_location`

Metrikler:
- `click_contact_cta`
- `submit_contact`
- conversion assist rate (location bazli)

### E. Project Contribution

Dimension:
- `project_slug`
- `project_category`

Metrikler:
- `view_project`
- project page -> contact click assisted count

## 2) Suggested Date Presets

- Last 7 days (operational)
- Last 28 days (trend)
- Last 90 days (strategic)

## 3) Operational Alerts

- Haftalik `submit_contact` %20+ dusus
- `click_contact_cta` stable iken `submit_contact` dusuyorsa UX friction alarmi
- Top 3 landing page conversion ani degisimleri

## 4) Minimum Data Quality Rules

- `(not set)` oranlari:
  - `event_location` < %10
  - `event_label` < %10
- Event param bosluklari icin release sonrasi 24 saat icinde kontrol
