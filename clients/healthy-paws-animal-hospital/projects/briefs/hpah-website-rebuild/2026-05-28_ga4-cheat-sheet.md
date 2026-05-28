# GA4 Cheat Sheet — for HPAH

*Plain-language guide to Google Analytics 4 for a local vet practice. What each left-menu item is for, and whether it's worth your time. Property `G-CH989J9R71`.*

---

## The mental model

Two things on the left:
- **The narrow icon rail** (house, bar chart, squiggle, target, gear) = GA4's big areas. You're normally in **Reports** (the bar chart). The **gear at the bottom is Admin** — settings, not reports.
- **The menu** = everything inside Reports. The "**Life cycle**" grouping is the customer journey in order: **find you (Acquisition) → do something (Engagement) → buy (Monetization) → return (Retention).**

For a local vet, most of GA4 is noise. Three reports answer almost every real question:
1. **Traffic acquisition** — where patients come from
2. **Events** — are we getting leads
3. **Landing page / Pages and screens** — what content works

---

## The 6 that matter for HPAH

| Menu item | What it is | How HPAH uses it |
|---|---|---|
| **Reports snapshot** | Dashboard homepage of summary cards | 30-second "how are we doing" glance |
| **Acquisition → Traffic acquisition** | Where visits come from (Organic Search, Direct, Maps, Social, Referral) | The literal answer to "where do our patients come from." Find the channel gap. |
| **Acquisition → Lead acquisition** | Ties sources to lead events | Blank until conversions are set. Once Click-to-Call / Contact / Appointment are key events, this shows which channel drives actual *leads*, not just traffic. |
| **Engagement → Events** | Every tracked action | The lead-counting report — where the baseline came from (calls, contact, appointment forms) |
| **Engagement → Pages and screens** | Which pages get viewed | What content works; which service/location pages get attention |
| **Engagement → Landing page** | The *first* page people hit from Google (the "front door") | Shows the front doors (likely medication posts). Tells you where to put call/book CTAs to catch arrivals. |

## Mostly skip for now (and why)

- **Acquisition Overview / Engagement Overview** — just summaries of the reports above. Skip the middleman.
- **User acquisition** — like Traffic acquisition but only a user's *first-ever* visit. Traffic acquisition is more practical.
- **Non Google campaign** — only for UTM-tagged campaigns (a Facebook ad, an email blast). Empty for HPAH today.
- **User acquisition cohorts** — advanced retention math. Not now.
- **Monetization** — ecommerce/revenue. HPAH doesn't sell online, so it's empty. Ignore.
- **Retention** — new vs returning visitors. Mildly interesting (returning ≈ existing clients), not a new-patient growth lever.
- **Library** — where you *build* custom reports later (e.g. a leads dashboard). A tool, not a report to read.

## The icon rail extras

- **Home** — auto-insights landing page.
- **Explore** (squiggle) — advanced custom analysis (funnels, paths, segments). Powerful, later.
- **Advertising** (target) — attribution + Google Ads conversion paths. Only if running Google Ads.
- **Admin** (gear, bottom) — **settings, not a report.** Where the next setup happens: mark lead events as **key events**, fix the **industry category** (off "Drugs & Medications"), manage user access. This is how you turn GA4 from "a thing we read" into a live scoreboard.

---

## The honest takeaway

For HPAH, lean on **Traffic acquisition** (where patients come from), **Events** (are we getting leads), and **Landing page / Pages** (what content works). Ignore the rest until you're running ads or building custom dashboards. And remember the lead-data caveat: track the *specific* events (Click-to-Call, Contact, Initial Visit), never generic `form_submit` (72% of it is existing-client admin). See `2026-05-28_ga4-findings.md` for the full baseline.
