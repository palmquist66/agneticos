import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
r = app.scrape("https://healthypawsanimalhospital.com/education/", formats=["markdown"])
md = r.markdown if r and r.markdown else ""
(Path(__file__).parent / "scraped-content" / "education.md").write_text(md, encoding="utf-8")
print(md[:4000])
