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

**Offline as of 2026-05-23.** The Vercel demo (project `site`) was removed via `vercel remove site --yes`. Reason: the production URL `site-nu-ten-7nf3d3w9lm.vercel.app` was serving the full site publicly (HTTP 200) before Karen had reviewed or consented. Deployment Protection was inconsistent — 4 of 5 aliases returned 401, but the production URL was wide open. Removed entirely rather than relying on partial protection. Verified gone: project absent from `vercel project ls`; all aliases return 404.

**Before bringing it back for Karen:** redeploy, then re-test *every* URL (CLI `vercel project ls` + fetch each alias) before sharing any link — the production URL is the one that leaks. Set up Vercel Authentication + a verified share link, and flip `robots.txt` to `Disallow: /` so a demo can never be indexed. Redeploy from `site/` with `vercel --prod`.

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

- [ ] **Global `img { height: auto }` overrides Tailwind height classes site-wide.** `site/src/styles/global.css` (~line 62) has an *unlayered* `img { max-width: 100%; height: auto; }` rule. Because it's unlayered, it wins over every Tailwind height utility (`h-44`, `h-14`, `h-full`, …) on images — so those classes are silently ignored and images fall back to natural aspect ratio. This is what made the Pet Allergies card image render ~3× too tall (source is 1440×2560 portrait). **Patched surgically** on the services-page "More Services" cards with `h-44!` (important) on 2026-05-23. **Proper fix:** the rule is redundant with Tailwind's own preflight — either delete it or wrap it in `@layer base` so utilities can override. After fixing, re-verify the ~23 images using `h-full` (heroes, featured service cards) and the location-page service thumbnails (`LocationLayout.astro`, `w-14 h-14`), which have the same latent issue (currently width-constrained instead of true squares). Do this with the dev server up and eyeball each page type before/after.

- [ ] **Links to the live WP site neutralized for the demo (2026-05-23).** All user-facing links that pointed to the current WordPress site were removed/repointed so the demo never bounces a visitor off-site. These need real decisions before launch:
  - **Patient health form** (`forms.astro`), **careers application** (`careers.astro`), **prescription refill portal** (`prescription-refills.astro`) — working external systems on the current site, now replaced with internal CTAs + interim "being set up" notes. Decide per system: rebuild natively, embed the existing tool, or link out intentionally (opening in a new tab).
  - **Info-center article directory** (`info-center.astro`) — ~100 article titles now render as plain non-clickable text because the 119-post blog migration is pending. Restore as internal links once blog content is migrated.
  - **"Our team" link** in info-center repointed to internal `/meet-the-team/`. **Favicon** now served locally (`/favicon.ico` + `/favicon.svg`).
  - Minor: `og:image` and schema `logo` still use the WP-hosted logo URL (`business.logo` in `business.ts`). These are metadata (not clickable) and need an absolute URL, so leave until the site has a stable domain, then point at a local/canonical logo.
  - **Team bios**: the "Read Bio" links were removed entirely — individual vet bios were never migrated (Divi blocked reading them; needs Karen). Rebuild bio pages or inline bios once content is provided.
