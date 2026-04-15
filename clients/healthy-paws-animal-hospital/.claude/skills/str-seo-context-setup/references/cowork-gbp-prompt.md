# Co-Work GBP Data Collection Prompt

This reference file contains the prompt template that gets personalized and given to the user to paste into Claude co-work (browser). The Chrome extension can see rendered Google Maps pages and extract data that CLI tools cannot scrape.

## When to Generate This

Generate this prompt when:
- Running `str-seo-context-setup` and the user's GBP URL is available
- Running `str-gbp-audit` and `brand_context/seo/gbp-details.md` has gaps (Unknown, TBD, "needs verification")
- The user asks to "refresh GBP data" or "update from Google Maps"

## How It Works

1. **Code** fills in the template below with actual business names, URLs, and competitor URLs from `brand_context/seo/`
2. **Code** outputs the filled prompt as a copyable block
3. **User** opens claude.ai co-work, navigates to the first Google Maps URL, and pastes the prompt
4. **Co-work** (with Chrome extension reading the page) extracts structured data
5. **User** copies the co-work output and pastes it back into Code
6. **Code** parses the structured output and updates `brand_context/seo/` files

## User Instructions (show these to the user)

```
To get the GBP data I can't access from here, do this:

1. Open claude.ai (co-work mode) in Chrome with the Claude extension active
2. Open Google Maps in another tab
3. Paste the prompt below into co-work
4. Follow the URL-by-URL instructions — co-work will read each Maps page
5. When done, copy the full output and paste it back here

This takes about 5 minutes and fills every gap in our competitor data.
```

## Prompt Template

The `{VARIABLES}` below get replaced by Code with real data before showing to the user.

---

### START OF CO-WORK PROMPT ###

I need you to extract Google Business Profile data from Google Maps listings. I'll navigate to each URL one at a time. For each listing, read everything visible on the page and output the data in the exact format below.

**IMPORTANT:** Use the exact format — this output gets pasted into another tool that parses it.

---

**LISTINGS TO VISIT:**

{URL_LIST}

---

**For each listing, after I navigate to the URL, extract and output:**

```
=== GBP DATA: {business name} ===

RATING: {star rating, e.g., 4.8}
REVIEWS: {total review count, e.g., 365}

PRIMARY_CATEGORY: {the main category shown, e.g., Animal hospital}
SECONDARY_CATEGORIES: {comma-separated list, e.g., Veterinarian, Emergency veterinary service}

DESCRIPTION: {the full business description text, or "None set" if blank}

ATTRIBUTES:
- {attribute 1, e.g., Wheelchair accessible entrance}
- {attribute 2, e.g., Identifies as veteran-owned}
- {etc — list every attribute/tag visible}

SERVICES:
- {service 1} | {description if shown, or "No description"}
- {service 2} | {description if shown, or "No description"}
- {etc — list every service in the services section}

PHOTOS:
- Total count: {number}
- Owner photos: {number if shown}
- Customer photos: {number if shown}
- Types visible: {e.g., exterior, interior, team, food, menu — whatever categories are shown}

POSTS:
- Last post date: {date or "No posts"}
- Post frequency: {e.g., "2-3 per month" or "None visible"}
- Recent post topics: {brief description of last 2-3 posts, or "N/A"}

HOURS:
- Mon: {hours}
- Tue: {hours}
- Wed: {hours}
- Thu: {hours}
- Fri: {hours}
- Sat: {hours or "Closed"}
- Sun: {hours or "Closed"}

REVIEWS_SNAPSHOT:
- Most mentioned: {top 3 keywords/topics from review highlights if visible}
- Recent review themes: {brief note on what recent reviews say}

=== END: {business name} ===
```

Let me navigate to the first URL now.

### END OF CO-WORK PROMPT ###

---

## Parsing Rules (for Code)

When the user pastes co-work output back into Code, parse it using these rules:

1. Split on `=== GBP DATA:` markers to separate each business
2. Extract fields by line prefix (RATING:, REVIEWS:, PRIMARY_CATEGORY:, etc.)
3. ATTRIBUTES and SERVICES are multi-line — collect all `- ` lines until the next section header
4. Match business name to existing context files:
   - If it matches the client business → update `brand_context/seo/gbp-details.md`
   - If it matches a competitor → update `brand_context/seo/competitors/{slug}.md`
5. Merge, don't overwrite — keep existing data (website scrapes, Yelp data) and ADD the Google-specific fields
6. Mark fields as "verified via GBP" with the date

## URL List Template

Generate the URL list section like this:

```
1. **{Business Name}** (YOUR LISTING)
   URL: {GBP URL from business-profile.md}

2. **{Competitor 1 Name}**
   URL: {GBP URL from competitors/slug.md, or "Search: {business name} {city} on Google Maps"}

3. **{Competitor 2 Name}**
   URL: {GBP URL from competitors/slug.md, or "Search: {business name} {city} on Google Maps"}
```
