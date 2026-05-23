#!/usr/bin/env python3
"""
Download all media from the HPAH WordPress site via REST API.
Full-resolution originals, organized by upload year/month.

Usage: python3 scripts/download-wp-media.py
"""

import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

SITE = "https://healthypawsanimalhospital.com"
API = f"{SITE}/wp-json/wp/v2/media"
PER_PAGE = 100
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "images" / "wp-import"

# Image extensions we care about (skip PDFs, docs, etc.)
IMAGE_TYPES = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"}


def fetch_page(page: int) -> list:
    """Fetch one page of media items from WP REST API."""
    url = f"{API}?per_page={PER_PAGE}&page={page}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "HPAH-Media-Sync/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        if e.code == 400:
            return []  # No more pages
        raise


def get_full_url(item: dict) -> str:
    """Get the best available image URL (prefer full size)."""
    # Try media_details.sizes.full first
    sizes = item.get("media_details", {}).get("sizes", {})
    if "full" in sizes:
        return sizes["full"].get("source_url", item["source_url"])
    return item["source_url"]


def download_file(url: str, dest: Path) -> bool:
    """Download a single file. Returns True on success."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "HPAH-Media-Sync/1.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            dest.parent.mkdir(parents=True, exist_ok=True)
            with open(dest, "wb") as f:
                while True:
                    chunk = resp.read(8192)
                    if not chunk:
                        break
                    f.write(chunk)
        return True
    except Exception as e:
        print(f"  FAILED: {e}")
        return False


def main():
    print(f"Fetching media library from {SITE}")
    print(f"Saving to: {OUTPUT_DIR}\n")

    # Collect all media items
    all_items = []
    page = 1
    while True:
        items = fetch_page(page)
        if not items:
            break
        all_items.extend(items)
        print(f"  Page {page}: {len(items)} items")
        page += 1

    print(f"\nFound {len(all_items)} total media items")

    # Filter to images only
    images = []
    skipped = []
    for item in all_items:
        url = get_full_url(item)
        ext = Path(url.split("?")[0]).suffix.lower()
        if ext in IMAGE_TYPES:
            images.append(item)
        else:
            skipped.append((item.get("title", {}).get("rendered", "untitled"), url))

    if skipped:
        print(f"Skipping {len(skipped)} non-image files:")
        for title, url in skipped:
            print(f"  - {title} ({url.split('/')[-1]})")

    print(f"\nDownloading {len(images)} images...\n")

    # Download each image
    downloaded = 0
    failed = 0
    already_exists = 0
    manifest = []

    for i, item in enumerate(images, 1):
        url = get_full_url(item)
        filename = url.split("/")[-1]
        # Remove "-scaled" suffix WordPress adds
        clean_name = filename.replace("-scaled", "")
        title = item.get("title", {}).get("rendered", "")
        alt = item.get("alt_text", "")
        wp_id = item["id"]

        dest = OUTPUT_DIR / clean_name

        manifest.append({
            "wp_id": wp_id,
            "filename": clean_name,
            "original_url": url,
            "title": title,
            "alt_text": alt,
            "mime_type": item.get("mime_type", ""),
        })

        if dest.exists():
            print(f"  [{i}/{len(images)}] EXISTS: {clean_name}")
            already_exists += 1
            continue

        print(f"  [{i}/{len(images)}] Downloading: {clean_name}")
        if download_file(url, dest):
            downloaded += 1
        else:
            failed += 1

    # Save manifest for reference
    manifest_path = OUTPUT_DIR / "_manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nDone!")
    print(f"  Downloaded: {downloaded}")
    print(f"  Already existed: {already_exists}")
    print(f"  Failed: {failed}")
    print(f"  Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
