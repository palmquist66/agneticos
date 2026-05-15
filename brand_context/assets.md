## Last Updated
2026-04-28 — landing page rebrand: Navy + Orange palette, Proxima Nova typeface

# VetForge AI — Brand Assets

## Business Entity
- **LLC:** Palmquist Ventures LLC (Illinois)
- **Operating brand (DBA):** VetForge AI
- **Domain:** vetforgeai.com
- **Held domain:** jpdigitalworks.com (reserved for future use)

## Business Links
- **Website:** https://vetforgeai.com

## Personal Links
- **LinkedIn:** https://linkedin.com/in/jamespalmquist

## Social Handles
- **Target handle:** @vetforgeai (to claim across all platforms)
- **Platforms to claim:** LinkedIn, Twitter/X, Instagram, TikTok, Facebook, Threads, Bluesky, YouTube

## Logo

Custom illustrative wordmark featuring a stylized anvil with dog/cat silhouette and orange data spark accents, with "VetForge AI" typeset. Orange accents on decorative elements (dots, data bars). Two-color rendering: white on dark backgrounds, navy on light backgrounds.

**Wordmark variants:**
| File | Purpose | Size |
|------|---------|------|
| `logo-dark.svg` | Full logo on dark/navy backgrounds (white body + orange accents) | 1755x459 |
| `logo-light.svg` | Full logo on light backgrounds (navy #0B1D3A body + orange accents) | 1755x459 |

**Social profile images:**
| File | Purpose | Use on |
|------|---------|--------|
| `profile-navy.png` | Square icon on navy background | Most platforms (X, LinkedIn, Facebook, TikTok, YouTube) |
| `profile-white.png` | Square icon on white background | Light-themed platforms, Google Business Profile |
| `profile-circle-preview.png` | Circular crop preview | Reference — shows how the icon looks in circle-cropped contexts (Instagram, X) |

**Location:** Wordmark SVGs in `projects/briefs/vetforge-ai-launch/site/public/`. Social profile PNGs in `brand_context/`.

> **Note:** The old VF monogram (`logo-icon.svg`, `favicon.svg`) used a legacy blue gradient and is retired. The current brand mark is the anvil + animal silhouette icon shown in the social profile images above.

## Colors

### Primary — Navy scale
| Token | Hex | Usage |
|-------|-----|-------|
| `--navy-900` | #0B103A | Primary brand — trust, stability, confidence |
| `--navy-800` | #10264A | Hover surfaces, navigation, elevated states |
| `--navy-700` | #1A3763 | Interactive states, active elements |

### Accent — Orange scale (action)
| Token | Hex | Usage |
|-------|-----|-------|
| `--orange-500` | #F97316 | Primary accent — energy, innovation, CTAs |
| `--orange-400` | #FB623C | Hover accent, highlights |
| `--orange-300` | #FDBA74 | Subtle accents, badges, emphasis |

### Neutrals — Gray scale
| Token | Hex | Usage |
|-------|-----|-------|
| `--gray-100` | #F5F6F8 | Page background, subtle surfaces |
| `--gray-300` | #D1D5DB | Borders, dividers, disabled states |
| `--gray-500` | #6B7280 | Secondary text, icons, placeholders |
| `--white` | #FFFFFF | Cards, surfaces, clean backgrounds |

### Status colors (used sparingly)
| Token | Hex |
|-------|-----|
| `--status-active` | #16A34A |
| `--status-warning` | #EAB308 |
| `--status-error` | #DC2626 |
| `--status-info` | #0EA5E9 |

### Semantic mapping
- **fg-1 (headings):** Navy 900
- **fg-2 (body):** #1F2937
- **fg-3 (secondary):** Gray 500
- **fg-on-navy:** White
- **fg-accent:** Orange 500
- **bg-1 (page):** White (light theme is canonical)
- **bg-2 (nested):** Gray 100
- **bg-3 (dark surfaces):** Navy 900
- **Focus ring:** `0 0 0 3px rgba(249, 115, 22, 0.30)` (orange glow)

## Fonts
- **Primary:** Proxima Nova (weights 400, 500, 600, 700) — licensed via Adobe Fonts
- **Fallback:** Montserrat (Google Fonts) — geometric humanist substitute at matching weights
- **Stack:** `"Proxima Nova", "Montserrat", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`

### Type scale
| Level | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| H1 | 56px | 64px | 700 (Bold) | -0.025em |
| H2 | 40px | 48px | 700 (Bold) | -0.015em |
| H3 | 28px | 36px | 600 (Semibold) | -0.015em |
| Body | 16px | 24px | 400 (Regular) | 0 |
| Small | 14px | 20px | 400 (Regular) | 0 |
| Eyebrow | 12px | — | 600 (Semibold) | 0.14em, uppercase |

## Design Tokens

### Spacing (4px base)
`4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128`

### Border Radii
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | — |
| `--radius-md` | 8px | — |
| `--radius-lg` | 12px | Buttons |
| `--radius-xl` | 16px | — |
| `--radius-2xl` | 20px | Cards |
| `--radius-pill` | 999px | Pills, tags |

### Elevation
| Level | Shadow | Usage |
|-------|--------|-------|
| 1 | `0 1px 2px rgba(0,0,0,0.08)` | Buttons |
| 2 | `0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(11,16,58,0.06)` | Cards |
| 3 | `0 1px 2px rgba(0,0,0,0.06), 0 12px 32px rgba(11,16,58,0.10)` | Modals |

### Motion
| Token | Value |
|-------|-------|
| `--ease` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `--dur-fast` | 120ms |
| `--dur` | 150ms (buttons) |
| `--dur-slow` | 300ms |

### Layout
- **Max content width:** 1200px
- **Max prose width:** 720px

## Brand Traits
- Light theme is canonical (Navy on white), with dark Navy surfaces for hero/footer
- Navy + Orange as the signature palette — no blue gradient on new pages
- Tight negative letter-spacing on headings for a premium feel
- Restrained elevation — never neon, never heavy
- Rounded corners throughout (12px buttons, 20px cards)
- The "forge" metaphor should carry through visual identity: craftsmanship, precision, built by hand

## Landing Page Design Source
- **Source file:** `/Users/jamespalmquist/Downloads/Landing Page-2.zip`
- **Contents:** 2 HTML pages, 4 SVG assets, `colors_and_type.css` (design tokens), `tweaks-panel.jsx`, 3 hero image iterations (`scraps/`), 4 uploaded reference images (`uploads/`)

## Notes
- jpdigitalworks.com is owned and held for potential future use (non-vet brand)
- Previous typefaces (Playfair Display, Source Sans Pro, Inter) are retired — Proxima Nova is the new typeface
- Proxima Nova requires Adobe Fonts license for production; Montserrat is the free fallback
- Old VF monogram (`logo-icon.svg`, `favicon.svg`) is retired — replaced by anvil + animal mark in social profile images
