#!/usr/bin/env python3
"""Scrape Yelp listings via Firecrawl to get business data for GBP audit."""

import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env", override=True)
load_dotenv(Path(__file__).resolve().parent.parent.parent.parent / ".env", override=True)

api_key = os.environ.get("FIRECRAWL_API_KEY")
if not api_key:
    print("ERROR: FIRECRAWL_API_KEY not found")
    sys.exit(1)

from firecrawl import Firecrawl
app = Firecrawl(api_key=api_key)

output_dir = Path(__file__).resolve().parent.parent / "brand_context" / "seo" / "scraped"
output_dir.mkdir(parents=True, exist_ok=True)

yelp_listings = {
    "healthy-paws": "https://www.yelp.com/biz/healthy-paws-animal-hospital-lake-in-the-hills",
    "cary-grove": "https://www.yelp.com/biz/cary-grove-animal-hospital-cary",
    "vca-woodstock": "https://www.yelp.com/biz/vca-woodstock-veterinary-clinic-woodstock",
    "dundee-algonquin": "https://www.yelp.com/biz/dundee-animal-hospital-algonquin-algonquin",
    "pet-vet": "https://www.yelp.com/biz/pet-vet-animal-clinic-and-mobile-practice-huntley",
}

target = sys.argv[1] if len(sys.argv) > 1 else "all"
if target != "all":
    if target not in yelp_listings:
        print(f"Unknown: {target}. Options: {', '.join(yelp_listings.keys())} or 'all'")
        sys.exit(1)
    to_scrape = {target: yelp_listings[target]}
else:
    to_scrape = yelp_listings

for key, url in to_scrape.items():
    print(f"\n{'='*60}")
    print(f"Scraping Yelp: {key}")
    print(f"URL: {url}")
    print(f"{'='*60}")

    try:
        doc = app.scrape(
            url=url,
            formats=["markdown"],
            only_main_content=True,
            wait_for=5000,
        )
        if doc and hasattr(doc, 'markdown') and doc.markdown:
            content = doc.markdown
            out_file = output_dir / f"yelp-{key}.md"
            out_file.write_text(content)
            print(f"Saved {len(content)} chars to {out_file}")

            # Quick summary of what we got
            lines = content.split('\n')
            for line in lines[:5]:
                if line.strip():
                    print(f"  {line.strip()[:100]}")
        else:
            print("No content returned")
    except Exception as e:
        print(f"ERROR: {e}")

print("\n\nDone. Files saved to brand_context/seo/scraped/")
