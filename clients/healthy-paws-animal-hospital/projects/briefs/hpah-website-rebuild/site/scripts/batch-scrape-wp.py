#!/usr/bin/env python3
"""Batch scrape HPAH WordPress pages via Firecrawl for content migration."""

import os
import json
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
env_path = Path(__file__).resolve().parents[5] / ".env"
load_dotenv(env_path)

api_key = os.getenv("FIRECRAWL_API_KEY")
if not api_key:
    print("ERROR: FIRECRAWL_API_KEY not found in .env")
    sys.exit(1)

from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key=api_key)

BASE_URL = "https://healthypawsanimalhospital.com"

# WP slug -> Astro page mapping
PAGES = {
    # General pages
    "about-healthy-paws-animal-hospital": "about",
    "lake-in-the-hills-il-veterinary-services": "services",
    "veterinarian-lake-in-the-hills-il": "meet-the-team",
    "lake-in-the-hills-il-veterinary-jobs": "careers",
    "transparency": "transparency-and-pricing",
    "contact": "contact",
    "prescription-refills": "prescription-refills",
    "specialty-emergency-partners": "specialty-partners",
    "local-pet-services": "local-pet-services",
    "info-center": "info-center",
    "patient-health-form": "forms",
    # Try these (may or may not exist as standalone pages)
    "your-pets-experience": "your-pets-experience",
    "areas-we-serve": "areas-we-serve",
    # Service pages
    "pet-dentistry-lake-in-the-hills-il": "dental-care",
    "pet-surgery-lake-in-the-hills-il": "surgery",
    "pet-spay-and-neuter-lake-in-the-hills-il": "spay-neuter",
    "pet-senior-care-lake-in-the-hills-il": "senior-pet-care",
    "fearful-friends-lake-in-the-hills-il": "low-stress-vet",
}

output_dir = Path(__file__).parent / "scraped-content"
output_dir.mkdir(exist_ok=True)

results = {}
failed = []

print(f"Scraping {len(PAGES)} pages from {BASE_URL}...")
print("-" * 60)

for wp_slug, astro_name in PAGES.items():
    url = f"{BASE_URL}/{wp_slug}/"
    print(f"  Scraping: {url} -> {astro_name}.md")
    try:
        result = app.scrape(url, formats=["markdown"])
        md = result.markdown if result and result.markdown else None
        if md:
            out_file = output_dir / f"{astro_name}.md"
            out_file.write_text(md, encoding="utf-8")
            results[astro_name] = {
                "wp_slug": wp_slug,
                "url": url,
                "chars": len(md),
                "lines": md.count("\n"),
            }
            print(f"    OK ({len(md)} chars)")
        else:
            failed.append({"slug": wp_slug, "astro": astro_name, "reason": "empty response"})
            print(f"    EMPTY - no markdown returned")
    except Exception as e:
        failed.append({"slug": wp_slug, "astro": astro_name, "reason": str(e)})
        print(f"    FAILED: {e}")

print("-" * 60)
print(f"\nResults: {len(results)} succeeded, {len(failed)} failed")

if failed:
    print("\nFailed pages:")
    for f in failed:
        print(f"  - {f['slug']} ({f['astro']}): {f['reason']}")

# Save manifest
manifest = {"succeeded": results, "failed": failed}
(output_dir / "_manifest.json").write_text(json.dumps(manifest, indent=2))
print(f"\nManifest saved to {output_dir / '_manifest.json'}")
