# Website Developer Brief — Healthy Paws Animal Hospital

*This is a list of updates needed on healthypawsanimalhospital.com. Hand this to your website developer/service provider.*

---

## Background

An SEO and AI visibility audit was done on the Healthy Paws website and competitive landscape. HP is already ranking well organically for several keywords, but is missing dedicated pages that would lock in those rankings and expand visibility. HP is also invisible to AI search engines (Perplexity, ChatGPT) because the site lacks the structured data and content format those engines look for.

The site is WordPress/Divi. Everything below should work within that setup.

---

## Part 1: Service & Location Pages (10 new pages)

HP ranks #1 on Google for several services **without even having a dedicated page for them.** That means any competitor who builds a page can leapfrog. These pages lock in what HP is already earning.

Build each page with:
- Unique, original content (not duplicated from the homepage or other pages)
- The target keyword in the page title, H1, meta title, and meta description
- At least 500-800 words of helpful, patient-focused content
- A clear call-to-action (call to schedule, contact form, etc.)
- Internal links to/from related pages on the site

### Service Pages (build in this priority order)

| # | Page | URL Slug | Why |
|---|---|---|---|
| 1 | Fear Free Veterinary Care | `/fear-free-vet-lake-in-the-hills-il/` | Already ranking #1 with no page. Easiest win. HP is Fear Free certified — this is a major differentiator. |
| 2 | Spay & Neuter | `/spay-neuter-lake-in-the-hills-il/` | Already ranking #1 with no page. High search volume. |
| 3 | Cat Veterinarian | `/cat-vet-lake-in-the-hills-il/` | Already ranking #2. Zero competition for this term. First-mover advantage. |
| 4 | Senior Pet Care | `/senior-pet-care-lake-in-the-hills-il/` | Already ranking #1. Needs a dedicated page to hold position. |
| 5 | Wellness Exams | `/wellness-exams-lake-in-the-hills-il/` | Core service, no dedicated page. |
| 6 | Pet Vaccinations | `/pet-vaccinations-lake-in-the-hills-il/` | Core service, no dedicated page. |
| 7 | Pet Allergy Treatment | `/pet-allergy-treatment-lake-in-the-hills-il/` | Specialty service with search demand. |

### Location Pages (expand geographic reach)

These target nearby towns that HP serves but has no search presence in. Competitors like Pet Vet already have location pages for these areas and are ranking because of it.

| # | Page | URL Slug | Why |
|---|---|---|---|
| 8 | Veterinarian in Algonquin | `/veterinarian-algonquin-il/` | 4 competitors already ranking. HP serves the area but has no page. |
| 9 | Veterinarian in Huntley | `/veterinarian-huntley-il/` | Pet Vet ranks #1 here. HP can compete with a page. |
| 10 | Veterinarian in Crystal Lake | `/veterinarian-crystal-lake-il/` | First-mover opportunity. No strong competitor pages yet. |

**Location page content guidance:**
- Don't just copy the homepage with the city name swapped in. Each page needs unique content about serving that community.
- Mention distance/drive time from that town to the practice
- Reference local landmarks or neighborhoods if natural
- Include the full practice address, phone number, and hours
- Embed a Google Map showing the route from that town to the practice

---

## Part 2: Structured Data / Schema Markup (all pages)

Structured data is code added to pages that tells Google and AI search engines exactly what your business is, what services you offer, and how to find you. Without it, AI engines like Perplexity and ChatGPT can't reliably pull HP's information.

### LocalBusiness + VeterinaryCare Schema (site-wide)

Add `LocalBusiness` schema (subtype `VeterinaryCare`) to the homepage at minimum. Include:

- Business name: Healthy Paws Animal Hospital
- Address: 500 Pyott Road, Lake in the Hills, IL 60156
- Phone: (847) 854-2322
- Website URL
- Hours of operation
- Geo coordinates (latitude/longitude)
- Logo URL
- Price range (if applicable)
- Area served (Lake in the Hills, Algonquin, Huntley, Crystal Lake)
- Same-as links (Facebook, Google Business Profile, any other social profiles)

Use JSON-LD format in the `<head>` of each page. If the developer isn't sure how, Google's documentation is here: https://developers.google.com/search/docs/appearance/structured-data/local-business

### FAQ Schema (on each new service/location page)

Each service and location page should have a **FAQ section** with 3-5 common questions and answers. These need `FAQPage` schema markup so Google can display them as rich results and AI engines can pull them as citations.

**Example FAQs for the Fear Free page:**

- Q: What does "Fear Free certified" mean?
- A: Fear Free certification means our team is trained in techniques that reduce fear, anxiety, and stress in pets during veterinary visits. We use gentle handling, calming environments, and low-stress approaches so your pet feels safe.

