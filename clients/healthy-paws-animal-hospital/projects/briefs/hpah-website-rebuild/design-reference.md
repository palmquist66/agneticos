# HPAH Current Website Design Reference

Scraped from healthypawsanimalhospital.com (WordPress + Divi) on 2026-05-22.
Use this as the source of truth when building the Astro replica.

---

## Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Green | `#478033` | Borders on service cards, toggle accents, alert bars, button accents |
| Secondary Green | `#99B43A` | Text section borders, accent elements |
| Light Gray | `#DEDEE9` | Card borders, box shadows, section dividers |
| White | `#ffffff` | Backgrounds, text on dark overlays |
| Dark Text | `#262626` | Body text |
| Black | `#000000` | Body text alternate |
| Overlay Dark | `rgba(0,0,0,0.4)` | Hero section overlays (desktop) |
| Overlay Darker | `rgba(0,0,0,0.55)` | Homepage slider overlay |
| Overlay Mobile | `rgba(0,0,0,0.6)` | Hero overlays on mobile |
| Staff BG Tint | `rgba(71,128,51,0.04)` | Staff section background (very faint green) |
| Toggle BG | `#f8f8f8` | FAQ toggle background |
| Green Highlight | `rgba(72,170,67,0.16)` | Commitment section background |

### Typography

| Element | Font | Weight | Notes |
|---------|------|--------|-------|
| Body | PT Sans | 400 | Google Fonts, `font-display: swap` |
| Bold/Headings | PT Sans | 700 | |
| Accent/Subheadings | PT Sans Narrow | 700 | Used for emphasis/labels |

### Borders & Shadows

| Pattern | CSS |
|---------|-----|
| Card border | `2px solid #DEDEE9` |
| Card radius | `border-radius: 0 0 30px 30px` (bottom corners only) |
| Card shadow | `box-shadow: 20px 20px 0 #dedee9` |
| Service card border | `3px solid #478033` with `30px` radius |
| Service card shadow | `box-shadow: 20px 20px 0 #dedee9` |
| Section divider | `border-bottom: 1px solid #DEDEE9` |

### Buttons

- Primary CTA: Green accent, centered, links to contact or service pages
- "Learn More" style: Appears on service cards and content sections
- "Contact Us" / "Get Started": Main CTAs in hero sections
- Disabled on tablet/mobile in some hero sections

### Responsive Breakpoints

| Device | Max Width | Notes |
|--------|-----------|-------|
| Desktop | Default | Full grid layouts |
| Tablet | 1024px | 80-90% width, stacked columns |
| Mobile | 767px | Single column, 90% width |
| Small | 479px | Adjusted padding/font |

---

## Page Templates

### Hero Banner (used on every page)

```
Full-width section
  Background: Featured image + dark overlay (rgba 0,0,0,0.3-0.55)
  Padding: 220px top/bottom desktop, 120px left/right
  Tablet: 80px top/bottom
  Mobile: 60px top/bottom
  Text: White, centered
  Content:
    - H1 heading
    - Subheading paragraph
    - Optional CTA button ("Contact Us" -> /contact/)
```

### Service Page Template (Puppy/Kitten Care as reference)

```
Section 1: Hero Banner (standard pattern above)

Section 2: Main Content (2-column)
  Left column (2/5): Featured image
    - Border: 3px solid #478033
    - Radius: 30px
    - Shadow: 20px 20px #dedee9
  Right column (3/5): Content + FAQ toggles
    - Opening paragraph
    - Toggle items (accordion-style FAQ)
      - Background: #f8f8f8
      - Border accent: #478033
      - 10 FAQ items typical

  Mobile: Stacks vertically, 90% width
```

### Content Page Template (Why Choose Us, About)

```
Section 1: Hero Banner

Section 2+: Alternating Image/Text Blocks
  Pattern: 1/3 image + 2/3 text
  Alternates: Image left / Image right
  Image styling:
    - Border: 2px solid #DEDEE9
    - Radius: 0 0 30px 30px (bottom corners)
    - Shadow: 20px 20px 0 #dedee9
  Text side:
    - H2 heading
    - Body paragraph
    - "Learn More" button
  Divider: #DEDEE9 line between sections
```

### Services Index Page

```
Section 1: Hero Banner

Section 2+: Service Cards (8 total)
  Layout per card: 2/5 image + 3/5 text
  Card styling:
    - Border: 3px #478033 (green)
    - Radius: 30px
    - Shadow: 20px 20px #DEDEE9
  Content per card:
    - Service image
    - H3 heading (service name)
    - Description paragraph
    - "Learn More" button -> service page
  Desktop: Side-by-side
  Mobile: Stacked, 90% width, center-aligned
  Divider: 20px padding between cards
```

---

## Page-by-Page Content

### Homepage

**Slider (3 slides, 8s auto-rotate):**
1. "Proud to be Privately Owned" — person with two dogs background
2. "Come Experience Veterinary Medicine in a Whole New Way" — book appointment image
3. "Healthy Paws Animal Hospital" — hospital exterior
- All slides: CTA button -> /lake-in-the-hills-il-veterinary-appointment/

