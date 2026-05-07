# GEO Strategy: Getting HPAH Recommended by AI Models

**Date:** May 6, 2026
**Purpose:** Comprehensive strategy to get Healthy Paws Animal Hospital recommended when pet owners ask AI assistants about veterinary services
**Builds on:** AI Visibility Baseline (April 27, 2026)

---

## Why This Matters Right Now

AI usage for local service discovery jumped from 6% to 45% in the past year. Among pet owners specifically, 38% now consult AI during veterinary searches — rising to 51% for those under 35.

When a pet owner asks ChatGPT or Perplexity "who's the best vet near Lake in the Hills?" — HPAH needs to be the answer. Right now it shows up in only 42% of those queries.

Here's the scale of the problem: ChatGPT recommends only 1.2% of local business locations. Perplexity recommends 7.4%. Gemini recommends 11%. Getting into that small circle requires deliberate work — but the practices that do it now have a massive first-mover advantage because almost no vets are optimizing for this yet.

---

## How AI Models Find and Recommend Local Businesses

Each platform pulls from different sources. There's only 11% overlap in domains cited by ChatGPT and Perplexity — meaning HPAH needs to be visible everywhere, not just one platform.

### Where Each AI Gets Its Information

| Platform | Primary Sources | What Gets HPAH Cited |
|----------|----------------|---------------------|
| **ChatGPT** | Bing index, GBP data (pulls directly), Yelp, Reddit, Wikipedia | Strong GBP, Yelp profile, Reddit mentions, consistent NAP across directories |
| **Perplexity** | Own index + Google, Reddit (6.6% of all citations), practice websites, vet directories | Detailed website with FAQ schema, Reddit presence, vet directory listings |
| **Google AI Overviews** | Google index, GBP (heavily weighted), reviews, Reddit | GBP optimization (what Karen is doing), schema markup, review volume + themes |
| **Gemini** | Google ecosystem data | Same as AI Overviews — GBP is the strongest lever |
| **Claude** | Brave Search index | Factually dense, well-structured website content with citations and statistics |

### The Trust Stack AI Models Use

AI doesn't work like Google search. It evaluates a stack of signals:

1. **Entity verification** — Does HPAH exist consistently across the web? Same name, address, phone everywhere?
2. **Structured data** — Can AI read the website's data in machine format (JSON-LD schema)?
3. **Third-party validation** — What do reviews, directories, Reddit threads, and articles say about HPAH?
4. **Content depth** — Does the website have specific, well-structured content that directly answers the questions pet owners ask?

Only 45% overlap exists between Google rankings and AI recommendations. More than half of businesses that rank on Google are NOT in AI answers.

---

## What Karen's GBP Posting Is Already Doing for GEO

This is important to understand: Karen's GBP work is directly feeding the AI engine pipeline.

ChatGPT now pulls data directly from Google Business Profiles for location-based queries. When someone asks "find me a reliable vet near Lake in the Hills," ChatGPT accesses GBP data including:

- Business name, address, phone, hours
- Service categories and attributes
- Review content (AI summarizes WHAT customers say, not just star ratings)
- Photos and activity signals (posting = active business)
- Q&A section content

Google is also rolling out AI-generated review summaries that aggregate sentiment like "Customers frequently praise the prompt service and calm exam experience." Every review that mentions specific services or experiences feeds these summaries.

**Karen's weekly GBP posts signal that HPAH is active and current.** This contributes to the overall trust score AI systems assign. The posting calendar we built is already working for traditional local SEO AND GEO simultaneously.

---

## Current HPAH Gaps (Why AI Models Can't Recommend HPAH Consistently)

### Critical Gaps

| Gap | Impact | Current State |
|-----|--------|--------------|
| **Zero structured data (JSON-LD schema)** | AI models can't machine-read the site | No LocalBusiness, VeterinaryCare, or FAQ schema on any page |
| **JavaScript-rendered content** | AI crawlers get blank pages | WordPress/Divi renders client-side; crawlers see CSS/JS, not business content |
| **No FAQ sections** | Misses 43% of AI citation opportunities | Zero FAQ content on any page |
| **No individual service pages** | Can't be cited for specific service queries | All services on one page |
| **No location/service-area pages** | Invisible in Crystal Lake, Huntley, Algonquin | Only appears for Lake in the Hills |
| **Zero Reddit presence** | Misses the #1 community citation source | Reddit appears in 40% of AI-generated answers |
| **No Fear Free page** | Ranks #1 organically but AI can't find it | No crawlable content for AI to cite |
| **Low domain authority (DR 11)** | ChatGPT weights domain authority at ~40% of citation decisions | Sites with high authority get 8.4 citations per response vs. 6 for lower |

