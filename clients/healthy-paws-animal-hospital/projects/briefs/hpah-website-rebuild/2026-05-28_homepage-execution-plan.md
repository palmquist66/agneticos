# HPAH Homepage — Execution Plan (with WordPress admin access)

*Prepared 2026-05-28. This is the do-it-yourself version of the 14-item homepage checklist Karen sent WhiskerCloud. It assumes the takeover is greenlit and Jim has WordPress admin access. Order is dependency-aware: safe/invisible edits first, structural and URL changes later, navigation last, QA at the end. Every exact value and code block is included so no cross-referencing is needed.*

**Headline estimate: a focused half-day, ~4 to 5 hours**, happy path. Add ~30 min if no SEO plugin is installed. The navigation item (hamburger → horizontal desktop) is the one wildcard that could add 1-2 hours if the Divi header is custom-built.

**Who does what:** Jim is the hands in WordPress (clicks, pastes, publishes). Claude pre-writes every value/code block, writes any CSS needed, validates the schema, and troubleshoots live. The copy is already done — most of this is mechanical paste-and-save.

---

## Phase 0 — Pre-flight (~20-30 min). Do NOT skip.

This is a live site for a real business. Don't touch anything structural until these are done.

- **0.1 Confirm admin login works.** Log into `/wp-admin`. Verify you can see Pages, Appearance → Menus, and the Divi builder. (~5 min)
- **0.2 Create a restore point.** Check if the host (or a plugin like UpdraftPlus) has a recent backup. If not, install UpdraftPlus and run one backup before editing. At minimum, screenshot the current homepage and note the current title/meta/H1/URLs so anything is reversible. (~10 min)
- **0.3 Recon — three things that decide the path:**
  1. **Which SEO plugin?** Plugins list → look for **Rank Math** or **Yoast**. This gates items 2, 3, 5. If *neither* is installed, install Rank Math (free) and run its setup wizard before Phase 1 (+~30 min).
  2. **Redirect capability?** Rank Math has a built-in **Redirections** module (enable it). Yoast free does *not* — if it's Yoast, install the **Redirection** plugin (free) for the 301s in Phase 3.
  3. **Divi header type?** Appearance → check whether the nav is the default Divi menu or a custom **Divi Theme Builder** header. This sizes the navigation work in Phase 4.

**Decision gate:** once 0.3 is known, the rest of the plan is unblocked. Tell Claude the three answers and we lock the exact clicks.

---

## Phase 1 — Invisible / zero-risk plugin edits (~40 min)

These change nothing visible and are instantly reversible. Knock them out first for quick wins.

### Item 2 — Homepage page title (~5 min)
- **Where:** Rank Math/Yoast → Homepage SEO settings → "SEO Title" / "Meta Title."
- **Paste exactly:**
  ```
  Veterinarian in Lake in the Hills, IL | Healthy Paws Animal Hospital
  ```

### Item 3 — Homepage meta description (~5 min)
- **Where:** same panel → "Meta Description."
- **Paste exactly:**
  ```
  Healthy Paws Animal Hospital is a privately owned veterinary practice in Lake in the Hills, IL, serving dogs and cats with wellness exams, dental care, surgery, fear free visits, and end-of-life care. Call (815) 322-5400.
  ```

