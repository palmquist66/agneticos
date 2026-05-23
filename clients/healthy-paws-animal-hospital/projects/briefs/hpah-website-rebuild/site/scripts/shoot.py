import os, json, urllib.request
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
out = Path(__file__).parent / "visual-reference"
out.mkdir(exist_ok=True)
PAGES = {
  "home": "https://healthypawsanimalhospital.com/",
  "about": "https://healthypawsanimalhospital.com/about-healthy-paws-animal-hospital/",
  "services": "https://healthypawsanimalhospital.com/lake-in-the-hills-il-veterinary-services/",
  "team": "https://healthypawsanimalhospital.com/veterinarian-lake-in-the-hills-il/",
}
for name, url in PAGES.items():
    try:
        r = app.scrape(url, formats=[{"type":"screenshot","fullPage":True}])
        shot = getattr(r, "screenshot", None)
        if shot and shot.startswith("http"):
            urllib.request.urlretrieve(shot, out / f"{name}.png")
            print(f"OK {name}: saved screenshot ({(out / f'{name}.png').stat().st_size} bytes)")
        else:
            print(f"{name}: no screenshot url -> {str(shot)[:80]}")
    except Exception as e:
        print(f"{name}: ERR {str(e)[:120]}")
