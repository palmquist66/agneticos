import os, re
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
r = app.scrape("https://healthypawsanimalhospital.com/patient-health-form/", formats=["rawHtml"])
html = r.raw_html if hasattr(r, "raw_html") and r.raw_html else (r.rawHtml if hasattr(r, "rawHtml") else "")
print("HTML len:", len(html))
# find jotform references
for m in sorted(set(re.findall(r'https?://[^"\'\s<>]*jotform[^"\'\s<>]*', html))):
    print("JOTFORM:", m)
# find any iframe srcs
for m in sorted(set(re.findall(r'<iframe[^>]*\bsrc="([^"]+)"', html))):
    print("IFRAME:", m)
