# HPAH GA4 Findings + Lead Baseline

*Prepared 2026-05-28, first read of GA4 data after access was granted. Property `G-CH989J9R71`. Window: trailing 12 months, May 28 2025 → May 28 2026. This establishes the baseline every future growth claim is measured against.*

---

## Headline

HPAH's website generates **~57 new-patient lead actions per month**, with **phone calls as the #1 channel.** A much larger pile of form activity exists, but ~72% of it is existing-client admin (refills, records), not new patients. The site also pulls heavy traffic from national medication/condition blog content — high volume, wrong audience for local patient growth.

---

## Traffic (trailing 12 mo)

| Metric | 12 months | ~Per month |
|---|---|---|
| Total users | 35,688 | ~2,975 |
| Page views | 53,811 | ~4,485 |
| Total events | 169,503 | — |
| Avg engagement time | 33s | (low — see note) |

*Low engagement (33s) is consistent with drive-by informational traffic: people land on a medication page from Google, get their answer, and leave.*

## True new-patient lead flow (the baseline)

| Lead channel | 12 mo | ~/mo | Unique people |
|---|---|---|---|
| Click to Call | 260 | ~22 | 208 |
| Contact Form | 209 | ~17 | 166 |
| Initial Visit / appointment form | 178 | ~15 | 142 |
| Click to Email | 31 | ~3 | 29 |
| **Total new-patient lead actions** | **678** | **~57** | — |

- **Calls are the top channel** — expected for a local vet; phone is king.
- **Initial Visit form (~15/mo)** is the purest new-patient-intent signal (an actual appointment request).
- Lead-action rate ≈ 1.9% of visitors — modest, clear headroom.

## The form_submit decomposition (critical)

Generic `form_submit` = **1,467/yr**, but it lumps everything together:

| Bucket | ~Count | Share |
|---|---|---|
| Tagged new-patient forms (Contact 209 + Initial Visit 178) | 387 | ~26% |
| Career form (job applicants) | 23 | ~2% |
| **Untagged admin forms (refills, patient health, pet insurance)** | **~1,057** | **~72%** |

**Implication:** never use generic `form_submit` as the conversion metric — it overstates new-patient leads ~4x. Anyone reporting "1,467 leads/year" would be wrong; the real new-patient form number is ~387/yr (plus 260 calls).

## Full event list (trailing 12 mo, for reference)

| # | Event | Count | Users |
|---|---|---|---|
| 1 | page_view | 53,811 | 35,481 |
| 2 | session_start | 43,137 | 35,470 |
| 3 | first_visit | 34,844 | 35,362 |
| 4 | user_engagement | 28,122 | 18,569 |
| 5 | scroll | 5,371 | 3,739 |
| 6 | form_start | 1,771 | 1,152 |
| 7 | form_submit (generic, all forms) | 1,467 | 999 |
| 8 | Click To Call Tracking | 260 | 208 |
| 9 | click (generic link click) | 254 | 142 |
| 10 | Contact Form Submission | 209 | 166 |
| 11 | Initial Visit History Form Submission | 178 | 142 |
| 12 | Click To Email Tracking | 31 | 29 |
| 13 | Career Form Submission | 23 | 17 |
| 14 | file_download | 19 | 13 |
| 15 | Click To Download App (App Store) | 6 | 6 |

## Channel mix (Traffic acquisition, trailing 12 mo)

44,871 sessions total:

| Channel | Sessions | Share | Engagement rate |
|---|---|---|---|
| Organic Search | 29,728 | 66.3% | 49.8% |
| Direct | 12,917 | 28.8% | 25.6% |
| Referral | 549 | 1.2% | 48.1% |
| Organic Social | 418 | 0.9% | 28.5% |
| Email | 2 | ~0% | — |

- **HPAH lives on Google: 66% organic search** (mostly the medication blog). SEO is the engine — point it at local-intent content.
- **29% Direct** = people who already know HPAH (existing clients, branded), low engagement (25%, 25s) = quick admin visits (find phone, refill).
- **Social + email ≈ 0** — untapped, but not where local vet patients come from. Low priority.
- **No Paid Search** — not running Google Ads. All traffic is unpaid.

## Geography — the audience is mostly NOT local (Top cities by active users, ~12 mo)

| City | Active users | Read |
|---|---|---|
| (not set) | 4.7K | Unknown / privacy / bots |
| **Lanzhou, China** | 2.5K | Overseas — not patients (bot/scraper) |
| **Chicago** | 2.4K | Only plausibly-local entry (~7%) |
| **Singapore** | 1.9K | Overseas — not patients |
| New York | 735 | National blog reader |
| Ashburn, VA | 699 | Data-center / bot traffic |
| Dallas / LA / Atlanta / San Jose | ~2.1K | National blog readers |

**Striking:** more traffic comes from Lanzhou + Singapore + Ashburn (bots/overseas, ~5.1K) than from local Chicago (2.4K). HPAH's actual service-area towns (Lake in the Hills, Algonquin, Crystal Lake) don't crack the top 10 — rolled into "Chicago" or genuinely small.

**Implications:**
1. The 44K sessions / ~3K monthly visitors **massively overstate the real local audience** — it's bots + national medication-article readers. The genuine local prospective-patient pool is small.
2. **Good news:** a small, concentrated local pool is *more winnable* than 44K of diffuse intent. Don't be intimidated by the topline.
3. **Anchor on leads, not traffic.** The ~57 calls/forms a month are real, local, human signals; raw traffic is polluted. Karen's overview was adjusted to de-emphasize the visitor count and lead with leads.
4. **When standing up ongoing reporting, filter bot/non-local noise** so numbers reflect actual patients.

## Traffic-source insight (from the 2025 Engagement Overview)

Top pages by views are almost all national informational medication/condition posts: Prednisone (5.2K), Amoxicillin/Clavulanate (4.2K), Xylitol toxicity (2.6K), Apoquel (2.5K), Maropitant/Cerenia (1.9K). The local-intent pages — "Best Vet in Lake in the Hills" (6.9K, the top page), Fearful Friends, Practice Tour, Pet Adult Care — get far less. The 119-post blog is a traffic machine pulling the *wrong audience* for local new-patient growth, but it's a real domain-authority and AEO asset.

---

## What to do with this

1. **Set key events on the SPECIFIC lead events** — Click to Call, Contact Form, Initial Visit Form (optionally Email). **NOT** generic `form_submit` (72% admin noise). This makes the conversion dashboard true.
2. **Fix the property industry category** (off "Drugs & Medications").
3. **Grow the channels that matter:** calls + appointment requests. GBP drives calls; local SEO + location pages drive local-intent visitors; prominent call/book CTAs convert them.
4. **Harvest the blog, don't chase it:** add local CTAs + internal links from high-traffic medication pages down to service/location pages. Borrowed authority → local rankings.
5. **This baseline (~57 lead actions/mo, 22 calls / 17 contact / 15 appointment) is the number to beat** in the Month-3 growth report.

## Caveats

- Calls and contact forms include some existing clients; the Initial Visit form is the cleanest new-patient proxy.
- Trailing-12 figures partly reflect the Initial Visit form tracking coming online ~mid-2025, so its full-period count slightly understates current monthly rate.
- A 7-day view showed -28% users; that's noise — this 12-month baseline is the real read.
