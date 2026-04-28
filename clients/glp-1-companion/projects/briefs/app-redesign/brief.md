---
project: app-redesign
status: active
level: 2
created: 2026-04-21
---

# GLP-1 Companion — App Redesign

## Goal

Restructure and clean up the GLP-1 Companion app so data loading/syncing is the hero experience, pages have clear purpose, and every screen earns its place.

## Problem

The app has the right features but the layout is all over the place:
- 6 tabs in a flat hierarchy with no clear priority
- Data sync options (Google Fit, Dexcom CSV) are buried inside the Health tab alongside manual logging
- The Dashboard tries to do too much (metrics + patterns + export + activity feed)
- Food logging has 3 input paths (photo/text/manual) that compete for attention instead of being a clear flow
- Medication management mixes daily check-in, scheduling, and GLP-1 cycle tracking in one tab
- No guided onboarding — new users land on a login page with no context on what to connect

## Core Principle

**Data in = value out.** The easier it is to get health data into the app, the better the patterns, the more useful the doctor export, the stickier the product. Every design decision should reduce friction for data entry and sync.

## Scope

**Restructure + clean up** — keep all existing features but:
- Reorganize page hierarchy around user intent
- Simplify flows (fewer taps to log, fewer decisions per screen)
- Make data sync/import the front-and-center experience
- Clean up visual clutter and competing CTAs
- Evaluate whether Streamlit is the right platform or if we should migrate

## Deliverables

- [ ] **Platform evaluation** — Stay on Streamlit vs. migrate to React Native or Next.js. Pros/cons with recommendation.
- [ ] **Information architecture** — New page/screen structure with clear hierarchy. What goes where and why.
- [ ] **User flow diagrams** — The 4-5 core journeys mapped out (onboarding, daily logging, data sync, pattern review, doctor export)
- [ ] **Screen-by-screen redesign specs** — For each screen: purpose, content, interactions, what got removed/moved
- [x] **Onboarding flow** — Guided setup that walks new users through connecting data sources
- [x] **Data sync hub** — Central place to manage all data connections (Google Fit, Dexcom, Apple Health, manual)
- [ ] **Implementation plan** — Phased execution order so the app stays functional throughout the rebuild

## Acceptance Criteria

- A new user can connect their first data source within 2 minutes of signup
- Daily logging takes fewer taps than current design
- Every screen has one clear primary action
- Pattern insights are visible from the main view (not hidden behind a tab)
- Doctor export is accessible in 2 taps or fewer
- No feature regression — everything that works today still works after redesign

## Constraints

- Current database schema is solid — keep it
- Brand positioning ("The Pattern Layer") stays — redesign should reinforce it
- AI features (photo food logging, chat, pattern engine) are differentiators — make them more prominent, not less
- Must work on mobile (whether Streamlit responsive, PWA, or native app)

## Open Questions

1. Is Streamlit holding us back, or is the problem purely information architecture?
2. Should we support Apple Health in addition to Google Fit?
3. Is there a way to auto-sync (background) instead of user-initiated pull?
4. Should the AI chat be a standalone screen or contextual (appears where relevant)?