### What AI Models Currently CAN Say About HPAH

When HPAH does appear, AI pulls: privately owned, Dr. Burgess, no lobby wait, in-room checkout, floor-to-ceiling windows, clinic cats (Gus Gus and Eleanor), 4.7 stars on Google, Neighborhood Favorite 7 years running.

### What AI Models CANNOT Say (But Should)

- Fear Free approach (no dedicated page)
- Specific service capabilities (dental, surgery types, wellness protocols)
- Why HPAH is different from competitors (transparency philosophy, education-first)
- Connection to Crystal Lake, Huntley, or Algonquin
- Answers to common pet owner questions (FAQ content)
- Dr. Burgess's specific credentials and expertise areas

---

## The GEO Playbook: 10 Actions Ranked by Impact

### Tier 1 — Foundation (Do These First)

#### 1. Implement VeterinaryCare + LocalBusiness + FAQPage Schema

**What:** Add JSON-LD structured data to every page on the website.

**Why:** Schema markup delivers a 30-40% AI visibility boost. FAQ schema specifically drives 43% of all AI citations. This is the single highest-impact technical change.

**What the developer needs to add (homepage minimum):**
- `VeterinaryCare` + `LocalBusiness` dual-type schema with: business name, address, phone, hours, geo coordinates, logo, services offered, area served (Lake in the Hills, Crystal Lake, Huntley, Algonquin, Cary), social links, aggregate rating
- `FAQPage` schema on every service page with 3-5 questions each
- `Person` schema for Dr. Burgess with: DVM credentials (Kansas State 1997), specializations, Fear Free certification, years of experience

**This was already outlined in the developer brief (April 20). If the developer hasn't started yet, this is the #1 priority to push.**

#### 2. Build the 7 Service Pages + 3 Location Pages

**What:** The 10 pages outlined in the developer brief — Fear Free, Spay/Neuter, Cat Vet, Senior Pet Care, Wellness Exams, Vaccinations, Pet Allergy Treatment, plus Algonquin/Huntley/Crystal Lake location pages.

**Why:** AI models cite specific pages, not general websites. Without a Fear Free page, HPAH can't be cited for fear-free vet queries — even though it ranks #1 on Google for that term. Without location pages, HPAH is invisible in 3 of 4 service areas.

Each page needs: 500-800 words of helpful content, 3-5 FAQ questions with schema, clear heading structure (H1 > H2 > H3), and a self-contained answer in the first 40-60 words of each section (optimal for AI extraction).

#### 3. Fix AI Crawler Access

**What:** Two things the developer needs to verify:

1. **robots.txt** — Allow these AI bots:
   - GPTBot (ChatGPT)
   - ChatGPT-User (ChatGPT browsing)
   - PerplexityBot (Perplexity)
   - ClaudeBot + anthropic-ai (Claude)
   - Google-Extended (Gemini/AI Overviews)
   - Bingbot (Copilot)

2. **Server-side rendering** — The WordPress/Divi site renders via JavaScript. AI crawlers can't execute JavaScript — they get empty pages. The developer needs to either enable server-side rendering or use a prerender service so crawlers get the actual HTML content.

**Why:** If AI bots can't crawl the site, nothing else matters. This is a blocker.

---

### Tier 2 — Authority Building

#### 4. Build Reddit Presence (Organic, Not Promotional)

**What:** Start participating authentically in relevant subreddits where Lake in the Hills / McHenry County pet owners ask for vet recommendations.

**Relevant subreddits:**
- r/ChicagoSuburbs — pet recommendations come up regularly
- r/McHenryCounty — hyperlocal recommendations
- r/dogs, r/cats — general pet health questions
- r/AskVet — veterinary questions (never give medical advice, but can share general expertise)
- Local city subreddits for Crystal Lake, Huntley, Algonquin

**The 95/5 rule:** 95% genuine value (answering questions, sharing expertise, being helpful) and 5% practice mentions. Reddit bans overt promotion — this has to be organic.

**Why:** Reddit appears in 40% of AI-generated answers across platforms. Perplexity cites Reddit at 6.6% of all citations — the single highest individual source. ChatGPT weights Reddit heavily. One well-upvoted recommendation thread can persist in AI answers for years (average cited post age: 1 year).

