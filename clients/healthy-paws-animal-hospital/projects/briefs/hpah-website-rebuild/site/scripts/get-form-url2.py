import os, re
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
r = app.scrape("https://healthypawsanimalhospital.com/patient-health-form/", formats=["rawHtml"])
html = r.raw_html if hasattr(r, "raw_html") and r.raw_html else (r.rawHtml if hasattr(r, "rawHtml") else "")
for kw in ["jotform","typeform","cognito","wpforms","gravityforms","gform","formidable","frm_","et_pb_contact","cognitoforms","fillout","<form","data-form","embed"]:
    idxs = [m.start() for m in re.finditer(re.escape(kw), html, re.I)]
    if idxs:
        print(f"=== '{kw}' x{len(idxs)} ===")
        for i in idxs[:2]:
            print("   ...", html[max(0,i-80):i+160].replace("\n"," "))
# form action attrs
for m in sorted(set(re.findall(r'<form[^>]*\baction="([^"]*)"', html, re.I))):
    print("FORM ACTION:", m)
