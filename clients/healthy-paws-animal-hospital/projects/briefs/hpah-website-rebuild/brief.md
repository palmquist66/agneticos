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
- [x] Built Vercel demo — **taken offline 2026-05-23, pending Karen's review/consent** (see Deployment Status below)

## Deployment Status

**LIVE & PRIVATE as of 2026-05-24** — project `healthy-paws-demo`, URL **https://healthy-paws-demo.vercel.app**, gated by HTTP Basic Auth (username `healthypaws` / password `KarenPreview2026`). Verified: every route returns `401` without the password (pages, assets, sitemap, robots, deployment-hash URL); the password serves the full site. Ready to share with Karen — link + login are in `2026-05-24_karen-preview-email.md`.

**How the gate works (and why):** On the Hobby plan, Vercel's "Standard Protection" leaves the production `*.vercel.app` URL **public** (only preview/hash URLs get 401), and Password/"All Deployments" protection needs the $150/mo Pro add-on. So plan-level protection can't privatize the production URL for free — this is what leaked twice (project `site` on 2026-05-23, and a first attempt at `healthy-paws-demo` on 2026-05-24, both taken down within ~minutes). The fix is a **Vercel Edge Middleware** at `site/middleware.ts` (uses `@vercel/edge`) that enforces Basic Auth on `matcher: '/:path*'` — every request, including production — independent of plan. `robots.txt` is also set to `Disallow: /` (production version saved as `site/robots.txt.production-bak`).

**Operational notes:**
- First deploy to a fresh Vercel project auto-targets **production** (creates the public `<project>.vercel.app` alias) regardless of `--prod`. The middleware is what makes that safe.
- `@vercel/edge` is now a dependency (added 2026-05-24). Local `npm run build` is unaffected — Astro ignores root `middleware.ts`; only Vercel bundles it.
- Deploys must be run by James via `! vercel deploy` from `site/` — the auto-mode safety classifier blocks Claude from publishing HPAH content directly.
- **Always re-verify the lock after any redeploy:** fetch the production URL with no auth and confirm `401` before sharing. To rotate the password, edit `USER`/`PASS` in `site/middleware.ts` and redeploy.
- **Before any real public launch:** restore `robots.txt` from `robots.txt.production-bak`, and remove/disable the `middleware.ts` gate.

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

## Follow-ups / Known Issues

- [x] **Global `img { height: auto }` overrides Tailwind height classes site-wide.** ~~`site/src/styles/global.css` (~line 62) has an *unlayered* `img { max-width: 100%; height: auto; }` rule that wins over every Tailwind height utility (`h-44`, `h-14`, `h-full`, …), so images fall back to natural aspect ratio.~~ **FIXED 2026-05-24** — wrapped the rule in `@layer base` so utilities in the utilities layer now override it; removed the surgical `h-44!` workaround on the services "More Services" cards (now plain `h-full`). Verified across page types with Playwright/Chrome screenshots (home hero + service/commitment photos, services featured + "More Services" grid, ServiceLayout hero + image-left, location thumbnails): Pet Allergies card no longer ~3× too tall, and the `LocationLayout` service thumbnails (`w-14 h-14`) now render as true 56×56 squares instead of width-constrained. Build clean at 67 pages. (Verification screenshots in `site/scripts/imgfix/`.)

- [ ] **Links to the live WP site neutralized for the demo (2026-05-23).** All user-facing links that pointed to the current WordPress site were removed/repointed so the demo never bounces a visitor off-site. These need real decisions before launch:
  - **Patient health form** (`forms.astro`), **careers application** (`careers.astro`), **prescription refill portal** (`prescription-refills.astro`) — working external systems on the current site, now replaced with internal CTAs + interim "being set up" notes. Decide per system: rebuild natively, embed the existing tool, or link out intentionally (opening in a new tab).
  - **Info-center article directory** (`info-center.astro`) — ~100 article titles now render as plain non-clickable text because the 119-post blog migration is pending. Restore as internal links once blog content is migrated.
  - **"Our team" link** in info-center repointed to internal `/meet-the-team/`. **Favicon** now served locally (`/favicon.ico` + `/favicon.svg`).
  - Minor: `og:image` and schema `logo` still use the WP-hosted logo URL (`business.logo` in `business.ts`). These are metadata (not clickable) and need an absolute URL, so leave until the site has a stable domain, then point at a local/canonical logo.
  - **Team bios**: the "Read Bio" links were removed entirely — individual vet bios were never migrated (Divi blocked reading them; needs Karen). Rebuild bio pages or inline bios once content is provided.
