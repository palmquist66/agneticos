#!/usr/bin/env python3
import os, json, sys
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[5] / ".env")
from firecrawl import FirecrawlApp
app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
res = app.map("https://healthypawsanimalhospital.com")
links = res.links if hasattr(res, "links") else res
urls = []
for l in links:
    u = l.url if hasattr(l, "url") else (l.get("url") if isinstance(l, dict) else str(l))
    urls.append(u)
urls = sorted(set(urls))
print(f"TOTAL: {len(urls)}")
for u in urls:
    print(u)
Path(__file__).parent / "wp-urls.txt"
(Path(__file__).parent / "wp-urls.txt").write_text("\n".join(urls))
