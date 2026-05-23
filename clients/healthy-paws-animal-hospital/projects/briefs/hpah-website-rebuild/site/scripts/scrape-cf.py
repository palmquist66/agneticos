import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
for slug in ["pricing-transparency-canine","pricing-transparency-feline"]:
    r = app.scrape(f"https://healthypawsanimalhospital.com/{slug}/", formats=["markdown"])
    md = r.markdown if r and r.markdown else ""
    (Path(f"scripts/scraped-content/{slug}.md")).write_text(md, encoding="utf-8")
    i = md.find("##")
    print(f"\n===== {slug} ({len(md)} chars) =====")
    print(md[max(0,i-60):i+1600])
