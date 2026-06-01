# Algonquin + Crystal Lake — Route Corrections

*Verifying drive times and routes for the Algonquin and Crystal Lake location page drafts against the actual HP address before WhiskerCloud picks them up on June 9. Karen's Huntley FINAL exposed that the AI drafts were routing town-center to town-center and getting both the time AND the road wrong. Same error pattern likely on these two.*

---

## Anchor: where HP actually is

- **Address:** 4581 Princeton Ln #101, Lake in the Hills, IL 60156
- **Real-world location:** intersection of **Lakewood Rd and Ackman Rd**, just south of Ackman (in the Princeton Crossing retail area).
- **Karen's framing** (Huntley FINAL): "adjacent to the northwest corner of Huntley just off the intersection of Ackman Rd. and Lakewood Rd." Plus: "we settled between neighborhoods, avoiding the commotion and traffic of Randall, Route 47 and Route 14, allowing easy access for our clients via Lakewood."

**The brand routing rule** (from Karen): mention **Lakewood Rd** as the access road. Avoid framing the drive around Randall Rd, Route 47, or Route 14 as the recommended route, even when they're technically faster on Google Maps. The whole point is HP is the calm option *off* those corridors.

---

## Algonquin (current draft: `/veterinarian-algonquin-il/`)

### What the current draft says

- Drive time: **10 minutes**
- Route: **"head north on Randall Road"** (called out as "straightforward," "no highway merges, no toll plazas")
- Map embed: 42.1654, -88.2943 to 42.2025, -88.3828

### What's actually true

- **Distance: ~3 miles by car** (2.16 mi straight-line).
- **Drive time: ~5-6 minutes**, not 10. Algonquin and Lake in the Hills are adjacent; Algonquin Rd literally forms the border.
- **Route options:**
  - Google Maps default: **Randall Rd north → Algonquin Rd west → Lakewood Rd north** (fast, but Randall is exactly what Karen says she avoids)
  - Karen's preferred framing: **Algonquin Rd west → Lakewood Rd north** (off the Randall corridor, which is her whole pitch)

### Errors to fix

1. **Drive time is ~2x too long.** "10 minutes" → **~5 minutes**.
2. **Route framing conflicts with Karen's brand.** "Heading north on Randall Road" is the *opposite* of how she positions HP. Reframe around **Algonquin Rd / Lakewood Rd**, the calm-access story.
3. **Distance not mentioned in copy.** Add "about 3 miles" so search engines and skim-readers get a concrete number (Karen did this on Huntley: "3 minutes or 1.5 miles").
4. **Map embed coordinates look correct** but should be re-verified after the route update (the embed URL is a placeholder pattern, not a real Maps API link).
5. **Competitive shadow-throwing.** Lines like "Algonquin has veterinary options. We know that" and "drive a few extra minutes is not convenience" hint at competitor critique. Karen's Huntley FINAL killed all of this. Strip on next draft.

### Suggested copy direction (for Karen to author, not for me to ship)

What a Karen-voiced Algonquin page would probably do, based on her Huntley pattern:
- Open with: real distance + her preferred route. *Something like:* "Just 5 minutes from [Algonquin landmark she names] via Algonquin Rd to Lakewood Rd. Personal, privately owned care for your dog or cat."
- Anchor on an Algonquin landmark she chooses (Huntley got Sunset Park — Algonquin equivalent could be Cornish Park, Algonquin Commons, Towne Park, Spella Park, or wherever feels natural to her).
- Local detail block: brief Algonquin history note + the four-township framing (HP sits between Huntley, Lake in the Hills, Lakewood, Crystal Lake — Algonquin is the fifth neighbor).
- Four pillars: Peace · Time · Education · Follow Up.
- "Algonquin Happenings" closing with named local spots (Algonquin Commons restaurants with patios, Spella Park, Cornish Park, any annual Algonquin pet event she knows about).

---

## Crystal Lake (current draft: `/veterinarian-crystal-lake-il/`)

### What the current draft says

- Drive time: **10 minutes**
- Route: **"west on Crystal Lake Road (Route 176)"**
- Map embed: 42.2411, -88.3162 to 42.2025, -88.3828

### What's actually true

