---
project: hpah-website-rebuild
status: active
level: 3
created: 2026-05-22
---

# HPAH Website Rebuild — Astro Static Site

## Goal

Replace the current WordPress/Divi site with a fast, static Astro site that AI crawlers can read, includes all 10 new SEO pages from the developer brief, and makes future updates as simple as editing a markdown file.

## Deliverables

- [x] Full Astro site with all existing pages migrated (44 .astro pages, 60 routes total)
- [x] 7 new service pages (Fear Free, Spay/Neuter, Cat Vet, Senior Care, Wellness, Vaccinations, Allergies)
- [x] 3 new location pages (Algonquin, Huntley, Crystal Lake)
- [x] Schema markup on every page (LocalBusiness, VeterinaryCare, FAQPage, Service, Person, Article)
- [x] Blog system with content collections (5 sample articles — full 119 migration pending WordPress export)
- [x] robots.txt allowing all AI crawlers
- [x] Auto-generated sitemap (60 URLs)
- [ ] Deployed demo on Vercel for Karen review

## Acceptance Criteria

- `npm run build` succeeds with zero errors
- All existing URLs from current site resolve on new site
- Google Rich Results Test validates schema
- View source shows real HTML (not empty JS shell)
- Lighthouse: Performance 95+, SEO 100, Accessibility 90+
- All 10 new SEO pages have proper meta tags, FAQ sections, and schema

## Tech Stack

- Astro 6 (static HTML output)
- Tailwind CSS 4 (via @tailwindcss/vite)
- TypeScript (strict)
- Vercel (deployment)

## Key Files

- `site/` — Astro project root
- `site/src/pages/` — All page files
- `site/src/layouts/` — BaseLayout, ServiceLayout, LocationLayout, BlogPostLayout
- `site/src/components/` — Header, Footer, CTA, FAQSection, Schema components
- `site/src/content/blog/` — Blog posts as markdown
- `site/src/data/business.ts` — Centralized business data
