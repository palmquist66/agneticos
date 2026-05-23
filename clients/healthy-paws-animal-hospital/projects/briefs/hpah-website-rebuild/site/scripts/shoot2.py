import os, urllib.request
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
out = Path(__file__).parent / "visual-reference"
PAGES = {
  "service-dental": "https://healthypawsanimalhospital.com/pet-dentistry-lake-in-the-hills-il/",
  "contact": "https://healthypawsanimalhospital.com/contact/",
  "why-choose-us": "https://healthypawsanimalhospital.com/why-choose-us/",
  "your-first-visit": "https://healthypawsanimalhospital.com/your-first-visit/",
}
for name, url in PAGES.items():
    try:
        r = app.scrape(url, formats=[{"type":"screenshot","fullPage":True}])
        shot = getattr(r, "screenshot", None)
        if shot and shot.startswith("http"):
            urllib.request.urlretrieve(shot, out / f"{name}.png")
            print(f"OK {name}")
        else:
            print(f"{name}: no url")
    except Exception as e:
        print(f"{name}: ERR {str(e)[:90]}")