- **Distance: ~5 miles** by car.
- **Drive time: ~10-11 minutes** (so the *number* is roughly right this time, give or take).
- **Route options:**
  - From downtown Crystal Lake / central CL: south on **Pingree Rd → west on Algonquin Rd → north on Lakewood Rd**.
  - From south Crystal Lake: **Crystal Lake Ave → Pyott Rd → Algonquin Rd → Lakewood Rd**.
  - **Route 176 is generally NORTH of HP** — it runs east-west through Crystal Lake/Wauconda, not the natural southwest connector to Lake in the Hills. Calling out Route 176 as the route from Crystal Lake to HP is geographically odd; you'd typically come south, not west on 176.

### Errors to fix

1. **Drive time is close enough** (10 min ≈ 11 min real). Keep, or tighten to "about 10 minutes."
2. **Route is wrong.** "West on Route 176" doesn't match how a Crystal Lake resident would actually drive. Real route is **south through Crystal Lake on Pingree (or Crystal Lake Ave / Pyott), then Algonquin Rd west, then Lakewood Rd**. Reframe so the access road named is **Lakewood Rd** (her brand routing rule).
3. **Distance not in copy.** Add "about 5 miles."
4. **Competitive shadow-throwing is heavier here than on Algonquin.** Phrases to strip on next draft: "corporate chains, multi-location groups, and high-volume clinics all vying for your business," "you are not imagining things, that is how volume-driven veterinary medicine works," "many high-volume practices ... often without a clear explanation," "Crystal Lake residents who have grown wary of upselling at corporate-backed clinics." Karen killed every line like this on Huntley. The Crystal Lake draft is the worst offender of the three on this dimension.
5. **Map embed** uses the same placeholder pattern as Algonquin — re-verify after the route correction.

### Suggested copy direction (for Karen to author)

- Open with: real distance + her preferred route. *Something like:* "About 10 minutes from [Crystal Lake landmark] via Pingree Rd south to Lakewood Rd. Personal, privately owned care for your dog or cat."
- Crystal Lake-specific anchor (Karen would name it — maybe Three Oaks Recreation Area, Lippold Park, Crystal Lake itself, or downtown CL).
- The four-township framing fits perfectly here: HP literally sits at the intersection of four townships including **The Village of Lakewood and Crystal Lake** (Karen's own line from Huntley). Crystal Lake page can lean on this hardest of the three.
- Four pillars: Peace · Time · Education · Follow Up.
- "Crystal Lake Happenings" closing with named local spots (Three Oaks, Main Beach, Veteran Acres, pet-friendly Crystal Lake patios, any annual Crystal Lake pet events).

---

## Summary table for the call

| Page | Current draft says | Reality | Brand routing fix |
|---|---|---|---|
| **Huntley** (Karen's FINAL, for reference) | We drafted "12 min via Route 47" | **3 min / 1.5 mi via Haligus to Ackman Rd from Sunset Park** | Lakewood approach, off Route 47 ✓ |
| **Algonquin** | 10 min via Randall Rd north | **~5 min / ~3 mi via Algonquin Rd west to Lakewood Rd** | Lakewood approach, off Randall ✓ |
| **Crystal Lake** | 10 min via Route 176 west | **~10 min / ~5 mi via Pingree Rd south to Algonquin Rd to Lakewood Rd** | Lakewood approach, off Route 176 ✓ |

---

## What I'd do with this

1. **Don't regenerate the pages yet.** The workflow agreement (drafts as scaffolding, Karen writes the body) is the call topic. Regenerating before the call pre-decides the answer.
2. **Bring the route corrections to the call as a tangible "here's what I caught."** It demonstrates that the draft-as-scaffolding workflow is actually higher-quality, because I'm catching geography errors before they ship — not because I'm trying to write her voice.
3. **After the call** (assuming workflow agreed): regenerate Algonquin and Crystal Lake drafts with corrected drive times, corrected routes (Lakewood approach), no competitor jabs, four-pillar structure, Happenings section placeholder for her to fill with local landmarks. Send to Karen for her edit pass.
4. **Flag for WhiskerCloud** (when timing is right, probably *after* the workflow conversation with Karen, not directly to WC): make sure the Algonquin and Crystal Lake pages that go live on June 9 don't ship with the wrong drive times. Cleanest path is for Karen to send them the corrected versions, same way she sent the Huntley FINAL.

---

## Open questions to resolve with Karen on the call

- Which Algonquin landmark does she want as the page's geographic anchor (her Huntley analogue to "Sunset Park")?
- Same for Crystal Lake.
- Which Algonquin / Crystal Lake pet-friendly patios + local events does she want named in the Happenings sections?
- Confirm which set of hours is current (her Huntley doc shows different hours than the demo's LocationLayout).
