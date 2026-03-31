#!/usr/bin/env python3
"""Fetch today's trending sports betting tweets from X via xAI API."""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SCRIPT_DIR / ".claude/skills/str-trending-research/scripts"))

from lib import env, xai_x, models

# Load config
config = env.get_config()
api_key = config.get("XAI_API_KEY", "")
if not api_key:
    print("ERROR: XAI_API_KEY not found", file=sys.stderr)
    sys.exit(1)

# Select model
selected = models.get_models(config)
model = selected["xai"]

today = datetime.now().strftime("%Y-%m-%d")

topic = """Sports betting trending discussion TODAY. Find the most popular and engaging tweets from the last 12 hours about:
- NBA props tonight (Luka Doncic, Karl-Anthony Towns, any popular player props)
- MLB Ohtani pitching debut tonight, strikeout props
- NHL props (Connor McDavid)
- DraftKings or FanDuel microbetting lawsuit / addiction controversy
- Sports betting hot takes, controversial opinions, walk-away takes
- Any viral sports betting tweet from large accounts

Prioritize: tweets with high engagement (1000+ likes preferred, 200+ minimum), from accounts with large followings, posted TODAY or in the last 12 hours. These are reply targets for a sports betting brand."""

print(f"Searching X with model {model}...", file=sys.stderr)

raw = xai_x.search_x(
    api_key=api_key,
    model=model,
    topic=topic,
    from_date=today,
    to_date=today,
    depth="default",
)

items = xai_x.parse_x_response(raw or {})

if not items:
    print("No tweets found.", file=sys.stderr)
    print("Raw response:", json.dumps(raw, indent=2)[:2000], file=sys.stderr)
    sys.exit(1)

# Normalize items — could be dataclass or dict
def get(item, key, default=None):
    if isinstance(item, dict):
        return item.get(key, default)
    return getattr(item, key, default)

def get_eng(item, key):
    eng = get(item, "engagement")
    if eng is None:
        return "?"
    if isinstance(eng, dict):
        return eng.get(key, "?")
    return getattr(eng, key, "?")

# Sort by engagement
items.sort(key=lambda x: (get_eng(x, "likes") if isinstance(get_eng(x, "likes"), int) else 0), reverse=True)

# Output
for i, item in enumerate(items):
    likes = get_eng(item, "likes")
    reposts = get_eng(item, "reposts")
    replies = get_eng(item, "replies")
    print(f"\n--- Tweet {i+1} (score: {get(item, 'score', '?')}) ---")
    print(f"@{get(item, 'author_handle', '?')} | {likes} likes, {reposts} RTs, {replies} replies")
    print(f"Date: {get(item, 'date', '?')}")
    print(f"URL: {get(item, 'url', '?')}")
    print(f"Text: {str(get(item, 'text', ''))[:500]}")
    print(f"Why: {get(item, 'why_relevant', '?')}")
