import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
r = app.scrape("https://healthypawsanimalhospital.com/pet-adult-care-in-the-hills-il/", formats=["markdown"])
md = r.markdown if r and r.markdown else ""
(Path("scripts/scraped-content/adult-care.md")).write_text(md, encoding="utf-8")
# print from the first FAQ onward (the part cut off)
i = md.find("When should my pet")
print(md[i:])
