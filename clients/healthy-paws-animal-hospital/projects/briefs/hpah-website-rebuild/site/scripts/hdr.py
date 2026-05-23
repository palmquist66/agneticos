import os, re, html as ihtml
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
h = (lambda r: getattr(r,"raw_html","") or getattr(r,"rawHtml",""))(app.scrape("https://healthypawsanimalhospital.com/", formats=["rawHtml"]))
def clean(s): return re.sub(r'\s+',' ', ihtml.unescape(re.sub(r'<[^>]+>',' ',s))).strip()
# find nav menus (ul with class containing 'menu')
print("===== MENU ULs =====")
for mm in re.findall(r'<ul[^>]*class="[^"]*menu[^"]*"[^>]*>(.*?)</ul>', h, re.S|re.I)[:4]:
    items=[]
    for li in re.findall(r'<li[^>]*>(.*?)</li>', mm, re.S):
        a = re.search(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', li, re.S)
        if a:
            txt=clean(a.group(2))
            if txt: items.append(f"{txt} -> {a.group(1)}")
    if items:
        print("  --- menu ---")
        for it in items[:20]: print("   ", it)
# header phone / contact button
print("\n===== header tel / contact button near top =====")
top = h[:18000]
for m in re.findall(r'(tel:[0-9+\-]+|Contact Us|Book Appointment|Appointment)', top):
    pass
for m in set(re.findall(r'href="(tel:[0-9+\-]+)"', top)): print("  TEL:", m)