**Alert Bars (green #478033 background):**
- Dynamic alerts (holiday closures, policy notices)

**Services Section (3-column grid):**
- General Care (with icon)
- Senior Care (with icon)
- End of Life Care (with icon)

**Commitment Section (4-column grid, rgba(72,170,67,0.16) background):**
1. "Transparency...Clear and Kind"
2. "Your Pet's Experience...Your Experience"
3. "Our Team...Our Secret Sauce"
4. "Education...Where Trust Begins"

**Testimonials Carousel:**
- 5 customer reviews
- Star rating display
- Background gradient overlay
- "Read More Reviews" button -> Google Business profile

### About Page (slug: about-healthy-paws-animal-hospital)

**Hero:** "About Healthy Paws Animal Hospital"
Subheading: "Exceptional veterinary care in Lake in the Hills..."

**About Us Section (full width):**
- Describes full-service practice
- Lists services: wellness exams, senior care, behavioral, nutrition, surgery, spay/neuter, pain mgmt, euthanasia, dental radiography, teeth cleaning
- Vaccination approach: "one size does not fit all"

**Facilities Section (2-column: image left, text right):**
- Image: dog with stethoscope (`1-1.jpg`)
- Features: onsite lab, isolation ward, surgery suite, pharmacy, in-room checkout, floor-to-ceiling exam windows, paperless records
- Location details

**Mission Section (gray #DEDEE9 background):**
"Healthy Paws provides medically advanced, comprehensive, and compassionate veterinary care in a timely and honest manner while promoting overall animal health and awareness"

### Services Page (slug: lake-in-the-hills-il-veterinary-services)

**8 Service Cards:**

| # | Service | Image | Link |
|---|---------|-------|------|
| 1 | Puppy and Kitten Care | puppy-care.png | /general-care-lake-in-the-hills-il/#puppy |
| 2 | Adult Care | adult-care.png (Gnocchi the cat) | /pet-adult-care-in-the-hills-il/ |
| 3 | Senior Care | senior-care.png (Heather with small dog) | /pet-senior-care-lake-in-the-hills-il/ |
| 4 | Fearful Friends | fearful-friends.png (Deuce the Great Dane) | /fearful-friends-lake-in-the-hills-il/ |
| 5 | End of Life Care | madalyn-cox-IVgU_fyQ7Kg-unsplash-1-scaled.jpg | /end-of-life-care-lake-in-the-hills-il/ |
| 6 | Pet Dentistry | Dentistry-2.png | /pet-dentistry-lake-in-the-hills-il/ |
| 7 | Pet Surgery | Surgery.jpg | /pet-surgery-lake-in-the-hills-il/ |
| 8 | Spay & Neuter | spay-3.png (Dog with tennis ball) | /pet-spay-and-neuter-lake-in-the-hills-il/ |

### Meet the Team (slug: veterinarian-lake-in-the-hills-il)

**Hero:** "Meet Our Veterinary Team"

**Veterinarians (4-column grid, white cards with border/shadow):**
1. Dr. Karen Burgess — Head Veterinarian — Dr.-Burgess2.jpg
2. Dr. Tracey Haslitt — Associate Veterinarian — Dr.-Haslitt.png
3. Dr. Megan Mosier — Associate Veterinarian — Dr.-Mosier.jpg

**Staff Section (rgba(71,128,51,0.04) green tint background):**

*Certified Veterinary Technicians:*
- Brooke Burger (Brooke.jpg)
- Cheri Eckdhal (Cheri-1.jpg)
- Amanda Schwarz (Amanda-Schwarz-1.jpg)
- Heather Sullivan (Heather-8.png)
- Liz Hartzheim (Liz-Hartzheim.jpg) — bio disabled
- Eryn Czarnik (Eryn.jpg)

*Veterinary Assistants:*
- Sarah Prigge (Sarah-Prigge.jpg)
- Anastasiia Gusarova (Anastasiia-Gusarova.jpg)

*Care Coordinators:*
- Kadee Palmquist (Kadee-Palmquist.jpg)
- Carol Pietsch (Carol-1.jpg)
- Brenda Czarnecki (Brenda-1.jpg)
- Kristen Koske (Kristen-1.jpg)
- Anna Zipparro (ANNA.jpg)

*Administration:*
- Jean-Marie Brickey — Accountant (Jean-Marie-1.jpg)
- John Ferrero — Practice Manager (John-1-1.jpg)

**Clinic Cats:**
- Gus Gus (orange longhaired) — Gus.jpg
- Eleanor (gray shorthaired) — Eleanor-cat.jpg
- Group photo: hugging-1-1.jpg

**Bio Modals:** Each team member has "Read Bio" link that opens a modal with:
- Extended bio text
- Personal photos carousel (3-4 photos per person)
- Dr. Burgess quote about the team member

### Why Choose Us

**6 alternating image/text sections:**
1. Transparency — 1.jpg (cat with green eyes)
2. Your Pet's Experience — 3.jpg (dog on hind legs)
3. Our Team — 2.jpg (two cats on ledge)
4. Education — 4.jpg (dog with tongue out)
5. Schedule — Dog-img.jpg (dog on grass)
6. Origin & Mission — cat-img.jpg (cat lying)

### Your First Visit

**Hero image:** 7-YOUR-FIRST-VISIT-Gus-El-2.jpg

**Preparation Checklist (4 numbered items):**
1. Gather documentation (adoption records, medical history, medications, feeding schedule, questions)
2. Collect biological samples if required
3. Ready transport (leash for dogs; carrier for cats)
4. Bring treats; follow fasting instructions if given

**CTA:** "Initial Visit History Form" button

### Hospital Tour

**Hero:** "Take a Tour"
**Content:** Masonry gallery layout with 10 facility photos
**Message:** "Take a tour online or in person. We have an open-door policy."

### Our App

**Hero:** "Our App"
**Content:** PetPage by AllyDVM app description
**Features:** Update info, request refills/appointments 24/7, pet ID, notifications
**Downloads:**
- App Store: iOS app ID 6443568264
- Google Play: com.allydvm.ast
**Images:** our-app-header.png, our-app-image.png, store badges

### Contact

**Hero image:** Person petting a cat
**Heading:** "Contact Healthy Paws Animal Hospital"
**Alert:** Holiday closure notice (green bar)
**Mission:** "We Proudly Serve the Pets of Lake in the Hills, IL, and Beyond"
**Form:** Contact form (fields not in API — likely Divi contact module)

---

## WordPress Slug -> Astro Route Mapping

| WP Slug | WP Title | Astro Route |
|---------|----------|-------------|
| home | Home | / |
| about-healthy-paws-animal-hospital | About | /about |
| lake-in-the-hills-il-veterinary-services | Services | /services |
| veterinarian-lake-in-the-hills-il | Team | /meet-the-team |
| why-choose-us | Why Choose Us | /why-choose-us |
| your-first-visit | Your First Visit | /your-first-visit |
| healthy-paws-animal-hospital-tour | Tour | /hospital-tour |
| our-app | Our App | /our-app |
| contact | Contact | /contact |
| schedule | Schedule | /schedule |
| veterinarian-lake-in-the-hills-il-reviews | Reviews | /reviews |
| lake-in-the-hills-il-veterinary-jobs | Careers | /careers |
| lake-in-the-hills-il-veterinary-appointment | Appointment | /schedule |
| general-care-lake-in-the-hills-il | Puppy & Kitten Care | /puppy-kitten-care (or service page) |
| pet-adult-care-in-the-hills-il | Adult Care | /adult-care (service page) |
| pet-senior-care-lake-in-the-hills-il | Senior Care | /senior-pet-care-lake-in-the-hills-il |
| fearful-friends-lake-in-the-hills-il | Fearful Friends | /low-stress-vet-lake-in-the-hills-il |
| end-of-life-care-lake-in-the-hills-il | End of Life Care | /end-of-life-care |
| pet-dentistry-lake-in-the-hills-il | Pet Dentistry | /dental-care |
| pet-surgery-lake-in-the-hills-il | Pet Surgery | /surgery |
| pet-spay-and-neuter-lake-in-the-hills-il | Spay & Neuter | /spay-neuter-lake-in-the-hills-il |
| prescription-refills | Prescription Refills | /prescription-refills |
| specialty-emergency-partners | Specialty Partners | /specialty-partners |
| local-pet-services | Local Pet Services | /local-pet-services |
| info-center | Info Center | /info-center |
| policies | Policies | /policies |
| privacy-policy | Privacy Policy | /privacy-policy |
| accessibility-statement | Accessibility | /accessibility |
| transparency | Transparency | /transparency-and-pricing |
| education | Education | /info-center |
| pricing-transparency | Pricing Transparency | /transparency-and-pricing |
| pricing-transparency-canine | Canine Pricing | (subpage) |
| pricing-transparency-feline | Feline Pricing | (subpage) |
| alerts | Alerts | /alerts |
| patient-health-form | Health Form | /forms |
| resources | Resources | /info-center |
| healthy-paws-animal-hospital-payment-options | Payment Options | (subpage) |

---

## Image Assets

212 images downloaded to `site/src/assets/images/wp-import/`
Manifest: `wp-import/_manifest.json` (maps each image to WP ID, title, alt text, original URL)

### Key Image Categories

| Category | Example Files | Usage |
|----------|--------------|-------|
| Team headshots | Dr.-Burgess2.jpg, Brooke.jpg, etc. | Team page cards |
| Team personal | *-family.jpeg, *-travel.jpeg | Bio modal carousels |
| Facility | Lobby-Room.jpg, Exam-Room.jpg, SurgerySuite.jpg | Tour page, about page |
| Service heroes | puppy-care.png, senior-care.png, fearful-friends.png | Service page headers |
| Clinic cats | Gus.jpg, Eleanor-cat.jpg, hugging-1-1.jpg | Team page, throughout |
| Homepage | a-person-with-two-dogs.jpg, book-app-image.jpg | Hero slider |
| Brand | Healthy-Paws-Animal-Hospital-logo-1-2.png, favicon.png | Header, meta |
| Blog | various | Blog posts |
| Icons | General-Care.png, Senior-Care.png | Services grid |
