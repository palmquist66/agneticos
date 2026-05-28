# HPAH Blog Publishing Workflow (future / not yet built)

*Captured 2026-05-28. A low-friction pipeline so HPAH can publish blog posts quickly instead of the email-WhiskerCloud-and-wait loop. Conceptual design only — nothing built yet. Gated on Jim getting WordPress admin access (the takeover must-get).*

---

## Goal

Karen's team writes a post; Jim (with Claude) picks it up, optimizes it, and gets it posted as a reviewable draft the same day — often within the hour of receiving a clean draft. Replaces the current "write a doc, email the vendor, wait, chase" model.

## Guiding principle

**Keep Karen's side dead simple.** The whole takeover promise is *less work for Karen*, so she should not have to learn a new system. The automation lives on Jim's side. She writes the way she already does; Jim's pipeline does the rest.

---

## Step 1 — Drop the draft (Karen's side)

Two options, both using what they already do:

- **Email** — Karen emails the draft, exactly how she sent the homepage instructions doc. Zero new tools. *(Lowest friction.)*
- **Shared Google Drive folder** — e.g. "HPAH Blog Drafts." Her team drops a Google Doc; Jim grabs it. More organized, fits their Google habits. *(Caveat: the gws CLI Google auth is currently broken — this path would lean on the Drive connector or a manual download. Email sidesteps that.)*

Pair either with a **one-page template** so the post arrives with the few things the pipeline needs: topic / target keyword, the body copy, and any "link to this service or location page" notes. Karen just writes — she never thinks about SEO.

## Step 2 — Optimize (Claude, where the value is)

Claude takes the raw draft and adds:
- SEO title + meta description
- Clean heading structure (one H1, logical H2/H3s)
- Internal links to relevant service / location pages
- `Article` (or `BlogPosting`) schema
- Image alt text
- Brand voice pass + humanizer so it reads like HPAH, not like AI

## Step 3 — Publish as a DRAFT via the WordPress REST API

A blog post is the *easiest* thing to automate on WordPress — standard content, handled cleanly by the REST API (unlike the Divi homepage). Post it with `status: draft` so nothing goes live unseen. This keeps Karen in control, per the takeover ethos and the consent-first client rule.

## Step 4 — Karen reviews (the approval gate)

A draft created via the API is a normal WordPress draft (Posts → Drafts). How Karen views it depends on her access — **and we don't yet know if Karen has a WordPress admin login** (open question as of 2026-05-28). So the recommended path is the one that works *regardless*:

| Path | How Karen views it | Needs her WP login? | Notes |
|---|---|---|---|
| **A. Public preview link (RECOMMENDED)** | Tap a no-login URL on her phone; sees it styled exactly as live | **No** | Needs the free **Public Post Preview** plugin (or WP's share-preview) installed once. Works whether or not Karen has admin. |
| B. wp-admin preview | Posts → Drafts → Preview | Yes | Simplest if she's already logged in, but asks her to go into WordPress. |
| C. Logged-in preview link | Open a draft preview URL | Yes | Only works if she has a session. |
| D. External preview | Claude sends a formatted preview before it touches WordPress | No | Zero plugins, but won't show real site styling — content only. |

**Default to Path A** until Karen's WP access is confirmed — it's frictionless and access-agnostic.

## Step 5 — Publish on approval

Once Karen says yes: flip `draft` → `publish` with a one-line API call, or she clicks Publish herself if she's in wp-admin. Nothing goes live until she's seen it. Once trust is established, the gate could be relaxed to straight-to-publish.

---

## Timing

- Karen's team writing the post: their time (the slow part).
- Pickup → optimize → posted as draft: **15-30 min**.
- Review + publish: a few minutes.
- Net: **same-day, often within the hour** of receiving a clean draft.

## VetForge reusability

This is a **product feature, not a one-off.** The blog flow is clean, repeatable, and recurring — a better first automation to build than the one-time homepage fixes. Build it once against the WordPress REST API, parameterize per client, and every vet practice on VetForge gets fast blog publishing.

## Prerequisites & open questions

- **Jim needs WordPress admin + an Application Password** (WP 5.6+, generated in user profile — no SSH needed). Same gate as everything else.
- **REST API must be enabled** and not locked down by a security plugin (recon).
- **Does Karen have a WordPress admin login? — UNKNOWN as of 2026-05-28.** Decides whether review Path A is required or B/C are options. Until confirmed, assume she doesn't and default to Path A.
- **Public Post Preview plugin** (free) needed for Path A.
- **Images** in a post need an upload step (REST media endpoint) + alt text — scriptable, one extra step.

## Caveats

- Keep the draft-review gate in place early; relax only once Karen trusts the output.
- Don't make Karen learn anything — if a step adds friction on her side, move it to Jim's side.
- Entire pipeline is gated on access; nothing here runs until WordPress admin is granted.