### Item 5 — VeterinaryCare schema (~15 min)
- **First:** verify the real Facebook + Instagram URLs (the doc's are placeholders) and swap them in.
- **Where (best path):** if Rank Math → Rank Math → Schema → Add New → Custom/JSON, OR use the **WPCode** / **Insert Headers and Footers** plugin to inject into the homepage `<head>`. **Do NOT paste into Appearance → Theme Editor** — direct theme-file edits break on the next theme update.
- **Code:** the full `VeterinaryCare` JSON-LD block is in the WhiskerCloud instructions doc (Priority 4). Claude will hand you the final version with the corrected social URLs.
- **Validate after:** run the homepage URL through Google's **Rich Results Test** to confirm it parses clean.

### Item 14 — Alt text on 3 homepage images (~10 min)
- **Where:** edit each image (Divi module or Media Library) → Alt Text field.
- **Values** (em dashes removed per Jim's preference):
  - Hero 1 (Dr. Burgess with dogs): `Veterinarian Dr. Karen Burgess DVM with dogs at Healthy Paws Animal Hospital in Lake in the Hills, IL`
  - Hero 2: `Healthy Paws Animal Hospital: fear free veterinary care in Lake in the Hills, IL`
  - Hero 3: `Healthy Paws Animal Hospital exterior, 4581 Princeton Lane, Lake in the Hills, IL 60156`

---

## Phase 2 — Homepage H1 (~15-20 min)

### Item 4 — Fix the H1
- **Where:** open the homepage in the **Divi builder** → hero section at top.
- **Steps:**
  1. Find the "Proud to be Privately Owned" text. Change its heading tag from **H1 → H2** (it stays visible, just not the H1).
  2. Add a new text element above it, heading tag **H1**, containing: `Veterinarian in Lake in the Hills, IL`.
- **Note:** if the hero is a Divi *Fullwidth Header* module (auto-H1 title), the method differs slightly — adjust the module's title or use a Text module with an explicit H1. Claude will confirm once we see which module it is.
- **Verify:** right-click → Inspect, confirm there's exactly one `<h1>` and it's the new text.

---

## Phase 3 — URL slugs + 301 redirects (~40 min)

Higher care: changing URLs can break links if redirects aren't set. Do each slug, set its 301, then test before moving on.

### Item 6 + 7 — Fear Free page (~25 min)
- **Slug:** Pages → Fear Free page → change slug
  `/fearful-friends-lake-in-the-hills-il/` → `/fear-free-vet-lake-in-the-hills-il/`
- **301 redirect:** old slug → new slug (Rank Math Redirections or Redirection plugin).
- **H1:** `Fear Free Veterinary Care in Lake in the Hills, IL`
- **Title tag:** `Fear Free Vet in Lake in the Hills, IL | Healthy Paws Animal Hospital`
- **Keep** "Fearful Friends" in the body copy as the branded program name — only the SEO elements change.
- **Test:** visit the OLD url, confirm it 301s to the new one.

### Item 8 — Adult Care page (~15 min)
- **Slug:** `/pet-adult-care-in-the-hills-il/` → `/pet-adult-care-lake-in-the-hills-il/` (adds the missing "Lake")
- **301 redirect:** old → new.
- **Test:** old URL redirects cleanly.

---

## Phase 4 — Navigation restructure (~60-90 min + wildcard)

Most visible changes, so do them last and test on desktop + mobile. Appearance → Menus for most of this.

### Item 11 — Rename "Our Services" → "Services" (~2 min)
- Menus → edit the label. Fastest win, do first.

### Item 10 — New "Our Team" top-level item (~10 min)
- Add top-level "Our Team"; move **Meet the Team, Reviews, Careers** under it (pull out of About Us).

### Item 9 — New "Areas We Serve" top-level item (~10 min)
- Add top-level "Areas We Serve." Sub-links:
  - Lake in the Hills → `/` (exists)
  - Algonquin → `/veterinarian-algonquin-il/` *(page to be built — add link when live)*
  - Huntley → `/veterinarian-huntley-il/` *(to be built)*
  - Crystal Lake → `/veterinarian-crystal-lake-il/` *(to be built)*
- For now, add Lake in the Hills; add the others as those pages get built (separate, larger task).

### Remove "Forms" top-level item (~5 min)
- Move Patient Health Form, Pet Insurance Records Request, Prescription Request to the **footer** or Contact page; remove from top nav.

### Item 12 — "Contact Us" → CTA button (~20 min)
- Remove its dropdown sub-links (Hours/Directions/Request Appointment become sections on one Contact page).
- Style as a prominent button, far right of the nav. May need a Divi menu setting or small custom CSS — Claude will write the CSS if the theme doesn't have a toggle.

### Item 13 — Horizontal desktop nav (WILDCARD, 15 min to 2 hrs)
- Goal: stop showing the hamburger on screens **wider than 768px**; show standard horizontal nav.
- **If Divi theme setting:** Theme Customizer → Header/Navigation → set the desktop breakpoint. ~15 min.
- **If custom Theme Builder header:** may need to rebuild/adjust the header module + CSS. ~1-2 hrs.
- This is the only item Claude can't size until we see the header (Phase 0.3). Custom CSS provided if needed.

---

## Phase 5 — QA & confirm (~25 min)

- Run homepage through **Rich Results Test** — schema valid.
- Inspect homepage — exactly one H1, correct text.
- Visit both OLD slug URLs — confirm 301s work.
- Check nav on desktop (horizontal, Contact is a button) and on mobile (still usable).
- View page source / Google's preview — title + meta description correct.
- Tick every box on the doc's Implementation Checklist.
- Send Karen a short "all 14 done, here's what changed" note (the opposite of the wait-and-chase loop).

---

## Time roll-up

| Phase | Work | Est. |
|---|---|---|
| 0 | Pre-flight: login, backup, recon | 20-30 min |
| 1 | Plugin fields, schema, alt text | ~40 min |
| 2 | Homepage H1 | 15-20 min |
| 3 | URL slugs + 301s | ~40 min |
| 4 | Navigation (excl. wildcard) | 60-75 min |
| 5 | QA & confirm | ~25 min |
| **Subtotal** | **happy path** | **~3.5-4.5 hrs** |
| +/- | No SEO plugin installed | +30 min |
| +/- | Item 13 needs custom header rebuild | +1-2 hrs |

**Realistic: one focused half-day. Worst case: a long day.** Versus WhiskerCloud, which has delivered 0% live on the same list.

---

## Risks & guardrails

- **Live site.** Backup first (Phase 0.2). Make changes in a logical order and test as you go, not all-then-pray.
- **Don't edit theme files directly** for schema — use a plugin so it survives theme updates.
- **301s are mandatory** on slug changes or you create broken links and lose any existing ranking equity.
- **Location pages are out of scope here.** "Areas We Serve" can list them, but building Algonquin/Huntley/Crystal Lake pages is a separate, larger project — as are the blog migration and team bios.
- **Access is the gate.** None of this starts until WordPress admin is granted. That's the golf must-get.
