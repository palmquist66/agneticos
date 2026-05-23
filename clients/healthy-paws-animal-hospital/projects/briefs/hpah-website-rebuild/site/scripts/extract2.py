import os, re, html as ihtml
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
h = (lambda r: getattr(r,"raw_html","") or getattr(r,"rawHtml",""))(app.scrape("https://healthypawsanimalhospital.com/", formats=["rawHtml"]))
def clean(s): return re.sub(r'\s+',' ', ihtml.unescape(re.sub(r'<[^>]+>',' ',s))).strip()

print("===== HEADER MENU (li > a inside nav/menu) =====")
# Divi top menu usually id="top-menu" or class menu
for mm in re.findall(r'<ul[^>]*id="(?:top-menu|main-menu)[^"]*"[^>]*>(.*?)</ul>', h, re.S|re.I):
    for a in re.findall(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', mm, re.S):
        print(f"  {clean(a[1]):34s} {a[0]}")
print("\n===== FOOTER region text =====")
fm = re.search(r'<footer.*?</footer>', h, re.S|re.I)
if fm: print(clean(fm.group(0))[:1200])
print("\n===== Pre-footer / 'Here to Help' / hours (search) =====")
for kw in ["Here to Help","We're Here","Location","Hours","Powered by","Monday","Tuesday","Wednesday","Thursday","Friday"]:
    i = h.find(kw)
    if i!=-1:
        print(f"[{kw}] ...{clean(h[i-20:i+200])}")
