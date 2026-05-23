import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
for slug in ["pricing-transparency","transparency"]:
    r = app.scrape(f"https://healthypawsanimalhospital.com/{slug}/", formats=["markdown"])
    md = r.markdown if r and r.markdown else ""
    (Path(f"scripts/scraped-content/{slug}.md")).write_text(md, encoding="utf-8")
    print(f"\n========== {slug} ({len(md)} chars) ==========")
    # strip leading chrome
    i = md.find("##")
    print(md[max(0,i-120):i+1400])