- Q: How is a Fear Free vet visit different from a regular vet visit?
- A: We minimize loud noises, avoid forceful restraint, use calming pheromones, and let pets acclimate to the exam room before starting. Every visit is tailored to your pet's comfort level.

- Q: Does Fear Free care cost more?
- A: No. Fear Free techniques are part of how we practice — there's no extra charge.

**The developer should generate similar Q&As for each service page.** The questions should be things real pet owners actually search for. The answers should be 2-4 sentences, written in plain language.

Google's FAQ schema documentation: https://developers.google.com/search/docs/appearance/structured-data/faqpage

### Service Schema (on each service page)

Each service page should also have `Service` schema listing:
- Service name
- Description
- Provider (Healthy Paws Animal Hospital)
- Area served
- URL of the page

---

## Part 3: Technical SEO Fixes

### Meta Titles & Descriptions

Every page on the site should have a unique meta title and meta description. Check that:
- Meta titles are under 60 characters and include the primary keyword + location
- Meta descriptions are under 160 characters and include a call to action
- No two pages share the same meta title or description

**Format for new service pages:**
- Title: `[Service] in Lake in the Hills, IL | Healthy Paws Animal Hospital`
- Description: `[1-2 sentence summary of the service]. Call (847) 854-2322 to schedule.`

**Format for location pages:**
- Title: `Veterinarian in [City], IL | Healthy Paws Animal Hospital`
- Description: `Trusted veterinary care for [City] pets. Fear Free certified, [key services]. Call (847) 854-2322.`

### Internal Linking

Once the new pages are built:
- Link from the homepage to each new service page
- Link from each service page to related services (e.g., Wellness Exams links to Vaccinations)
- Link from location pages to service pages
- Add a "Services" section to the main navigation if one doesn't exist, linking to all service pages
- Add an "Areas We Serve" section to the footer linking to all location pages

### Image Alt Text

Check that all images on the site have descriptive alt text. For photos of the practice, use alt text like:
- "Healthy Paws Animal Hospital exterior in Lake in the Hills IL"
- "Veterinarian examining a dog at Healthy Paws Animal Hospital"
- "Fear Free veterinary exam room at Healthy Paws"

Don't keyword-stuff, but do include the practice name and location naturally.

---

## Part 4: Content That AI Engines Look For

AI search engines (Perplexity, ChatGPT, Google AI Overviews) cite websites that have clear, authoritative, well-structured content. HP has unique differentiators that no competitor talks about — these need to be prominent and well-written so AI engines pick them up.

### Strengthen These Existing Pages

HP's website already has great content (transparency page, pet experience page, education philosophy). Make sure these pages:
- Have proper H1/H2 heading structure (not just styled text that looks like headings)
- Include the practice name and location naturally
- Have schema markup (see Part 2)
- Are linked from the main navigation or footer

### Content That Should Exist Somewhere on the Site

If any of these don't already exist as content on the site, they should be added — either as standalone pages or as sections within existing pages:

- **"Why Choose Healthy Paws"** — a page or section highlighting differentiators: Fear Free certified, lobby-free design, in-room checkout, transparency philosophy. This is the kind of content AI engines cite when someone asks "best vet near Lake in the Hills."
- **Team/staff page with bios** — AI engines reference veterinarian credentials. Include DVM names, specializations, years of experience, and certifications (especially Fear Free).
- **"Areas We Serve"** summary page that links to each location page.

---

## Priority Order

| Priority | What | Impact |
|---|---|---|
| **Do first** | Pages 1-4 (Fear Free, Spay/Neuter, Cat Vet, Senior Pet Care) | Locks in existing #1 rankings before competitors build pages |
| **Do second** | LocalBusiness + VeterinaryCare schema on homepage | Makes HP machine-readable for AI engines |
| **Do third** | Pages 5-10 (remaining service + location pages) | Expands search footprint |
| **Do fourth** | FAQ sections + FAQ schema on all new pages | Enables rich results + AI citations |
| **Do fifth** | Meta titles/descriptions, internal linking, alt text | Polishes everything for maximum impact |

---

## Reference

- Current site: healthypawsanimalhospital.com
- CMS: WordPress with Divi theme
- Practice address: 500 Pyott Road, Lake in the Hills, IL 60156
- Phone: (847) 854-2322
- Google Business Profile category: Animal Hospital
- Current Domain Rating: 8 (competitors are 11-12)
- Fear Free certified: Yes

**Questions?** Contact John Ferrero (practice manager) or Jim Palmquist at JP Digital Works.

---

*Prepared by JP Digital Works — April 2026*