**Who should do this:** Ideally someone at the practice or a genuine community member. AI models detect astroturfing. The Dr. Burgess personal touch would be powerful here — answering general pet health questions from a vet's perspective.

**Timeline:** Perplexity surfaces new Reddit content within days. ChatGPT takes 2-4 weeks. Meaningful AI citation impact appears after 2-3 months of consistent participation.

#### 5. Yelp Profile Optimization

**What:** Fully optimize the Yelp listing — photos, complete service descriptions, response to every review.

**Why:** Yelp is heavily cited by both ChatGPT and Perplexity for local business queries. ChatGPT leans on Yelp especially for subjective questions ("best vet for anxious dogs"). Yelp is also licensing data directly to OpenAI for ChatGPT.

HPAH has 33 Yelp reviews currently. Target: 50+ with consistent response and updated profile photos.

#### 6. Review Generation Campaign With Service-Specific Keywords

**What:** Encourage satisfied clients to mention specific services and experiences in their Google reviews.

**Instead of:** "Great vet, highly recommend!"
**Aim for:** "Dr. Burgess was amazing with my senior dog's dental cleaning. The Fear Free approach made such a difference — my dog wasn't stressed at all. Love that they do everything in the exam room so I could be there the whole time."

**Why:** AI models summarize review THEMES, not just star ratings. If reviews consistently mention "Fear Free," "calm exams," "transparent pricing," and "senior pet care" — those become the phrases AI uses when recommending HPAH.

**Keywords to encourage in reviews:**
- Specific services: dental cleaning, spay/neuter, wellness exam, senior care, vaccinations
- Differentiators: Fear Free, no lobby wait, in-room checkout, transparent pricing
- Emotional language: calm, gentle, thorough, trustworthy, not rushed
- Comparative: "best vet we've ever had," "switched from [competitor] and never looked back"

**Target:** 200+ Google reviews (currently 158). Practices with 200+ reviews cross a threshold where AI models recommend with higher confidence.

#### 7. Veterinary Directory Listings

