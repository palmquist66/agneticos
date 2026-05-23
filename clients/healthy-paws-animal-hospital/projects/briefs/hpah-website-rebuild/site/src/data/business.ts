// ============================================================
// VERIFICATION STATUS
// ============================================================
// Fields marked VERIFIED have been confirmed from GBP, WP API,
// or Karen directly. Fields marked NEEDS KAREN are placeholders
// or pulled from the current site without confirmation.
//
// DO NOT ship any page that displays NEEDS KAREN data without
// getting sign-off first.
// ============================================================

export const business = {
  name: 'Healthy Paws Animal Hospital',                  // VERIFIED (GBP)
  legalName: 'Healthy Paws Animal Hospital',             // VERIFIED (GBP)
  phone: '(815) 322-5400',                               // VERIFIED (GBP)
  phoneRaw: '+18153225400',                              // VERIFIED (GBP)
  fax: '815-322-5401',                                   // VERIFIED (live site footer)
  email: 'service@hpah.org',                             // VERIFIED (website)
  website: 'https://healthypawsanimalhospital.com',      // VERIFIED
  address: {                                             // VERIFIED (GBP)
    street: '4581 Princeton Ln #101',
    city: 'Lake in the Hills',
    state: 'IL',
    zip: '60156',
    full: '4581 Princeton Ln #101, Lake in the Hills, IL 60156',
    note: '(On Lakewood at Ackman)',                     // VERIFIED (live site footer)
  },
  geo: {                                                 // VERIFIED (GBP)
    latitude: 42.2025351,
    longitude: -88.3828499,
  },
  founded: '',                                           // NEEDS KAREN — not found on website
  tagline: 'Personal. Professional. Educational.',       // VERIFIED (website header + about page)
  hours: {                                               // CONFIRMED 2026-05-23 — matches live site footer (supersedes prior screenshot values).
    monday: '7:00 AM - 6:00 PM',
    tuesday: '7:00 AM - 6:00 PM',
    wednesday: '8:00 AM - 6:00 PM',
    thursday: '10:00 AM - 6:00 PM',
    friday: '7:00 AM - 5:00 PM',
    saturday: 'Closed',
    sunday: 'Closed',
  },
  hoursSchema: [                                         // derived from live-site hours
    'Mo,Tu 07:00-18:00',
    'We 08:00-18:00',
    'Th 10:00-18:00',
    'Fr 07:00-17:00',
  ],
  social: {                                              // VERIFIED
    facebook: 'https://www.facebook.com/healthypawsanimalhospital/',
    yelp: 'https://www.yelp.com/biz/healthy-paws-animal-hospital-lake-in-the-hills',
    google: 'https://share.google/NdX8yGH4TWkqxM3Db',
  },
  serviceAreas: [                                        // VERIFIED (GBP)
    'Lake in the Hills',
    'Algonquin',
    'Huntley',
    'Crystal Lake',
    'Cary',
    'Village of Lakewood',
  ],
  logo: 'https://healthypawsanimalhospital.com/wp-content/uploads/2024/01/Healthy-Paws-Animal-Hospital-logo-1-2.png',
  certifications: [],
  attributes: ['Privately owned'],                        // VERIFIED (website header: "Proud to be Privately Owned"). Women-owned removed — not on site, needs Karen to confirm before adding back.
} as const;

