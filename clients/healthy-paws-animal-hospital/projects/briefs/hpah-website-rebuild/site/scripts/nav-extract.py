import os, re, html as ihtml
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
r = app.scrape("https://healthypawsanimalhospital.com/", formats=["rawHtml"])
h = getattr(r, "raw_html", "") or getattr(r, "rawHtml", "")
# Extract primary nav menu items
nav = re.search(r'<nav[^>]*main[^>]*>.*?</nav>', h, re.I|re.S) or re.search(r'<ul[^>]*menu[^>]*>.*?</ul>', h, re.I|re.S)
print("=== TOP-LEVEL MENU LINKS (id=menu / nav) ===")
# Grab the header menu region
mhead = re.search(r'id="main-header".*?</header>', h, re.S)
region = mhead.group(0) if mhead else h[:40000]
for m in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>\s*(?:<span[^>]*>)?([^<]{1,40})', region):
    href, txt = m
    txt = ihtml.unescape(txt).strip()
    if txt and "menu-item" not in txt and len(txt)>1 and "javascript" not in href:
        print(f"  {txt:32s} {href}")