**What:** Ensure HPAH is listed with complete, consistent information on:
- Vet.com / VetFinder / Petplace.com
- AVMA member directory
- Illinois State Veterinary Medical Association
- Fear Free Certified Professional directory
- Better Business Bureau (upgrade from basic listing)
- Local chamber of commerce
- GeniusVets (already listed — verify it's complete)

**Why:** Perplexity favors industry-specific directories. Each listing is another data point AI models use to verify HPAH as a legitimate entity. Consistent NAP across all directories strengthens the entity verification layer of the trust stack.

---

### Tier 3 — Content Authority

#### 8. Build a "Why Choose Healthy Paws" Cornerstone Page

**What:** A comprehensive page on the website that answers the exact questions AI models try to answer when someone asks "best vet near Lake in the Hills."

**Content to include:**
- What makes HPAH different (lobby-free, Fear Free, in-room everything, transparent pricing, privately owned)
- Dr. Burgess's credentials and philosophy (Kansas State DVM 1997, Fear Free certified, personally follows up after surgery)
- The team's continuous education philosophy
- Specific numbers: 15+ years serving Lake in the Hills, 158+ Google reviews, 7 consecutive Neighborhood Favorite awards, 4.7-star average
- Areas served with drive times (Lake in the Hills, Crystal Lake 10 min, Huntley 12 min, Algonquin 8 min)
- FAQ section with 10+ questions pet owners actually ask

**Structure it for AI extraction:**
- Lead every section with a direct answer in the first 40-60 words
- Use H2 headings that match how people phrase queries ("What makes Healthy Paws different from other vets?")
- Include statistics with dates and sources
- Write self-contained paragraphs that work as standalone answers

**Why:** This becomes the page AI models cite when asked about HPAH directly. Right now there's no single page that answers "why this vet?" in a format AI can extract.

#### 9. Create Comprehensive DVM Bio Page

**What:** A detailed page for Dr. Burgess (and any other vets) that goes beyond a headshot and a paragraph.

**Include:**
- Full credentials: DVM, Kansas State University, 1997
- Years of experience (29 years as of 2026)
- Fear Free certification
- Specializations and areas of interest
- Practice philosophy in their own words
- Specific expertise (senior pet care, feline medicine, etc.)
- Professional memberships (AVMA, IVMA, etc.)
- Fun facts that humanize (the clinic cats, personal follow-up calls)

**Why:** AI systems need expertise signals to recommend with confidence. A detailed bio with credentials gives AI models the E-E-A-T signals they weight heavily. "Dr. Burgess, DVM, Kansas State University 1997, Fear Free certified, 29 years of experience" is infinitely more citable than "Meet our team!"

#### 10. Monitor and Retest AI Visibility Quarterly

**What:** Every 90 days, test the same 12 queries from the April baseline across ChatGPT, Perplexity, and Google AI Overviews. Track:
- Which queries mention HPAH (target: 75%+, up from 42%)
- What details AI models cite
- Which competitors appear
- Whether new service/location pages are getting cited
- Whether Reddit threads are being picked up

---

## How GBP Posting Feeds the AI Pipeline (For Karen)

Karen's GBP posting isn't just traditional SEO — it's directly building the AI recommendation pipeline. Here's the connection:

1. **GBP posts signal freshness** — AI models favor active businesses over stale listings
2. **Post content becomes searchable data** — When Karen writes about dental month or senior wellness, that content enters Google's data pool for AI Overviews
3. **Review responses show engagement** — AI models weight response rate as a trust signal
4. **Q&A section is direct AI fuel** — If Karen adds Q&A pairs to GBP, ChatGPT can pull them directly

**Recommendation for Karen:** Keep doing what she's doing with the posting calendar. Consider adding 5-10 Q&A pairs to the GBP listing that match the FAQ content planned for the website. Questions like:
- "Does Healthy Paws accept new patients?"
- "What's a Fear Free vet?"
- "How far is Healthy Paws from Crystal Lake?"
- "Do you see cats?"
- "What's included in a wellness exam?"

---

## Implementation Priority and Sequencing

| Phase | Actions | Who | Dependencies |
|-------|---------|-----|-------------|
| **Phase 1: Technical Foundation** | Schema markup, robots.txt AI bot access, fix JS rendering | Website developer | Developer brief already sent |
| **Phase 2: Content Build** | 7 service pages + 3 location pages + FAQ sections | Website developer (page build) + Jim (page copy) | Phase 1 for schema on new pages |
| **Phase 3: Authority Signals** | Reddit presence, Yelp optimization, vet directory listings, review campaign | Practice team + Jim | Can start immediately, parallel to Phases 1-2 |
| **Phase 4: Cornerstone Content** | "Why Choose HP" page, DVM bio page, GBP Q&A | Website developer + Jim | After Phases 1-2 |
| **Phase 5: Monitor + Iterate** | Retest 12 queries, measure progress, adjust | Jim | 90 days after Phase 2 launch |

---

## What Moves the Needle Most (If You Can Only Do 3 Things)

1. **Schema markup on the website** — 30-40% AI visibility boost from structured data alone. This is the biggest gap between HPAH and being AI-recommendable.

2. **Build the Fear Free page and top 3 service pages** — HPAH already ranks #1 for several terms but has no page AI can cite. Building these pages is like having a store with no front door.

3. **Start Reddit presence** — 40% of AI answers cite Reddit. Zero current presence means zero citations from the highest-impact community source. Even 3-4 well-placed, helpful comments per month will compound.

---

## Targets (Measure in 90 Days — August 2026)

| Metric | Current (May 2026) | Target (August 2026) |
|--------|:------------------:|:--------------------:|
| AI query visibility rate | 42% (5/12) | 75%+ (9/12) |
| Service area AI coverage | 1 of 4 cities | 3 of 4 cities |
| Pages with schema markup | 0 | All pages |
| Service-specific pages | 0 | 7 |
| FAQ sections with schema | 0 | 10+ |
| Reddit mentions/threads | 0 | 5+ organic |
| Google reviews | 158 | 200+ |
| Yelp reviews | 33 | 50+ |
| Vet directory listings (complete) | ~3 | 8+ |

---

## The Bottom Line

SEO keywords get you ranked. GEO gets you **recommended**. When a pet owner asks an AI "who's the best vet near me?" — the AI doesn't return 10 blue links. It gives one answer, maybe two. HPAH needs to be that answer.

The good news: almost no veterinary practices are doing this yet. The practices that build these signals now will own the AI recommendation space for their service area. Karen's GBP posting is already laying the groundwork. The website technical work (schema, service pages, FAQ) is the unlock that turns that groundwork into AI citations.

---

*Research sources: SOCi 2026 Local Visibility Index, Princeton GEO Study (KDD 2024), SE Ranking domain authority analysis, ZipTie content-answer fit analysis, iVET360 veterinary GEO framework, AdsX veterinary AI visibility guide, Search Engine Land GEO guide (2026)*
