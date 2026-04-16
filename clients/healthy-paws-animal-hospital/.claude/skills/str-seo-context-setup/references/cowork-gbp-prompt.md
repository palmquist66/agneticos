# Co-Work GBP Data Collection Prompt

This reference file contains the prompt template that gets personalized and given to the user to paste into Claude in Chrome (browser). The Chrome extension can see rendered Google Maps pages and extract data that CLI tools cannot scrape.

## When to Generate This

Generate this prompt when:
- Running `str-seo-context-setup` and the user's GBP URL is available
- Running `str-gbp-audit` and `brand_context/seo/gbp-details.md` has gaps (Unknown, TBD, "needs verification")
- The user asks to "refresh GBP data" or "update from Google Maps"

## Prerequisites

Before generating this prompt, the user must have provided **3-5 target keywords** they want to rank for in the map pack. These keywords are used in Part 1 of the prompt. If keywords haven't been collected yet, ask first.

## How It Works

1. **Code** collects 3-5 target keywords from the user
2. **Code** fills in the template below with keywords, business names, URLs, and competitor URLs from `brand_context/seo/`
3. **Code** outputs the filled prompt as a copyable block
4. **User** opens claude.ai in Chrome with the Claude extension active
5. **User** navigates to Google Maps and pastes the prompt into the Claude side panel
6. **Part 1:** User searches each keyword on Google Maps — Claude reads the map pack results and records rankings
7. **Part 2:** User navigates to each listing URL — Claude reads the full GBP data
8. **User** copies the full output and pastes it back into Code
9. **Code** parses the structured output and updates `brand_context/seo/` files

## User Instructions (show these to the user)

```
To get the GBP data I can't access from here, do this:

1. Open claude.ai in Chrome with the Claude extension active
2. Click the Claude icon in your toolbar to open the side panel
3. Open Google Maps in another tab
4. Paste the prompt below into the Claude side panel
5. Part 1: Search each keyword — Claude will read the map pack results
6. Part 2: Visit each listing URL — Claude will extract full GBP data
7. When done, copy the full output and paste it back here

This takes about 10 minutes and gives us real ranking data + competitor profiles.
```

## Prompt Template

The `{VARIABLES}` below get replaced by Code with real data before showing to the user.

---

### START OF CO-WORK PROMPT ###

I need your help extracting data from Google Maps in two parts. I'll navigate to pages and you read what's on screen. Use the exact output formats below — this gets pasted into another tool that parses it.

---

## PART 1: MAP PACK KEYWORD SEARCHES

I'm going to search these keywords on Google Maps one at a time. For each search, read the map pack results (the top 3-5 listings that appear) and record them in the exact format below.

**KEYWORDS TO SEARCH:**

{KEYWORD_LIST}

**For each keyword search, after I type it into Google Maps, extract and output:**

```
=== MAP PACK: "{keyword}" ===

POSITION_1: {business name} | {primary category shown} | {rating} stars | {review count} reviews
POSITION_2: {business name} | {primary category shown} | {rating} stars | {review count} reviews
POSITION_3: {business name} | {primary category shown} | {rating} stars | {review count} reviews
POSITION_4: {business name} | {primary category shown} | {rating} stars | {review count} reviews (if shown)
POSITION_5: {business name} | {primary category shown} | {rating} stars | {review count} reviews (if shown)

MY_LISTING_APPEARS: Yes (position {N}) / No
SPONSORED_RESULTS: {any sponsored listings at top, or "None"}

=== END MAP PACK: "{keyword}" ===
```

Let me search the first keyword now.

---

## PART 2: INDIVIDUAL LISTING EXTRACTION

After we finish all keyword searches, I'll navigate to each business listing one at a time. For each listing, read everything visible on the page and output in this format:

**LISTINGS TO VISIT:**

{URL_LIST}

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

Let me navigate to the first listing now.

### END OF CO-WORK PROMPT ###

---

## Parsing Rules (for Code)

When the user pastes co-work output back into Code, parse it using these rules:

### Part 1 (Map Pack Data)
1. Split on `=== MAP PACK:` markers to separate each keyword search
2. Extract the keyword from the header (between quotes)
3. Parse each POSITION line: split on `|` to get business name, category, rating, reviews
4. Check MY_LISTING_APPEARS for the client's ranking position
5. Store map pack data for the category audit — this shows:
   - Which categories correlate with map pack appearances
   - The client's actual ranking position per keyword
   - Which competitors consistently appear across keywords
6. Save to `brand_context/seo/map-pack-rankings.md` with the date

### Part 2 (Listing Data)
1. Split on `=== GBP DATA:` markers to separate each business
2. Extract fields by line prefix (RATING:, REVIEWS:, PRIMARY_CATEGORY:, etc.)
3. ATTRIBUTES and SERVICES are multi-line — collect all `- ` lines until the next section header
4. Match business name to existing context files:
   - If it matches the client business → update `brand_context/seo/gbp-details.md`
   - If it matches a competitor → update `brand_context/seo/competitors/{slug}.md`
5. Merge, don't overwrite — keep existing data (website scrapes, Yelp data) and ADD the Google-specific fields
6. Mark fields as "verified via GBP" with the date

## Keyword List Template

Generate the keyword list section like this:

```
1. "{keyword 1}" in {primary city}
2. "{keyword 2}" in {primary city}
3. "{keyword 3}" in {primary city}
```

Use the keywords the user selected during the "Before You Start" step of the GBP audit skill.

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