// VERIFIED — full team roster scraped from live website team page
// Bio details (education, personal info) still NEED KAREN — Divi
// blocks individual bio page content from being read.
export const team = {
  vets: [
    {
      name: 'Dr. Karen Burgess',                         // VERIFIED (website)
      fullName: 'Dr. Karen Burgess, DVM',
      role: 'Head Veterinarian',                         // VERIFIED (website — "Head Veterinarian", not "Owner & Lead")
      education: '',                                     // NEEDS KAREN — bio page blocked by Divi
      photo: 'Dr.-Burgess2.jpg',
      slug: 'dr-burgess',
    },
    {
      name: 'Dr. Tracey Haslitt',                        // VERIFIED (website)
      fullName: 'Dr. Tracey Haslitt, DVM',
      role: 'Associate Veterinarian',                    // VERIFIED (website)
      education: '',
      photo: 'Dr.-Haslitt.png',
      slug: 'dr-haslitt',
    },
    {
      name: 'Dr. Megan Mosier',                          // VERIFIED (website)
      fullName: 'Dr. Megan Mosier, DVM',
      role: 'Associate Veterinarian',                    // VERIFIED (website)
      education: '',
      photo: 'Dr.-Mosier.jpg',
      slug: 'dr-mosier',
    },
  ],
  staff: [
    { name: 'Brooke Burger', role: 'Certified Veterinary Technician', photo: 'Brooke.jpg' },
    { name: 'Cheri Eckdhal', role: 'Certified Veterinary Technician', photo: 'Cheri-1.jpg' },
    { name: 'Amanda Schwarz', role: 'Certified Veterinary Technician', photo: 'Amanda-Schwarz-1.jpg' },
    { name: 'Heather Sullivan', role: 'Certified Veterinary Technician', photo: 'Heather-8.png' },
    { name: 'Liz Hartzheim', role: 'Certified Veterinary Technician', photo: 'Liz-Hartzheim.jpg' },
    { name: 'Eryn Czarnik', role: 'Certified Veterinary Technician', photo: 'Eryn.jpg' },
    { name: 'Sarah Prigge', role: 'Veterinary Assistant', photo: 'Sarah-Prigge.jpg' },
    { name: 'Anastasiia Gusarova', role: 'Veterinary Assistant', photo: 'Anastasiia-Gusarova.jpg' },
    { name: 'Kadee Palmquist', role: 'Care Coordinator', photo: 'Kadee-Palmquist.jpg' },
    { name: 'Carol Pietsch', role: 'Care Coordinator', photo: 'Carol-1.jpg' },
    { name: 'Brenda Czarnecki', role: 'Care Coordinator', photo: 'Brenda-1.jpg' },
    { name: 'Kristen Koske', role: 'Care Coordinator', photo: 'Kristen-1.jpg' },
    { name: 'Anna Zipparro', role: 'Care Coordinator', photo: 'ANNA.jpg' },
    { name: 'Jean-Marie Brickey', role: 'Accountant', photo: 'Jean-Marie-1.jpg' },
    { name: 'John Ferrero', role: 'Practice Manager', photo: 'John-1-1.jpg' },
  ],                                                     // ALL VERIFIED (website team page)
  clinicCats: [
    { name: 'Gus Gus', photo: 'Gus.jpg' },
    { name: 'Eleanor', photo: 'Eleanor-cat.jpg' },
  ],                                                     // VERIFIED (website)
} as const;

export const services = [
  { name: 'Puppy & Kitten Care', slug: 'general-care-lake-in-the-hills-il', icon: '🐶', description: 'Vaccinations, parasite control, nutrition counseling, and behavioral guidance for new puppies and kittens.' },
  { name: 'Wellness Exams', slug: 'wellness-exams-lake-in-the-hills-il', icon: '🩺', description: 'Comprehensive annual and semi-annual wellness examinations for dogs and cats.' },
  { name: 'Vaccinations', slug: 'pet-vaccinations-lake-in-the-hills-il', icon: '💉', description: 'Customized vaccination protocols tailored to your pet\'s lifestyle and risk factors.' },
  { name: 'Dental Care', slug: 'dental-care', icon: '🦷', description: 'Digital dental radiography, teeth cleaning, and oral surgery.' },
  { name: 'Surgery', slug: 'surgery', icon: '🏥', description: 'General and emergency surgical services in our modern surgery suite.' },
  { name: 'Spay & Neuter', slug: 'spay-neuter-lake-in-the-hills-il', icon: '✂️', description: 'Safe, compassionate spay and neuter procedures with personalized aftercare.' },
  { name: 'Senior Pet Care', slug: 'senior-pet-care-lake-in-the-hills-il', icon: '🐾', description: 'Specialized care for aging pets including early disease detection and pain management.' },
  { name: 'Low-Stress Care', slug: 'low-stress-vet-lake-in-the-hills-il', icon: '💚', description: 'Gentle, low-stress approach that reduces anxiety during veterinary visits.' },
  { name: 'Cat Veterinarian', slug: 'cat-vet-lake-in-the-hills-il', icon: '🐱', description: 'Specialized feline care from a team that understands cats\' unique needs.' },
  { name: 'Pet Allergies', slug: 'pet-allergy-treatment-lake-in-the-hills-il', icon: '🌿', description: 'Diagnosis and treatment of skin conditions, food allergies, and environmental allergies.' },
  { name: 'Emergency & Urgent Care', slug: 'emergency-urgent-care', icon: '🚨', description: 'Same-day urgent care for acute illness and injuries during business hours.' },
  { name: 'Nutrition Counseling', slug: 'nutrition-counseling', icon: '🥗', description: 'Expert dietary guidance tailored to your pet\'s age, breed, and health needs.' },
  { name: 'Pain Management', slug: 'pain-management', icon: '💊', description: 'Multimodal pain management to keep your pet comfortable and active.' },
  { name: 'Behavioral Health', slug: 'behavioral-health', icon: '🧠', description: 'Behavioral assessments and recommendations to improve your pet\'s quality of life.' },
  { name: 'End of Life Care', slug: 'end-of-life-care', icon: '🕊️', description: 'Compassionate euthanasia and end-of-life support for you and your pet.' },
  { name: 'Microchipping', slug: 'microchipping', icon: '📡', description: 'Permanent identification to help reunite you with your pet if they\'re ever lost.' },
  { name: 'Laboratory & Diagnostics', slug: 'laboratory-diagnostics', icon: '🔬', description: 'In-house laboratory for fast, accurate diagnostic results.' },
] as const;
