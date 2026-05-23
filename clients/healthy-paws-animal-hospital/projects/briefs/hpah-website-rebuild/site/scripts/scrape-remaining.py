#!/usr/bin/env python3
import os, json, sys
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
BASE = "https://healthypawsanimalhospital.com"

# astro_name -> list of candidate WP slugs (first that returns content wins)
PAGES = {
    "index": [""],
    "why-choose-us": ["why-choose-us"],
    "your-first-visit": ["your-first-visit"],
    "hospital-tour": ["healthy-paws-animal-hospital-tour"],
    "our-app": ["our-app"],
    "schedule": ["schedule", "lake-in-the-hills-il-veterinary-appointment"],
    "reviews": ["veterinarian-lake-in-the-hills-il-reviews"],
    "general-care-lake-in-the-hills-il": ["general-care-lake-in-the-hills-il"],
    "end-of-life-care": ["end-of-life-care-lake-in-the-hills-il"],
    "policies": ["policies"],
    "privacy-policy": ["privacy-policy"],
    "accessibility": ["accessibility-statement"],
    "alerts": ["alerts"],
    # probes - may not exist as standalone live pages
    "emergency-urgent-care": ["emergency-urgent-care", "pet-emergency-care-lake-in-the-hills-il", "emergency-care-lake-in-the-hills-il"],
    "laboratory-diagnostics": ["laboratory-diagnostics", "pet-laboratory-lake-in-the-hills-il", "labwork-faq"],
    "microchipping": ["microchipping", "pet-microchipping-lake-in-the-hills-il", "microchip"],
    "nutrition-counseling": ["nutrition-counseling", "pet-nutrition-lake-in-the-hills-il", "nutrition-choosing-pet-food"],
    "pain-management": ["pain-management", "pet-pain-management-lake-in-the-hills-il", "pain-management-lake-in-the-hills-il"],
}
out = Path(__file__).parent / "scraped-content"
out.mkdir(exist_ok=True)
results, failed = {}, []
for astro, slugs in PAGES.items():
    got = False
    for slug in slugs:
        url = f"{BASE}/{slug}/" if slug else f"{BASE}/"
        try:
            r = app.scrape(url, formats=["markdown"])
            md = r.markdown if r and r.markdown else None
            if md and len(md.strip()) > 50:
                (out / f"{astro}.md").write_text(md, encoding="utf-8")
                results[astro] = {"slug": slug, "url": url, "chars": len(md)}
                print(f"OK   {astro:34s} <- {slug or '(home)'} ({len(md)} chars)")
                got = True
                break
            else:
                print(f"     {astro:34s} <- {slug}: empty/short")
        except Exception as e:
            print(f"     {astro:34s} <- {slug}: ERR {str(e)[:60]}")
    if not got:
        failed.append(astro)
        print(f"FAIL {astro}")
print("\n", len(results), "ok,", len(failed), "failed:", failed)
(out / "_manifest2.json").write_text(json.dumps({"ok": results, "failed": failed}, indent=2))
